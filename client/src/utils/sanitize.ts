export const sanitizeForLog = (input: any): string => {
  if (input === null || input === undefined) return 'null';
  const str = String(input);
  return str.replace(/[\r\n\t]/g, ' ').replace(/[^\x20-\x7E]/g, '?').substring(0, 200);
};

export const sanitizeForHtml = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
};

export const sanitizeInput = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  return str
    .replace(/[<>"'&]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .substring(0, 1000);
};