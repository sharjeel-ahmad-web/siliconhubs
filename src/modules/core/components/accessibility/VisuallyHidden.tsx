/**
 * Visually Hidden Component
 * Hides content visually but keeps it accessible to screen readers
 * Validates: Requirements 22.4
 */

import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
}

const visuallyHiddenStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0',
};

export function VisuallyHidden({ children, as = 'span' }: VisuallyHiddenProps) {
  const Element = as;
  return React.createElement(Element, { style: visuallyHiddenStyle }, children);
}
