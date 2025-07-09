@echo off
echo 🚀 Nightingale Connect Quick Start
echo ==================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    echo Recommended version: 18.x or higher
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm detected

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
call npm install

if errorlevel 1 (
    echo ❌ Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Error: Backend directory not found.
    echo Please ensure the backend folder exists.
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install

if errorlevel 1 (
    echo ❌ Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed
cd ..

REM Create environment files
echo.
echo 🔧 Setting up environment files...

REM Frontend .env
if not exist ".env.local" (
    echo Creating .env.local for frontend...
    (
        echo REACT_APP_API_URL=http://localhost:3001
        echo REACT_APP_ENVIRONMENT=development
        echo REACT_APP_VERSION=1.0.0
    ) > .env.local
    echo ✅ Created .env.local
) else (
    echo ✅ .env.local already exists
)

REM Backend .env
if not exist "backend\.env" (
    echo Creating backend .env...
    (
        echo # Server Configuration
        echo PORT=3001
        echo NODE_ENV=development
        echo BASE_URL=http://localhost:3001
        echo.
        echo # Database Configuration ^(SQLite for development^)
        echo DATABASE_URL=file:./dev.db
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=dev-secret-key-change-in-production
        echo JWT_EXPIRES_IN=7d
        echo.
        echo # OpenAI Configuration ^(optional for development^)
        echo OPENAI_API_KEY=
        echo.
        echo # CORS Configuration
        echo CORS_ORIGIN=http://localhost:3000
        echo.
        echo # File Upload Configuration
        echo MAX_FILE_SIZE=10485760
        echo UPLOAD_PATH=./uploads
        echo.
        echo # Logging Configuration
        echo LOG_LEVEL=debug
        echo LOG_FILE=./logs/app.log
        echo.
        echo # Feature Flags
        echo ENABLE_AI_ASSISTANT=false
        echo ENABLE_FILE_UPLOADS=true
        echo ENABLE_EMAIL_NOTIFICATIONS=false
        echo ENABLE_REAL_TIME_NOTIFICATIONS=false
        echo.
        echo # Monitoring
        echo ENABLE_HEALTH_CHECKS=true
        echo ENABLE_METRICS=false
    ) > backend\.env
    echo ✅ Created backend .env
) else (
    echo ✅ Backend .env already exists
)

REM Create necessary directories
echo.
echo 📁 Creating necessary directories...
if not exist "backend\logs" mkdir backend\logs
if not exist "backend\uploads" mkdir backend\uploads
if not exist "backend\db" mkdir backend\db

echo ✅ Directories created

REM Database setup (SQLite for development)
echo.
echo 🗄️  Setting up development database...
cd backend

REM Check if Drizzle is available
npm list drizzle-kit >nul 2>&1
if not errorlevel 1 (
    echo Running database migrations...
    call npm run db:migrate
    
    if errorlevel 1 (
        echo ⚠️  Database migrations failed ^(this is normal for first run^)
    ) else (
        echo ✅ Database migrations completed
    )
) else (
    echo ⚠️  Drizzle not found, skipping database setup
)

cd ..

REM Build frontend
echo.
echo 🔨 Building frontend...
call npm run build

if errorlevel 1 (
    echo ❌ Error: Frontend build failed
    pause
    exit /b 1
)

echo ✅ Frontend build completed

REM Start development servers
echo.
echo 🎉 Setup completed successfully!
echo.
echo 🚀 To start development:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   npm start
echo.
echo 📱 Your application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   API Docs: http://localhost:3001/api/docs
echo.
echo 🔧 Development Commands:
echo   npm start          - Start frontend development server
echo   npm run build      - Build frontend for production
echo   npm test           - Run frontend tests
echo   cd backend ^&^& npm run dev    - Start backend development server
echo   cd backend ^&^& npm run db:migrate - Run database migrations
echo.
echo 📚 Documentation:
echo   README.md          - Project overview
echo   DEPLOYMENT_GUIDE.md - Deployment instructions
echo   backend\README.md  - Backend documentation
echo.
echo 🎯 Next Steps:
echo 1. Start the development servers
echo 2. Open http://localhost:3000 in your browser
echo 3. Register a new account
echo 4. Explore the features
echo.
echo 💡 Tips:
echo - Use SQLite for local development ^(already configured^)
echo - Set up PostgreSQL for production deployment
echo - Configure OpenAI API key for AI features
echo - Check the deployment guide for production setup
echo.
pause 