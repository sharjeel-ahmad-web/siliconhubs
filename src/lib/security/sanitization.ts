/**
 * Input Sanitization Utilities
 * Uses sanitize-html (pure CommonJS, no jsdom) for XSS prevention.
 * isomorphic-dompurify was replaced because it pulls in jsdom, which fails
 * on Vercel serverless runtimes with ERR_REQUIRE_ESM (@exodus/bytes).
 */

import sanitizeHtml from 'sanitize-html';

/**
 * Subset of sanitize-html options used by this module.
 * (Avoids pulling in @types/sanitize-html's `export =` namespace, which is
 * incompatible with ESM module resolution in this project.)
 */
interface SanitizeOptions {
  allowedTags?: string[] | false;
  allowedAttributes?: Record<string, string[]> | false;
  allowedSchemes?: string[] | boolean;
  allowedSchemesAppliedToAttributes?: string[];
  allowProtocolRelative?: boolean;
  disallowedTagsMode?:
    | 'discard'
    | 'escape'
    | 'recursiveEscape'
    | 'completelyDiscard';
  [key: string]: any;
}

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param input Raw HTML input
 * @param options sanitize-html configuration options
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(input: string, options?: SanitizeOptions): string {
  if (typeof input !== 'string') {
    return '';
  }

  const defaultConfig: SanitizeOptions = {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'blockquote',
      'code',
      'pre',
    ],
    allowedAttributes: {
      a: ['href', 'title'],
      img: ['src', 'alt', 'title'],
      '*': ['class', 'id'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowProtocolRelative: false,
  };

  const config = { ...defaultConfig, ...options };
  return sanitizeHtml(input, config as any);
}

/**
 * Sanitize plain text input (removes all HTML)
 * @param input Raw text input
 * @returns Sanitized plain text string
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  } as any);
}

/**
 * Sanitize URL to prevent javascript: and data: protocol attacks
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeURL(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }

  // Remove whitespace
  const trimmed = url.trim();

  // Check for dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file):/i;
  if (dangerousProtocols.test(trimmed)) {
    return '';
  }

  // Validate URL format
  try {
    const urlObj = new URL(trimmed, 'https://example.com');

    // Only allow http, https, mailto, and tel protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return '';
    }

    return trimmed;
  } catch {
    // If URL parsing fails, return empty string
    return '';
  }
}

/**
 * Sanitize email address
 * @param email Email address to sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }

  const trimmed = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return '';
  }

  return trimmed;
}

/**
 * Sanitize phone number
 * @param phone Phone number to sanitize
 * @returns Sanitized phone number
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return '';
  }

  // Remove all non-digit characters except + at the start
  return phone.replace(/[^\d+]/g, '').replace(/^(\+?).*/, '$1');
}

/**
 * Validate and sanitize JSON input
 * @param input JSON string to sanitize
 * @returns Parsed and sanitized object or null if invalid
 */
export function sanitizeJSON<T = any>(input: string): T | null {
  if (typeof input !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(input);

    // Recursively sanitize string values in the object
    return sanitizeObjectStrings(parsed);
  } catch {
    return null;
  }
}

/**
 * Recursively sanitize string values in an object
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
function sanitizeObjectStrings<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeText(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectStrings) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObjectStrings(value);
    }
    return sanitized;
  }

  return obj;
}
