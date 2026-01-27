'use client';

import { useEffect, useRef } from 'react';
import { getAnalyticsTracker } from './tracker';

/**
 * React hook for analytics tracking
 * Provides easy access to analytics tracking functions
 */
export function useAnalytics() {
  const tracker = getAnalyticsTracker();

  return {
    track: tracker.track.bind(tracker),
    trackFormSubmission: tracker.trackFormSubmission.bind(tracker),
    trackFunnelStage: tracker.trackFunnelStage.bind(tracker),
    trackAnimationEvent: tracker.trackAnimationEvent.bind(tracker),
    getSessionDuration: tracker.getSessionDuration.bind(tracker),
  };
}

/**
 * Hook to track page views
 */
export function usePageView(pageName: string) {
  const { track } = useAnalytics();
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      track('page_view', {
        pageName,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: Date.now(),
      });
      tracked.current = true;
    }
  }, [pageName, track]);
}

/**
 * Hook to track animation visibility and engagement
 */
export function useAnimationTracking(animationName: string) {
  const { trackAnimationEvent } = useAnalytics();
  const startTime = useRef<number>(0);
  const isVisible = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible.current) {
            isVisible.current = true;
            startTime.current = Date.now();
            trackAnimationEvent(animationName, 'visible', {
              timestamp: startTime.current,
            });
          } else if (!entry.isIntersecting && isVisible.current) {
            isVisible.current = false;
            const duration = Date.now() - startTime.current;
            trackAnimationEvent(animationName, 'hidden', {
              duration,
              timestamp: Date.now(),
            });
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.querySelector(
      `[data-animation="${animationName}"]`
    );
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [animationName, trackAnimationEvent]);

  return {
    trackInteraction: (interactionType: string, data?: Record<string, any>) => {
      trackAnimationEvent(animationName, interactionType, data);
    },
  };
}

/**
 * Hook to track scroll-triggered animations
 */
export function useScrollAnimation(
  animationName: string,
  triggerPoint: number = 0.5
) {
  const { trackAnimationEvent } = useAnalytics();
  const triggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !triggered.current) {
            triggered.current = true;
            trackAnimationEvent(animationName, 'scroll_triggered', {
              scrollPosition: window.scrollY,
              timestamp: Date.now(),
            });
          }
        });
      },
      { threshold: triggerPoint }
    );

    const element = document.querySelector(
      `[data-scroll-animation="${animationName}"]`
    );
    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [animationName, triggerPoint, trackAnimationEvent]);
}

/**
 * Hook to track conversion funnel progress
 */
export function useFunnelTracking(stage: string, autoTrack: boolean = true) {
  const { trackFunnelStage } = useAnalytics();
  const tracked = useRef(false);

  useEffect(() => {
    if (autoTrack && !tracked.current) {
      trackFunnelStage(stage);
      tracked.current = true;
    }
  }, [stage, autoTrack, trackFunnelStage]);

  return {
    trackStage: (customStage?: string, metadata?: Record<string, any>) => {
      trackFunnelStage(customStage || stage, metadata);
    },
  };
}
