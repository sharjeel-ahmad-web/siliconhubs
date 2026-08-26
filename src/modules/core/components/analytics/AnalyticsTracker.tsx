'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

interface TrackingData {
  page: string;
  referrer?: string;
  scrollDepth?: number;
  duration?: number;
  event?: string;
  eventData?: Record<string, any>;
}

const isDev = process.env.NODE_ENV === 'development';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const startTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const lastTrackedPath = useRef<string>('');
  const trackingDisabled = useRef(false);

  const track = useCallback(async (data: TrackingData) => {
    if (isDev) return;
    if (trackingDisabled.current) return;
    try {
      const res = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) trackingDisabled.current = true;
    } catch (error) {
      trackingDisabled.current = true;
    }
  }, []);

  // Track page view on route change
  useEffect(() => {
    if (pathname === lastTrackedPath.current) return;

    // Send previous page duration before tracking new page
    if (lastTrackedPath.current) {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      track({
        page: lastTrackedPath.current,
        scrollDepth: maxScrollDepth.current,
        duration,
      });
    }

    // Reset for new page
    startTime.current = Date.now();
    maxScrollDepth.current = 0;
    lastTrackedPath.current = pathname;

    // Track new page view
    track({
      page: pathname,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    });
  }, [pathname, track]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent =
        docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track session end (page unload)
  useEffect(() => {
    if (isDev) return;
    const handleUnload = () => {
      if (trackingDisabled.current) return;
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/track',
          JSON.stringify({
            page: pathname,
            scrollDepth: maxScrollDepth.current,
            duration,
          })
        );
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [pathname]);

  // Expose tracking function globally for custom events
  useEffect(() => {
    (window as any).trackEvent = (
      event: string,
      eventData?: Record<string, any>
    ) => {
      if (!isDev) track({ page: pathname, event, eventData });
    };
    return () => {
      delete (window as any).trackEvent;
    };
  }, [pathname, track]);

  return null; // This component doesn't render anything
}

// Hook for tracking custom events
export function useAnalytics() {
  const pathname = usePathname();

  const trackEvent = useCallback(
    async (event: string, eventData?: Record<string, any>) => {
      if (process.env.NODE_ENV === 'development') return;
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page: pathname, event, eventData }),
        });
      } catch (error) {
        // no-op
      }
    },
    [pathname]
  );

  return { trackEvent };
}
