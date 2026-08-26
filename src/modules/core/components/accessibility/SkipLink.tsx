/**
 * Skip Link Component
 * Provides keyboard navigation to skip to main content
 * Validates: Requirements 22.3
 */

'use client';

import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href ?? '#'}
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        zIndex: 9999,
      }}
      onFocus={(e) => {
        // Make visible when focused
        e.currentTarget.style.position = 'fixed';
        e.currentTarget.style.left = '0';
        e.currentTarget.style.top = '0';
        e.currentTarget.style.width = 'auto';
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.padding = '1rem 2rem';
        e.currentTarget.style.backgroundColor = '#2563EB';
        e.currentTarget.style.color = '#FFFFFF';
        e.currentTarget.style.textDecoration = 'none';
        e.currentTarget.style.fontWeight = '600';
        e.currentTarget.style.borderRadius = '0 0 0.5rem 0';
      }}
      onBlur={(e) => {
        // Hide when focus is lost
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.left = '-10000px';
        e.currentTarget.style.top = 'auto';
        e.currentTarget.style.width = '1px';
        e.currentTarget.style.height = '1px';
        e.currentTarget.style.padding = '0';
      }}
    >
      {children}
    </a>
  );
}

/**
 * Skip Links Container
 * Provides multiple skip links for navigation
 */
export function SkipLinks() {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#footer">Skip to footer</SkipLink>
    </>
  );
}
