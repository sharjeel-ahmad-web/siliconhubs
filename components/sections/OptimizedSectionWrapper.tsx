'use client';

import { useBatchSection } from './BatchSectionProvider';

interface OptimizedSectionWrapperProps {
  section: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Optimized wrapper that uses batched visibility data
 * No individual API calls - relies on BatchSectionProvider
 */
export default function OptimizedSectionWrapper({
  section,
  children,
  fallback = null,
}: OptimizedSectionWrapperProps) {
  const { isVisible, loading } = useBatchSection(section);

  // While loading, render nothing to prevent flash
  if (loading) {
    return null;
  }

  // If hidden, don't render
  if (!isVisible) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
