// app.ts - Main Application Entry Point
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import i18n from 'i18n';

// Load environment variables
dotenv.config();

// Basic environment validation
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}
console.log('✅ Environment variables validated');



// Import configuration
import connectDB from './config/database';

// Import routes
import * as apiProductRoutes from './routes/api/products';
import * as apiCategoryRoutes from './routes/api/categories';
import * as apiReviewRoutes from './routes/api/reviews';
import * as apiAuthRoutes from './routes/api/auth';
import * as apiUploadRoutes from './routes/api/upload';
import * as adminSecureRoutes from './routes/api/admin-secure';
import * as apiUsersRoutes from './routes/api/users';

// Import middleware
import { setLanguage } from './middleware/language';
import { corsMiddleware } from './middleware/cors';
import { performanceMonitor } from './middleware/performance';

// Create Express app
const app = express();

// Trust proxy for App Runner
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

// SERVE STATIC FILES FIRST - BEFORE ANY MIDDLEWARE
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../client/build');
  console.log('🔍 Checking build path:', buildPath);
  
  // Serve React build files
  app.use(express.static(buildPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
      }
    }
  }));
}

// Connect to MongoDB
connectDB();

// Configure i18n for multilingual support
i18n.configure({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '../locales'),
  objectNotation: true,
  updateFiles: false,
  syncFiles: false,
  cookie: 'language'
});

// Security middleware with proper CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://apis.google.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.whatsapp.com", "https://accounts.google.com"],
      frameSrc: ["'self'", "https://accounts.google.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Compression middleware
app.use(compression());

// Rate limiting with different limits per endpoint
const createLimiter = (windowMs: number, max: number, message: string) => rateLimit({ windowMs, max, message });

// Relaxed rate limits for production
const generalLimiter = createLimiter(15 * 60 * 1000, 1000, 'Too many requests, try again later');
const authLimiter = createLimiter(15 * 60 * 1000, 50, 'Too many login attempts, try again later');
const uploadLimiter = createLimiter(60 * 1000, 100, 'Too many uploads, try again later');
const reviewLimiter = createLimiter(60 * 60 * 1000, 100, 'Too many reviews, try again later');

// Apply different rate limits (after static files)
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/upload', uploadLimiter);
app.use('/api/reviews', reviewLimiter);
app.use('/api/', generalLimiter);
app.use('/webhook/', generalLimiter);

// CORS middleware for all environments
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
const xss = require('xss-clean');
app.use(xss());
app.use(mongoSanitize());

// Custom XSS protection
import { xssProtection } from './middleware/xss';
app.use('/api', xssProtection);

// Cookie parser
app.use(cookieParser());

// Session configuration
const isProduction = process.env.NODE_ENV === 'production';
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_cameroon',
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: isProduction,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: isProduction ? 'none' : 'lax'
  }
}));

// Flash messages
app.use(flash());

// i18n initialization
app.use(i18n.init);

// Performance monitoring
app.use(performanceMonitor);

// Request logging
import { requestLogger, errorLogger } from './middleware/logger';
app.use(requestLogger);

// Language middleware
app.use(setLanguage);

// Secure CSRF protection
import { setCSRFToken, secureCSRFProtection } from './middleware/csrf-secure';
app.use(setCSRFToken);
// Apply CSRF protection to admin routes only
app.use('/api/admin', secureCSRFProtection);



// Global variables for views
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = (req.session as any).user || null;
  
  // Set CSRF token for all requests (disabled)
  res.locals.csrfToken = '';
  
  res.locals.currentLanguage = (req as any).language || 'en';
  res.locals.__ = res.__;
  res.locals.businessInfo = {
    name: process.env.BUSINESS_NAME || 'E-commerce Cameroon',
    phone: process.env.BUSINESS_PHONE || '+237000000000',
    whatsapp: process.env.BUSINESS_WHATSAPP_NUMBER || '+237000000000',
    email: process.env.BUSINESS_EMAIL || 'contact@business.cm',
    address: process.env.BUSINESS_ADDRESS || 'Yaoundé, Cameroon'
  };
  res.locals.currentUrl = req.originalUrl;
  res.locals.formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };
  next();
});

