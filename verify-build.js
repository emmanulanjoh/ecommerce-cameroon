const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build files...');

const distPath = path.join(__dirname, 'dist');
const routesPath = path.join(distPath, 'routes', 'api');

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.error('❌ dist folder not found!');
  process.exit(1);
}

// Check if routes are compiled
const requiredRoutes = ['users.js', 'auth.js', 'google-auth.js'];

requiredRoutes.forEach(route => {
  const routePath = path.join(routesPath, route);
  if (fs.existsSync(routePath)) {
    console.log(`✅ ${route} compiled successfully`);
  } else {
    console.error(`❌ ${route} not found in dist/routes/api/`);
  }
});

// List all files in dist/routes/api
if (fs.existsSync(routesPath)) {
  const files = fs.readdirSync(routesPath);
  console.log('📁 Files in dist/routes/api:', files);
} else {
  console.error('❌ dist/routes/api folder not found!');
}

console.log('✅ Build verification complete');