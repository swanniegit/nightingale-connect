@echo off
echo Setting up Nightingale Connect...

echo.
echo 1. Creating environment file...
copy env.example .env.local >nul 2>&1
if exist .env.local (
    echo ✅ Environment file created: .env.local
) else (
    echo ❌ Failed to create environment file
)

echo.
echo 2. Installing dependencies...
call npm install

echo.
echo 3. Starting development server...
echo.
echo ⚠️  IMPORTANT: Update .env.local with your Supabase credentials before testing!
echo.
call npm run dev
