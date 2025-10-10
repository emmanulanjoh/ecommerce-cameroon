// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

// Sanitize input to prevent injection attacks
export const sanitizeInput = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  return str
    .replace(/[<>"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000);
};

// Sanitize for logging to prevent log injection
export const sanitizeForLog = (input: any): string => {
  if (input === null || input === undefined) return 'null';
  const str = String(input);
  return str.replace(/[\r\n\t]/g, ' ').replace(/[^\x20-\x7E]/g, '?').substring(0, 200);
};

// Sanitize for HTML output
export const sanitizeForHtml = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Sanitize MongoDB query parameters
export const sanitizeMongoQuery = (query: any): any => {
  if (typeof query !== 'object' || query === null) return {};
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      sanitized[key] = value.replace(/[{}$]/g, '');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMongoQuery(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

// Validate and sanitize file names
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName || typeof fileName !== 'string') return 'file';
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 100);
};