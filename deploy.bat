@echo off
REM ResumeAI Pro - Deployment Script for Windows
REM This script helps deploy your app to Vercel

echo.
echo ========================================
echo   ResumeAI Pro - Deployment Script
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not found!
    echo [INFO] Installing Vercel CLI...
    call npm install -g vercel
    echo [SUCCESS] Vercel CLI installed!
    echo.
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this script from the skill-matcher-pro-main directory
    pause
    exit /b 1
)

echo [INFO] Running pre-deployment checks...
echo.

REM Test build
echo [INFO] Building project...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed! Please fix errors before deploying.
    pause
    exit /b 1
)

echo [SUCCESS] Build successful!
echo.

REM Ask for confirmation
echo [QUESTION] Ready to deploy to production?
echo            This will deploy your app to Vercel.
echo.
set /p CONFIRM="Continue? (y/n): "

if /i not "%CONFIRM%"=="y" (
    echo [INFO] Deployment cancelled
    pause
    exit /b 0
)

echo.
echo [INFO] Deploying to Vercel...
echo.

REM Deploy to production
call vercel --prod

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Deployment successful!
    echo.
    echo [INFO] Next steps:
    echo    1. Add VITE_OPENAI_API_KEY in Vercel Dashboard
    echo    2. Add your Vercel domain to Firebase authorized domains
    echo    3. Test your app at the deployed URL
    echo.
    echo [INFO] See DEPLOYMENT.md for detailed instructions
) else (
    echo.
    echo [ERROR] Deployment failed!
    echo    Check the error messages above
    echo    See DEPLOYMENT.md for troubleshooting
)

echo.
pause
