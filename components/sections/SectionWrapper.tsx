'use client';

import { useEffect, useState } from 'react';

interface SectionWrapperProps {
  page: string;
  section: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/** Safe get: never indexes null/undefined. Returns undefined if data is nullish or not an object. */
function safeGet(data: unknown, key: string): unknown {
  if (data === null || data === undefined) return undefined;
  if (typeof data !== 'object') return undefined;
  return (data as Record<string, unknown>)[key];
}

/**
 * Get visibility from API response. All property access goes through safeGet — never reads from null/undefined.
 * API with ?page=&section= returns the section object or { _visible: true }; never null.
 */
function getVisibleFromResponse(data: unknown, _section: string): boolean {
  try {
    if (data === null || data === undefined) return true;
    if (typeof data !== 'object' || Array.isArray(data)) return true;
    const directVisible = safeGet(data, '_visible');
    if (typeof directVisible === 'boolean') return directVisible !== false;
    return true;
  } catch {
    return true;
  }
}

const visibilityCache = new Map<
  string,
  { visible: boolean; timestamp: number }
>();
const VISIBILITY_CACHE_TTL = 15 * 1000;

function getCachedVisibility(cacheKey: string): boolean | null {
  const entry = visibilityCache.get(cacheKey);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > VISIBILITY_CACHE_TTL) {
    visibilityCache.delete(cacheKey);
    return null;
  }
  return entry.visible;
}

const inFlightVisibility = new Map<string, Promise<boolean>>();

/**
 * Wrapper component that checks section visibility from CMS.
 * If section is hidden (visible: false), it won't render the children.
 * Null-safe: never reads properties from null; handles API returning null/empty.
 */
export default function SectionWrapper({
  page,
  section,
  children,
  fallback = null,
}: SectionWrapperProps) {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${page}\0${section}`;

    const cached = getCachedVisibility(cacheKey);
    if (cached !== null) {
      setIsVisible(cached);
      setLoading(false);
      return;
    }

    let promise = inFlightVisibility.get(cacheKey);
    if (!promise) {
      promise = (async () => {
        try {
          const res = await fetch(
            `/api/content?page=${encodeURIComponent(page)}&section=${encodeURIComponent(section)}&includeVisibility=true`
          );

          if (!res.ok) return true;

          let data: unknown;
          try {
            const text = await res.text();
            data = text ? JSON.parse(text) : null;
          } catch {
            data = null;
          }

          const visible = getVisibleFromResponse(data, section);
          visibilityCache.set(cacheKey, { visible, timestamp: Date.now() });
          return visible;
        } catch {
          visibilityCache.set(cacheKey, { visible: true, timestamp: Date.now() });
          return true;
        } finally {
          inFlightVisibility.delete(cacheKey);
        }
      })();
      inFlightVisibility.set(cacheKey, promise);
    }

    promise.then((visible) => {
      if (!cancelled) {
        setIsVisible(visible);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [page, section]);

  if (loading) {
    return null;
  }

  if (isVisible === false) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
