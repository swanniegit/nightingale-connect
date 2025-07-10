import {
  users,
  channels,
  messages,
  aiSuggestions,
  faqs,
  educationalContent,
  announcements,
  userAnnouncementViews,
  notifications,
  locationConnections,
  aiSuggestionUpvotes,
  type User,
  type InsertUser,
  type UpsertUser,
  type Channel,
  type InsertChannel,
  type Message,
  type InsertMessage,
  type AISuggestion,
  type InsertAISuggestion,
  type FAQ,
  type InsertFAQ,
  type EducationalContent,
  type InsertEducationalContent,
  type Notification,
  type InsertNotification,
  type LocationConnection,
  type InsertLocationConnection,
  type Announcement,
  type InsertAnnouncement,
  type UserAnnouncementView,
  type InsertUserAnnouncementView,
  type AISuggestionUpvote,
  type InsertAISuggestionUpvote,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, or, ne, lte, gte, sql } from "drizzle-orm";

export interface IStorage {
  // Users (Auth-compatible interface)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void>;
  approveUser(id: string, approvedBy: string): Promise<void>;
  getUsersByLocation(location: string): Promise<User[]>;
  getPractitionersWithLocations(): Promise<User[]>;
  
  // Channels
  getChannels(): Promise<Channel[]>;
  getChannel(id: number): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  
  // Messages
  getMessages(channelId: number, limit?: number): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  approveMessage(id: number, approvedBy: string): Promise<void>;
  
  // AI Suggestions
  getAISuggestionsByMessage(messageId: number): Promise<AISuggestion[]>;
  createAISuggestion(suggestion: InsertAISuggestion): Promise<AISuggestion>;
  validateAISuggestion(id: number, validatedBy: string): Promise<void>;
  approveAISuggestion(id: number, approvedBy: string, category?: string): Promise<FAQ>;
  editAISuggestion(id: number, editedSuggestion: string, editedBy: string): Promise<AISuggestion>;
  rejectAISuggestion(id: number, rejectionReason: string, rejectedBy: string): Promise<AISuggestion>;
  
  // Notifications
  getNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<void>;
  
  // Location Connections
  getLocationConnections(location: string): Promise<LocationConnection[]>;
  createLocationConnection(connection: InsertLocationConnection): Promise<LocationConnection>;
  
  // FAQs
  getFAQs(): Promise<FAQ[]>;
  getFAQsByCategory(category: string): Promise<FAQ[]>;
  searchFAQs(query: string): Promise<FAQ[]>;
  createFAQ(faq: InsertFAQ): Promise<FAQ>;
  updateFAQ(id: number, faq: Partial<InsertFAQ>): Promise<FAQ>;
  deleteFAQ(id: number): Promise<void>;
  
  // Educational Content
  getEducationalContent(): Promise<EducationalContent[]>;
  getEducationalContentByCategory(category: string): Promise<EducationalContent[]>;
  getFeaturedEducationalContent(): Promise<EducationalContent[]>;
  searchEducationalContent(query: string): Promise<EducationalContent[]>;
  createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent>;
  createEducationalContentFromAttachment(attachment: any, messageId: number, userId: string): Promise<EducationalContent>;
  deleteEducationalContent(id: number): Promise<void>;
  
  // Announcements
  getActiveAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  markAnnouncementViewed(userId: string, announcementId: number, viewedDate: string): Promise<void>;
  hasUserViewedAnnouncement(userId: string, announcementId: number, viewedDate: string): Promise<boolean>;
  
  // AI Suggestion Upvotes
  upvoteAISuggestion(userId: string, suggestionId: number): Promise<void>;
  removeUpvoteAISuggestion(userId: string, suggestionId: number): Promise<void>;
  hasUserUpvotedSuggestion(userId: string, suggestionId: number): Promise<boolean>;
  
