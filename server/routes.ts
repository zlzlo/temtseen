import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertNewsEventSchema,
  insertProgramSchema,
  insertApplicationSchema,
  insertContactMessageSchema,
  type NewsEvent,
  type Program
} from "@shared/schema";
import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1)
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1)
});

type ContextMessage = {
  role: "system" | "assistant";
  content: string;
};

const BASE_SYSTEM_PROMPT =
  "You are a friendly Mongolian-speaking assistant for the Temtseen school website. Use the provided context snippets to answer accurately. If the context does not contain the answer, say you are unsure and suggest contacting the school. Always answer in Mongolian.";

const PROGRAM_KEYWORDS = [
  "хөтөлбөр",
  "хөтөлбөрүүд",
  "сургалт",
  "program",
  "curriculum",
  "төлөвлөгөө"
];

const NEWS_KEYWORDS = [
  "мэдээ",
  "шинэ",
  "эвент",
  "event",
  "үйл ажиллагаа",
  "арга хэмжээ"
];

const ADMISSIONS_KEYWORDS = [
  "элсэлт",
  "элсэлтийн",
  "бүртгэл",
  "шаардлага",
  "материал",
  "алхам"
];

const STUDENT_LIFE_KEYWORDS = [
  "оюутны амьдрал",
  "оюутан",
  "клуб",
  "дотуур байр",
  "тэтгэлэг",
  "спорт",
  "номын сан"
];

const CONTACT_KEYWORDS = [
  "холбоо",
  "байршил",
  "хаана",
  "хаяг",
  "имэйл",
  "email",
  "утас",
  "contact"
];

const ADMISSIONS_CONTEXT = `Элсэлтийн үйл явц дараах үндсэн алхмуудаас бүрдэнэ.
1. Бүртгүүлэх – онлайн бүртгэл бөглөж, хувийн мэдээллээ баталгаажуулна.
2. Бичиг баримт – иргэний үнэмлэх, цээж зураг, ЭЕШ-ын оноо эсвэл дунд сургуулийн голч дүн, төлбөрийн баримт зэрэг шаардлагатай материалуудыг бүрдүүлнэ.
3. Шалгалт/ярилцлага – элсэлтийн шалгалт өгөх эсвэл ярилцлагад оролцоно.
4. Элсэлт баталгаажуулах – сургалтын төлбөр, баримтыг баталгаажуулж эрхээ идэвхжүүлнэ.`;

const STUDENT_LIFE_CONTEXT =
  "Оюутны амьдрал: спорт, урлаг, шинжлэх ухааны 20 гаруй клубууд ажилладаг. Гүйцэтгэл болон нийгмийн байдалд тулгуурласан тэтгэлэг, орчин үеийн дотуур байр, 100 000+ номтой номын сан, инновацын лаборатори, спортын заал, фитнесс төвөөр дамжуулан оюутнууд бүх талаар хөгжих боломжтой.";

const CONTACT_CONTEXT =
  "Холбоо барих мэдээлэл: Хаяг – Улаанбаатар, Монгол Улс. Имэйл – info@mandakh.edu.mn. Ажлын цаг – Даваа–Баасан 09:00–18:00.";

const FAQ_ENTRIES: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ["элсэлт", "алхам"],
    answer:
      "Элсэлтийн үндсэн алхамууд: 1) Онлайн бүртгүүлэх, 2) Шаардлагатай бичиг баримтыг бүрдүүлэх, 3) Элсэлтийн шалгалт эсвэл ярилцлага өгөх, 4) Элсэлтийн эрхээ баталгаажуулах."
  },
  {
    keywords: ["элсэлт", "материал"],
    answer:
      "Элсэлтэд бүрдүүлэх материал: иргэний үнэмлэх, цээж зураг, ЭЕШ-ын оноо эсвэл дунд сургуулийн голч дүн, цахим төлбөрийн баримт."
  },
  {
    keywords: ["байршил"],
    answer: "Темтсэний кампус Улаанбаатар хотод байрладаг. Хаяг: Улаанбаатар, Монгол Улс."
  },
  {
    keywords: ["ажлын", "цаг"],
    answer: "Манай хүлээн авах алба Даваа–Баасан гаригт 09:00–18:00 цагийн хооронд ажиллана."
  }
];

function findFaqAnswer(query: string): string | undefined {
  const normalized = query.toLowerCase();
  for (const entry of FAQ_ENTRIES) {
    if (entry.keywords.every((keyword) => normalized.includes(keyword))) {
      return entry.answer;
    }
  }
  return undefined;
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^0-9a-zа-яёөү]+/g)
    .map((word) => word.trim())
    .filter((word) => word.length > 2);
}

function matchKeywords(keywordSet: Set<string>, normalized: string, keywords: string[]): boolean {
  return keywords.some((keyword) => keywordSet.has(keyword) || normalized.includes(keyword));
}

