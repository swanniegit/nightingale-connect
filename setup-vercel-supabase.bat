@echo off
REM Nightingale Connect - Vercel + Supabase Setup Script (Windows)
REM This script helps set up the project for Vercel + Supabase deployment

echo 🚀 Nightingale Connect - Vercel + Supabase Setup
echo ================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 18 (
    echo ❌ Node.js version 18+ is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js 
node --version
echo detected

REM Install dependencies
echo.
echo 📦 Installing dependencies...
call npm run install:all

REM Check if .env file exists in backend
if not exist "backend\.env" (
    echo.
    echo 🔧 Setting up environment variables...
    copy backend\env.example backend\.env
    echo ✅ Created backend\.env file
    echo ⚠️  Please edit backend\.env with your Supabase credentials
) else (
    echo ✅ backend\.env already exists
)

REM Check if client\.env file exists
if not exist "client\.env" (
    echo.
    echo 🔧 Setting up frontend environment variables...
    echo VITE_API_URL=http://localhost:3001 > client\.env
    echo ✅ Created client\.env file
) else (
    echo ✅ client\.env already exists
)

echo.
echo 🎯 Next Steps:
echo ==============
echo.
echo 1. Set up Supabase Database:
echo    - Go to https://supabase.com
echo    - Create a new project
echo    - Get your database connection details
echo.
echo 2. Update backend\.env with your Supabase credentials:
echo    SUPABASE_DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
echo    SUPABASE_URL=https://[PROJECT-REF].supabase.co
echo    SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
echo    SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
echo    OPENAI_API_KEY=your-openai-api-key
echo    JWT_SECRET=your-super-secret-jwt-key
echo.
echo 3. Run database migrations:
echo    npm run db:migrate
echo.
echo 4. Start development servers:
echo    npm run dev
echo.
echo 5. Deploy to Vercel:
echo    - Push your code to GitHub
echo    - Connect to Vercel
echo    - Add environment variables
echo    - Deploy
echo.
echo 📚 For detailed instructions, see VERCEL_SUPABASE_DEPLOYMENT.md
echo.
echo 🎉 Setup complete! Happy coding!
pause 