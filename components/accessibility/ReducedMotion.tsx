/**
 * Reduced Motion Component
 * Respects user's motion preferences
 * Validates: Requirements 22.8
 */

'use client';

import React, { useEffect } from 'react';
import { useReducedMotion } from '@/lib/hooks/useAccessibility';

/**
 * Reduced Motion Styles
 * Disables animations when user prefers reduced motion
 */
export function ReducedMotionStyles() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  return (
    <style jsx global>{`
      /* Disable animations for users who prefer reduced motion */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      /* Additional reduced motion styles */
      .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      /* Disable particle systems */
      .reduce-motion .particle-system {
        display: none;
      }

      /* Disable complex animations */
      .reduce-motion .liquid-image,
      .reduce-motion .magnetic-cursor,
      .reduce-motion .scroll-skew {
        animation: none !important;
        transform: none !important;
      }

      /* Keep essential transitions for usability */
      .reduce-motion button:hover,
      .reduce-motion a:hover {
        transition:
          background-color 0.1s ease,
          color 0.1s ease;
      }
    `}</style>
  );
}

/**
 * Conditional Animation Wrapper
 * Only renders children if animations are enabled
 */
interface ConditionalAnimationProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ConditionalAnimation({
  children,
  fallback,
}: ConditionalAnimationProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion && fallback) {
    return <>{fallback}</>;
  }

  if (reducedMotion) {
    return null;
  }

  return <>{children}</>;
}
