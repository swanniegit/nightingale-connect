# 🚀 Nightingale Connect - Vercel Deployment Guide

## Prerequisites
- [Vercel account](https://vercel.com) (free tier available)
- [GitHub account](https://github.com) (if not already connected)
- Your code pushed to GitHub

## Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? nightingale-connect
# - Directory? ./
# - Override settings? No
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub: `nightingale-connect`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Click "Deploy"

### 3. Environment Variables
In Vercel dashboard, go to Settings > Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Custom Domain (Optional)
- Go to Settings > Domains
- Add your custom domain
- Update DNS records as instructed

## Post-Deployment

### Test Your Deployment
1. Visit your Vercel URL
2. Test authentication
3. Test chat functionality
4. Test from different devices

### Monitor Performance
- Check Vercel Analytics
- Monitor function execution times
- Review error logs

## Troubleshooting

### Common Issues
1. **Build Failures**: Check build logs in Vercel dashboard
2. **Environment Variables**: Ensure all required vars are set
3. **API Routes**: Check function logs for errors
4. **CORS Issues**: Verify API route configurations

### Support
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Issues](https://github.com/your-repo/issues)

## Features Included
✅ Real-time chat with typing indicators
✅ Message reactions and emoji picker
✅ Authentication system
✅ Responsive design
✅ PWA capabilities
✅ Offline support with IndexedDB
✅ Modern Next.js 15.5.3 architecture

## Next Steps
- Set up Supabase for production database
- Configure real-time subscriptions
- Add push notifications
- Implement end-to-end encryption
- Add message threading
- Set up monitoring and analytics
