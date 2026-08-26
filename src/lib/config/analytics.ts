/**
 * Analytics Configuration
 *
 * Centralized configuration for analytics and monitoring services
 */

export const analyticsConfig = {
  // Google Analytics 4
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
    enabled: !!process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    debug: process.env.NODE_ENV === 'development',
  },

  // Sentry
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: process.env.NODE_ENV === 'development',
  },

  // Custom Analytics
  customAnalytics: {
    enabled: true,
    flushInterval: 10000, // 10 seconds
    batchSize: 10,
  },
};

export default analyticsConfig;
