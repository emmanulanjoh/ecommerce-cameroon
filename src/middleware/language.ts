import { Request, Response, NextFunction } from 'express';

export const setLanguage = (req: Request, res: Response, next: NextFunction): void => {
  // Get language from query parameter, cookie, or default to English
  const language = req.query.lang || req.cookies.language || 'en';
  
  // Set language for i18n
  req.setLocale(language as string);
  
  // Set language cookie if it doesn't exist
  if (!req.cookies.language) {
    res.cookie('language', language, { maxAge: 900000, httpOnly: true });
  }
  
  // Add language to request object for use in routes
  (req as any).language = language;
  
  next();
};