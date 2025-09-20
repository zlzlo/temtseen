import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("student"), // student, admin, staff
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// News & Events Tables
export const newsEvents = pgTable("news_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // news, event
  eventDate: timestamp("event_date"),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").notNull().default(false),
  authorId: varchar("author_id").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Programs Table
export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  level: text("level").notNull(), // bachelor, master, professional
  duration: text("duration").notNull(),
  studyMode: text("study_mode").notNull(), // day, evening, weekend
  description: text("description").notNull(),
  curriculum: text("curriculum").notNull(),
  requirements: text("requirements").notNull(),
  tuitionFee: integer("tuition_fee"),
  icon: text("icon").notNull().default("BookOpen"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Applications Table
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantId: varchar("applicant_id").notNull(),
  programId: varchar("program_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, waitlist
  personalInfo: text("personal_info").notNull(), // JSON string
  documents: text("documents"), // JSON array of document URLs
  academicInfo: text("academic_info").notNull(), // JSON string
  submittedAt: timestamp("submitted_at").notNull().default(sql`now()`),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: varchar("reviewed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

// Contact Messages Table
export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // unread, read, replied
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  newsEvents: many(newsEvents),
  applications: many(applications),
  reviewedApplications: many(applications, { relationName: "reviewer" }),
}));

export const newsEventsRelations = relations(newsEvents, ({ one }) => ({
  author: one(users, {
    fields: [newsEvents.authorId],
    references: [users.id],
  }),
}));

export const programsRelations = relations(programs, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  applicant: one(users, {
    fields: [applications.applicantId],
    references: [users.id],
  }),
  program: one(programs, {
    fields: [applications.programId],
    references: [programs.id],
  }),
  reviewer: one(users, {
    fields: [applications.reviewedBy],
    references: [users.id],
    relationName: "reviewer",
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertNewsEventSchema = createInsertSchema(newsEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type NewsEvent = typeof newsEvents.$inferSelect;
export type InsertNewsEvent = z.infer<typeof insertNewsEventSchema>;
export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;