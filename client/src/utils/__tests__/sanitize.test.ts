import { sanitizeForLog, sanitizeForHtml } from '../sanitize';

describe('sanitizeForLog', () => {
  it('should remove newlines and tabs', () => {
    const input = 'Hello\nWorld\tTest\r\nEnd';
    const result = sanitizeForLog(input);
    expect(result).toBe('Hello World Test End');
  });

  it('should collapse multiple spaces', () => {
    const input = 'Hello    World     Test';
    const result = sanitizeForLog(input);
    expect(result).toBe('Hello World Test');
  });

  it('should trim whitespace', () => {
    const input = '  Hello World  ';
    const result = sanitizeForLog(input);
    expect(result).toBe('Hello World');
  });
});

describe('sanitizeForHtml', () => {
  it('should escape HTML entities', () => {
    const input = '<script>alert("xss")</script>';
    const result = sanitizeForHtml(input);
    expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('should escape ampersands', () => {
    const input = 'Tom & Jerry';
    const result = sanitizeForHtml(input);
    expect(result).toBe('Tom &amp; Jerry');
  });

  it('should escape quotes', () => {
    const input = `He said "Hello" and 'Goodbye'`;
    const result = sanitizeForHtml(input);
    expect(result).toBe('He said &quot;Hello&quot; and &#x27;Goodbye&#x27;');
  });
});