import { pgTable, text, serial, integer, boolean, timestamp, jsonb, numeric, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("nurse"), // nurse, senior, admin
  registrationText: text("registration_text"), // Why they want to join
  location: text("location"), // City/Province in South Africa
  // Detailed address fields for Google Maps
  practiceAddress: text("practice_address"), // Full practice address
  practiceCity: text("practice_city"),
  practiceProvince: text("practice_province"),
  practicePostalCode: text("practice_postal_code"),
  practicePhone: text("practice_phone"),
  latitude: numeric("latitude"), // For Google Maps positioning
  longitude: numeric("longitude"),
  isApproved: boolean("is_approved").notNull().default(false),
  isOnline: boolean("is_online").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // Subscription fields
  subscriptionStatus: text("subscription_status").notNull().default("free"), // free, active, cancelled
  llmUsageCount: integer("llm_usage_count").notNull().default(0),
  llmUsageResetDate: timestamp("llm_usage_reset_date").defaultNow(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const channels = pgTable("channels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isPrivate: boolean("is_private").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  channelId: integer("channel_id").notNull().references(() => channels.id),
  userId: text("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: jsonb("attachments").default([]),
  replyToId: integer("reply_to_id"),
  hasPatientData: boolean("has_patient_data").notNull().default(false),
  isApproved: boolean("is_approved").notNull().default(true), // For patient data approval
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiSuggestions = pgTable("ai_suggestions", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").notNull().references(() => messages.id),
  suggestion: text("suggestion").notNull(),
  suggestionType: text("suggestion_type").notNull().default("local"), // local, llm
  faqReferences: jsonb("faq_references").default([]),
  educationReferences: jsonb("education_references").default([]),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, edited
  isValidated: boolean("is_validated").notNull().default(false),
  validatedBy: text("validated_by").references(() => users.id),
  editedSuggestion: text("edited_suggestion"), // For edited suggestions
  rejectionReason: text("rejection_reason"), // For rejected suggestions
  approvedAsFaqId: integer("approved_as_faq_id").references(() => faqs.id), // Reference to created FAQ
  upvotes: integer("upvotes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Table to track user upvotes on AI suggestions
export const aiSuggestionUpvotes = pgTable("ai_suggestion_upvotes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  suggestionId: integer("suggestion_id").notNull().references(() => aiSuggestions.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Prevent duplicate upvotes
  userSuggestionUnique: unique().on(table.userId, table.suggestionId),
}));

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // registration_pending, patient_data_approval, mention, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: text("related_id"), // messageId, userId, etc.
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Location-based networking
export const locationConnections = pgTable("location_connections", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
  tags: jsonb("tags").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  contentType: text("content_type").notNull(), // article, video, tool, guideline
  attachments: jsonb("attachments").default([]),
  tags: jsonb("tags").default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  attachments: jsonb("attachments").default([]),
  linkUrl: text("link_url"),
  linkText: text("link_text"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userAnnouncementViews = pgTable("user_announcement_views", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  announcementId: integer("announcement_id").notNull().references(() => announcements.id),
  viewedAt: timestamp("viewed_at").defaultNow(),
  viewedDate: text("viewed_date").notNull(), // YYYY-MM-DD format for daily tracking
});

// Insert schemas for authentication
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  registrationText: true,
  location: true,
  practiceAddress: true,
  practiceCity: true,
  practiceProvince: true,
  practicePostalCode: true,
  practicePhone: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  isApproved: true,
});

export const insertChannelSchema = createInsertSchema(channels).pick({
  name: true,
  description: true,
  isPrivate: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  channelId: true,
  userId: true,
  content: true,
  attachments: true,
  replyToId: true,
  hasPatientData: true,
});

export const insertAISuggestionSchema = createInsertSchema(aiSuggestions).pick({
  messageId: true,
  suggestion: true,
  suggestionType: true,
  faqReferences: true,
  educationReferences: true,
  status: true,
  editedSuggestion: true,
  rejectionReason: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  type: true,
  title: true,
  message: true,
  relatedId: true,
});

export const insertLocationConnectionSchema = createInsertSchema(locationConnections).pick({
  location: true,
  userId: true,
  isVisible: true,
});

export const insertFAQSchema = createInsertSchema(faqs).pick({
  question: true,
  answer: true,
  category: true,
  tags: true,
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).pick({
  title: true,
  content: true,
  category: true,
  contentType: true,
  attachments: true,
  tags: true,
  isFeatured: true,
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  content: true,
  startDate: true,
  endDate: true,
  isActive: true,
  attachments: true,
  linkUrl: true,
  linkText: true,
  createdBy: true,
});

export const insertUserAnnouncementViewSchema = createInsertSchema(userAnnouncementViews).pick({
  userId: true,
  announcementId: true,
  viewedDate: true,
});

export const insertAISuggestionUpvoteSchema = createInsertSchema(aiSuggestionUpvotes).pick({
  userId: true,
  suggestionId: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type Channel = typeof channels.$inferSelect;
export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type AISuggestion = typeof aiSuggestions.$inferSelect;
export type InsertAISuggestion = z.infer<typeof insertAISuggestionSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type LocationConnection = typeof locationConnections.$inferSelect;
export type InsertLocationConnection = z.infer<typeof insertLocationConnectionSchema>;
export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = z.infer<typeof insertFAQSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type UserAnnouncementView = typeof userAnnouncementViews.$inferSelect;
export type InsertUserAnnouncementView = z.infer<typeof insertUserAnnouncementViewSchema>;
export type AISuggestionUpvote = typeof aiSuggestionUpvotes.$inferSelect;
export type InsertAISuggestionUpvote = z.infer<typeof insertAISuggestionUpvoteSchema>;
