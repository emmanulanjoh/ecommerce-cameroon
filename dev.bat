@echo off
echo Starting development servers with TypeScript...
echo.
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
start cmd /k "npm run dev:ts:full"
echo Servers started successfully!