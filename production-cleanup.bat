@echo off
echo Cleaning up project for production...

echo Removing unused files and directories...
del /f /q "*.json" 2>nul
del /f /q "fix-*.json" 2>nul
del /f /q "new-*.json" 2>nul
del /f /q "update-*.json" 2>nul
del /f /q "fresh-*.json" 2>nul
del /f /q "distribution-*.json" 2>nul
del /f /q "fix-images.js" 2>nul
del /f /q "aws-cli-commands.sh" 2>nul

echo Removing test and debug scripts...
rmdir /s /q "scripts" 2>nul
rmdir /s /q "src\scripts" 2>nul

echo Removing documentation files...
del /f /q "DEPLOYMENT_*.md" 2>nul
del /f /q "PRODUCTION_*.md" 2>nul
del /f /q "SECURITY_*.md" 2>nul
del /f /q "TROUBLESHOOTING.md" 2>nul
del /f /q "deployment-architecture.md" 2>nul

echo Removing test files...
rmdir /s /q "src\__tests__" 2>nul

echo Production cleanup complete!
pause