const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment build...');

try {
  // Build TypeScript
  console.log('📦 Building TypeScript...');
  execSync('npm run build', { stdio: 'inherit' });

  // Build React client
  console.log('⚛️ Building React client...');
  execSync('cd client && npm install && CI=false npm run build', { stdio: 'inherit' });

  // Check if build was successful
  const clientBuildPath = path.join(__dirname, 'client', 'build');
  const distPath = path.join(__dirname, 'dist');
  
  if (fs.existsSync(clientBuildPath) && fs.existsSync(distPath)) {
    console.log('✅ Build completed successfully!');
    console.log('📁 Client build:', fs.existsSync(clientBuildPath));
    console.log('📁 Server dist:', fs.existsSync(distPath));
  } else {
    throw new Error('Build directories not found');
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}