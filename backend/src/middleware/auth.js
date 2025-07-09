const jwt = require('jsonwebtoken');
const { getDB, users } = require('../config/database');
const { logger } = require('../utils/logger');
const { eq } = require('drizzle-orm');

// Required authentication middleware
const requireAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Access token is required.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const db = getDB();
    const user = await db.select({
      id: users.id,
      email: users.email,
      isActive: users.isActive,
      isVerified: users.isVerified,
    }).from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'User not found.',
      });
    }

    if (!user[0].isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account suspended',
        message: 'Your account has been suspended.',
      });
    }

    // Add user info to request
    req.userId = user[0].id;
    req.userEmail = user[0].email;
    req.userVerified = user[0].isVerified;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Invalid access token.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Access token has expired.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Authentication failed.',
    });
  }
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const db = getDB();
    const user = await db.select({
      id: users.id,
      email: users.email,
      isActive: users.isActive,
      isVerified: users.isVerified,
    }).from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (user.length > 0 && user[0].isActive) {
      // Add user info to request
      req.userId = user[0].id;
      req.userEmail = user[0].email;
      req.userVerified = user[0].isVerified;
    }

    next();
  } catch (error) {
    // For optional auth, just continue without user info
    logger.warn('Optional authentication failed:', error);
    next();
  }
};

// Admin authentication middleware
const requireAdmin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Access token is required.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists, is active, and is admin
    const db = getDB();
    const user = await db.select({
      id: users.id,
      email: users.email,
      isActive: users.isActive,
      isAdmin: users.isAdmin,
    }).from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'User not found.',
      });
    }

    if (!user[0].isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account suspended',
        message: 'Your account has been suspended.',
      });
    }

    if (!user[0].isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'Admin access required.',
      });
    }

    // Add user info to request
    req.userId = user[0].id;
    req.userEmail = user[0].email;
    req.isAdmin = true;

    next();
  } catch (error) {
    logger.error('Admin authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Invalid access token.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Access token has expired.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Authentication failed.',
    });
  }
};

// Verified user middleware
const requireVerified = async (req, res, next) => {
  try {
    // First check if user is authenticated
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Access token is required.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists, is active, and is verified
    const db = getDB();
    const user = await db.select({
      id: users.id,
      email: users.email,
      isActive: users.isActive,
      isVerified: users.isVerified,
    }).from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'User not found.',
      });
    }

    if (!user[0].isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account suspended',
        message: 'Your account has been suspended.',
      });
    }

    if (!user[0].isVerified) {
      return res.status(403).json({
        success: false,
        error: 'Account not verified',
        message: 'Your account must be verified to access this feature.',
      });
    }

    // Add user info to request
    req.userId = user[0].id;
    req.userEmail = user[0].email;
    req.userVerified = true;

    next();
  } catch (error) {
    logger.error('Verified user authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Invalid access token.',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'Access token has expired.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Authentication failed.',
    });
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireVerified,
}; 