import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
// AI imports removed - only wound care assistant remains
import { setupAuth, isAuthenticated, requireApproval, requireRole } from "./replitAuth";
import { 
  insertMessageSchema, 
  insertUserSchema, 
  insertAISuggestionSchema,
  insertNotificationSchema,
  insertLocationConnectionSchema,
  insertEducationalContentSchema
} from "@shared/schema";

interface MulterRequest extends Request {
  file?: any;
}

// Simple AI suggestion function that matches messages with FAQ keywords
// AI suggestions removed - chat is now simple messaging only

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Auth middleware
  await setupAuth(app);
  
  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<WebSocket, { userId: string; channelId: number }>();

  wss.on('connection', (ws) => {
    console.log('Client connected');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'join':
            clients.set(ws, { userId: message.userId, channelId: message.channelId });
            await storage.updateUserOnlineStatus(message.userId, true);
            break;
            
          case 'chat':
            const newMessage = await storage.createMessage({
              channelId: message.channelId,
              userId: message.userId,
              content: message.content,
              attachments: message.attachments || [],
              replyToId: message.replyToId,
            });
            
            // Always broadcast all messages immediately
            clients.forEach((clientInfo, client) => {
              if (client.readyState === WebSocket.OPEN && clientInfo.channelId === message.channelId) {
                client.send(JSON.stringify({
                  type: 'message',
                  data: newMessage,
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      const clientInfo = clients.get(ws);
      if (clientInfo) {
        storage.updateUserOnlineStatus(clientInfo.userId, false);
        clients.delete(ws);
      }
      console.log('Client disconnected');
    });
  });

  // REST API routes
  
  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error: any) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Registration for new users
  app.post('/api/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Notify admins of new registration
      const admins = await storage.getUsersByLocation('admin');
      for (const admin of admins) {
        await storage.createNotification({
          userId: admin.id,
          type: 'registration_pending',
          title: 'New Registration Request',
          message: `${userData.username} from ${userData.location} has requested to join the platform.`,
          relatedId: user.id,
        });
      }
      
      res.json({ 
        message: 'Registration submitted successfully. Please wait for admin approval.',
        user: { id: user.id, username: user.username, isApproved: user.isApproved }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Admin approve user
  app.post('/api/users/:id/approve', isAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const userId = req.params.id;
      const adminId = req.user.claims.sub;
      await storage.approveUser(userId, adminId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get users by location (for location-based networking)
  app.get('/api/users/location/:location', isAuthenticated, requireApproval, async (req, res) => {
    try {
      const location = req.params.location;
      const users = await storage.getUsersByLocation(location);
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get practitioners with locations for map display
  app.get('/api/practitioners-with-locations', isAuthenticated, requireApproval, async (req, res) => {
    try {
      const practitioners = await storage.getPractitionersWithLocations();
      res.json(practitioners);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notifications
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationRead(notificationId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Location connections
  app.get('/api/locations/:location/users', isAuthenticated, requireApproval, async (req, res) => {
    try {
      const location = req.params.location;
      const connections = await storage.getLocationConnections(location);
      res.json(connections);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/location-connections', isAuthenticated, requireApproval, async (req: any, res) => {
    try {
      const connectionData = insertLocationConnectionSchema.parse(req.body);
      connectionData.userId = req.user.claims.sub;
      const connection = await storage.createLocationConnection(connectionData);
      res.json(connection);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Channels
  app.get('/api/channels', isAuthenticated, async (req, res) => {
    try {
      const channels = await storage.getChannels();
      res.json(channels);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/channels/:id', isAuthenticated, async (req, res) => {
    try {
      const channel = await storage.getChannel(parseInt(req.params.id));
      if (!channel) {
        return res.status(404).json({ error: 'Channel not found' });
      }
      res.json(channel);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Messages
  app.get('/api/channels/:id/messages', isAuthenticated, async (req, res) => {
    try {
      const channelId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getMessages(channelId, limit);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific message (for replies)
  app.get('/api/messages/:messageId', isAuthenticated, async (req, res) => {
    try {
      const messageId = parseInt(req.params.messageId);
      const message = await storage.getMessage(messageId);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin approve message with patient data
  app.post('/api/messages/:id/approve', isAuthenticated, requireRole(['admin', 'senior']), async (req: any, res) => {
    try {
      const messageId = parseInt(req.params.id);
      const adminId = req.user.claims.sub;
      await storage.approveMessage(messageId, adminId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI suggestions removed - only wound care assistant remains

  // Wound Care AI Chat (not stored)
  app.post('/api/wound-care-chat', async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: 'Question is required' });
      }

      const { askWoundAssistant } = await import('./services/ai.js');
      const response = await askWoundAssistant(question);
      
      if (!response) {
        return res.status(500).json({ error: 'Failed to get AI response' });
      }

      res.json({ response });
    } catch (error: any) {
      console.error('Wound care chat error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // FAQs
  app.get('/api/faqs', async (req, res) => {
    try {
      const { category, search } = req.query;
      let faqs;
      
      if (search) {
        faqs = await storage.searchFAQs(search as string);
      } else if (category) {
        faqs = await storage.getFAQsByCategory(category as string);
      } else {
        faqs = await storage.getFAQs();
      }
      
      res.json(faqs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update FAQ (admin only)
  app.put('/api/faqs/:id', isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const faqId = parseInt(req.params.id);
      const updateData = req.body;
      
      const faq = await storage.updateFAQ(faqId, updateData);
      res.json(faq);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete FAQ (admin only)
  app.delete('/api/faqs/:id', isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const faqId = parseInt(req.params.id);
      await storage.deleteFAQ(faqId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Educational Content
  app.get('/api/education', async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      let content;
      
      if (search) {
        content = await storage.searchEducationalContent(search as string);
      } else if (category) {
        content = await storage.getEducationalContentByCategory(category as string);
      } else if (featured) {
        content = await storage.getFeaturedEducationalContent();
      } else {
        content = await storage.getEducationalContent();
      }
      
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Educational content creation endpoint  
  app.post('/api/education', isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const educationData = insertEducationalContentSchema.parse(req.body);
      const content = await storage.createEducationalContent(educationData);
      res.json(content);
    } catch (error) {
      console.error('Error creating educational content:', error);
      res.status(400).json({ error: 'Failed to create educational content' });
    }
  });

  // Delete educational content (admin only)
  app.delete('/api/education/:id', isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEducationalContent(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting educational content:', error);
      res.status(400).json({ error: 'Failed to delete educational content' });
    }
  });

  // AI Suggestion Upvote System
  app.post('/api/ai-suggestions/:id/upvote', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;
      await storage.upvoteAISuggestion(userId, parseInt(id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error upvoting suggestion:', error);
      res.status(500).json({ message: 'Error upvoting suggestion: ' + error.message });
    }
  });

  app.delete('/api/ai-suggestions/:id/upvote', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;
      await storage.removeUpvoteAISuggestion(userId, parseInt(id));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error removing upvote:', error);
      res.status(500).json({ message: 'Error removing upvote: ' + error.message });
    }
  });

  app.get('/api/ai-suggestions/:id/upvoted', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const userId = (req.user as any).id;
      const hasUpvoted = await storage.hasUserUpvotedSuggestion(userId, parseInt(id));
      res.json({ hasUpvoted });
    } catch (error: any) {
      console.error('Error checking upvote status:', error);
      res.status(500).json({ message: 'Error checking upvote status: ' + error.message });
    }
  });

  // Subscription Management
  app.get('/api/user/llm-usage', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const usage = await storage.getUserLLMUsage(userId);
      const user = await storage.getUser(userId);
      res.json({ 
        count: usage.count, 
        resetDate: usage.resetDate,
        subscriptionStatus: user?.subscriptionStatus || 'free'
      });
    } catch (error: any) {
      console.error('Error getting LLM usage:', error);
      res.status(500).json({ message: 'Error getting LLM usage: ' + error.message });
    }
  });

  // Announcement endpoints
  app.get('/api/announcements/active', async (req, res) => {
    try {
      const announcements = await storage.getActiveAnnouncements();
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching active announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  app.post('/api/announcements', isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const announcementData = {
        ...req.body,
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const announcement = await storage.createAnnouncement(announcementData);
      res.json(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(400).json({ error: 'Failed to create announcement' });
    }
  });

  app.get('/api/announcements/:id/viewed', isAuthenticated, async (req: any, res) => {
    try {
      const announcementId = parseInt(req.params.id);
      const { date } = req.query;
      const userId = req.user.claims.sub;
      
      const hasViewed = await storage.hasUserViewedAnnouncement(userId, announcementId, date as string);
      res.json({ hasViewed });
    } catch (error) {
      console.error('Error checking announcement view:', error);
      res.status(500).json({ error: 'Failed to check announcement view' });
    }
  });

  app.post('/api/announcements/mark-viewed', isAuthenticated, async (req: any, res) => {
    try {
      const { announcementId, userId, viewedDate } = req.body;
      await storage.markAnnouncementViewed(userId, announcementId, viewedDate);
      res.json({ success: true });
    } catch (error) {
      console.error('Error marking announcement as viewed:', error);
      res.status(400).json({ error: 'Failed to mark announcement as viewed' });
    }
  });

  // FAQ answer editing endpoint
  app.patch('/api/faqs/:id', isAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { answer } = req.body;
      
      if (!answer) {
        return res.status(400).json({ error: 'Answer is required' });
      }
      
      const updatedFaq = await storage.updateFAQ(id, { answer });
      res.json(updatedFaq);
    } catch (error) {
      console.error('Error updating FAQ answer:', error);
      res.status(400).json({ error: 'Failed to update FAQ answer' });
    }
  });

  // File upload with automatic education section integration
  // Serve attachment files
  app.get('/api/attachments/:filename', isAuthenticated, async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(process.cwd(), 'uploads', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      // Get file stats for proper headers
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;
      
      // Determine MIME type based on file extension
      const ext = path.extname(filename).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.pdf') contentType = 'application/pdf';
      else if (ext === '.txt') contentType = 'text/plain';
      else if (ext === '.doc') contentType = 'application/msword';
      else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      
      // Set headers for file download/viewing
      res.setHeader('Content-Length', fileSize);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      // Stream the file
      const readStream = fs.createReadStream(filePath);
      readStream.on('error', (err) => {
        console.error('Error reading file:', err);
        res.status(500).json({ error: 'Error reading file' });
      });
      readStream.pipe(res);
    } catch (error) {
      console.error('Error serving attachment:', error);
      res.status(500).json({ error: 'Failed to serve file' });
    }
  });

  app.post('/api/upload', isAuthenticated, requireApproval, upload.single('file'), async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      // Check for potential patient data in images (basic check)
      const hasPatientImages = req.file.mimetype.startsWith('image/') && 
        /patient|xray|scan|medical|chart/i.test(req.file.originalname);
      
      if (hasPatientImages) {
        return res.status(400).json({ 
          error: 'Patient images require approval. Please confirm patient consent before uploading.',
          requiresConsent: true 
        });
      }
      
      const fileInfo = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer.toString('base64'),
      };
      
      res.json(fileInfo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
