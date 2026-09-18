/**
 * Lightweight in-memory rate limiter for public submission endpoints
 * (e.g. career applications). Uses the client IP + email as the key.
 * This is best-effort protection and does not require external infra.
 */

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitRecord>();

// Periodically purge expired records to prevent unbounded growth.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
if (typeof setInterval === 'function') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store) {
      if (record.resetAt < now) store.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  remaining?: number;
}

/**
 * Rate limit by key.
 * @param key Unique client key (e.g. `ip|${email}`)
 * @param maxRequests Max requests within the window
 * @param windowSeconds Window length in seconds
 */
export function rateLimitByKey(
  key: string,
  maxRequests = 5,
  windowSeconds = 3600
): RateLimitResult {
  if (!key) return { allowed: true };
  const now = Date.now();
  const record = store.get(key);

  if (!record || record.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((record.resetAt - now) / 1000)
    );
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  record.count += 1;
  store.set(key, record);
  return { allowed: true, remaining: maxRequests - record.count };
}

/** Extract a reasonably stable client identifier from a request. */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
