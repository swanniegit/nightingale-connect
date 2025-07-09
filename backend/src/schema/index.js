const { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb, uuid } = require('drizzle-orm/pg-core');

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  professionalNumber: varchar('professional_number', { length: 50 }).notNull().unique(),
  specialty: varchar('specialty', { length: 100 }).notNull(),
  province: varchar('province', { length: 50 }).notNull(),
  institution: varchar('institution', { length: 200 }).notNull(),
  qualifications: text('qualifications').notNull(),
  bio: text('bio'),
  avatar: varchar('avatar', { length: 500 }),
  isVerified: boolean('is_verified').default(false),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Questions table
const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  specialty: varchar('specialty', { length: 100 }),
  province: varchar('province', { length: 50 }),
  tags: jsonb('tags'),
  votes: integer('votes').default(0),
  responseCount: integer('response_count').default(0),
  isResolved: boolean('is_resolved').default(false),
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Responses table
const responses = pgTable('responses', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  authorId: integer('author_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  votes: integer('votes').default(0),
  isAccepted: boolean('is_accepted').default(false),
  isAnonymous: boolean('is_anonymous').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Notifications table
const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'question', 'response', 'system', 'mention'
  relatedId: integer('related_id'), // ID of related question, response, etc.
  isRead: boolean('is_read').default(false),
  metadata: jsonb('metadata'), // Additional data like user info, question title, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Files table (for uploaded documents and images)
const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  path: varchar('path', { length: 500 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  uploadedBy: integer('uploaded_by').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  relatedType: varchar('related_type', { length: 50 }).notNull(), // 'question', 'response', 'profile'
  relatedId: integer('related_id'), // ID of related question, response, etc.
  isPublic: boolean('is_public').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User connections (for networking)
const userConnections = pgTable('user_connections', {
  id: serial('id').primaryKey(),
  requesterId: integer('requester_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recipientId: integer('recipient_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // 'pending', 'accepted', 'rejected'
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Question votes
const questionVotes = pgTable('question_votes', {
  id: serial('id').primaryKey(),
  questionId: integer('question_id').references(() => questions.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vote: integer('vote').notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Response votes
const responseVotes = pgTable('response_votes', {
  id: serial('id').primaryKey(),
  responseId: integer('response_id').references(() => responses.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  vote: integer('vote').notNull(), // 1 for upvote, -1 for downvote
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Chat messages (for real-time communication)
const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  senderId: integer('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  recipientId: integer('recipient_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  messageType: varchar('message_type', { length: 20 }).default('text'), // 'text', 'image', 'file'
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI conversation history
const aiConversations = pgTable('ai_conversations', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  query: text('query').notNull(),
  response: text('response').notNull(),
  tokens: integer('tokens'),
  model: varchar('model', { length: 50 }).default('gpt-4'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

module.exports = {
  users,
  questions,
  responses,
  notifications,
  files,
  userConnections,
  questionVotes,
  responseVotes,
  chatMessages,
  aiConversations,
}; 