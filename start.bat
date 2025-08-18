@echo off
echo Starting E-commerce Cameroon Application...

REM Check if TypeScript is available
if exist "dist\server.js" (
    echo TypeScript build found, using TypeScript version...
    call start-typescript.bat
) else (
    echo TypeScript build not found, please run "npm run build:ts" first
    pause
    exit /b 1
)

echo Application started successfully!