const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const { logger } = require('../utils/logger');

// Database schema
const { users, questions, responses, notifications, files } = require('../schema');

let db = null;
let sql = null;

const connectDB = async () => {
  try {
    // Database connection string - prioritize Supabase URL
    const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL || 
      `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'nightingale_connect'}`;

    // Create postgres connection with Supabase optimizations
    sql = postgres(connectionString, {
      max: process.env.NODE_ENV === 'production' ? 1 : 10, // Single connection for Vercel
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      // Supabase specific optimizations
      prepare: false, // Disable prepared statements for better performance
      max_lifetime: 60 * 30, // 30 minutes max lifetime
    });

    // Create Drizzle instance
    db = drizzle(sql);

    // Test connection
    await sql`SELECT 1`;
    logger.info('Database connection established successfully');

    // Run migrations in development
    if (process.env.NODE_ENV === 'development') {
      try {
        await migrate(db, { migrationsFolder: './drizzle' });
        logger.info('Database migrations completed');
      } catch (migrationError) {
        logger.warn('Migration error (this is normal if migrations are up to date):', migrationError.message);
      }
    }

    return db;
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return db;
};

const getSQL = () => {
  if (!sql) {
    throw new Error('Database not connected. Call connectDB() first.');
  }
  return sql;
};

const closeDB = async () => {
  if (sql) {
    await sql.end();
    logger.info('Database connection closed');
  }
};

// Database health check
const healthCheck = async () => {
  try {
    const result = await sql`SELECT 1 as health`;
    return result[0]?.health === 1;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};

// Database statistics
const getStats = async () => {
  try {
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM questions) as question_count,
        (SELECT COUNT(*) FROM responses) as response_count,
        (SELECT COUNT(*) FROM notifications) as notification_count
    `;
    return stats[0];
  } catch (error) {
    logger.error('Failed to get database stats:', error);
    return null;
  }
};

module.exports = {
  connectDB,
  getDB,
  getSQL,
  closeDB,
  healthCheck,
  getStats,
  users,
  questions,
  responses,
  notifications,
  files,
}; 