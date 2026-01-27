/**
 * Live Region Component
 * Announces dynamic content changes to screen readers
 * Validates: Requirements 22.9, 22.10
 */

'use client';

import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

export function LiveRegion({
  message,
  priority = 'polite',
  clearAfter = 1000,
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && regionRef.current) {
      regionRef.current.textContent = message;

      if (clearAfter > 0) {
        const timer = setTimeout(() => {
          if (regionRef.current) {
            regionRef.current.textContent = '';
          }
        }, clearAfter);

        return () => clearTimeout(timer);
      }
    }
  }, [message, clearAfter]);

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live={priority}
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
      }}
    />
  );
}

/**
 * Alert Component
 * Announces important messages immediately
 */
export function Alert({ message }: { message: string }) {
  return <LiveRegion message={message} priority="assertive" />;
}

/**
 * Status Component
 * Announces status updates politely
 */
export function Status({ message }: { message: string }) {
  return <LiveRegion message={message} priority="polite" />;
}
