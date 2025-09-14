@echo off
echo Setting up environment variables...

copy env.example .env.local
echo.
echo ✅ Environment file created: .env.local
echo.
echo ⚠️  IMPORTANT: Please update .env.local with your actual Supabase credentials:
echo    - NEXT_PUBLIC_SUPABASE_URL
echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_ROLE_KEY
echo.
echo After updating the file, restart the development server.
echo.
pause
