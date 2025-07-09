const express = require('express');
const { getDB, notifications } = require('../config/database');
const { logger } = require('../utils/logger');
const { eq, desc, and } = require('drizzle-orm');

const router = express.Router();

// Get user's notifications
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const userId = req.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const offset = (page - 1) * limit;

    let query = db.select({
      id: notifications.id,
      title: notifications.title,
      message: notifications.message,
      type: notifications.type,
      relatedId: notifications.relatedId,
      isRead: notifications.isRead,
      metadata: notifications.metadata,
      createdAt: notifications.createdAt,
    }).from(notifications).where(eq(notifications.userId, userId));

    // Filter unread only if requested
    if (unreadOnly === 'true') {
      query = query.where(eq(notifications.isRead, false));
    }

    // Get total count for pagination
    const total = await query;

    // Apply pagination and ordering
    const results = await query
      .orderBy(desc(notifications.createdAt))
      .limit(parseInt(limit))
      .offset(offset);

    res.json({
      success: true,
      data: {
        notifications: results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total.length,
          totalPages: Math.ceil(total.length / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch notifications.',
    });
  }
});

// Mark notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const userId = req.userId;

    // Check if notification exists and belongs to user
    const notification = await db.select().from(notifications).where(eq(notifications.id, parseInt(id))).limit(1);
    
    if (notification.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
        message: 'Notification not found.',
      });
    }

    if (notification[0].userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only mark your own notifications as read.',
      });
    }

    // Mark as read
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, parseInt(id)));

    logger.info(`Notification marked as read: ${id} by user ${userId}`);

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    logger.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to mark notification as read.',
    });
  }
});

// Mark all notifications as read
router.put('/read-all', async (req, res) => {
  try {
    const db = getDB();
    const userId = req.userId;

    // Mark all user's unread notifications as read
    const result = await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));

    logger.info(`All notifications marked as read for user ${userId}`);

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    logger.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to mark notifications as read.',
    });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const userId = req.userId;

    // Check if notification exists and belongs to user
    const notification = await db.select().from(notifications).where(eq(notifications.id, parseInt(id))).limit(1);
    
    if (notification.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
        message: 'Notification not found.',
      });
    }

    if (notification[0].userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only delete your own notifications.',
      });
    }

    // Delete notification
    await db.delete(notifications).where(eq(notifications.id, parseInt(id)));

    logger.info(`Notification deleted: ${id} by user ${userId}`);

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete notification.',
    });
  }
});

// Get notification count (unread)
router.get('/count', async (req, res) => {
  try {
    const db = getDB();
    const userId = req.userId;

    const unreadNotifications = await db.select().from(notifications).where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    );

    res.json({
      success: true,
      data: {
        unreadCount: unreadNotifications.length,
      },
    });
  } catch (error) {
    logger.error('Get notification count error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to get notification count.',
    });
  }
});

module.exports = router; 