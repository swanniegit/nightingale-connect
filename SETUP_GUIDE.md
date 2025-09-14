# 🚀 Nightingale Connect Setup Guide

## 📋 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
# Copy the example file
cp env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration
JWT_SECRET=your-jwt-secret-here

# Environment
NODE_ENV=development
```

### 3. Setup Supabase Database
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables and policies

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Troubleshooting

### Environment Variables Not Loading
If you see "supabaseUrl is required" error:

1. **Check .env.local exists** in the root directory
2. **Restart the development server** after adding environment variables
3. **Verify variable names** start with `NEXT_PUBLIC_` for client-side access
4. **Check for typos** in variable names

### Supabase Connection Issues
1. **Verify your Supabase URL** is correct
2. **Check your anon key** is valid
3. **Ensure database schema** is properly set up
4. **Check browser console** for detailed error messages

### Database Schema Issues
1. **Run the complete SQL schema** from `supabase-schema.sql`
2. **Check RLS policies** are enabled
3. **Verify realtime** is enabled for tables
4. **Test with Supabase dashboard** first

## 📊 Testing the Setup

### 1. Database Test
- Should show "Database is ready!" with test button
- Click "Test Message" to verify IndexedDB works

### 2. Supabase Test
- Should show environment variable status
- If configured, should show authentication status
- Click "Test Connection" to verify API calls

### 3. Console Logs
Check browser console for:
- Database initialization messages
- Supabase connection status
- Any error messages

## 🎯 Next Steps

Once setup is complete:
1. **Phase 2**: Core Data Layer implementation
2. **Real-time messaging** with live updates
3. **User authentication** and session management
4. **Offline-first synchronization**

## 📚 Documentation

- [Development Specification](DEVELOPMENT_SPEC.md)
- [Task Breakdown](TASK_BREAKDOWN.md)
- [Vercel Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)
