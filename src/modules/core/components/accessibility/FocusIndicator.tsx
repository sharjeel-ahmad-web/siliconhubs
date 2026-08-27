/**
 * Focus Indicator Component
 * Provides visible focus indicators for interactive elements
 * Validates: Requirements 22.2
 */

'use client';

import React, { useEffect } from 'react';
import { useKeyboardUser } from '@/lib/hooks/useAccessibility';

/**
 * Global Focus Indicator Styles
 * Applies focus indicators to all interactive elements
 */
export function FocusIndicatorStyles() {
  const isKeyboardUser = useKeyboardUser();

  useEffect(() => {
    if (isKeyboardUser) {
      document.body.classList.add('keyboard-user');
    } else {
      document.body.classList.remove('keyboard-user');
    }
  }, [isKeyboardUser]);

  return (
    <style jsx global>{`
      /* Focus indicators - only show for keyboard users */
      .keyboard-user *:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }

      /* Remove default focus outline for mouse users */
      *:focus {
        outline: none;
      }

      /* Ensure focus is visible on interactive elements */
      .keyboard-user button:focus,
      .keyboard-user a:focus,
      .keyboard-user input:focus,
      .keyboard-user select:focus,
      .keyboard-user textarea:focus,
      .keyboard-user [tabindex]:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }

      /* Custom focus styles for specific elements */
      .keyboard-user .magnetic-button:focus {
        outline: 2px solid #2563eb;
        outline-offset: 4px;
      }

      .keyboard-user .card:focus {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
      }
    `}</style>
  );
}
