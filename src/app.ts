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



// Import configuration
import connectDB from './config/database';

// Import routes
import * as apiProductRoutes from './routes/api/products';
import * as apiCategoryRoutes from './routes/api/categories';
import * as apiReviewRoutes from './routes/api/reviews';
import * as apiAuthRoutes from './routes/api/auth';
import * as apiUploadRoutes from './routes/api/upload';

// Import middleware
import { setLanguage } from './middleware/language';
import { corsMiddleware } from './middleware/cors';
import { performanceMonitor } from './middleware/performance';

// Create Express app
const app = express();

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

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://code.jquery.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.whatsapp.com", "wss://"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to API routes
app.use('/api/', limiter);
app.use('/webhook/', limiter);

// CORS middleware for development
if (process.env.NODE_ENV !== 'production') {
  app.use(corsMiddleware);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB sanitization
app.use(mongoSanitize());

// Cookie parser
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_cameroon',
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// i18n initialization
app.use(i18n.init);

// Performance monitoring
app.use(performanceMonitor);

// Language middleware
app.use(setLanguage);

// CSRF protection - temporarily disabled
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).csrfToken = () => '';
  next();
});

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Static files
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'), {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : 0
}));

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

// Import contact and chat routes
import * as apiContactRoutes from './routes/api/contact';
import * as apiChatRoutes from './routes/api/chat';
import * as apiUsersRoutes from './routes/api/users';
import * as apiOrdersRoutes from './routes/api/orders';

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// API Routes for React frontend
app.use('/api/auth', apiAuthRoutes.router);
app.use('/api/products', apiProductRoutes.router);
app.use('/api/categories', apiCategoryRoutes.router);
app.use('/api/reviews', apiReviewRoutes.router);
app.use('/api/upload', apiUploadRoutes.router);
app.use('/api/contact', apiContactRoutes.router);
app.use('/api/chat', apiChatRoutes.router);
app.use('/api/users', apiUsersRoutes.router);
app.use('/api/orders', apiOrdersRoutes.router);

// API error handler
app.use('/api', (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error
  console.error(err.stack);
  
  // Send JSON error response
  res.status(500).json({
    success: false,
    message: err.message || 'Server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
} else {
  // 404 handler for development
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  });
}

export default app;