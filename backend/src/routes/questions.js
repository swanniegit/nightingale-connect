const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDB, users, questions, responses } = require('../config/database');
const { logger } = require('../utils/logger');
const { sanitizeHtml } = require('../utils/security');
const { eq, like, desc, asc, and, or } = require('drizzle-orm');

const router = express.Router();

// Get all questions with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, search, specialty, province, sort = 'newest' } = req.query;
    const offset = (page - 1) * limit;

    let query = db.select({
      id: questions.id,
      title: questions.title,
      content: questions.content,
      specialty: questions.specialty,
      province: questions.province,
      tags: questions.tags,
      votes: questions.votes,
      responseCount: questions.responseCount,
      isResolved: questions.isResolved,
      isAnonymous: questions.isAnonymous,
      createdAt: questions.createdAt,
      author: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        specialty: users.specialty,
      },
    }).from(questions)
    .leftJoin(users, eq(questions.authorId, users.id));

    // Apply filters
    if (search) {
      query = query.where(
        or(
          like(questions.title, `%${search}%`),
          like(questions.content, `%${search}%`)
        )
      );
    }
    if (specialty) {
      query = query.where(eq(questions.specialty, specialty));
    }
    if (province) {
      query = query.where(eq(questions.province, province));
    }

    // Get total count for pagination
    const countQuery = query;
    const total = await countQuery;

    // Apply sorting
    let orderByClause;
    switch (sort) {
      case 'votes':
        orderByClause = desc(questions.votes);
        break;
      case 'responses':
        orderByClause = desc(questions.responseCount);
        break;
      case 'oldest':
        orderByClause = asc(questions.createdAt);
        break;
      default:
        orderByClause = desc(questions.createdAt);
    }

    // Apply pagination and ordering
    const results = await query
      .orderBy(orderByClause)
      .limit(parseInt(limit))
      .offset(offset);

    res.json({
      success: true,
      data: {
        data: results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total.length,
          totalPages: Math.ceil(total.length / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch questions.',
    });
  }
});

// Get single question by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const question = await db.select({
      id: questions.id,
      title: questions.title,
      content: questions.content,
      specialty: questions.specialty,
      province: questions.province,
      tags: questions.tags,
      votes: questions.votes,
      responseCount: questions.responseCount,
      isResolved: questions.isResolved,
      isAnonymous: questions.isAnonymous,
      createdAt: questions.createdAt,
      updatedAt: questions.updatedAt,
      author: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        specialty: users.specialty,
        isVerified: users.isVerified,
      },
    }).from(questions)
    .leftJoin(users, eq(questions.authorId, users.id))
    .where(eq(questions.id, parseInt(id)))
    .limit(1);

    if (question.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
        message: 'Question not found.',
      });
    }

    // Get responses for this question
    const questionResponses = await db.select({
      id: responses.id,
      content: responses.content,
      votes: responses.votes,
      isAccepted: responses.isAccepted,
      isAnonymous: responses.isAnonymous,
      createdAt: responses.createdAt,
      author: {
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        specialty: users.specialty,
        isVerified: users.isVerified,
      },
    }).from(responses)
    .leftJoin(users, eq(responses.authorId, users.id))
    .where(eq(responses.questionId, parseInt(id)))
    .orderBy(desc(responses.votes), asc(responses.createdAt));

    res.json({
      success: true,
      data: {
        question: question[0],
        responses: questionResponses,
      },
    });
  } catch (error) {
    logger.error('Get question error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch question.',
    });
  }
});

// Create new question
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be 10-200 characters long'),
  body('content')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Content must be 20-5000 characters long'),
  body('tags')
    .optional()
    .isArray({ min: 0, max: 10 })
    .withMessage('Tags must be an array with 0-10 items'),
  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('isAnonymous must be a boolean'),
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
    const { title, content, tags = [], isAnonymous = false } = req.body;
    const userId = req.userId;

    // Get user info for the question
    const user = await db.select({
      specialty: users.specialty,
      province: users.province,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found.',
      });
    }

    // Sanitize inputs
    const sanitizedData = {
      title: sanitizeHtml(title),
      content: sanitizeHtml(content),
      tags: tags.map(tag => sanitizeHtml(tag)),
      isAnonymous: isAnonymous,
      authorId: userId,
      specialty: user[0].specialty,
      province: user[0].province,
    };

    // Create question
    const [newQuestion] = await db.insert(questions).values(sanitizedData).returning({
      id: questions.id,
      title: questions.title,
      content: questions.content,
      specialty: questions.specialty,
      province: questions.province,
      tags: questions.tags,
      votes: questions.votes,
      responseCount: questions.responseCount,
      isResolved: questions.isResolved,
      isAnonymous: questions.isAnonymous,
      createdAt: questions.createdAt,
    });

    logger.info(`New question created: ${newQuestion.title} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: {
        question: newQuestion,
      },
    });
  } catch (error) {
    logger.error('Create question error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create question.',
    });
  }
});

// Update question
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be 10-200 characters long'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Content must be 20-5000 characters long'),
  body('tags')
    .optional()
    .isArray({ min: 0, max: 10 })
    .withMessage('Tags must be an array with 0-10 items'),
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
    const { id } = req.params;
    const questionId = parseInt(id);
    const userId = req.userId;

    // Check if question exists and user owns it
    const existingQuestion = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
    if (existingQuestion.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
        message: 'Question not found.',
      });
    }

    if (existingQuestion[0].authorId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only update your own questions.',
      });
    }

    // Prepare update data
    const updateData = {};
    if (req.body.title !== undefined) {
      updateData.title = sanitizeHtml(req.body.title);
    }
    if (req.body.content !== undefined) {
      updateData.content = sanitizeHtml(req.body.content);
    }
    if (req.body.tags !== undefined) {
      updateData.tags = req.body.tags.map(tag => sanitizeHtml(tag));
    }
    updateData.updatedAt = new Date();

    // Update question
    const [updatedQuestion] = await db.update(questions)
      .set(updateData)
      .where(eq(questions.id, questionId))
      .returning({
        id: questions.id,
        title: questions.title,
        content: questions.content,
        specialty: questions.specialty,
        province: questions.province,
        tags: questions.tags,
        votes: questions.votes,
        responseCount: questions.responseCount,
        isResolved: questions.isResolved,
        isAnonymous: questions.isAnonymous,
        updatedAt: questions.updatedAt,
      });

    logger.info(`Question updated: ${updatedQuestion.title} by user ${userId}`);

    res.json({
      success: true,
      message: 'Question updated successfully',
      data: {
        question: updatedQuestion,
      },
    });
  } catch (error) {
    logger.error('Update question error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update question.',
    });
  }
});

// Delete question
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const questionId = parseInt(id);
    const userId = req.userId;

    // Check if question exists and user owns it
    const existingQuestion = await db.select().from(questions).where(eq(questions.id, questionId)).limit(1);
    if (existingQuestion.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
        message: 'Question not found.',
      });
    }

    if (existingQuestion[0].authorId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only delete your own questions.',
      });
    }

    // Delete question (responses will be deleted automatically due to CASCADE)
    await db.delete(questions).where(eq(questions.id, questionId));

    logger.info(`Question deleted: ${existingQuestion[0].title} by user ${userId}`);

    res.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    logger.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete question.',
    });
  }
});

module.exports = router; 