/**
 * HTML Sanitization Utility
 * Removes potentially dangerous HTML elements and attributes
 * to prevent XSS attacks when using dangerouslySetInnerHTML
 */

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'a', 'span', 'div', 'section', 'article',
  'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr'
];

const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
  'div': ['class'],
  'span': ['class'],
  'p': ['class'],
  'section': ['class'],
  'article': ['class'],
  'table': ['class'],
  'th': ['class'],
  'td': ['class'],
  'tr': ['class']
};

/**
 * Sanitizes HTML string by removing dangerous elements and attributes
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHTML(html) {
  if (!html || typeof html !== 'string') return '';

  // Create a temporary DOM element to parse HTML
  const temp = typeof document !== 'undefined' 
    ? document.createElement('div')
    : null;

  if (!temp) {
    // Server-side: basic regex-based sanitization
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
  }

  temp.innerHTML = html;

  // Remove script tags and event handlers
  const scripts = temp.querySelectorAll('script, iframe, object, embed, form, input, button');
  scripts.forEach(el => el.remove());

  // Remove all elements not in allowed list
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    
    if (!ALLOWED_TAGS.includes(tagName)) {
      el.remove();
      return;
    }

    // Remove disallowed attributes
    const allowedAttrs = ALLOWED_ATTRIBUTES[tagName] || [];
    Array.from(el.attributes).forEach(attr => {
      const attrName = attr.name.toLowerCase();
      
      // Remove event handlers and javascript: protocols
      if (attrName.startsWith('on') || 
          attr.value.toLowerCase().startsWith('javascript:') ||
          (!allowedAttrs.includes(attrName) && attrName !== 'id')) {
        el.removeAttribute(attr.name);
      }
    });

    // Ensure external links have rel="noopener noreferrer"
    if (tagName === 'a') {
      const href = el.getAttribute('href');
      if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
        el.setAttribute('rel', 'noopener noreferrer');
        el.setAttribute('target', '_blank');
      }
    }
  });

  return temp.innerHTML;
}

