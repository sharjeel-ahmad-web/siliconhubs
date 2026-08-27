/**
 * Sentry Performance Monitoring
 *
 * Implements Real User Monitoring (RUM) with Sentry
 * Requirements 21.10, 40.7
 */

import * as Sentry from '@sentry/nextjs';

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  debug?: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  interactionLatency: number;
  errorRate: number;
  deviceType: 'desktop' | 'tablet' | 'mobile';
}

class SentryMonitor {
  private fpsHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private interactionLatencies: number[] = [];
  private errorCount: number = 0;
  private totalRequests: number = 0;
  private animationFrameId: number | null = null;

  constructor(config: SentryConfig) {
    this.initializeSentry(config);
  }

  /**
   * Initialize Sentry with performance monitoring
   */
  private initializeSentry(config: SentryConfig) {
    if (typeof window === 'undefined') return;

    Sentry.init({
      dsn: config.dsn,
      environment: config.environment,
      tracesSampleRate: config.tracesSampleRate,
      debug: config.debug || false,

      // Performance monitoring
      integrations: [
        Sentry.browserTracingIntegration({
          enableInp: true,
        }),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],

      // Session replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // Before send hook for custom processing
      beforeSend: (event) => {
        // Add custom context
        if (event.contexts) {
          event.contexts.performance = {
            fps: this.getCurrentFPS(),
            frameTime: this.getAverageFrameTime(),
          };
        }
        return event;
      },
    });

    // Start FPS tracking
    this.startFPSTracking();

    // Track interaction latency
    this.trackInteractionLatency();

    // Track errors
    this.trackErrors();
  }

  /**
   * Track FPS for animations
   * Requirement 21.10, 40.7
   */
  private startFPSTracking() {
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = (currentTime: number) => {
      frames++;
      const delta = currentTime - lastTime;

      // Calculate FPS every second
      if (delta >= 1000) {
        const fps = Math.round((frames * 1000) / delta);
        this.fpsHistory.push(fps);

        // Keep only last 60 measurements (1 minute at 1 sample/second)
        if (this.fpsHistory.length > 60) {
          this.fpsHistory.shift();
        }

        // Track frame time
        const frameTime = delta / frames;
        this.frameTimeHistory.push(frameTime);
        if (this.frameTimeHistory.length > 60) {
          this.frameTimeHistory.shift();
        }

        // Send to Sentry if FPS is low
        if (fps < 30) {
          Sentry.captureMessage(`Low FPS detected: ${fps}`, {
            level: 'warning',
            tags: {
              performance: 'fps',
            },
            extra: {
              fps,
              frameTime,
              deviceType: this.getDeviceType(),
            },
          });
        }

        frames = 0;
        lastTime = currentTime;
      }

      this.animationFrameId = requestAnimationFrame(measureFPS);
    };

    this.animationFrameId = requestAnimationFrame(measureFPS);
  }

  /**
   * Track interaction latency
   * Requirement 21.10
   */
  private trackInteractionLatency() {
    const measureLatency = (eventType: string) => {
      return (event: Event) => {
        const startTime = performance.now();

        // Measure time until next frame
        requestAnimationFrame(() => {
          const latency = performance.now() - startTime;
          this.interactionLatencies.push(latency);

          // Keep only last 100 measurements
          if (this.interactionLatencies.length > 100) {
            this.interactionLatencies.shift();
          }

          // Track high latency
          if (latency > 100) {
            Sentry.captureMessage(`High interaction latency: ${latency}ms`, {
              level: 'warning',
              tags: {
                performance: 'latency',
                event_type: eventType,
              },
              extra: {
                latency,
                eventType,
                target: (event.target as HTMLElement)?.tagName,
              },
            });
          }
        });
      };
    };

    // Track various interaction types
    ['click', 'touchstart', 'keydown'].forEach((eventType) => {
      document.addEventListener(eventType, measureLatency(eventType), {
        passive: true,
      });
    });
  }

