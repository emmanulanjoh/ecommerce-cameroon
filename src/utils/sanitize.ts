/**
 * Sanitize user input to prevent XSS and log injection
 */
export const sanitizeForLog = (input: any): string => {
  if (typeof input !== 'string') {
    input = String(input);
  }
  // Remove newlines and control characters that could be used for log injection
  return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
};

export const sanitizeForHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};