import { 
  users, 
  newsEvents, 
  programs, 
  applications, 
  contactMessages,
  type User, 
  type InsertUser,
  type NewsEvent,
  type InsertNewsEvent,
  type Program,
  type InsertProgram,
  type Application,
  type InsertApplication,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // News & Events operations
  getNewsEvents(limit?: number): Promise<NewsEvent[]>;
  getNewsEvent(id: string): Promise<NewsEvent | undefined>;
  createNewsEvent(newsEvent: InsertNewsEvent): Promise<NewsEvent>;
  updateNewsEvent(id: string, newsEvent: Partial<InsertNewsEvent>): Promise<NewsEvent | undefined>;
  deleteNewsEvent(id: string): Promise<boolean>;
  
  // Programs operations
  getPrograms(): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program | undefined>;
  
  // Applications operations
  getApplications(userId?: string): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: string, status: string, reviewedBy?: string, notes?: string): Promise<Application | undefined>;
  
  // Contact messages operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markContactMessageRead(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // News & Events operations
  async getNewsEvents(limit = 10): Promise<NewsEvent[]> {
    return await db
      .select()
      .from(newsEvents)
      .where(eq(newsEvents.isPublished, true))
      .orderBy(desc(newsEvents.createdAt))
      .limit(limit);
  }

  async getNewsEvent(id: string): Promise<NewsEvent | undefined> {
    const [newsEvent] = await db.select().from(newsEvents).where(eq(newsEvents.id, id));
    return newsEvent || undefined;
  }

  async createNewsEvent(newsEvent: InsertNewsEvent): Promise<NewsEvent> {
    const [created] = await db
      .insert(newsEvents)
      .values(newsEvent)
      .returning();
    return created;
  }

  async updateNewsEvent(id: string, newsEvent: Partial<InsertNewsEvent>): Promise<NewsEvent | undefined> {
    const [updated] = await db
      .update(newsEvents)
      .set({ ...newsEvent, updatedAt: new Date() })
      .where(eq(newsEvents.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteNewsEvent(id: string): Promise<boolean> {
    const result = await db.delete(newsEvents).where(eq(newsEvents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Programs operations
  async getPrograms(): Promise<Program[]> {
    return await db
      .select()
      .from(programs)
      .where(eq(programs.isActive, true))
      .orderBy(programs.title);
  }

  async getProgram(id: string): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program || undefined;
  }

  async createProgram(program: InsertProgram): Promise<Program> {
    const [created] = await db
      .insert(programs)
      .values(program)
      .returning();
    return created;
  }

  async updateProgram(id: string, program: Partial<InsertProgram>): Promise<Program | undefined> {
    const [updated] = await db
      .update(programs)
      .set({ ...program, updatedAt: new Date() })
      .where(eq(programs.id, id))
      .returning();
    return updated || undefined;
  }

  // Applications operations
  async getApplications(userId?: string): Promise<Application[]> {
    const query = db.select().from(applications);
    
    if (userId) {
      return await query.where(eq(applications.applicantId, userId));
    }
    
    return await query.orderBy(desc(applications.submittedAt));
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application || undefined;
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const [created] = await db
      .insert(applications)
      .values(application)
      .returning();
    return created;
  }

  async updateApplicationStatus(
    id: string, 
    status: string, 
    reviewedBy?: string, 
    notes?: string
  ): Promise<Application | undefined> {
    const [updated] = await db
      .update(applications)
      .set({ 
        status, 
        reviewedBy, 
        notes, 
        reviewedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(applications.id, id))
      .returning();
    return updated || undefined;
  }

  // Contact messages operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return created;
  }

  async markContactMessageRead(id: string): Promise<boolean> {
    const result = await db
      .update(contactMessages)
      .set({ status: "read" })
      .where(eq(contactMessages.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();