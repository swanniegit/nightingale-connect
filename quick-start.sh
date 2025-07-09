#!/bin/bash

# Nightingale Connect Quick Start Script
# This script sets up the project for local development

echo "🚀 Nightingale Connect Quick Start"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    echo "Recommended version: 18.x or higher"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "⚠️  Warning: Node.js version $(node -v) detected."
    echo "Recommended: Node.js 18.x or higher"
    echo "Continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: Backend directory not found."
    echo "Please ensure the backend folder exists."
    exit 1
fi

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"
cd ..

# Create environment files
echo ""
echo "🔧 Setting up environment files..."

# Frontend .env
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local for frontend..."
    cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
EOF
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

# Backend .env
if [ ! -f "backend/.env" ]; then
    echo "Creating backend .env..."
    cat > backend/.env << EOF
# Server Configuration
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001

# Database Configuration (SQLite for development)
DATABASE_URL=file:./dev.db

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# OpenAI Configuration (optional for development)
OPENAI_API_KEY=

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Logging Configuration
LOG_LEVEL=debug
LOG_FILE=./logs/app.log

# Feature Flags
ENABLE_AI_ASSISTANT=false
ENABLE_FILE_UPLOADS=true
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_REAL_TIME_NOTIFICATIONS=false

# Monitoring
ENABLE_HEALTH_CHECKS=true
ENABLE_METRICS=false
EOF
    echo "✅ Created backend .env"
else
    echo "✅ Backend .env already exists"
fi

# Create necessary directories
echo ""
echo "📁 Creating necessary directories..."
mkdir -p backend/logs
mkdir -p backend/uploads
mkdir -p backend/db

echo "✅ Directories created"

# Database setup (SQLite for development)
echo ""
echo "🗄️  Setting up development database..."
cd backend

# Check if Drizzle is available
if npm list drizzle-kit > /dev/null 2>&1; then
    echo "Running database migrations..."
    npm run db:migrate
    
    if [ $? -eq 0 ]; then
        echo "✅ Database migrations completed"
    else
        echo "⚠️  Database migrations failed (this is normal for first run)"
    fi
else
    echo "⚠️  Drizzle not found, skipping database setup"
fi

cd ..

# Build frontend
echo ""
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Frontend build failed"
    exit 1
fi

echo "✅ Frontend build completed"

# Start development servers
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start development:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  npm start"
echo ""
echo "📱 Your application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3001"
echo "  API Docs: http://localhost:3001/api/docs"
echo ""
echo "🔧 Development Commands:"
echo "  npm start          - Start frontend development server"
echo "  npm run build      - Build frontend for production"
echo "  npm test           - Run frontend tests"
echo "  cd backend && npm run dev    - Start backend development server"
echo "  cd backend && npm run db:migrate - Run database migrations"
echo ""
echo "📚 Documentation:"
echo "  README.md          - Project overview"
echo "  DEPLOYMENT_GUIDE.md - Deployment instructions"
echo "  backend/README.md  - Backend documentation"
echo ""
echo "🎯 Next Steps:"
echo "1. Start the development servers"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Register a new account"
echo "4. Explore the features"
echo ""
echo "💡 Tips:"
echo "- Use SQLite for local development (already configured)"
echo "- Set up PostgreSQL for production deployment"
echo "- Configure OpenAI API key for AI features"
echo "- Check the deployment guide for production setup" 