const fs = require('fs');
const path = require('path');

console.log('🧹 Starting production cleanup...');

// Files to delete (unused/redundant)
const filesToDelete = [
  'src/production-server.js',
  'src/server.js',
  'server.js',
  'deploy.js',
  'apprunner-minimal.yaml',
  'fix-images.js',
  'fix-origin-config.json',
  'fresh-config.json',
  'new-distribution-config.json',
  'update-config.json',
  'distribution-config.json',
  'cloudfront-response-headers.json',
  's3-bucket-policy.json',
  's3-cors-policy.json',
  'deploy-frontend.bat',
  'update-security.bat',
  'production-cleanup.bat',
  'aws-cli-commands.sh',
  'Procfile',
  'nixpacks.toml',
  'cypress.config.ts',
  'src/routes/api/products-simple.js'
];

// Documentation files to keep but move to docs folder
const docsToMove = [
  'CSRF_FIX.md',
  'DEPLOYMENT_CHECKLIST.md',
  'DEPLOYMENT_GUIDE.md',
  'DEPLOYMENT_STEPS.md',
  'deployment-architecture.md',
  'FIXES_APPLIED.md',
  'GITHUB_SECRETS.md',
  'GOOGLE_OAUTH_FIX.md',
  'HOW_TO_START.md',
  'IMPLEMENTATION_COMPLETE.md',
  'PERFORMANCE_FIXES.md',
  'PERFORMANCE_OPTIMIZATION_PLAN.md',
  'PRODUCTION_READY.md',
  'PRODUCTION_SECURITY_CHECKLIST.md',
  'REMAINING_FIXES_APPLIED.md',
  'SECURITY_DEPLOYMENT_GUIDE.md',
  'SECURITY_FIXES_APPLIED.md',
  'SECURITY_FIXES.md',
  'TROUBLESHOOTING.md'
];

let deletedCount = 0;
let movedCount = 0;

// Delete unused files
filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${file}`);
      deletedCount++;
    } catch (error) {
      console.log(`⚠️ Could not delete: ${file}`);
    }
  }
});

// Create docs folder and move documentation
const docsDir = path.join(__dirname, 'docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir);
}

docsToMove.forEach(file => {
  const oldPath = path.join(__dirname, file);
  const newPath = path.join(docsDir, file);
  if (fs.existsSync(oldPath)) {
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`📁 Moved to docs: ${file}`);
      movedCount++;
    } catch (error) {
      console.log(`⚠️ Could not move: ${file}`);
    }
  }
});

console.log(`\n✅ Cleanup complete!`);
console.log(`   Deleted: ${deletedCount} files`);
console.log(`   Moved to docs: ${movedCount} files`);
