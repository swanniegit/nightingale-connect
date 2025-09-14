#!/bin/bash

echo "🚀 Deploying Nightingale Connect to Vercel..."
echo

echo "📦 Installing Vercel CLI..."
npm install -g vercel

echo
echo "🔐 Logging into Vercel..."
vercel login

echo
echo "🚀 Deploying to Vercel..."
vercel --prod

echo
echo "✅ Deployment complete!"
echo "🌐 Your app is now live on the internet!"
echo
