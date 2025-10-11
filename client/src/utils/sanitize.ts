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
  // Optimized HTML entity encoding with single pass
  const entityMap: { [key: string]: string } = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;'
  };
  
  return str
    .replace(/[&<>"'/]/g, (char) => entityMap[char])
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .substring(0, 5000);
};

export const sanitizeInput = (input: any): string => {
  if (input === null || input === undefined) return '';
  const str = String(input).trim();
  // Whitelist approach: allow only safe characters
  // eslint-disable-next-line no-useless-escape
  const disallowedChars = /[^a-zA-Z0-9\s\-_.,!?@#$%^*()+=\[\]{}|;:]/g;
  // eslint-disable-next-line no-control-regex
  const controlChars = /[\x00-\x1F\x7F]/g;
  
  return str
    .replace(disallowedChars, '')
    .replace(controlChars, '')
    .substring(0, 1000);
};