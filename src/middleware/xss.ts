import { Request, Response, NextFunction } from 'express';
import { sanitizeInput, sanitizeForHtml } from '../utils/sanitize';

// XSS protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

// Fields that should not be sanitized (URLs, etc.)
const SKIP_SANITIZE_FIELDS = ['images', 'thumbnailImage', 'videoUrl', 'url', 'imageUrl', 'avatar', 'profilePicture'];

// Recursively sanitize object properties
const sanitizeObject = (obj: any, parentKey?: string): any => {
  if (obj === null || obj === undefined) return obj;
  
  // Skip sanitization for URL fields
  if (parentKey && SKIP_SANITIZE_FIELDS.includes(parentKey)) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    // Don't sanitize if it looks like a URL
    if (obj.startsWith('http://') || obj.startsWith('https://')) {
      return obj;
    }
    return sanitizeInput(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, parentKey));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value, key);
    }
    return sanitized;
  }
  
  return obj;
};