  /**
   * Track error rate
   * Requirement 21.10
   */
  private trackErrors() {
    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.errorCount++;
      this.totalRequests++;

      Sentry.captureException(event.error, {
        tags: {
          error_type: 'unhandled',
        },
        extra: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.errorCount++;
      this.totalRequests++;

      Sentry.captureException(event.reason, {
        tags: {
          error_type: 'unhandled_rejection',
        },
      });
    });

    // Track fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      this.totalRequests++;
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.errorCount++;
        }
        return response;
      } catch (error) {
        this.errorCount++;
        throw error;
      }
    };
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory[this.fpsHistory.length - 1];
  }

  /**
   * Get average FPS
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.fpsHistory.length);
  }

  /**
   * Get average frame time
   */
  getAverageFrameTime(): number {
    if (this.frameTimeHistory.length === 0) return 16.67; // 60fps
    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
    return sum / this.frameTimeHistory.length;
  }

  /**
   * Get average interaction latency
   */
  getAverageInteractionLatency(): number {
    if (this.interactionLatencies.length === 0) return 0;
    const sum = this.interactionLatencies.reduce((a, b) => a + b, 0);
    return sum / this.interactionLatencies.length;
  }

  /**
   * Get error rate
   */
  getErrorRate(): number {
    if (this.totalRequests === 0) return 0;
    return (this.errorCount / this.totalRequests) * 100;
  }

  /**
   * Get device type
   */
  private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const width = window.innerWidth;
    if (width > 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  /**
   * Get comprehensive performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return {
      fps: this.getCurrentFPS(),
      frameTime: this.getAverageFrameTime(),
      interactionLatency: this.getAverageInteractionLatency(),
      errorRate: this.getErrorRate(),
      deviceType: this.getDeviceType(),
    };
  }

  /**
   * Track custom performance metric
   */
  trackPerformanceMetric(name: string, value: number, unit: string = 'ms') {
    Sentry.setMeasurement(name, value, unit);
  }

  /**
   * Start a performance span
   */
  startTransaction(name: string, op: string) {
    return Sentry.startSpan({ name, op }, () => {
      return {
        setMeasurement: (key: string, value: number, unit: string) => {
          Sentry.setMeasurement(key, value, unit);
        },
        setTag: (key: string, value: string) => {
          Sentry.setTag(key, value);
        },
        finish: () => {},
      };
    });
  }

  /**
   * Track animation performance
   */
  trackAnimationPerformance(
    animationName: string,
    duration: number,
    fps: number
  ) {
    Sentry.startSpan(
      { name: `animation.${animationName}`, op: 'animation' },
      () => {
        Sentry.setMeasurement('duration', duration, 'ms');
        Sentry.setMeasurement('fps', fps, 'none');
        Sentry.setTag('animation_name', animationName);
        Sentry.setTag('device_type', this.getDeviceType());
      }
    );

    // Alert if animation performance is poor
    if (fps < 30) {
      Sentry.captureMessage(`Poor animation performance: ${animationName}`, {
        level: 'warning',
        tags: {
          animation: animationName,
          fps: fps.toString(),
        },
        extra: {
          duration,
          fps,
          deviceType: this.getDeviceType(),
        },
      });
    }
  }

  /**
   * Track device-specific performance
   * Requirement 21.10
   */
  trackDevicePerformance() {
    const metrics = this.getPerformanceMetrics();

    Sentry.setContext('device_performance', {
      device_type: metrics.deviceType,
      fps: metrics.fps,
      frame_time: metrics.frameTime,
      interaction_latency: metrics.interactionLatency,
      error_rate: metrics.errorRate,
    });

    // Send performance report
    Sentry.captureMessage('Device Performance Report', {
      level: 'info',
      tags: {
        device_type: metrics.deviceType,
      },
      extra: {
        fps: metrics.fps,
        frameTime: metrics.frameTime,
        interactionLatency: metrics.interactionLatency,
        errorRate: metrics.errorRate,
        deviceType: metrics.deviceType,
      },
    });
  }

  /**
   * Cleanup
   */
  destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Singleton instance
let sentryMonitorInstance: SentryMonitor | null = null;

export function initializeSentry(config: SentryConfig): SentryMonitor {
  if (typeof window === 'undefined') {
    // Return no-op for SSR
    return {
      getCurrentFPS: () => 60,
      getAverageFPS: () => 60,
      getAverageFrameTime: () => 16.67,
      getAverageInteractionLatency: () => 0,
      getErrorRate: () => 0,
      getPerformanceMetrics: () => ({
        fps: 60,
        frameTime: 16.67,
        interactionLatency: 0,
        errorRate: 0,
        deviceType: 'desktop',
      }),
      trackPerformanceMetric: () => {},
      startTransaction: () => ({}) as any,
      trackAnimationPerformance: () => {},
      trackDevicePerformance: () => {},
      destroy: () => {},
    } as any;
  }

  if (!sentryMonitorInstance) {
    sentryMonitorInstance = new SentryMonitor(config);
  }
  return sentryMonitorInstance;
}

export function getSentryMonitor(): SentryMonitor | null {
  return sentryMonitorInstance;
}

export default SentryMonitor;
