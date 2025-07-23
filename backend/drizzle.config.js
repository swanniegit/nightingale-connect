const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  schema: './src/schema/*.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || 'postgresql://postgres:password@localhost:5432/nightingale_connect',
  },
  verbose: true,
  strict: true,
}); 