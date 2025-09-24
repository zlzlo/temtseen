// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertNewsEventSchema,
  insertProgramSchema,
  insertApplicationSchema,
  insertContactMessageSchema
} from "@shared/schema";
import { z } from "zod";
import { knowledgeBase, type KnowledgeEntry } from "./knowledge";

/** ----- Chat schemas ----- */
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1)
});
const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1)
});

/** ----- OpenAI Prompt ID (Published Prompt) ----- */
const MANDAX_PROMPT_ID = "pmpt_68d3f38ef4048196adfa404d6e7eb56d0602415a6bfbe225";

/** ----- Helper: safe output_text fallback ----- */
function extractOutputText(resp: any): string {
  const direct = resp?.output_text?.trim?.();
  if (direct) return direct;
  // defensive fallbacks for older SDK payload shapes
  const fromArray =
    resp?.output?.[0]?.content?.[0]?.text?.trim?.() ||
    resp?.data?.[0]?.content?.[0]?.text?.trim?.() ||
    "";
  return fromArray;
}

type ChatMessage = z.infer<typeof chatMessageSchema>;

const STOP_WORDS = new Set([
  "би",
  "чи",
  "та",
  "энэ",
  "тэр",
  "асуулт",
  "тухай",
  "талаар",
  "байна",
  "байдаг",
  "байх",
  "бол",
  "болох",
  "хэрхэн",
  "яаж",
  "ямар",
  "хэн",
  "хэд",
  "өгөөч",
  "хүсэж",
  "мэдээлэл"
]);

function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\w\s\u0400-\u04FF]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

interface KnowledgeIndexEntry {
  entry: KnowledgeEntry;
  fullText: string;
  tokens: Set<string>;
  keywordSet: Set<string>;
}

const knowledgeIndex: KnowledgeIndexEntry[] = knowledgeBase.map((entry) => {
  const fullText = `${entry.title} ${entry.content} ${(entry.keywords ?? []).join(" ")}`.toLowerCase();
  return {
    entry,
    fullText,
    tokens: new Set(tokenizeText(fullText)),
    keywordSet: new Set(entry.keywords.map((keyword) => keyword.toLowerCase()))
  };
});

