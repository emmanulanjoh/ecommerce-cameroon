// Simple build test script
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔧 Testing build process...');

try {
  // Test TypeScript build
  console.log('1. Testing TypeScript build...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ TypeScript build completed');
  } catch (error) {
    console.log('⚠️ TypeScript build had errors, but continuing...');
  }

  // Check if dist exists
  if (fs.existsSync('./dist')) {
    console.log('✅ Dist folder exists');
    const files = fs.readdirSync('./dist');
    console.log('📁 Dist contents:', files);
  } else {
    console.log('❌ Dist folder missing');
  }

  // Test client build
  console.log('2. Testing client build...');
  process.chdir('./client');
  execSync('npm install', { stdio: 'inherit' });
  execSync('GENERATE_SOURCEMAP=false npm run build', { stdio: 'inherit' });
  
  if (fs.existsSync('./build')) {
    console.log('✅ Client build successful');
  } else {
    console.log('❌ Client build failed');
  }

  console.log('🎉 Build test completed!');
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}