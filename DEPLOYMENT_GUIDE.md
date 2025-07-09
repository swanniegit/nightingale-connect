# 🚀 Nightingale Connect Deployment Guide

This guide will help you deploy Nightingale Connect to production. We'll deploy the frontend to Netlify and the backend to a cloud platform.

## 📋 Prerequisites

- GitHub account
- Netlify account (free)
- Railway/Render/Heroku account (for backend)
- PostgreSQL database (provided by hosting platform)

## 🎯 Quick Start (Recommended)

### Option 1: One-Click Deploy (Easiest)

1. **Fork this repository** to your GitHub account
2. **Deploy Frontend to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your forked repository
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Click "Deploy site"

3. **Deploy Backend to Railway:**
   - Go to [Railway](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your forked repository
   - Set root directory to `backend`
   - Add environment variables (see below)
   - Deploy

### Option 2: Manual Deployment

## 🌐 Frontend Deployment (Netlify)

### Step 1: Prepare Frontend

```bash
# Clone your repository
git clone https://github.com/yourusername/nightingale-connect.git
cd nightingale-connect

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 2: Deploy to Netlify

1. **Sign up/Login to Netlify**
2. **Connect GitHub:**
   - Click "New site from Git"
   - Choose GitHub
   - Authorize Netlify
   - Select your repository

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `build`
   - Base directory: (leave empty)

4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   REACT_APP_ENVIRONMENT=production
   ```

5. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete

### Step 3: Custom Domain (Optional)

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## 🔧 Backend Deployment

### Option A: Railway (Recommended)

1. **Sign up/Login to Railway**
2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory to `backend`

3. **Add PostgreSQL Database:**
   - Click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will automatically set `DATABASE_URL`

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   CORS_ORIGIN=https://your-frontend-url.netlify.app
   ```

5. **Deploy:**
   - Railway will automatically deploy when you push to GitHub
   - Or click "Deploy" manually

### Option B: Render

1. **Sign up/Login to Render**
2. **Create New Web Service:**
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Add PostgreSQL Database:**
   - Create new PostgreSQL service
   - Copy the connection string to environment variables

4. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   CORS_ORIGIN=https://your-frontend-url.netlify.app
   ```

### Option C: Heroku

1. **Install Heroku CLI**
2. **Create Heroku App:**
   ```bash
   heroku create your-app-name
   ```

3. **Add PostgreSQL:**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-jwt-key
   heroku config:set OPENAI_API_KEY=your-openai-api-key
   heroku config:set CORS_ORIGIN=https://your-frontend-url.netlify.app
   ```

5. **Deploy:**
   ```bash
   git subtree push --prefix backend heroku main
   ```

## 🗄️ Database Setup

### Automatic Setup (Recommended)

Most hosting platforms (Railway, Render, Heroku) will automatically:
- Create PostgreSQL database
- Set `DATABASE_URL` environment variable
- Run migrations automatically

### Manual Setup

If you need to set up the database manually:

1. **Create PostgreSQL Database**
2. **Run Migrations:**
   ```bash
   cd backend
   npm run db:migrate
   ```

3. **Seed Data (Optional):**
   ```bash
   npm run db:seed
   ```

## 🔐 Environment Variables

### Frontend (.env.production)

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Backend

```env
# Server
NODE_ENV=production
PORT=3001
BASE_URL=https://your-backend-url.railway.app

# Database
DATABASE_URL=postgresql://...

# Security
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-url.netlify.app

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# File Upload
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './build'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🧪 Testing Deployment

### Frontend Tests

1. **Check Build:**
   ```bash
   npm run build
   npm run test
   ```

2. **Test Production Build:**
   ```bash
   npx serve -s build
   ```

### Backend Tests

1. **Health Check:**
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

2. **API Test:**
   ```bash
   curl https://your-backend-url.railway.app/api/auth/health
   ```

## 🔍 Monitoring & Logs

### Railway
- Go to your project dashboard
- Click on your service
- View logs in real-time

### Render
- Go to your service dashboard
- Click "Logs" tab
- View application logs

### Heroku
```bash
heroku logs --tail
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails:**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection:**
   - Verify `DATABASE_URL` is correct
   - Check if database is accessible
   - Run migrations manually if needed

3. **CORS Errors:**
   - Verify `CORS_ORIGIN` matches your frontend URL
   - Check for trailing slashes

4. **Environment Variables:**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Restart the application after changes

### Getting Help

1. **Check Logs:** Always check application logs first
2. **GitHub Issues:** Create an issue with detailed error information
3. **Documentation:** Refer to platform-specific documentation

## 📈 Performance Optimization

### Frontend
- Enable gzip compression in Netlify
- Use CDN for static assets
- Optimize images and bundle size

### Backend
- Enable database connection pooling
- Use Redis for caching (optional)
- Monitor memory and CPU usage

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] CORS_ORIGIN is properly configured
- [ ] Database connection uses SSL
- [ ] Rate limiting is enabled
- [ ] Input validation is working
- [ ] File upload restrictions are in place
- [ ] HTTPS is enabled
- [ ] Environment variables are secure

## 🎉 Success!

Once deployed, your Nightingale Connect application will be available at:
- **Frontend:** https://your-app-name.netlify.app
- **Backend:** https://your-app-name.railway.app

### Next Steps

1. **Test all features** thoroughly
2. **Set up monitoring** and alerts
3. **Configure backups** for your database
4. **Set up SSL certificates** if needed
5. **Document your deployment** for team members

---

**Need help?** Create an issue on GitHub or check the platform-specific documentation for your hosting provider. 