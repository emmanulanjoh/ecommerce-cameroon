// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // HTML entity encoding with single pass
  const entityMap: { [key: string]: string } = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'
  };
  
  return input
    .replace(/[&<>"'/]/g, (char) => entityMap[char])
    .replace(/(javascript|data|vbscript):|on\w+\s*=|<script[^>]*>.*?<\/script>|\\u[0-9a-fA-F]{4}/gi, '')
    .substring(0, 5000);
};

// Sanitize input to prevent injection attacks
export const sanitizeInput = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  // Single regex for better performance
  return str
    .replace(/[<>"'&\x00-\x1F\x7F]|javascript:|data:|vbscript:|on\w+\s*=|<script[^>]*>.*?<\/script>|\\u[0-9a-fA-F]{4}/gi, '')
    .substring(0, 1000);
};

// Sanitize for logging to prevent log injection
export const sanitizeForLog = (input: any): string => {
  if (input === null || input === undefined) return 'null';
  const str = String(input);
  return str.replace(/[\r\n\t]/g, ' ').replace(/[^\x20-\x7E]/g, '?').substring(0, 200);
};

// Cached entity map for better performance
const HTML_ENTITY_MAP: { [key: string]: string } = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'
};

// Sanitize for HTML output
export const sanitizeForHtml = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input);
  
  return str
    .replace(/[&<>"'/]/g, (char) => HTML_ENTITY_MAP[char])
    .replace(/(javascript|data|vbscript):|on\w+\s*=|<script[^>]*>.*?<\/script>|\\u[0-9a-fA-F]{4}/gi, '')
    .substring(0, 5000);
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
  
  // Optimized single pass sanitization
  return fileName
    .replace(/[^a-zA-Z0-9.-]|\.{2,}|(javascript|data|vbscript):|<script[^>]*>.*?<\/script>|[\x00-\x1F\x7F]/gi, (match) => 
      match.startsWith('..') ? '.' : match.match(/[^a-zA-Z0-9.-]/) ? '_' : '')
    .substring(0, 100);
};