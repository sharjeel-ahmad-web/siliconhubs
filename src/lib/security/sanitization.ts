/**
 * Input Sanitization Utilities
 * Implements DOMPurify-based sanitization for XSS prevention
 */

import DOMPurify, { Config } from 'isomorphic-dompurify';

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param input Raw HTML input
 * @param options DOMPurify configuration options
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(input: string, options?: Config): string {
  if (typeof input !== 'string') {
    return '';
  }

  const defaultConfig: Config = {
    ALLOWED_TAGS: [
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
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  };

  const config = { ...defaultConfig, ...options };
  return DOMPurify.sanitize(input, config);
}

/**
 * Sanitize plain text input (removes all HTML)
 * @param input Raw text input
 * @returns Sanitized plain text
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
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
  return phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
}

/**
 * Validate and sanitize JSON input
 * @param input JSON string to validate
 * @returns Parsed and sanitized JSON object or null if invalid
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
