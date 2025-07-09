#!/bin/bash

# Nightingale Connect Frontend Deployment Script
# This script builds and deploys the frontend to Netlify

echo "🚀 Starting Nightingale Connect Frontend Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📥 Installing Netlify CLI..."
    npm install -g netlify-cli
    
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install Netlify CLI"
        exit 1
    fi
fi

echo "✅ Netlify CLI is available"

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=build

if [ $? -ne 0 ]; then
    echo "❌ Error: Deployment failed"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo "🌍 Your app is now live on Netlify!"
echo ""
echo "📝 Next steps:"
echo "1. Set up your backend API URL in the frontend configuration"
echo "2. Configure environment variables in Netlify dashboard"
echo "3. Set up your database and backend services"
echo ""
echo "🔗 Backend setup options:"
echo "- Deploy to Railway: https://railway.app/"
echo "- Deploy to Render: https://render.com/"
echo "- Deploy to Heroku: https://heroku.com/"
echo "- Use Replit: https://replit.com/" 