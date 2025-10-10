import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Admin from '../models/Admin';

// Admin session interface
declare module 'express-session' {
  interface SessionData {
    adminId?: string;
    adminToken?: string;
    csrfToken?: string;
  }
}

// Generate secure admin token
export const generateAdminToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

// Secure admin authentication middleware
export const secureAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for JWT token in Authorization header
    const authHeader = req.header('Authorization');
    const jwtToken = authHeader?.replace('Bearer ', '');
    
    // Check for session-based admin authentication
    const sessionAdminId = req.session?.adminId;
    const sessionToken = req.session?.adminToken;

    let admin = null;

    // Try JWT authentication first
    if (jwtToken && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET) as any;
        if (decoded.admin) {
          admin = await Admin.findById(decoded.admin.id);
        }
      } catch (jwtError) {
        // JWT invalid, try session auth
      }
    }

    // Try session authentication if JWT failed
    if (!admin && sessionAdminId && sessionToken) {
      admin = await Admin.findById(sessionAdminId);
      if (admin && admin.sessionToken !== sessionToken) {
        admin = null; // Invalid session token
      }
    }

    if (!admin) {
      return res.status(401).json({ 
        message: 'Admin access denied',
        code: 'ADMIN_AUTH_REQUIRED'
      });
    }

    (req as any).admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Invalid admin authentication',
      code: 'ADMIN_AUTH_INVALID'
    });
  }
};

// CSRF protection for admin routes
export const adminCSRFProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // For admin routes, require CSRF token
  const token = req.headers['x-csrf-token'] as string || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ 
      message: 'Invalid CSRF token for admin action',
      code: 'ADMIN_CSRF_INVALID'
    });
  }

  next();
};

// Rate limiting for admin actions
const adminActionAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const adminRateLimit = (maxAttempts: number = 10, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const adminId = (req as any).admin?._id?.toString();
    if (!adminId) return next();

    const now = Date.now();
    const attempts = adminActionAttempts.get(adminId);

    if (attempts) {
      if (now - attempts.lastAttempt > windowMs) {
        // Reset window
        adminActionAttempts.set(adminId, { count: 1, lastAttempt: now });
      } else if (attempts.count >= maxAttempts) {
        return res.status(429).json({
          message: 'Too many admin actions, please wait',
          code: 'ADMIN_RATE_LIMIT'
        });
      } else {
        attempts.count++;
        attempts.lastAttempt = now;
      }
    } else {
      adminActionAttempts.set(adminId, { count: 1, lastAttempt: now });
    }

    next();
  };
};