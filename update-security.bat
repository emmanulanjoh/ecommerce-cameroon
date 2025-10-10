@echo off
echo Updating packages for security fixes...

echo Installing updated backend dependencies...
npm install express@^4.19.2 mongoose@^8.0.0 helmet@^7.1.0 express-rate-limit@^7.1.5

echo Removing vulnerable packages...
npm uninstall isomorphic-dompurify csurf

echo Installing security audit tools...
npm install --save-dev npm-audit-resolver

echo Running security audit...
npm audit fix --force

echo Updating client dependencies...
cd client
npm install
npm audit fix --force
cd ..

echo Security update complete!
echo Please review the changes and test the application.
pause