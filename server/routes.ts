import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertNewsEventSchema, 
  insertProgramSchema,
  insertApplicationSchema,
  insertContactMessageSchema 
} from "@shared/schema";
import { z } from "zod";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1)
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1)
});

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

      const openAiMessages = [
        {
          role: "system",
          content:
            "You are a friendly Mongolian-speaking assistant for the Temtseen school website. Provide concise, accurate answers about programs, admissions, student life, and contact information using the details shared by the user."
        },
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
          temperature: 0.7,
          max_tokens: 300
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
