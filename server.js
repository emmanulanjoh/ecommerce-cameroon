// Simple production server fallback
const path = require('path');

// Try to use compiled TypeScript first, fallback to JavaScript
let app;
try {
  app = require('./dist/app.js').default || require('./dist/app.js');
  console.log('✅ Using compiled TypeScript server');
} catch (error) {
  console.log('⚠️ TypeScript server not found, using JavaScript fallback');
  try {
    app = require('./src/app.ts');
  } catch (tsError) {
    console.log('⚠️ TypeScript not available, using JavaScript server');
    app = require('./src/server.js');
  }
}

const PORT = process.env.PORT || 5000;

if (app && app.listen) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
} else if (app && app.default && app.default.listen) {
  app.default.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
} else {
  console.error('❌ Could not start server - app not found');
  process.exit(1);
}