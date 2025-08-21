import { Request, Response, NextFunction } from 'express';

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, url } = req;
    const { statusCode } = res;
    
    // Log slow requests (>1000ms)
    if (duration > 1000) {
      console.warn(`🐌 SLOW REQUEST: ${method} ${url} - ${duration}ms - Status: ${statusCode}`);
    }
    
    // Log all requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 ${method} ${url} - ${duration}ms - Status: ${statusCode}`);
    }
  });
  
  next();
};

// Memory usage monitoring
export const memoryMonitor = () => {
  const used = process.memoryUsage();
  console.log('💾 Memory Usage:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key as keyof typeof used] / 1024 / 1024 * 100) / 100} MB`);
  }
};

// Monitor memory every 5 minutes in production
if (process.env.NODE_ENV === 'production') {
  setInterval(memoryMonitor, 5 * 60 * 1000);
}