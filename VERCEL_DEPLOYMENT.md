# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Database**: Set up a Neon database (or any PostgreSQL database)

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `nightingale-connect`

### 2. Configure Build Settings

Vercel will automatically detect the configuration from `vercel.json`, but verify these settings:

- **Framework Preset**: Other
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

Add these environment variables in the Vercel dashboard:

- `DATABASE_URL`: Your Neon database connection string
- `NODE_ENV`: `production`
- `VERCEL`: `1`

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Project Structure for Vercel

```
nightingale-connect/
├── dist/                    # Built files (created during build)
│   ├── index.js            # Server entry point
│   └── public/             # Static files
├── server/                 # Server source code
├── client/                 # Client source code
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
└── vite.config.ts         # Vite configuration
```

## How It Works

1. **Build Process**: 
   - Vite builds the frontend to `dist/public/`
   - esbuild bundles the server to `dist/index.js`

2. **Runtime**:
   - Vercel serves `dist/index.js` as a serverless function
   - The server serves static files from `dist/public/`
   - All routes fall back to `index.html` for SPA routing

3. **Database**:
   - Uses Neon serverless database
   - Connection is established per request

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **404 Errors**: Ensure `dist/public/index.html` exists after build
3. **Database Connection**: Verify `DATABASE_URL` is set correctly
4. **Static Files Not Loading**: Check that `serveStatic` path is correct

### Debugging

- Check Vercel build logs for errors
- Verify environment variables are set
- Test database connection locally first

## Local Testing

To test the Vercel build locally:

```bash
npm run build
node dist/index.js
```

The server should start and serve files from `dist/public/`. 