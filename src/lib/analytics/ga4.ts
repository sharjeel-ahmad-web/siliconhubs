/**
 * Google Analytics 4 Integration
 *
 * Implements Requirements 25.1-25.10
 * Integrates with existing analytics tracker for comprehensive tracking
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface GA4Config {
  measurementId: string;
  debug?: boolean;
}

export interface GA4Event {
  eventName: string;
  eventParams?: Record<string, any>;
}

class GA4Tracker {
  private measurementId: string;
  private debug: boolean;
  private initialized: boolean = false;

  constructor(config: GA4Config) {
    this.measurementId = config.measurementId;
    this.debug = config.debug || false;
  }

  /**
   * Initialize Google Analytics 4
   */
  initialize() {
    if (typeof window === 'undefined' || this.initialized) return;

    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer!.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.measurementId, {
      debug_mode: this.debug,
      send_page_view: true,
    });

    this.initialized = true;
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string) {
    if (!this.initialized) return;

    window.gtag?.('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  /**
   * Track animation engagement
   * Requirement 25.1
   */
  trackAnimationEngagement(
    animationType: string,
    engagementTime: number,
    interactionDepth: number
  ) {
    this.trackEvent({
      eventName: 'animation_engagement',
      eventParams: {
        animation_type: animationType,
        engagement_time: engagementTime,
        interaction_depth: interactionDepth,
      },
    });
  }

  /**
   * Track scroll depth with animation trigger points
   * Requirement 25.2
   */
  trackScrollDepth(depth: number, triggerPoint?: string) {
    this.trackEvent({
      eventName: 'scroll_depth',
      eventParams: {
        depth_percentage: depth,
        trigger_point: triggerPoint,
      },
    });
  }

  /**
   * Track form submission with source attribution
   * Requirement 25.3
   */
  trackFormSubmission(
    formName: string,
    success: boolean,
    sourceAttribution: Record<string, any>
  ) {
    this.trackEvent({
      eventName: success
        ? 'form_submission_success'
        : 'form_submission_failure',
      eventParams: {
        form_name: formName,
        ...sourceAttribution,
      },
    });

    // Track as conversion if successful
    if (success) {
      this.trackConversion(formName);
    }
  }

  /**
   * Track conversion
   */
  trackConversion(conversionName: string, value?: number) {
    this.trackEvent({
      eventName: 'conversion',
      eventParams: {
        conversion_name: conversionName,
        value: value,
      },
    });
  }

  /**
   * Track performance metrics correlation
   * Requirement 25.4
   */
  trackPerformanceMetrics(metrics: {
    loadTime: number;
    fcp: number;
    lcp: number;
    fid: number;
    cls: number;
    conversionRate?: number;
  }) {
    this.trackEvent({
      eventName: 'performance_metrics',
      eventParams: {
        load_time: metrics.loadTime,
        first_contentful_paint: metrics.fcp,
        largest_contentful_paint: metrics.lcp,
        first_input_delay: metrics.fid,
        cumulative_layout_shift: metrics.cls,
        conversion_rate: metrics.conversionRate,
      },
    });
  }

  /**
   * Track device-specific behavior
   * Requirement 25.5
   */
  trackDeviceBehavior(
    deviceType: 'desktop' | 'tablet' | 'mobile',
    behavior: Record<string, any>
  ) {
    this.trackEvent({
      eventName: 'device_behavior',
      eventParams: {
        device_type: deviceType,
        ...behavior,
      },
    });
  }

  /**
   * Track conversion funnel stage
   * Requirement 25.10
   */
  trackFunnelStage(stage: string, metadata?: Record<string, any>) {
    this.trackEvent({
      eventName: 'funnel_stage',
      eventParams: {
        stage,
        ...metadata,
      },
    });
  }

  /**
   * Generic event tracking
   */
  trackEvent(event: GA4Event) {
    if (!this.initialized) return;

    window.gtag?.('event', event.eventName, event.eventParams);

    if (this.debug) {
      console.log('[GA4] Event tracked:', event);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>) {
    if (!this.initialized) return;

    window.gtag?.('set', 'user_properties', properties);
  }

  /**
   * Set user ID
   */
  setUserId(userId: string) {
    if (!this.initialized) return;

    window.gtag?.('config', this.measurementId, {
      user_id: userId,
    });
  }
}

// Singleton instance
let ga4Instance: GA4Tracker | null = null;

export function initializeGA4(config: GA4Config): GA4Tracker {
  if (!ga4Instance) {
    ga4Instance = new GA4Tracker(config);
    ga4Instance.initialize();
  }
  return ga4Instance;
}

export function getGA4(): GA4Tracker | null {
  return ga4Instance;
}

export default GA4Tracker;
