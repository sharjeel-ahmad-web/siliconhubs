/**
 * Analytics Tracker
 *
 * Client-side utility for tracking user interactions and behavior
 * Implements Requirements 25.1-25.10
 */

interface AnalyticsEvent {
  eventType: string;
  eventData: Record<string, any>;
  timestamp: number;
}

class AnalyticsTracker {
  private queue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private sessionStart: number;
  private scrollDepthTracked: Set<number> = new Set();
  private animationInteractions: Map<string, number> = new Map();

  constructor() {
    this.sessionStart = Date.now();
    this.initializeTracking();
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;

    // Track scroll depth (Requirement 25.2)
    this.trackScrollDepth();

    // Track animation interactions (Requirement 25.1)
    this.trackAnimationEngagement();

    // Track device type (Requirement 25.5)
    this.trackDeviceInfo();

    // Track performance metrics (Requirement 25.4)
    this.trackPerformanceMetrics();

    // Flush queue every 10 seconds
    this.flushInterval = setInterval(() => this.flush(), 10000);

    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }

  /**
   * Track animation engagement time and interaction depth
   * Requirement 25.1
   */
  private trackAnimationEngagement() {
    // Track hero interactions
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-animation="hero"]')) {
        this.incrementInteraction('hero');
      }
    });

    // Track particle interactions
    document.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-animation="particles"]')) {
        this.incrementInteraction('particles');
      }
    });

    // Track magnetic cursor usage
    document.addEventListener(
      'mouseenter',
      (e) => {
        const target = e.target as HTMLElement;
        if (target.hasAttribute('data-magnetic')) {
          this.incrementInteraction('magnetic-cursor');
        }
      },
      true
    );
  }

  private incrementInteraction(type: string) {
    const current = this.animationInteractions.get(type) || 0;
    this.animationInteractions.set(type, current + 1);
  }

  /**
   * Track scroll depth with animation trigger points
   * Requirement 25.2
   */
  private trackScrollDepth() {
    let ticking = false;

    const checkScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage =
        (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !this.scrollDepthTracked.has(milestone)
        ) {
          this.scrollDepthTracked.add(milestone);
          this.track('scroll_depth', {
            depth: milestone,
            timestamp: Date.now(),
          });
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScrollDepth);
        ticking = true;
      }
    });
  }

  /**
   * Track device type for behavior segmentation
   * Requirement 25.5
   */
  private trackDeviceInfo() {
    const deviceType = this.getDeviceType();
    const screenSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.track('device_info', {
      deviceType,
      screenSize,
      userAgent: navigator.userAgent,
    });
  }

  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth;
    if (width > 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  /**
   * Track performance metrics and correlate with conversions
   * Requirement 25.4
   */
  private trackPerformanceMetrics() {
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Track page load time
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;

        this.track('performance', {
          loadTime: perfData.loadEventEnd - perfData.fetchStart,
          domContentLoaded:
            perfData.domContentLoadedEventEnd - perfData.fetchStart,
          firstPaint: this.getFirstPaint(),
          largestContentfulPaint: this.getLCP(),
        });
      });

      // Track Core Web Vitals
      this.trackCoreWebVitals();
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(
      (entry) => entry.name === 'first-paint'
    );
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getLCP(): number {
    let lcp = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcp = lastEntry.startTime;
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    return lcp;
  }

  private trackCoreWebVitals() {
    // Track FID (First Input Delay)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime;
        this.track('core_web_vitals', {
          metric: 'FID',
          value: fid,
        });
      }
    });
    observer.observe({ entryTypes: ['first-input'] });

    // Track CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.track('core_web_vitals', {
        metric: 'CLS',
        value: clsValue,
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Track form submissions with source attribution
   * Requirement 25.3
   */
  trackFormSubmission(
    formName: string,
    success: boolean,
    sourceAttribution?: Record<string, any>
  ) {
    this.track('form_submission', {
      formName,
      success,
      sourceAttribution: sourceAttribution || this.getSourceAttribution(),
      timestamp: Date.now(),
    });
  }

  private getSourceAttribution() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      referrer: document.referrer,
    };
  }

  /**
   * Track conversion funnel stages
   * Requirement 25.10
   */
  trackFunnelStage(stage: string, metadata?: Record<string, any>) {
    this.track('funnel_stage', {
      stage,
      metadata,
      timestamp: Date.now(),
    });
  }

  /**
   * Track animation-specific events
   */
  trackAnimationEvent(
    animationType: string,
    eventName: string,
    data?: Record<string, any>
  ) {
    this.track('animation_event', {
      animationType,
      eventName,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Generic event tracking
   */
  track(eventType: string, eventData: Record<string, any>) {
    this.queue.push({
      eventType,
      eventData,
      timestamp: Date.now(),
    });

    // Flush if queue is large
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  /**
   * Send queued events to server
   */
  private async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      await fetch('/api/admin/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events,
          sessionDuration: Date.now() - this.sessionStart,
          animationInteractions: Object.fromEntries(this.animationInteractions),
        }),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Re-queue events on failure
      this.queue.unshift(...events);
    }
  }

  /**
   * Get session duration
   */
  getSessionDuration(): number {
    return Date.now() - this.sessionStart;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

// Singleton instance
let trackerInstance: AnalyticsTracker | null = null;

export function getAnalyticsTracker(): AnalyticsTracker {
  if (typeof window === 'undefined') {
    // Return a no-op tracker for SSR
    return {
      track: () => {},
      trackFormSubmission: () => {},
      trackFunnelStage: () => {},
      trackAnimationEvent: () => {},
      getSessionDuration: () => 0,
      destroy: () => {},
    } as any;
  }

  if (!trackerInstance) {
    trackerInstance = new AnalyticsTracker();
  }

  return trackerInstance;
}

export default AnalyticsTracker;
