# 🚀 Nightingale Connect - Vercel + Supabase Deployment Guide

This guide will help you deploy Nightingale Connect using **Vercel** for hosting and **Supabase** for the database, with **OpenAI** for AI features.

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Supabase account (free tier available)
- OpenAI API key

## 🎯 Quick Start (Recommended)

### Step 1: Set Up Supabase Database

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: `nightingale-connect`
   - Set database password (save this!)
   - Choose region (closest to your users)
   - Click "Create new project"

2. **Get Database Connection Details:**
   - Go to Settings → Database
   - Copy the connection string (URI)
   - Note your project reference ID

3. **Set Up Database Schema:**
   ```bash
   # Clone your repository
   git clone https://github.com/yourusername/nightingale-connect.git
   cd nightingale-connect/backend
   
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp env.example .env
   ```

4. **Update .env with Supabase details:**
   ```env
   SUPABASE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
   ```

5. **Run Database Migrations:**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### Step 2: Deploy to Vercel

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository: `nightingale-connect`

2. **Configure Build Settings:**
   - Framework Preset: Other
   - Root Directory: `./` (leave empty)
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
   - Install Command: `npm install`

3. **Add Environment Variables:**
   ```
   # Database
   SUPABASE_DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
   SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   
   # Server
   NODE_ENV=production
   PORT=3001
   
   # CORS
   CORS_ORIGIN=https://your-app-name.vercel.app
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

## 🔧 Detailed Configuration

### Supabase Setup

#### 1. Database Schema
Your database will be automatically set up with these tables:
- `users` - User accounts and profiles
- `questions` - Q&A platform questions
- `responses` - Answers to questions
- `notifications` - User notifications
- `files` - File upload metadata

#### 2. Row Level Security (RLS)
Enable RLS for security:
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
```

#### 3. Storage Setup (Optional)
For file uploads, create a storage bucket:
```sql
-- Create storage bucket for files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('nightingale-files', 'nightingale-files', true);
```

### Vercel Configuration

#### 1. Project Structure
```
nightingale-connect/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/                # Backend (Node.js + Express)
│   ├── src/
│   ├── package.json
│   └── drizzle.config.js
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

#### 2. Build Process
The build process:
1. **Frontend**: Vite builds React app to `client/dist/`
2. **Backend**: Node.js server runs as serverless function
3. **Routing**: Vercel routes `/api/*` to backend, everything else to frontend

#### 3. Environment Variables
Required environment variables:
```env
# Supabase
SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE-ROLE-KEY]

# OpenAI
OPENAI_API_KEY=sk-...

# Security
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://your-app.vercel.app

# Server
NODE_ENV=production
PORT=3001
```

## 🚀 Deployment Steps

### 1. Prepare Your Code

```bash
# Clone repository
git clone https://github.com/yourusername/nightingale-connect.git
cd nightingale-connect

# Install dependencies
npm install
cd client && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Set Up Supabase

1. **Create Supabase project**
2. **Get connection details**
3. **Run migrations locally first:**
   ```bash
   cd backend
   npm run db:migrate
   ```

### 3. Deploy to Vercel

1. **Push to GitHub**
2. **Connect Vercel to GitHub**
3. **Configure environment variables**
4. **Deploy**

### 4. Test Deployment

```bash
# Test API endpoints
curl https://your-app.vercel.app/api/health

# Test database connection
curl https://your-app.vercel.app/api/auth/health
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check Supabase connection
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Solutions:**
- Verify `SUPABASE_DATABASE_URL` is correct
- Check if database is accessible from Vercel
- Ensure SSL is enabled for production

#### 2. Build Failures
**Solutions:**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for TypeScript errors

#### 3. CORS Errors
**Solutions:**
- Verify `CORS_ORIGIN` matches your Vercel domain
- Check for trailing slashes in URLs
- Ensure frontend and backend URLs are correct

#### 4. OpenAI API Errors
**Solutions:**
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has sufficient credits
- Ensure API key has correct permissions

### Debugging

#### 1. Check Vercel Logs
- Go to Vercel dashboard
- Click on your project
- Go to "Functions" tab
- Check function logs

#### 2. Test Locally
```bash
# Test backend locally
cd backend
npm run dev

# Test frontend locally
cd client
npm run dev
```

#### 3. Database Debugging
```bash
# Connect to Supabase directly
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Check tables
\dt

# Check data
SELECT * FROM users LIMIT 5;
```

## 📊 Performance Optimization

### 1. Database Optimization
- **Connection pooling**: Single connection per function
- **Query optimization**: Use indexes on frequently queried columns
- **Caching**: Implement Redis for session storage (optional)

### 2. Vercel Optimization
- **Function timeout**: Set to 30 seconds max
- **Cold starts**: Minimize dependencies
- **Bundle size**: Optimize frontend build

### 3. Supabase Optimization
- **RLS policies**: Optimize for your use case
- **Indexes**: Add indexes on search columns
- **Storage**: Use Supabase storage for files

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS_ORIGIN is properly configured
- [ ] Database connection uses SSL
- [ ] Row Level Security (RLS) is enabled
- [ ] Environment variables are secure
- [ ] API keys are properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is working

## 📈 Monitoring & Analytics

### 1. Vercel Analytics
- Function execution times
- Error rates
- Build performance

### 2. Supabase Monitoring
- Database performance
- Connection usage
- Storage usage

### 3. Application Monitoring
- Health check endpoints
- Error tracking
- User analytics

## 🎉 Success!

Once deployed, your Nightingale Connect application will be available at:
- **Frontend**: https://your-app-name.vercel.app
- **API**: https://your-app-name.vercel.app/api
- **Database**: Managed by Supabase

### Next Steps

1. **Test all features** thoroughly
2. **Set up custom domain** (optional)
3. **Configure monitoring** and alerts
4. **Set up backups** (Supabase handles this)
5. **Document your deployment** for team members

## 💰 Cost Estimation

### Free Tier (Recommended for starting)
- **Vercel**: Free (100GB bandwidth, 100 serverless function executions/day)
- **Supabase**: Free (500MB database, 50MB file storage, 2GB bandwidth)
- **OpenAI**: Pay per use (~$0.01-0.10 per query)

### Paid Tier (For scaling)
- **Vercel Pro**: $20/month (unlimited bandwidth, 1000 function executions/day)
- **Supabase Pro**: $25/month (8GB database, 100GB file storage)
- **OpenAI**: Pay per use

---

**Need help?** Check the Vercel and Supabase documentation, or create an issue on GitHub.

**Estimated deployment time**: 30-60 minutes  
**Cost**: Free to start  
**Support**: Comprehensive documentation included 