function truncateText(text: string, maxLength = 400): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1).trim()}…`;
}

function rankByKeywords<T>(
  items: T[],
  keywords: string[],
  getText: (item: T) => string,
  limit: number
): T[] {
  if (!items.length) {
    return [];
  }

  const keywordSet = new Set(keywords);
  const scored = items.map((item) => {
    const haystack = getText(item).toLowerCase();
    let score = 0;
    keywordSet.forEach((keyword) => {
      if (keyword.length > 2 && haystack.includes(keyword)) {
        score += 1;
      }
    });
    return { item, score };
  });

  const relevant = scored.filter(({ score }) => score > 0);
  const sorted = (relevant.length > 0 ? relevant : scored).sort((a, b) => b.score - a.score);
  return sorted.slice(0, limit).map(({ item }) => item);
}

function formatProgram(program: Program): string {
  const tuitionText =
    program.tuitionFee != null ? `Жилийн төлбөр: ${program.tuitionFee.toLocaleString()}₮` : "Төлбөрийн мэдээлэл: тодорхойгүй";

  return [
    `• ${program.title} (${program.level})`,
    `Хугацаа: ${program.duration}`,
    `Суралцах хэлбэр: ${program.studyMode}`,
    `Товч танилцуулга: ${truncateText(program.description, 280)}`,
    `Шаардлага: ${truncateText(program.requirements, 220)}`,
    tuitionText
  ].join("\n");
}

function formatNewsEvent(newsEvent: NewsEvent): string {
  const baseDate = newsEvent.eventDate ?? newsEvent.createdAt;
  let formattedDate = "";
  if (baseDate) {
    try {
      formattedDate = new Date(baseDate).toLocaleDateString("mn-MN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      formattedDate = "";
    }
  }

  const dateLine = formattedDate ? ` (${formattedDate})` : "";
  const typeLine = newsEvent.type === "event" ? "Үйл ажиллагаа" : "Мэдээ";

  return [
    `• ${newsEvent.title}${dateLine}`,
    `Ангилал: ${typeLine}`,
    `Товч мэдээлэл: ${truncateText(newsEvent.description, 220)}`
  ].join("\n");
}

async function buildContextMessages(query: string): Promise<ContextMessage[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const normalized = trimmed.toLowerCase();
  const keywords = extractKeywords(normalized);
  const keywordSet = new Set(keywords);
  const contextMessages: ContextMessage[] = [];

  if (matchKeywords(keywordSet, normalized, PROGRAM_KEYWORDS)) {
    try {
      const programs = await storage.getPrograms();
      if (programs.length) {
        const relevantPrograms = rankByKeywords(
          programs,
          [...keywords, ...PROGRAM_KEYWORDS],
          (program) =>
            [program.title, program.description, program.requirements, program.curriculum, program.studyMode].join(" "),
          3
        );
        if (relevantPrograms.length) {
          contextMessages.push({
            role: "system",
            content: `Хөтөлбөрийн мэдээлэл:\n${relevantPrograms.map(formatProgram).join("\n\n")}`
          });
        }
      }
    } catch (error) {
      console.error("Failed to load programs for chat context:", error);
    }
  }

  if (matchKeywords(keywordSet, normalized, NEWS_KEYWORDS)) {
    try {
      const newsEvents = await storage.getNewsEvents(8);
      if (newsEvents.length) {
        const relevantNews = rankByKeywords(
          newsEvents,
          [...keywords, ...NEWS_KEYWORDS],
          (item) => [item.title, item.description, item.content, item.type].join(" "),
          3
        );
        if (relevantNews.length) {
          contextMessages.push({
            role: "system",
            content: `Сүүлд нийтэлсэн мэдээ, үйл ажиллагааны мэдээлэл:\n${relevantNews
              .map(formatNewsEvent)
              .join("\n\n")}`
          });
        }
      }
    } catch (error) {
      console.error("Failed to load news/events for chat context:", error);
    }
  }

  if (matchKeywords(keywordSet, normalized, ADMISSIONS_KEYWORDS)) {
    contextMessages.push({ role: "system", content: ADMISSIONS_CONTEXT });
  }

  if (matchKeywords(keywordSet, normalized, STUDENT_LIFE_KEYWORDS)) {
    contextMessages.push({ role: "system", content: STUDENT_LIFE_CONTEXT });
  }

  if (matchKeywords(keywordSet, normalized, CONTACT_KEYWORDS)) {
    contextMessages.push({ role: "system", content: CONTACT_CONTEXT });
  }

  return contextMessages;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
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

  // News & Events routes
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

  // Programs routes
  app.get("/api/programs", async (req, res) => {
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

  // Applications routes
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
        // Admin/staff can see all applications
        applications = await storage.getApplications();
      } else {
        // Students see only their own applications
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

  // Contact messages routes
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      
      // Add client info
      const clientInfo = {
        ...messageData,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
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

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = chatRequestSchema.parse(req.body);

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res
          .status(500)
          .json({ error: "Chatbot одоогоор идэвхгүй байна. Админтай холбогдоно уу." });
      }

      const latestUserMessage = [...messages]
        .reverse()
        .find((message) => message.role === "user")?.content;

      if (latestUserMessage) {
        const faqAnswer = findFaqAnswer(latestUserMessage);
        if (faqAnswer) {
          return res.json({ reply: faqAnswer });
        }
      }

      const contextMessages = latestUserMessage ? await buildContextMessages(latestUserMessage) : [];

      const openAiMessages = [
        {
          role: "system",
          content: BASE_SYSTEM_PROMPT
        },
        ...contextMessages,
        ...messages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      ];

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: openAiMessages,
          temperature: 0.25,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenAI API error:", response.status, errorBody);
        return res.status(502).json({ error: "Гадаад үйлчилгээтэй холбогдоход алдаа гарлаа." });
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      if (!reply) {
        console.error("OpenAI API returned unexpected payload:", data);
        return res.status(502).json({ error: "Хариу боловсруулахад алдаа гарлаа." });
      }

      res.json({ reply });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Буруу хүсэлтийн бүтэц." });
      }

      console.error("Chatbot request error:", error);
      res.status(500).json({ error: "Хүсэлтийг боловсруулахад алдаа гарлаа." });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