  // User Subscription Management
  updateUserSubscriptionStatus(userId: string, status: string): Promise<void>;
  incrementLLMUsage(userId: string): Promise<void>;
  resetLLMUsage(userId: string): Promise<void>;
  getUserLLMUsage(userId: string): Promise<{ count: number; resetDate: Date }>;
  updateStripeCustomerId(userId: string, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users (Auth-compatible interface)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: Date.now().toString(), // Generate a simple ID for new users
      })
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        username: userData.email?.split('@')[0] || 'user',
        role: 'nurse',
        isApproved: true, // Auto-approve all users
        isOnline: false,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserOnlineStatus(id: string, isOnline: boolean): Promise<void> {
    await db
      .update(users)
      .set({ isOnline, updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  async approveUser(id: string, approvedBy: string): Promise<void> {
    await db
      .update(users)
      .set({ isApproved: true, updatedAt: new Date() })
      .where(eq(users.id, id));
    
    // Create notification
    await this.createNotification({
      userId: id,
      type: 'user_approved',
      title: 'Registration Approved',
      message: 'Your registration has been approved by an administrator. Welcome to Nightingale Connect!',
      relatedId: approvedBy,
    });
  }

  async getUsersByLocation(location: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(and(
        eq(users.location, location),
        eq(users.isApproved, true)
      ));
  }

  async getPractitionersWithLocations(): Promise<User[]> {
    const practitioners = await db
      .select()
      .from(users)
      .where(eq(users.isApproved, true));
    
    // Return only practitioners who have practice address information
    return practitioners.filter(user => 
      user.practiceAddress || user.practiceCity || user.location
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Channels
  async getChannels(): Promise<Channel[]> {
    return await db.select().from(channels).orderBy(desc(channels.createdAt));
  }

  async getChannel(id: number): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel;
  }

  async createChannel(channelData: InsertChannel): Promise<Channel> {
    const [channel] = await db
      .insert(channels)
      .values(channelData)
      .returning();
    return channel;
  }

  // Messages
  async getMessages(channelId: number, limit = 50): Promise<Message[]> {
    const messageList = await db
      .select()
      .from(messages)
      .where(eq(messages.channelId, channelId)) // Show all messages
      .orderBy(desc(messages.createdAt))
      .limit(limit);
      
    // Reverse to show oldest first (WhatsApp style - most recent at bottom)
    return messageList.reverse();
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const [message] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id));
    return message;
  }

  async createMessage(messageData: InsertMessage): Promise<Message> {
    // Check if message contains potential patient data
    const hasPatientData = /patient|diagnosis|medication|treatment|medical record|case study|clinical|symptom/i.test(messageData.content);
    
    const [message] = await db
      .insert(messages)
      .values({
        ...messageData,
        hasPatientData,
        isApproved: true, // All messages are approved and visible
      })
      .returning();

    // Auto-move attachments to education if they are documents and user is admin
    if (messageData.attachments && Array.isArray(messageData.attachments)) {
      // Get user role to check if admin
      const user = await this.getUser(messageData.userId);
      
      for (const attachment of messageData.attachments) {
        // Check if it's a document (PDF, DOC, TXT, etc.) and user is admin
        const isDocument = attachment.mimeType && (
          attachment.mimeType.includes('application/pdf') ||
          attachment.mimeType.includes('application/msword') ||
          attachment.mimeType.includes('application/vnd.openxmlformats') ||
          attachment.mimeType.includes('text/') ||
          attachment.mimeType.includes('application/rtf')
        );
        
        if (isDocument && user?.role === 'admin') {
          const educationalContent = await this.createEducationalContentFromAttachment(attachment, message.id, messageData.userId);
          
          // Notify the admin that their document was moved
          await this.createNotification({
            userId: messageData.userId,
            type: 'document_moved',
            title: 'Document Moved to Educational Resources',
            message: `Your document "${attachment.originalName}" has been automatically added to the educational resources for community access.`,
            relatedId: educationalContent.id.toString(),
          });
          
          // Notify other admins about new educational content
          const otherAdmins = await db
            .select()
            .from(users)
            .where(and(
              eq(users.role, 'admin'),
              ne(users.id, messageData.userId)
            ));
          
          for (const admin of otherAdmins) {
            await this.createNotification({
              userId: admin.id,
              type: 'new_educational_content',
              title: 'New Educational Content Added',
              message: `${user?.username || 'Admin'} shared a new document: "${attachment.originalName}" in the educational resources.`,
              relatedId: educationalContent.id.toString(),
            });
          }
        }
      }
    }

    return message;
  }

  async approveMessage(id: number, approvedBy: string): Promise<void> {
    await db
      .update(messages)
      .set({ isApproved: true })
      .where(eq(messages.id, id));
  }

  // AI Suggestions
  async getAISuggestionsByMessage(messageId: number): Promise<AISuggestion[]> {
    return await db
      .select()
      .from(aiSuggestions)
      .where(eq(aiSuggestions.messageId, messageId));
  }

  async createAISuggestion(suggestionData: InsertAISuggestion): Promise<AISuggestion> {
    const [suggestion] = await db
      .insert(aiSuggestions)
      .values(suggestionData)
      .returning();
    return suggestion;
  }

  async validateAISuggestion(id: number, validatedBy: string): Promise<void> {
    await db
      .update(aiSuggestions)
      .set({ isValidated: true, validatedBy })
      .where(eq(aiSuggestions.id, id));
  }

  async approveAISuggestion(id: number, approvedBy: string, category?: string): Promise<FAQ> {
    // Get the AI suggestion
    const [suggestion] = await db
      .select()
      .from(aiSuggestions)
      .where(eq(aiSuggestions.id, id));
    
    if (!suggestion) {
      throw new Error('AI suggestion not found');
    }

    // Determine category - use provided category or default to 'AI Generated'
    const faqCategory = category || 'AI Generated';
    
    // Create FAQ from the suggestion
    const [faq] = await db
      .insert(faqs)
      .values({
        question: `AI Generated Question from Suggestion #${id}`,
        answer: suggestion.suggestion,
        category: faqCategory,
        tags: ['ai-generated', 'approved'],
      })
      .returning();

    // Update the AI suggestion status
    await db
      .update(aiSuggestions)
      .set({ 
        status: 'approved',
        isValidated: true,
        validatedBy: approvedBy,
        approvedAsFaqId: faq.id
      })
      .where(eq(aiSuggestions.id, id));

    return faq;
  }

  async editAISuggestion(id: number, editedSuggestion: string, editedBy: string): Promise<AISuggestion> {
    const [suggestion] = await db
      .update(aiSuggestions)
      .set({ 
        status: 'edited',
        editedSuggestion,
        validatedBy: editedBy
      })
      .where(eq(aiSuggestions.id, id))
      .returning();

    return suggestion;
  }

  async rejectAISuggestion(id: number, rejectionReason: string, rejectedBy: string): Promise<AISuggestion> {
    const [suggestion] = await db
      .update(aiSuggestions)
      .set({ 
        status: 'rejected',
        rejectionReason,
        validatedBy: rejectedBy
      })
      .where(eq(aiSuggestions.id, id))
      .returning();

    return suggestion;
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }
  
  async broadcastNotification(userId: string, notification: any, wss?: any): Promise<void> {
    // If WebSocket server is available, broadcast notification
    if (wss && wss.clients) {
      wss.clients.forEach((client: any) => {
        if (client.readyState === 1 && client.userId === userId) { // WebSocket.OPEN = 1
          client.send(JSON.stringify({
            type: 'notification',
            data: notification
          }));
        }
      });
    }
  }

  async markNotificationRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Location Connections
  async getLocationConnections(location: string): Promise<LocationConnection[]> {
    return await db
      .select()
      .from(locationConnections)
      .where(eq(locationConnections.location, location));
  }

  async createLocationConnection(connectionData: InsertLocationConnection): Promise<LocationConnection> {
    const [connection] = await db
      .insert(locationConnections)
      .values(connectionData)
      .returning();
    return connection;
  }

  // FAQs
  async getFAQs(): Promise<FAQ[]> {
    return await db.select().from(faqs).orderBy(desc(faqs.createdAt));
  }

  async getFAQsByCategory(category: string): Promise<FAQ[]> {
    return await db
      .select()
      .from(faqs)
      .where(eq(faqs.category, category));
  }

  async searchFAQs(query: string): Promise<FAQ[]> {
    return await db
      .select()
      .from(faqs)
      .where(or(
        like(faqs.question, `%${query}%`),
        like(faqs.answer, `%${query}%`)
      ));
  }

  async createFAQ(faqData: InsertFAQ): Promise<FAQ> {
    const [faq] = await db
      .insert(faqs)
      .values(faqData)
      .returning();
    return faq;
  }

  async updateFAQ(id: number, faqData: Partial<InsertFAQ>): Promise<FAQ> {
    const [faq] = await db
      .update(faqs)
      .set(faqData)
      .where(eq(faqs.id, id))
      .returning();
    return faq;
  }

  async deleteFAQ(id: number): Promise<void> {
    await db
      .delete(faqs)
      .where(eq(faqs.id, id));
  }

  // Educational Content
  async getEducationalContent(): Promise<EducationalContent[]> {
    return await db.select().from(educationalContent).orderBy(desc(educationalContent.createdAt));
  }

  async getEducationalContentByCategory(category: string): Promise<EducationalContent[]> {
    return await db
      .select()
      .from(educationalContent)
      .where(eq(educationalContent.category, category));
  }

  async getFeaturedEducationalContent(): Promise<EducationalContent[]> {
    return await db
      .select()
      .from(educationalContent)
      .where(eq(educationalContent.isFeatured, true));
  }

  async searchEducationalContent(query: string): Promise<EducationalContent[]> {
    return await db
      .select()
      .from(educationalContent)
      .where(or(
        like(educationalContent.title, `%${query}%`),
        like(educationalContent.content, `%${query}%`)
      ));
  }

  async createEducationalContent(contentData: InsertEducationalContent): Promise<EducationalContent> {
    const [content] = await db
      .insert(educationalContent)
      .values(contentData)
      .returning();
    return content;
  }

  async createEducationalContentFromAttachment(attachment: any, messageId: number, userId: string): Promise<EducationalContent> {
    // Get the user info for better content attribution
    const user = await this.getUser(userId);
    
    // Determine category based on file type or name
    let category = 'Shared Documents';
    const filename = attachment.originalName?.toLowerCase() || '';
    
    if (filename.includes('guideline') || filename.includes('protocol')) {
      category = 'Clinical Guidelines';
    } else if (filename.includes('procedure') || filename.includes('manual')) {
      category = 'Procedures';
    } else if (filename.includes('policy') || filename.includes('regulation')) {
      category = 'Policies';
    } else if (filename.includes('form') || filename.includes('template')) {
      category = 'Forms and Templates';
    }
    
    const [content] = await db
      .insert(educationalContent)
      .values({
        title: attachment.originalName || 'Admin Shared Document',
        content: `Document shared by ${user?.username || 'Admin'} from chat discussion. 
        
File: ${attachment.originalName}
Size: ${attachment.size ? Math.round(attachment.size / 1024) + ' KB' : 'Unknown'}
Shared from message #${messageId}

This document was automatically moved to the educational resources for future reference by the community.`,
        category,
        contentType: 'document',
        attachments: [{
          ...attachment,
          filename: attachment.filename || attachment.originalName
        }],
        tags: ['admin-shared', 'document', 'chat-upload'],
        isFeatured: true, // Mark admin uploads as featured
      })
      .returning();
    
    // Create notification for the document being moved to education
    await this.createNotification({
      userId,
      type: 'document_moved',
      title: 'Document Added to Education',
      message: `Your shared document "${attachment.originalName}" has been automatically added to the education section.`,
      relatedId: content.id.toString(),
    });
    
    return content;
  }

  async deleteEducationalContent(id: number): Promise<void> {
    await db
      .delete(educationalContent)
      .where(eq(educationalContent.id, id));
  }

  // Announcements
  async getActiveAnnouncements(): Promise<Announcement[]> {
    const now = new Date();
    return await db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.isActive, true),
          lte(announcements.startDate, now),
          gte(announcements.endDate, now)
        )
      )
      .orderBy(desc(announcements.createdAt));
  }

  async createAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values(announcementData)
      .returning();
    return announcement;
  }

  async markAnnouncementViewed(userId: string, announcementId: number, viewedDate: string): Promise<void> {
    await db
      .insert(userAnnouncementViews)
      .values({
        userId,
        announcementId,
        viewedDate,
      })
      .onConflictDoNothing();
  }

  async hasUserViewedAnnouncement(userId: string, announcementId: number, viewedDate: string): Promise<boolean> {
    const result = await db
      .select({ id: userAnnouncementViews.id })
      .from(userAnnouncementViews)
      .where(
        and(
          eq(userAnnouncementViews.userId, userId),
          eq(userAnnouncementViews.announcementId, announcementId),
          eq(userAnnouncementViews.viewedDate, viewedDate)
        )
      )
      .limit(1);
    
    return result.length > 0;
  }

  // AI Suggestion Upvotes
  async upvoteAISuggestion(userId: string, suggestionId: number): Promise<void> {
    // First, check if user has already upvoted
    const existingUpvote = await db
      .select()
      .from(aiSuggestionUpvotes)
      .where(
        and(
          eq(aiSuggestionUpvotes.userId, userId),
          eq(aiSuggestionUpvotes.suggestionId, suggestionId)
        )
      )
      .limit(1);

    if (existingUpvote.length > 0) {
      return; // Already upvoted
    }

    // Create the upvote record
    await db
      .insert(aiSuggestionUpvotes)
      .values({ userId, suggestionId });

    // Increment upvote count on the suggestion using raw SQL
    await db
      .update(aiSuggestions)
      .set({ upvotes: sql`${aiSuggestions.upvotes} + 1` })
      .where(eq(aiSuggestions.id, suggestionId));
  }

  async removeUpvoteAISuggestion(userId: string, suggestionId: number): Promise<void> {
    // Remove the upvote
    await db
      .delete(aiSuggestionUpvotes)
      .where(
        and(
          eq(aiSuggestionUpvotes.userId, userId),
          eq(aiSuggestionUpvotes.suggestionId, suggestionId)
        )
      );

    // Decrement upvote count on the suggestion using raw SQL
    await db
      .update(aiSuggestions)
      .set({ upvotes: sql`GREATEST(0, ${aiSuggestions.upvotes} - 1)` })
      .where(eq(aiSuggestions.id, suggestionId));
  }

  async hasUserUpvotedSuggestion(userId: string, suggestionId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(aiSuggestionUpvotes)
      .where(
        and(
          eq(aiSuggestionUpvotes.userId, userId),
          eq(aiSuggestionUpvotes.suggestionId, suggestionId)
        )
      )
      .limit(1);
    
    return result.length > 0;
  }

  // User Subscription Management
  async updateUserSubscriptionStatus(userId: string, status: string): Promise<void> {
    await db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, userId));
  }

  async incrementLLMUsage(userId: string): Promise<void> {
    const user = await db
      .select({ llmUsageCount: users.llmUsageCount, llmUsageResetDate: users.llmUsageResetDate })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) return;

    const now = new Date();
    const resetDate = new Date(user[0].llmUsageResetDate || now);
    
    // Reset usage if it's been more than 30 days
    if (now.getTime() - resetDate.getTime() > 30 * 24 * 60 * 60 * 1000) {
      await db
        .update(users)
        .set({ 
          llmUsageCount: 1,
          llmUsageResetDate: now
        })
        .where(eq(users.id, userId));
    } else {
      await db
        .update(users)
        .set({ llmUsageCount: (user[0].llmUsageCount || 0) + 1 })
        .where(eq(users.id, userId));
    }
  }

  async resetLLMUsage(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ 
        llmUsageCount: 0,
        llmUsageResetDate: new Date()
      })
      .where(eq(users.id, userId));
  }

  async getUserLLMUsage(userId: string): Promise<{ count: number; resetDate: Date }> {
    const user = await db
      .select({ llmUsageCount: users.llmUsageCount, llmUsageResetDate: users.llmUsageResetDate })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return { count: 0, resetDate: new Date() };
    }

    return {
      count: user[0].llmUsageCount || 0,
      resetDate: new Date(user[0].llmUsageResetDate || new Date())
    };
  }

  async updateStripeCustomerId(userId: string, customerId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeInfo: { customerId: string; subscriptionId: string }): Promise<void> {
    await db
      .update(users)
      .set({ 
        stripeCustomerId: stripeInfo.customerId,
        stripeSubscriptionId: stripeInfo.subscriptionId,
        subscriptionStatus: 'active'
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
