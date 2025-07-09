const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getDB, users } = require('../config/database');
const { logger } = require('../utils/logger');
const { sanitizeHtml } = require('../utils/security');
const { eq } = require('drizzle-orm');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('First name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Last name must be 2-100 characters and contain only letters, spaces, hyphens, and apostrophes'),
  body('professionalNumber')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Professional registration number must be 5-50 characters long'),
  body('specialty')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialty must be 2-100 characters long'),
  body('province')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Province must be 2-50 characters long'),
  body('institution')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Institution must be 3-200 characters long'),
  body('qualifications')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Qualifications must be 5-1000 characters long'),
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Register new user
router.post('/register', validateRegistration, async (req, res) => {
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
    const {
      email,
      password,
      firstName,
      lastName,
      professionalNumber,
      specialty,
      province,
      institution,
      qualifications,
      bio,
    } = req.body;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'A user with this email address already exists.',
      });
    }

    // Check if professional number already exists
    const existingProfessional = await db.select().from(users).where(eq(users.professionalNumber, professionalNumber)).limit(1);
    if (existingProfessional.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Professional number already exists',
        message: 'A user with this professional registration number already exists.',
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Sanitize inputs
    const sanitizedData = {
      email: sanitizeHtml(email),
      password: hashedPassword,
      firstName: sanitizeHtml(firstName),
      lastName: sanitizeHtml(lastName),
      professionalNumber: sanitizeHtml(professionalNumber),
      specialty: sanitizeHtml(specialty),
      province: sanitizeHtml(province),
      institution: sanitizeHtml(institution),
      qualifications: sanitizeHtml(qualifications),
      bio: bio ? sanitizeHtml(bio) : null,
    };

    // Create user
    const [newUser] = await db.insert(users).values(sanitizedData).returning({
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
      isVerified: users.isVerified,
      createdAt: users.createdAt,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    logger.info(`New user registered: ${newUser.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to register user. Please try again.',
    });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
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
    const { email, password } = req.body;

    // Find user by email
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password.',
      });
    }

    const userData = user[0];

    // Check if user is active
    if (!userData.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account disabled',
        message: 'Your account has been disabled. Please contact support.',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password.',
      });
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, userData.id));

    // Generate JWT token
    const token = jwt.sign(
      { userId: userData.id, email: userData.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;

    logger.info(`User logged in: ${userData.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to login. Please try again.',
    });
  }
});

// Get current user
router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
        message: 'Authentication token is required.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const db = getDB();

    const user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found.',
      });
    }

    const userData = user[0];
    const { password: _, ...userWithoutPassword } = userData;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Invalid authentication token.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Authentication token has expired.',
      });
    }

    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to get user data.',
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

// Forgot password (placeholder for future implementation)
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    // TODO: Implement password reset functionality
    res.json({
      success: true,
      message: 'Password reset email sent (if user exists)',
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to process password reset request.',
    });
  }
});

module.exports = router; 