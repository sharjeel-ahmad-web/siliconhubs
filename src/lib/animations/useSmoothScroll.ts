/**
 * React Hook for SmoothScroll
 *
 * Provides easy integration of smooth scrolling in React components
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { SmoothScroll, SmoothScrollConfig, VelocityData } from './SmoothScroll';

/**
 * Hook to initialize and manage smooth scrolling
 */
export function useSmoothScroll(config?: SmoothScrollConfig) {
  const smoothScrollRef = useRef<SmoothScroll | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize smooth scroll
    smoothScrollRef.current = new SmoothScroll(config);
    setIsReady(true);

    // Cleanup on unmount
    return () => {
      if (smoothScrollRef.current) {
        smoothScrollRef.current.destroy();
        smoothScrollRef.current = null;
      }
    };
  }, []);

  return {
    smoothScroll: smoothScrollRef.current,
    isReady,
  };
}

/**
 * Hook to track scroll velocity for skew effects
 * Requirement 6.2, 33.6: Velocity tracking for skew effects
 */
export function useScrollVelocity(smoothScroll: SmoothScroll | null) {
  const [velocity, setVelocity] = useState<VelocityData>({
    current: 0,
    previous: 0,
    delta: 0,
    direction: 'none',
  });

  useEffect(() => {
    if (!smoothScroll) return;

    const unsubscribe = smoothScroll.onVelocity((velocityData) => {
      setVelocity(velocityData);
    });

    return unsubscribe;
  }, [smoothScroll]);

  return velocity;
}

/**
 * Hook to track scroll position
 */
export function useScrollPosition(smoothScroll: SmoothScroll | null) {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    if (!smoothScroll) return;

    const unsubscribe = smoothScroll.onScroll((data) => {
      setScroll(data.scroll);
    });

    return unsubscribe;
  }, [smoothScroll]);

  return scroll;
}

/**
 * Hook to get skew value for velocity-based transformations
 * Requirement 33.6: Apply skewY transformation with velocity × 0.1 multiplier
 */
export function useScrollSkew(smoothScroll: SmoothScroll | null) {
  const [skew, setSkew] = useState(0);

  useEffect(() => {
    if (!smoothScroll) return;

    const unsubscribe = smoothScroll.onVelocity(() => {
      setSkew(smoothScroll.getSkewValue());
    });

    return unsubscribe;
  }, [smoothScroll]);

  return skew;
}

/**
 * Hook to register a scroll trigger
 */
export function useScrollTrigger(
  smoothScroll: SmoothScroll | null,
  element: HTMLElement | null,
  callbacks: {
    onEnter?: () => void;
    onLeave?: () => void;
    onProgress?: (progress: number) => void;
  }
) {
  const triggerIdRef = useRef<string>(
    `trigger-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    if (!smoothScroll || !element) return;

    const triggerId = triggerIdRef.current;

    smoothScroll.addScrollTrigger({
      id: triggerId,
      element,
      start: 0,
      end: 0,
      ...callbacks,
    });

    return () => {
      smoothScroll.removeScrollTrigger(triggerId);
    };
  }, [
    smoothScroll,
    element,
    callbacks.onEnter,
    callbacks.onLeave,
    callbacks.onProgress,
  ]);
}
