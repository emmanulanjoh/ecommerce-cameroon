export const sanitizeForLog = (input: string): string => {
  return input.replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim();
};

export const sanitizeForHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};