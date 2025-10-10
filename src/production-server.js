require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for App Runner
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with proper error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected:', conn.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('📋 MongoDB URI exists:', !!process.env.MONGODB_URI);
    // Don't exit, let app run without DB for debugging
  }
};

connectDB();

// Serve static files
app.use(express.static(path.join(__dirname, '../client/build')));

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: process.env.NODE_ENV
  });
});

// Import API routes with detailed error handling
try {
  console.log('🔍 Loading API routes...');
  
  // Check if route files exist
  const fs = require('fs');
  const routesPath = path.join(__dirname, 'routes', 'api');
  console.log('📁 Routes directory exists:', fs.existsSync(routesPath));
  
  if (fs.existsSync(routesPath)) {
    const files = fs.readdirSync(routesPath);
    console.log('📄 Route files found:', files);
  }
  
  // Try to load each route
  const routes = [
    { name: 'products', path: './routes/api/products-simple' }
  ];
  
  // Add fallback routes if main routes don't exist
  const fallbackRoutes = [
    { name: 'auth', path: './routes/api/auth' },
    { name: 'products-full', path: './routes/api/products' },
    { name: 'users', path: './routes/api/users' }
  ];
  
  // Load primary routes
  routes.forEach(route => {
    try {
      const routeModule = require(route.path);
      if (routeModule.router) {
        const routeName = route.name === 'products' ? 'products' : route.name;
        app.use(`/api/${routeName}`, routeModule.router);
        console.log(`✅ ${route.name} routes loaded`);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${route.name} routes:`, err.message);
    }
  });
  
  // Try fallback routes
  fallbackRoutes.forEach(route => {
    try {
      const routeModule = require(route.path);
      if (routeModule.router) {
        app.use(`/api/${route.name}`, routeModule.router);
        console.log(`✅ ${route.name} fallback routes loaded`);
      }
    } catch (err) {
      console.log(`⚠️ ${route.name} fallback not available`);
    }
  });
  
} catch (error) {
  console.error('❌ Error setting up API routes:', error.message);
}

// Health check with detailed info
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      host: mongoose.connection.host || 'unknown'
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGODB_URI_EXISTS: !!process.env.MONGODB_URI
    }
  });
});

// Serve React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running on port ${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
});

module.exports = app;