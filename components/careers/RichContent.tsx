'use client';

/**
 * Renders CMS rich-text (HTML) content safely.
 * Uses the project's existing isomorphic-dompurify sanitization utilities.
 */
import { sanitizeHTML } from '@/lib/security/sanitization';

interface RichContentProps {
  html?: string | null;
  className?: string;
}

export function RichContent({ html, className }: RichContentProps) {
  if (!html || !html.trim()) return null;
  const safeHtml = sanitizeHTML(html, {
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
      'blockquote',
      'code',
      'pre',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'title'],
  });

  return (
    <div
      className={`rich-content ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

export default RichContent;
