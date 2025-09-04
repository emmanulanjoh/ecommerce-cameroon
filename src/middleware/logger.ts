import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  stack?: string;
}

class Logger {
  private static writeLog(entry: LogEntry) {
    const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
    const logLine = JSON.stringify(entry) + '\n';
    
    fs.appendFileSync(logFile, logLine);
    
    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${entry.level}] ${entry.message}`);
    }
  }

  static info(message: string, req?: Request) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message,
      method: req?.method,
      url: req?.url,
      ip: req?.ip
    });
  }

  static warn(message: string, req?: Request) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      message,
      method: req?.method,
      url: req?.url,
      ip: req?.ip
    });
  }

  static error(message: string, error?: Error, req?: Request) {
    this.writeLog({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      method: req?.method,
      url: req?.url,
      ip: req?.ip,
      userAgent: req?.get('User-Agent'),
      stack: error?.stack
    });
  }
}

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 400 ? 'WARN' : 'INFO';
    
    Logger[level.toLowerCase() as 'info' | 'warn'](`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, req);
  });
  
  next();
};

// Error logging middleware
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`Unhandled error: ${err.message}`, err, req);
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

export default Logger;