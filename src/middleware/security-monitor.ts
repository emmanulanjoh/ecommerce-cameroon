import { Request, Response, NextFunction } from 'express';

interface SecurityEvent {
  type: string;
  ip: string;
  userAgent: string;
  path: string;
  timestamp: Date;
  details?: any;
}

// In-memory security event store (use Redis in production)
const securityEvents: SecurityEvent[] = [];
const MAX_EVENTS = 1000;

// Log security events
export const logSecurityEvent = (type: string, req: Request, details?: any) => {
  const event: SecurityEvent = {
    type,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
    path: req.path,
    timestamp: new Date(),
    details
  };
  
  securityEvents.push(event);
  
  // Keep only recent events
  if (securityEvents.length > MAX_EVENTS) {
    securityEvents.shift();
  }
  
  // Log critical events
  if (['BRUTE_FORCE', 'XSS_ATTEMPT', 'SSRF_ATTEMPT', 'CSRF_VIOLATION'].includes(type)) {
    console.warn(`🚨 SECURITY EVENT: ${type}`, {
      ip: event.ip,
      path: event.path,
      userAgent: event.userAgent.substring(0, 100)
    });
  }
};

// Security monitoring middleware
export const securityMonitor = (req: Request, res: Response, next: NextFunction) => {
  // Monitor for suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//g, // Path traversal
    /<script/gi, // XSS attempts
    /union.*select/gi, // SQL injection
    /javascript:/gi, // JavaScript protocol
    /data:text\/html/gi // Data URI XSS
  ];
  
  const fullUrl = req.originalUrl || req.url;
  const body = JSON.stringify(req.body || {});
  
  // Check for suspicious patterns
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(fullUrl) || pattern.test(body)) {
      logSecurityEvent('SUSPICIOUS_PATTERN', req, { pattern: pattern.source });
    }
  });
  
  // Monitor failed authentication attempts
  const originalSend = res.send;
  res.send = function(data) {
    if (res.statusCode === 401 && req.path.includes('/auth/')) {
      logSecurityEvent('AUTH_FAILURE', req);
    }
    return originalSend.call(this, data);
  };
  
  next();
};

// Get security events (admin only)
export const getSecurityEvents = (limit: number = 100): SecurityEvent[] => {
  return securityEvents.slice(-limit).reverse();
};