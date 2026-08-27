/**
 * Analytics Provider
 *
 * Unified analytics provider that integrates:
 * - Google Analytics 4 (GA4)
 * - Custom Analytics Tracker
 * - Sentry Performance Monitoring
 *
 * Implements Requirements 25.1-25.10, 21.10, 40.7
 */

'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { getAnalyticsTracker } from './tracker';
import { initializeGA4, getGA4 } from './ga4';
import { initializeSentry, getSentryMonitor } from '../monitoring/sentry';

interface AnalyticsContextValue {
  trackEvent: (eventName: string, eventData?: Record<string, any>) => void;
  trackPageView: (path: string, title?: string) => void;
  trackFormSubmission: (
    formName: string,
    success: boolean,
    sourceAttribution?: Record<string, any>
  ) => void;
  trackAnimationEngagement: (
    animationType: string,
    engagementTime: number,
    interactionDepth: number
  ) => void;
  trackScrollDepth: (depth: number, triggerPoint?: string) => void;
  trackFunnelStage: (stage: string, metadata?: Record<string, any>) => void;
  trackPerformanceMetrics: (metrics: any) => void;
  trackDeviceBehavior: (
    deviceType: 'desktop' | 'tablet' | 'mobile',
    behavior: Record<string, any>
  ) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: ReactNode;
  ga4MeasurementId?: string;
  sentryDsn?: string;
  environment?: string;
  debug?: boolean;
}

export function AnalyticsProvider({
  children,
  ga4MeasurementId,
  sentryDsn,
  environment = 'production',
  debug = false,
}: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize GA4 if measurement ID is provided
    if (ga4MeasurementId) {
      initializeGA4({
        measurementId: ga4MeasurementId,
        debug,
      });
    }

    // Initialize Sentry if DSN is provided
    if (sentryDsn) {
      initializeSentry({
        dsn: sentryDsn,
        environment,
        tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
        debug,
      });
    }

    // Initialize custom tracker (always initialized)
    getAnalyticsTracker();
  }, [ga4MeasurementId, sentryDsn, environment, debug]);

  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.track(eventName, eventData || {});

    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackEvent({
      eventName,
      eventParams: eventData,
    });
  };

  const trackPageView = (path: string, title?: string) => {
    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackPageView(path, title);

    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.track('page_view', {
      path,
      title: title || document.title,
    });
  };

  const trackFormSubmission = (
    formName: string,
    success: boolean,
    sourceAttribution?: Record<string, any>
  ) => {
    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.trackFormSubmission(formName, success, sourceAttribution);

    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackFormSubmission(formName, success, sourceAttribution || {});
  };

  const trackAnimationEngagement = (
    animationType: string,
    engagementTime: number,
    interactionDepth: number
  ) => {
    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.trackAnimationEvent(animationType, 'engagement', {
      engagementTime,
      interactionDepth,
    });

    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackAnimationEngagement(
      animationType,
      engagementTime,
      interactionDepth
    );
  };

  const trackScrollDepth = (depth: number, triggerPoint?: string) => {
    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.track('scroll_depth', {
      depth,
      triggerPoint,
    });

    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackScrollDepth(depth, triggerPoint);
  };

  const trackFunnelStage = (stage: string, metadata?: Record<string, any>) => {
    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.trackFunnelStage(stage, metadata);

    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackFunnelStage(stage, metadata);
  };

  const trackPerformanceMetrics = (metrics: any) => {
    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackPerformanceMetrics(metrics);

    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.track('performance_metrics', metrics);
  };

  const trackDeviceBehavior = (
    deviceType: 'desktop' | 'tablet' | 'mobile',
    behavior: Record<string, any>
  ) => {
    // Track in GA4
    const ga4 = getGA4();
    ga4?.trackDeviceBehavior(deviceType, behavior);

    // Track in custom tracker
    const tracker = getAnalyticsTracker();
    tracker.track('device_behavior', {
      deviceType,
      ...behavior,
    });
  };

  const value: AnalyticsContextValue = {
    trackEvent,
    trackPageView,
    trackFormSubmission,
    trackAnimationEngagement,
    trackScrollDepth,
    trackFunnelStage,
    trackPerformanceMetrics,
    trackDeviceBehavior,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

export default AnalyticsProvider;
