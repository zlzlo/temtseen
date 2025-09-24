// server/routes.ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { knowledgeBase, type KnowledgeEntry } from "./knowledge";
import {
  insertUserSchema,
  insertNewsEventSchema,
  insertProgramSchema,
  insertApplicationSchema,
  insertContactMessageSchema
} from "@shared/schema";
import { z } from "zod";

/** ----- Chat schemas ----- */
const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1)
});
const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1)
});

/** ----- OpenAI Prompt ID (Published Prompt) ----- */
const MANDAX_PROMPT_ID =
  process.env.MANDAX_PROMPT_ID || "pmpt_68d3f38ef4048196adfa404d6e7eb56d0602415a6bfbe225";

/** ----- Helper: safe output_text fallback ----- */
function extractOutputText(resp: any): string {
  const direct = resp?.output_text?.trim?.();
  if (direct) return direct;
  return (
    resp?.output?.[0]?.content?.[0]?.text?.trim?.() ||
    resp?.data?.[0]?.content?.[0]?.text?.trim?.() ||
    ""
  );
}

/** ----- Helper: knowledge base fallback ----- */
type KnowledgeIndexEntry = {
  entry: KnowledgeEntry;
  normalizedText: string;
  tokens: Set<string>;
  keywordSet: Set<string>;
};

const normalizedKnowledgeIndex: KnowledgeIndexEntry[] = buildKnowledgeIndex(knowledgeBase);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/["'`]+/g, " ")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildKnowledgeIndex(entries: KnowledgeEntry[]): KnowledgeIndexEntry[] {
  return entries.map((entry) => {
    const normalizedKeywords = entry.keywords
      .map((kw) => normalizeText(kw))
      .filter((kw) => kw.length > 0);
    const normalizedText = normalizeText(
      [entry.title, entry.content, ...normalizedKeywords].join(" ")
    );

    const tokens = new Set(normalizedText.split(" ").filter(Boolean));
    for (const keyword of normalizedKeywords) {
      tokens.add(keyword);
    }

    return {
      entry,
      normalizedText,
      tokens,
      keywordSet: new Set(normalizedKeywords),
    };
  });
}

function findKnowledgeBaseAnswer(question: string): string | null {
  const normalizedQuery = normalizeText(question);
  if (!normalizedQuery) return null;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  if (queryTokens.length === 0) return null;

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;

  for (const candidate of normalizedKnowledgeIndex) {
    let score = 0;

    for (const token of queryTokens) {
      if (candidate.tokens.has(token)) {
        score += 2;
      }
    }

    for (const keyword of candidate.keywordSet) {
      if (normalizedQuery.includes(keyword)) {
        score += 3;
      }
    }

    if (candidate.normalizedText.includes(normalizedQuery)) {
      score += 4;
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = candidate.entry;
    }
  }

  if (bestEntry && bestScore >= 4) {
    return `🤖 Манай мэдлэгийн сангаас олдсон мэдээлэл:\n\n**${bestEntry.title}**\n${bestEntry.content}`;
  }

  return null;
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

      const lastUserMessage = [...messages]
        .reverse()
        .find((m) => m.role === "user")?.content?.trim();
      if (!lastUserMessage) {
        return res.status(400).json({ error: "Асуулт олдсонгүй." });
      }

      let reply: string | null = null;

      if (process.env.OPENAI_API_KEY) {
        try {
          const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          const ai = await client.responses.create({
            prompt: {
              id: MANDAX_PROMPT_ID,
              version: "1",
              variables: { topic: lastUserMessage }
            }
          });

          const openAiReply = extractOutputText(ai)?.trim();
          if (openAiReply) {
            reply = openAiReply;
          } else {
            console.error("Unexpected Responses payload:", ai);
          }
        } catch (error) {
          const err = error as any;
          console.error(
            "OpenAI error:",
            err?.status,
            err?.message,
            err?.response?.data || err
          );
        }
      } else {
        console.warn("OPENAI_API_KEY тохируулга хийгдээгүй тул мэдлэгийн сангийн горимоор ажиллаж байна.");
      }

      if (!reply) {
        const fallback = findKnowledgeBaseAnswer(lastUserMessage);
        if (fallback) {
          return res.json({ reply: fallback });
        }

        return res.json({
          reply:
            "Уучлаарай, одоогоор чатбот гадаад үйлчилгээтэй холбогдож чадсангүй. Та бидэнтэй 7700-0000 утсаар эсвэл info@mandakh.edu.mn хаягаар холбогдоорой.",
        });
      }

      return res.json({ reply });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: "Буруу хүсэлтийн бүтэц." });
      }

      console.error("Chat endpoint error:", err);
      return res.status(500).json({ error: "Дотоод серверийн алдаа." });
    }
  });

  // -------------------- HTTP SERVER --------------------
  const httpServer = createServer(app);
  return httpServer;
}