function buildKnowledgeContext(query: string, limit = 3): string {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = tokenizeText(normalizedQuery).filter(
    (token) => token && !STOP_WORDS.has(token)
  );

  if (queryTokens.length === 0) {
    return "";
  }

  const matches = knowledgeIndex
    .map(({ entry, tokens, keywordSet, fullText }) => {
      let score = 0;

      for (const token of queryTokens) {
        if (keywordSet.has(token)) {
          score += 6;
          continue;
        }

        if (tokens.has(token)) {
          score += 3;
          continue;
        }

        if (fullText.includes(token)) {
          score += 1;
        }
      }

      for (const keyword of Array.from(keywordSet)) {
        if (normalizedQuery.includes(keyword)) {
          score += 2;
        }
      }

      if (normalizedQuery && fullText.includes(normalizedQuery)) {
        score += 3;
      }

      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);

  if (matches.length === 0) {
    return "";
  }

  return matches
    .map((entry) => `${entry.title}: ${entry.content}`)
    .join("\n\n");
}

function prepareMessagesForInput(messages: ChatMessage[]) {
  return messages
    .map((message) => ({ ...message, content: message.content.trim() }))
    .filter((message) => message.content.length > 0)
    .slice(-12)
    .map((message) => ({
      role: message.role,
      content: [
        {
          type: "text" as const,
          text: message.content
        }
      ]
    }));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // -------------------- AUTH --------------------
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email уже зарегистрирован" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ error: "Нэр уже зарегистрирован" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ error: "Регистрацийн алдаа" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Нэр болон нууц үг шаардлагатай" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Буруу нэр эсвэл нууц үг" });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: "Хэрэглэгч идэвхгүй" });
      }

      const { password: _, ...userWithoutPassword } = user;

      // Store user in session
      (req.session as any).userId = user.id;
      (req.session as any).user = userWithoutPassword;

      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Нэвтрэх алдаа" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: unknown) => {
      if (err) {
        return res.status(500).json({ error: "Logout алдаа" });
      }
      res.json({ message: "Амжилттай гарлаа" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Нэвтрээгүй" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Auth check error:", error);
      res.status(500).json({ error: "Хэрэглэгчийн мэдээлэл алдаа" });
    }
  });

  // -------------------- NEWS & EVENTS --------------------
  app.get("/api/news-events", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const newsEvents = await storage.getNewsEvents(limit);
      res.json({ newsEvents });
    } catch (error) {
      console.error("Get news events error:", error);
      res.status(500).json({ error: "Мэдээ ачаалах алдаа" });
    }
  });

  app.get("/api/news-events/:id", async (req, res) => {
    try {
      const newsEvent = await storage.getNewsEvent(req.params.id);
      if (!newsEvent) {
        return res.status(404).json({ error: "Мэдээ олдсонгүй" });
      }
      res.json({ newsEvent });
    } catch (error) {
      console.error("Get news event error:", error);
      res.status(500).json({ error: "Мэдээ ачаалах алдаа" });
    }
  });

  app.post("/api/news-events", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Нэвтрээгүй" });
      }

      const user = await storage.getUser(userId);
      if (!user || (user.role !== "admin" && user.role !== "staff")) {
        return res.status(403).json({ error: "Эрх хүрэхгүй" });
      }

      const newsEventData = insertNewsEventSchema.parse(req.body);
      const newsEvent = await storage.createNewsEvent({
        ...newsEventData,
        authorId: userId
      });

      res.status(201).json({ newsEvent });
    } catch (error) {
      console.error("Create news event error:", error);
      res.status(400).json({ error: "Мэдээ үүсгэх алдаа" });
    }
  });

  // -------------------- PROGRAMS --------------------
  app.get("/api/programs", async (_req, res) => {
    try {
      const programs = await storage.getPrograms();
      res.json({ programs });
    } catch (error) {
      console.error("Get programs error:", error);
      res.status(500).json({ error: "Хөтөлбөр ачаалах алдаа" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const program = await storage.getProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ error: "Хөтөлбөр олдсонгүй" });
      }
      res.json({ program });
    } catch (error) {
      console.error("Get program error:", error);
      res.status(500).json({ error: "Хөтөлбөр ачаалах алдаа" });
    }
  });

  app.post("/api/programs", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Нэвтрээгүй" });
      }

      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Эрх хүрэхгүй" });
      }

      const programData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(programData);

      res.status(201).json({ program });
    } catch (error) {
      console.error("Create program error:", error);
      res.status(400).json({ error: "Хөтөлбөр үүсгэх алдаа" });
    }
  });

  // -------------------- APPLICATIONS --------------------
  app.get("/api/applications", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Нэвтрээгүй" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
      }

      let applications;
      if (user.role === "admin" || user.role === "staff") {
        applications = await storage.getApplications();
      } else {
        applications = await storage.getApplications(userId);
      }

      res.json({ applications });
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ error: "Өргөдөл ачаалах алдаа" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Нэвтрээгүй" });
      }

      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication({
        ...applicationData,
        applicantId: userId
      });

      res.status(201).json({ application });
    } catch (error) {
      console.error("Create application error:", error);
      res.status(400).json({ error: "Өргөдөл үүсгэх алдаа" });
    }
  });

  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Нэвтрээгүй" });
      }

      const user = await storage.getUser(userId);
      if (!user || (user.role !== "admin" && user.role !== "staff")) {
        return res.status(403).json({ error: "Эрх хүрэхгүй" });
      }

      const { status, notes } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Статус шаардлагатай" });
      }

      const application = await storage.updateApplicationStatus(
        req.params.id,
        status,
        userId,
        notes
      );

      if (!application) {
        return res.status(404).json({ error: "Өргөдөл олдсонгүй" });
      }

      res.json({ application });
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(500).json({ error: "Өргөдлийн статус шинэчлэх алдаа" });
    }
  });

  // -------------------- CONTACT MESSAGES --------------------
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);

      const clientInfo = {
        ...messageData,
        ipAddress: req.ip || (req.connection as any)?.remoteAddress,
        userAgent: req.get("User-Agent")
      };

      const message = await storage.createContactMessage(clientInfo);

      // TODO: Send email notification here

      res.status(201).json({
        message: "Таны мессеж амжилттай илгээгдлээ! Бид тун удахгүй хариулах болно.",
        id: message.id
      });
    } catch (error) {
      console.error("Contact message error:", error);
      res.status(400).json({ error: "Мессеж илгээх алдаа" });
    }
  });

  app.get("/api/contact-messages", async (req, res) => {
    try {
      const userId = (req.session as any)?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Нэвтрээгүй" });
      }

      const user = await storage.getUser(userId);
      if (!user || (user.role !== "admin" && user.role !== "staff")) {
        return res.status(403).json({ error: "Эрх хүрэхгүй" });
      }

      const messages = await storage.getContactMessages();
      res.json({ messages });
    } catch (error) {
      console.error("Get contact messages error:", error);
      res.status(500).json({ error: "Мессеж ачаалах алдаа" });
    }
  });

  // -------------------- CHAT (OpenAI Responses + Prompt ID) --------------------
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = chatRequestSchema.parse(req.body);

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res
          .status(500)
          .json({ error: "Chatbot одоогоор идэвхгүй байна. Админтай холбогдоно уу." });
      }

      const trimmedMessages: ChatMessage[] = messages.map((message) => ({
        role: message.role,
        content: message.content.trim()
      }));

      const lastUserMessage = [...trimmedMessages]
        .reverse()
        .find((m) => m.role === "user")?.content;

      if (!lastUserMessage) {
        return res.status(400).json({ error: "Хэрэглэгчийн асуулт олдсонгүй." });
      }

      const userQueries = trimmedMessages
        .filter((message) => message.role === "user")
        .map((message) => message.content);

      const retrievalQuery = userQueries.slice(-3).join(" ");
      const rawContext = buildKnowledgeContext(retrievalQuery);
      const normalizedContext = rawContext.trim();
      const MAX_CONTEXT_CHARS = 1500;
      const limitedContext =
        normalizedContext.length > MAX_CONTEXT_CHARS
          ? `${normalizedContext.slice(0, MAX_CONTEXT_CHARS)}…`
          : normalizedContext;

      const topicPayload = limitedContext
        ? `${lastUserMessage}\n\nХолбогдох мэдээлэл:\n${limitedContext}`
        : lastUserMessage;

      const conversationInput = prepareMessagesForInput(trimmedMessages);

      const client = new OpenAI({ apiKey });

      const aiResp = await client.responses.create({
        prompt: {
          id: MANDAX_PROMPT_ID,
          version: "1",
          variables: {
            topic: topicPayload
          }
        },
        input: conversationInput
      });

      const reply = extractOutputText(aiResp);

      if (!reply) {
        console.error("OpenAI Responses API unexpected payload:", aiResp);
        return res.status(502).json({ error: "Хариу боловсруулахад алдаа гарлаа." });
      }

      return res.json({ reply });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Буруу хүсэлтийн бүтэц." });
      }
      console.error("Chatbot request error:", error);
      return res.status(500).json({ error: "Хүсэлтийг боловсруулахад алдаа гарлаа." });
    }
  });

  // -------------------- HTTP SERVER --------------------
  const httpServer = createServer(app);
  return httpServer;
}
