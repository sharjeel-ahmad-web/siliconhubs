/**
 * SmoothScrollProvider Component
 *
 * Initializes and provides smooth scrolling functionality globally
 *
 * Requirements: 6.1, 33.1-33.10
 */

'use client';

import React, { useEffect, useRef } from 'react';
import {
  initSmoothScroll,
  destroySmoothScroll,
  SmoothScrollConfig,
} from '@/lib/animations/SmoothScroll';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  config?: SmoothScrollConfig;
}

/**
 * Provider component that initializes smooth scrolling for the entire application
 *
 * Requirements:
 * - 6.1: Initialize Lenis smooth scroll with 0.1 lerp value and 1.2 wheel multiplier
 * - 33.1: Use Lenis 1.0.47 with 0.1 lerp value for smooth interpolation
 * - 33.2: Apply 1.2 wheel multiplier for scroll sensitivity
 * - 33.3: Apply 2.0 touch multiplier for appropriate mobile sensitivity
 */
export function SmoothScrollProvider({
  children,
  config,
}: SmoothScrollProviderProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in development mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Don't initialize smooth scroll if user prefers reduced motion
      return;
    }

    // Initialize smooth scroll with default or custom config
    const defaultConfig: SmoothScrollConfig = {
      lerp: 0.1, // Requirement 33.1
      wheelMultiplier: 1.2, // Requirement 33.2
      touchMultiplier: 2.0, // Requirement 33.3
      duration: 1.2,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false, // Better mobile performance
    };

    initSmoothScroll({ ...defaultConfig, ...config });

    // Cleanup on unmount
    return () => {
      destroySmoothScroll();
    };
  }, []);

  return <>{children}</>;
}
