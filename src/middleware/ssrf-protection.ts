import { Request, Response, NextFunction } from 'express';
import { URL } from 'url';

// List of blocked domains and IP ranges
const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '10.',
  '172.16.',
  '192.168.',
  '169.254.',
  'metadata.google.internal'
];

// SSRF protection middleware
export const ssrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const { url, webhook_url, callback_url, redirect_uri } = req.body;
  
  const urlsToCheck = [url, webhook_url, callback_url, redirect_uri].filter(Boolean);
  
  for (const urlToCheck of urlsToCheck) {
    if (typeof urlToCheck === 'string') {
      try {
        const parsedUrl = new URL(urlToCheck);
        
        // Block non-HTTP(S) protocols
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          return res.status(400).json({ message: 'Invalid URL protocol' });
        }
        
        // Block internal/private addresses
        const hostname = parsedUrl.hostname.toLowerCase();
        if (BLOCKED_DOMAINS.some(blocked => hostname.includes(blocked))) {
          return res.status(400).json({ message: 'Access to internal resources not allowed' });
        }
        
        // Block IP addresses in private ranges
        if (/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(hostname)) {
          return res.status(400).json({ message: 'Access to private IP ranges not allowed' });
        }
        
      } catch (error) {
        return res.status(400).json({ message: 'Invalid URL format' });
      }
    }
  }
  
  next();
};