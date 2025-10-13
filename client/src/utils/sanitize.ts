export const sanitizeForLog = (input: any): string => {
  if (input === null || input === undefined) return 'null';
  const str = String(input);
  return str
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' }[char] || char))
    .replace(/[^\x20-\x7E]/g, '?')
    .substring(0, 200);
};

export const sanitizeForHtml = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input);
  const entityMap: { [key: string]: string } = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'
  };
  
  return str
    .replace(/[&<>"'/]/g, (char) => entityMap[char])
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .substring(0, 5000);
};

export const sanitizeInput = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  
  return str
    .replace(/[^a-zA-Z0-9\s\-_.,!?@#$%^*()+=[\]{}|;:]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .substring(0, 1000);
};