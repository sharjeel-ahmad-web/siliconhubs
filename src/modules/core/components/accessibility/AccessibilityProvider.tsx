/**
 * Accessibility Provider
 * Provides global accessibility features and styles
 * Validates: Requirements 22.1-22.10
 */

'use client';

import React from 'react';
import { SkipLinks } from './SkipLink';
import { FocusIndicatorStyles } from './FocusIndicator';
import { ReducedMotionStyles } from './ReducedMotion';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({
  children,
}: AccessibilityProviderProps) {
  return (
    <>
      {/* Skip links for keyboard navigation */}
      <SkipLinks />

      {/* Global focus indicator styles */}
      <FocusIndicatorStyles />

      {/* Reduced motion styles */}
      <ReducedMotionStyles />

      {/* Main content */}
      {children}
    </>
  );
}