// SSRF Protection middleware
const ssrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const allowedHosts = [
    'accounts.google.com',
    'api.whatsapp.com', 
    'googleapis.com',
    'd35ew0puu9c5cz.cloudfront.net',
    'cloudfront.net'
  ];
  const blockedIPs = ['127.0.0.1', '0.0.0.0', '::1', 'localhost'];
  
  const checkUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      
      if (blockedIPs.some(ip => hostname.includes(ip))) return false;
      return allowedHosts.some(host => hostname.includes(host));
    } catch {
      return false;
    }
  };
  
  if (req.body && typeof req.body === 'object') {
    const bodyStr = JSON.stringify(req.body);
    const urlPattern = /https?:\/\/[^\s"']+/g;
    const urls = bodyStr.match(urlPattern) || [];
    
    for (const url of urls) {
      if (!checkUrl(url)) {
        console.log('⚠️ SSRF blocked URL:', url);
        return res.status(400).json({ error: 'Invalid or blocked URL detected' });
      }
    }
  }
  
  next();
};

// Apply SSRF protection to API routes
app.use('/api', ssrfProtection);

// Lazy load route modules
const loadRoutes = async () => {
  console.log('📥 Importing route modules...');
  const [apiContactRoutes, apiChatRoutes, apiOrdersRoutes, googleAuthRoutes, apiReviewsRoutes, apiNotificationsRoutes] = await Promise.all([
    import('./routes/api/contact'),
    import('./routes/api/chat'),
    import('./routes/api/orders'),
    import('./routes/api/google-auth'),
    import('./routes/api/reviews'),
    import('./routes/api/notifications')
  ]);
  console.log('✅ All route modules imported successfully');
  return { apiContactRoutes, apiChatRoutes, apiOrdersRoutes, googleAuthRoutes, apiReviewsRoutes, apiNotificationsRoutes };
};

let routeModules: any = {};
loadRoutes().then(modules => routeModules = modules).catch(error => {
  console.error('❌ Error importing route modules:', error);
  process.exit(1);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Simple test route
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Test users route directly
app.get('/api/users/direct-test', (req: Request, res: Response) => {
  res.json({ message: 'Direct users route working' });
});

// Test auth route directly
app.get('/api/auth/direct-test', (req: Request, res: Response) => {
  res.json({ message: 'Direct auth route working' });
});

// Test Google auth route directly
app.get('/api/auth/google/test-direct', (req: Request, res: Response) => {
  res.json({ message: 'Google auth route working directly' });
});

// Profile redirect for compatibility with database fallback
app.get('/profile', (req: Request, res: Response) => {
  // If database is down, return mock profile for development
  if (mongoose.connection.readyState !== 1) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      return res.json({
        id: 'mock-user-id',
        name: 'Test User',
        email: 'test@example.com',
        isAdmin: true
      });
    }
  }
  res.redirect('/api/users/profile');
});

// Debug route registration
console.log('🔗 Registering API routes...');
console.log('Environment:', process.env.NODE_ENV);

// Profile route compatibility
app.get('/api/profile', (req: Request, res: Response) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  res.redirect(307, '/api/auth/profile');
});

// API Routes for React frontend
app.use('/api/auth', apiAuthRoutes.router);
app.use('/api/admin', adminSecureRoutes.router);
app.use('/api/products', apiProductRoutes.router);
app.use('/api/categories', apiCategoryRoutes.router);
app.use('/api/reviews', apiReviewRoutes.router);
app.use('/api/upload', apiUploadRoutes.router);
app.use('/api/users', apiUsersRoutes.router);
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Register async routes when they're loaded
loadRoutes().then(modules => {
  app.use('/api/auth', modules.googleAuthRoutes.router);
  app.use('/api/reviews', modules.apiReviewsRoutes.router);
  app.use('/api/notifications', modules.apiNotificationsRoutes.router);
  app.use('/api/contact', modules.apiContactRoutes.router);
  app.use('/api/chat', modules.apiChatRoutes.router);
  app.use('/api/orders', modules.apiOrdersRoutes.router);
  console.log('✅ Async routes registered successfully');
});

// Import and register sitemap route
var sitemapRoutes = require('./routes/api/sitemap');
app.use('/', sitemapRoutes.router);

console.log('✅ API routes registered successfully');

// API error handler
app.use('/api', errorLogger);

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req: Request, res: Response) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    
    const indexPath = path.join(__dirname, '../client/build/index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Server Error');
      }
    });
  });
}

export default app;