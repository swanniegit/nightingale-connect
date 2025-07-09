const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDB, users } = require('../config/database');
const { logger } = require('../utils/logger');
const { sanitizeHtml } = require('../utils/security');
const { eq, like, desc, asc } = require('drizzle-orm');

const router = express.Router();

// Get all users with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10, specialty, province, search } = req.query;
    const offset = (page - 1) * limit;

    let query = db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      specialty: users.specialty,
      province: users.province,
      institution: users.institution,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    }).from(users);

    // Apply filters
    if (specialty) {
      query = query.where(eq(users.specialty, specialty));
    }
    if (province) {
      query = query.where(eq(users.province, province));
    }
    if (search) {
      query = query.where(
        like(users.firstName, `%${search}%`)
      );
    }

    // Get total count for pagination
    const countQuery = query;
    const total = await countQuery;

    // Apply pagination and ordering
    const results = await query
      .orderBy(desc(users.createdAt))
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
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch users.',
    });
  }
});

// Get user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    const user = await db.select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      specialty: users.specialty,
      province: users.province,
      institution: users.institution,
      qualifications: users.qualifications,
      bio: users.bio,
      avatar: users.avatar,
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.id, parseInt(id))).limit(1);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      data: {
        user: user[0],
      },
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch user profile.',
    });
  }
});

// Update user profile
router.put('/profile/:id', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('First name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Last name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes'),
  body('specialty')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialty must be 2-100 characters long'),
  body('province')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Province must be 2-50 characters long'),
  body('institution')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Institution must be 3-200 characters long'),
  body('qualifications')
    .optional()
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Qualifications must be 5-1000 characters long'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Bio must be less than 2000 characters'),
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
    const userId = parseInt(id);

    // Check if user exists and user can only update their own profile
    if (req.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only update your own profile.',
      });
    }

    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found.',
      });
    }

    // Sanitize and prepare update data
    const updateData = {};
    const allowedFields = ['firstName', 'lastName', 'specialty', 'province', 'institution', 'qualifications', 'bio'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = sanitizeHtml(req.body[field]);
      }
    }

    // Add updated timestamp
    updateData.updatedAt = new Date();

    // Update user
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        specialty: users.specialty,
        province: users.province,
        institution: users.institution,
        qualifications: users.qualifications,
        bio: users.bio,
        avatar: users.avatar,
        isVerified: users.isVerified,
        updatedAt: users.updatedAt,
      });

    logger.info(`User profile updated: ${updatedUser.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    logger.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update profile.',
    });
  }
});

// Get current user's profile
router.get('/me', async (req, res) => {
  try {
    const db = getDB();
    const userId = req.userId;

    const user = await db.select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      professionalNumber: users.professionalNumber,
      specialty: users.specialty,
      province: users.province,
      institution: users.institution,
      qualifications: users.qualifications,
      bio: users.bio,
      avatar: users.avatar,
      isVerified: users.isVerified,
      lastLogin: users.lastLogin,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      data: {
        user: user[0],
      },
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch user data.',
    });
  }
});

module.exports = router; 