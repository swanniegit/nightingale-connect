const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { getDB, files } = require('../config/database');
const { logger } = require('../utils/logger');
const { eq, desc, and } = require('drizzle-orm');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and documents are allowed.'), false);
    }
  },
});

// Ensure upload directory exists
const ensureUploadDir = async () => {
  const uploadDir = path.join(__dirname, '../../uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Upload file
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
        message: 'Please select a file to upload.',
      });
    }

    const db = getDB();
    const userId = req.userId;
    const { type = 'document', relatedId } = req.body;

    // Validate upload type
    const validTypes = ['question', 'response', 'profile', 'document'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid upload type',
        message: 'Upload type must be one of: question, response, profile, document',
      });
    }

    // Ensure upload directory exists
    const uploadDir = await ensureUploadDir();

    // Generate unique filename
    const fileId = uuidv4();
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const filename = `${fileId}${fileExtension}`;
    const filePath = path.join(uploadDir, filename);

    let processedFile = req.file.buffer;
    let finalFilename = filename;
    let finalMimeType = req.file.mimetype;

    // Process images (resize and optimize)
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const image = sharp(req.file.buffer);
        const metadata = await image.metadata();

        // Resize if too large (max 1920x1080)
        if (metadata.width > 1920 || metadata.height > 1080) {
          image.resize(1920, 1080, {
            fit: 'inside',
            withoutEnlargement: true,
          });
        }

        // Convert to WebP for better compression
        processedFile = await image.webp({ quality: 80 }).toBuffer();
        finalFilename = `${fileId}.webp`;
        finalMimeType = 'image/webp';
      } catch (imageError) {
        logger.warn('Image processing failed, using original:', imageError);
        // Use original if processing fails
      }
    }

    // Save file to disk
    await fs.writeFile(path.join(uploadDir, finalFilename), processedFile);

    // Generate public URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
    const fileUrl = `${baseUrl}/uploads/${finalFilename}`;

    // Store file record in database
    const [fileRecord] = await db.insert(files).values({
      filename: finalFilename,
      originalName: originalName,
      mimeType: finalMimeType,
      size: processedFile.length,
      path: path.join(uploadDir, finalFilename),
      url: fileUrl,
      uploadedBy: userId,
      relatedType: type,
      relatedId: relatedId ? parseInt(relatedId) : null,
    }).returning({
      id: files.id,
      filename: files.filename,
      originalName: files.originalName,
      url: files.url,
      size: files.size,
      mimeType: files.mimeType,
      createdAt: files.createdAt,
    });

    logger.info(`File uploaded: ${originalName} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: fileRecord,
      },
    });
  } catch (error) {
    logger.error('File upload error:', error);
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid file type',
        message: error.message,
      });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'File size exceeds the maximum allowed limit.',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to upload file.',
    });
  }
});

// Get user's uploaded files
router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const userId = req.userId;
    const { page = 1, limit = 10, type } = req.query;
    const offset = (page - 1) * limit;

    let query = db.select({
      id: files.id,
      filename: files.filename,
      originalName: files.originalName,
      url: files.url,
      size: files.size,
      mimeType: files.mimeType,
      relatedType: files.relatedType,
      relatedId: files.relatedId,
      createdAt: files.createdAt,
    }).from(files).where(eq(files.uploadedBy, userId));

    // Filter by type if specified
    if (type) {
      query = query.where(eq(files.relatedType, type));
    }

    // Get total count for pagination
    const total = await query;

    // Apply pagination and ordering
    const results = await query
      .orderBy(desc(files.createdAt))
      .limit(parseInt(limit))
      .offset(offset);

    res.json({
      success: true,
      data: {
        files: results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total.length,
          totalPages: Math.ceil(total.length / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Get files error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch files.',
    });
  }
});

// Delete file
router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const userId = req.userId;

    // Get file record
    const fileRecord = await db.select().from(files).where(eq(files.id, id)).limit(1);
    
    if (fileRecord.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'File not found.',
      });
    }

    const file = fileRecord[0];

    // Check if user owns the file
    if (file.uploadedBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You can only delete your own files.',
      });
    }

    // Delete file from disk
    try {
      await fs.unlink(file.path);
    } catch (fsError) {
      logger.warn('Failed to delete file from disk:', fsError);
      // Continue with database deletion even if file doesn't exist on disk
    }

    // Delete file record from database
    await db.delete(files).where(eq(files.id, id));

    logger.info(`File deleted: ${file.originalName} by user ${userId}`);

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to delete file.',
    });
  }
});

// Get file info
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const userId = req.userId;

    const fileRecord = await db.select({
      id: files.id,
      filename: files.filename,
      originalName: files.originalName,
      url: files.url,
      size: files.size,
      mimeType: files.mimeType,
      relatedType: files.relatedType,
      relatedId: files.relatedId,
      isPublic: files.isPublic,
      createdAt: files.createdAt,
    }).from(files).where(eq(files.id, id)).limit(1);

    if (fileRecord.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File not found',
        message: 'File not found.',
      });
    }

    const file = fileRecord[0];

    // Check if user can access the file
    if (!file.isPublic && file.uploadedBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        message: 'You do not have permission to access this file.',
      });
    }

    res.json({
      success: true,
      data: {
        file: file,
      },
    });
  } catch (error) {
    logger.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch file information.',
    });
  }
});

module.exports = router; 