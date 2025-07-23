#!/bin/bash

# Nightingale Connect - Vercel + Supabase Setup Script
# This script helps set up the project for Vercel + Supabase deployment

echo "🚀 Nightingale Connect - Vercel + Supabase Setup"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm run install:all

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "🔧 Setting up environment variables..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please edit backend/.env with your Supabase credentials"
else
    echo "✅ backend/.env already exists"
fi

# Check if client/.env file exists
if [ ! -f "client/.env" ]; then
    echo ""
    echo "🔧 Setting up frontend environment variables..."
    echo "VITE_API_URL=http://localhost:3001" > client/.env
    echo "✅ Created client/.env file"
else
    echo "✅ client/.env already exists"
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. Set up Supabase Database:"
echo "   - Go to https://supabase.com"
echo "   - Create a new project"
echo "   - Get your database connection details"
echo ""
echo "2. Update backend/.env with your Supabase credentials:"
echo "   SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
echo "   SUPABASE_URL=https://[PROJECT-REF].supabase.co"
echo "   SUPABASE_ANON_KEY=[YOUR-ANON-KEY]"
echo "   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]"
echo "   OPENAI_API_KEY=your-openai-api-key"
echo "   JWT_SECRET=your-super-secret-jwt-key"
echo ""
echo "3. Run database migrations:"
echo "   npm run db:migrate"
echo ""
echo "4. Start development servers:"
echo "   npm run dev"
echo ""
echo "5. Deploy to Vercel:"
echo "   - Push your code to GitHub"
echo "   - Connect to Vercel"
echo "   - Add environment variables"
echo "   - Deploy"
echo ""
echo "📚 For detailed instructions, see VERCEL_SUPABASE_DEPLOYMENT.md"
echo ""
echo "🎉 Setup complete! Happy coding!" 