import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}

// Generate secure CSRF token
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Secure CSRF protection middleware
export const secureCSRFProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for API routes (using JWT authentication instead)
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const token = req.headers['x-csrf-token'] as string || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ 
      message: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID'
    });
  }

  next();
};

// Set CSRF token in session
export const setCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.csrfToken) {
    req.session!.csrfToken = generateCSRFToken();
  }
  
  // Make token available to templates
  res.locals.csrfToken = req.session.csrfToken;
  (req as any).csrfToken = () => req.session!.csrfToken;
  
  next();
};