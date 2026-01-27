/**
 * Performance Monitoring Hook
 *
 * React hook for accessing Sentry performance monitoring
 * Implements Requirements 21.10, 40.7
 */

'use client';

import { useEffect, useState } from 'react';
import { getSentryMonitor } from '../monitoring/sentry';
import type { PerformanceMetrics } from '../monitoring/sentry';

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    interactionLatency: 0,
    errorRate: 0,
    deviceType: 'desktop',
  });

  useEffect(() => {
    const monitor = getSentryMonitor();
    if (!monitor) return;

    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      const currentMetrics = monitor.getPerformanceMetrics();
      setMetrics(currentMetrics);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const trackAnimationPerformance = (
    animationName: string,
    duration: number,
    fps: number
  ) => {
    const monitor = getSentryMonitor();
    monitor?.trackAnimationPerformance(animationName, duration, fps);
  };

  const trackCustomMetric = (
    name: string,
    value: number,
    unit: string = 'ms'
  ) => {
    const monitor = getSentryMonitor();
    monitor?.trackPerformanceMetric(name, value, unit);
  };

  const startTransaction = (name: string, op: string) => {
    const monitor = getSentryMonitor();
    return monitor?.startTransaction(name, op);
  };

  return {
    metrics,
    trackAnimationPerformance,
    trackCustomMetric,
    startTransaction,
  };
}

export default usePerformanceMonitoring;
