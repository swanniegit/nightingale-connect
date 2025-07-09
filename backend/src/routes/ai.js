const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');
const { getDB, aiConversations } = require('../config/database');
const { logger } = require('../utils/logger');
const { sanitizeHtml } = require('../utils/security');
const { eq, desc, and, asc } = require('drizzle-orm');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Wound care assistant query
router.post('/wound-care', [
  body('query')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Query must be 10-1000 characters long'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const db = getDB();
    const { query } = req.body;
    const userId = req.userId;

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: 'AI service unavailable',
        message: 'AI assistant is not configured. Please contact support.',
      });
    }

    // Create system prompt for wound care assistant
    const systemPrompt = `You are a specialized wound care assistant for South African healthcare professionals. 
    
    Your role is to provide evidence-based guidance on wound care management, following South African healthcare protocols and international best practices.
    
    Guidelines for your responses:
    1. Always prioritize patient safety and evidence-based practice
    2. Consider South African healthcare context and available resources
    3. Provide practical, actionable advice
    4. Include relevant clinical guidelines when appropriate
    5. Suggest when to refer to specialists or seek immediate medical attention
    6. Be clear about limitations and when professional consultation is needed
    7. Use appropriate medical terminology while remaining accessible
    8. Consider POPIA compliance and patient privacy
    
    IMPORTANT: Always remind users that your advice is for educational purposes and should not replace professional medical judgment. For specific patient cases, they should consult with appropriate healthcare professionals.
    
    Respond in a helpful, professional manner suitable for healthcare professionals.`;

    try {
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: sanitizeHtml(query) }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      const usage = completion.usage.total_tokens;

      // Generate session ID for conversation tracking
      const sessionId = `session_${userId}_${Date.now()}`;

      // Store conversation in database
      await db.insert(aiConversations).values({
        userId: userId,
        sessionId: sessionId,
        query: sanitizeHtml(query),
        response: sanitizeHtml(response),
        tokens: usage,
        model: 'gpt-4',
      });

      logger.logAI('wound-care-query', {
        userId,
        sessionId,
        queryLength: query.length,
        responseLength: response.length,
        tokens: usage,
      });

      res.json({
        success: true,
        data: {
          response: response,
          usage: usage,
          sessionId: sessionId,
        },
      });
    } catch (openaiError) {
      logger.error('OpenAI API error:', openaiError);
      
      // Handle specific OpenAI errors
      if (openaiError.code === 'insufficient_quota') {
        return res.status(503).json({
          success: false,
          error: 'Service temporarily unavailable',
          message: 'AI assistant is currently experiencing high demand. Please try again later.',
        });
      }
      
      if (openaiError.code === 'invalid_api_key') {
        return res.status(503).json({
          success: false,
          error: 'AI service configuration error',
          message: 'AI assistant is not properly configured. Please contact support.',
        });
      }

      return res.status(503).json({
        success: false,
        error: 'AI service error',
        message: 'Unable to process your request at this time. Please try again later.',
      });
    }
  } catch (error) {
    logger.error('AI wound care query error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process AI query.',
    });
  }
});

// Get user's AI conversation history
router.get('/history', async (req, res) => {
  try {
    const db = getDB();
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const conversations = await db.select({
      id: aiConversations.id,
      sessionId: aiConversations.sessionId,
      query: aiConversations.query,
      response: aiConversations.response,
      tokens: aiConversations.tokens,
      model: aiConversations.model,
      createdAt: aiConversations.createdAt,
    }).from(aiConversations)
    .where(eq(aiConversations.userId, userId))
    .orderBy(desc(aiConversations.createdAt))
    .limit(parseInt(limit))
    .offset(offset);

    // Get total count for pagination
    const total = await db.select().from(aiConversations).where(eq(aiConversations.userId, userId));

    res.json({
      success: true,
      data: {
        conversations: conversations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total.length,
          totalPages: Math.ceil(total.length / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get AI history error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch conversation history.',
    });
  }
});

// Get conversation by session ID
router.get('/session/:sessionId', async (req, res) => {
  try {
    const db = getDB();
    const { sessionId } = req.params;
    const userId = req.userId;

    const conversations = await db.select({
      id: aiConversations.id,
      sessionId: aiConversations.sessionId,
      query: aiConversations.query,
      response: aiConversations.response,
      tokens: aiConversations.tokens,
      model: aiConversations.model,
      createdAt: aiConversations.createdAt,
    }).from(aiConversations)
    .where(and(
      eq(aiConversations.sessionId, sessionId),
      eq(aiConversations.userId, userId)
    ))
    .orderBy(asc(aiConversations.createdAt));

    if (conversations.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
        message: 'Conversation session not found.',
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: sessionId,
        conversations: conversations,
      },
    });
  } catch (error) {
    logger.error('Get AI session error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch conversation session.',
    });
  }
});

// Delete conversation history
router.delete('/history', async (req, res) => {
  try {
    const db = getDB();
    const userId = req.userId;

    await db.delete(aiConversations).where(eq(aiConversations.userId, userId));

    logger.info(`AI conversation history deleted for user ${userId}`);

    res.json({
      success: true,
      message: 'Conversation history deleted successfully',
    });
  } catch (error) {
    logger.error('Delete AI history error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete conversation history.',
    });
  }
});

// AI service health check
router.get('/health', async (req, res) => {
  try {
    const isConfigured = !!process.env.OPENAI_API_KEY;
    
    if (!isConfigured) {
      return res.json({
        success: true,
        data: {
          status: 'not_configured',
          message: 'AI service is not configured',
        },
      });
    }

    // Test OpenAI API connection
    try {
      await openai.models.list();
      res.json({
        success: true,
        data: {
          status: 'healthy',
          message: 'AI service is operational',
        },
      });
    } catch (apiError) {
      res.json({
        success: true,
        data: {
          status: 'error',
          message: 'AI service is experiencing issues',
          error: apiError.message,
        },
      });
    }
  } catch (error) {
    logger.error('AI health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to check AI service health.',
    });
  }
});

module.exports = router; 