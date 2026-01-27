'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

type NextLinkProps = ComponentProps<typeof Link>;

const FALLBACK_HREF = '/' as const;

/**
 * Wrapper around next/link that guarantees href is never undefined/null.
 * In development, logs a warning when a fallback is used so you can fix the source.
 */
export function SafeLink({ href, ...rest }: NextLinkProps) {
  let resolvedHref: NextLinkProps['href'] = FALLBACK_HREF;
  if (href != null && href !== '') {
    if (typeof href === 'string') resolvedHref = href;
    else if (typeof href === 'object' && 'pathname' in href) resolvedHref = href;
  }

  const usedFallback = resolvedHref === FALLBACK_HREF && href !== FALLBACK_HREF;
  if (usedFallback && typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn('[SafeLink] href was missing or invalid; using fallback.', { received: href });
  }

  return <Link href={resolvedHref} {...rest} />;
}
