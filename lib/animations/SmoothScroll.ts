/**
 * SmoothScroll System
 *
 * Integrates Lenis for momentum-based smooth scrolling with velocity tracking
 * and scroll-triggered animation support.
 *
 * Requirements: 6.1, 6.2, 33.1-33.10, 37.1-37.10
 */

import Lenis from 'lenis';

export interface SmoothScrollConfig {
  lerp?: number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  duration?: number;
  easing?: (t: number) => number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  infinite?: boolean;
}

export interface ScrollTrigger {
  id: string;
  element: HTMLElement;
  start: number;
  end: number;
  onEnter?: () => void;
  onLeave?: () => void;
  onProgress?: (progress: number) => void;
}

export interface VelocityData {
  current: number;
  previous: number;
  delta: number;
  direction: 'up' | 'down' | 'none';
}

/**
 * SmoothScroll class manages momentum-based scrolling with Lenis
 * and provides velocity tracking for skew effects and scroll-triggered animations.
 */
export class SmoothScroll {
  private lenis: Lenis | null = null;
  private velocity: VelocityData = {
    current: 0,
    previous: 0,
    delta: 0,
    direction: 'none',
  };
  private scrollTriggers: Map<string, ScrollTrigger> = new Map();
  private rafId: number | null = null;
  private isEnabled: boolean = true;
  private onScrollCallbacks: Set<
    (data: { scroll: number; velocity: number }) => void
  > = new Set();
  private onVelocityCallbacks: Set<(velocity: VelocityData) => void> =
    new Set();

  constructor(config: SmoothScrollConfig = {}) {
    if (typeof window === 'undefined') {
      return; // Skip initialization on server
    }

    this.initialize(config);
  }

  /**
   * Initialize Lenis with configuration
   * Requirements: 33.1, 33.2, 33.3, 37.3
   */
  private initialize(config: SmoothScrollConfig): void {
    const defaultConfig: SmoothScrollConfig = {
      lerp: 0.1, // Requirement 33.1: 0.1 lerp value for smooth interpolation
      wheelMultiplier: 1.2, // Requirement 33.2: 1.2 wheel multiplier for scroll sensitivity
      touchMultiplier: 2.0, // Requirement 33.3: 2.0 touch multiplier for mobile sensitivity
      duration: 1.2, // Requirement 37.1: 1.2 seconds duration for scroll animation
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Requirement 37.2: exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false, // Disabled by default for better mobile performance
      infinite: false,
    };

    const mergedConfig = { ...defaultConfig, ...config };

    this.lenis = new Lenis({
      lerp: mergedConfig.lerp,
      duration: mergedConfig.duration,
      easing: mergedConfig.easing,
      orientation: mergedConfig.orientation,
      gestureOrientation: mergedConfig.gestureOrientation,
      smoothWheel: mergedConfig.smoothWheel,
      wheelMultiplier: mergedConfig.wheelMultiplier,
      touchMultiplier: mergedConfig.touchMultiplier,
      infinite: mergedConfig.infinite,
    });

    this.setupEventListeners();
    this.start();
  }

  /**
   * Set up event listeners for scroll and velocity tracking
   * Requirements: 6.2, 33.6, 37.5
   */
  private setupEventListeners(): void {
    if (!this.lenis) return;

    this.lenis.on('scroll', (e: any) => {
      // Update velocity tracking
      // Requirement 37.5: Monitor scroll speed for skew effects
      this.velocity.previous = this.velocity.current;
      this.velocity.current = e.velocity || 0;
      this.velocity.delta = this.velocity.current - this.velocity.previous;

      // Determine scroll direction
      if (this.velocity.current > 0.01) {
        this.velocity.direction = 'down';
      } else if (this.velocity.current < -0.01) {
        this.velocity.direction = 'up';
      } else {
        this.velocity.direction = 'none';
      }

      // Notify scroll callbacks
      this.onScrollCallbacks.forEach((callback) => {
        callback({
          scroll: e.scroll || 0,
          velocity: this.velocity.current,
        });
      });

      // Notify velocity callbacks
      this.onVelocityCallbacks.forEach((callback) => {
        callback({ ...this.velocity });
      });

      // Check scroll triggers
      this.checkScrollTriggers(e.scroll || 0);
    });
  }

  /**
   * Start the animation loop
   */
  public start(): void {
    if (!this.lenis || this.rafId !== null) return;

    const raf = (time: number) => {
      if (!this.isEnabled || !this.lenis) return;

      this.lenis.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };

    this.rafId = requestAnimationFrame(raf);
  }

  /**
   * Stop the animation loop
   */
  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Destroy the smooth scroll instance
   */
  public destroy(): void {
    this.stop();

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }

    this.scrollTriggers.clear();
    this.onScrollCallbacks.clear();
    this.onVelocityCallbacks.clear();
  }

  /**
   * Enable smooth scrolling
   */
  public enable(): void {
    this.isEnabled = true;
    this.start();
  }

  /**
   * Disable smooth scrolling
   */
  public disable(): void {
    this.isEnabled = false;
    this.stop();
  }

  /**
   * Scroll to a specific position
   * @param target - Target scroll position or element
   * @param options - Scroll options
   */
  public scrollTo(
    target: number | string | HTMLElement,
    options?: {
      offset?: number;
      duration?: number;
      easing?: (t: number) => number;
      immediate?: boolean;
      lock?: boolean;
      onComplete?: () => void;
    }
  ): void {
    if (!this.lenis) return;

    this.lenis.scrollTo(target, options);
  }

  /**
   * Get current scroll position
   */
  public getScroll(): number {
    return this.lenis?.scroll || 0;
  }

  /**
   * Get current velocity data
   * Requirement 6.2, 33.6: Velocity tracking for skew effects
   */
  public getVelocity(): VelocityData {
    return { ...this.velocity };
  }

  /**
   * Get velocity multiplied by skew factor
   * Requirement 33.6: Apply skewY transformation with velocity × 0.1 multiplier
   */
  public getSkewValue(): number {
    return this.velocity.current * 0.1;
  }

  /**
   * Register a callback for scroll events
   */
  public onScroll(
    callback: (data: { scroll: number; velocity: number }) => void
  ): () => void {
    this.onScrollCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.onScrollCallbacks.delete(callback);
    };
  }

  /**
   * Register a callback for velocity changes
   */
  public onVelocity(callback: (velocity: VelocityData) => void): () => void {
    this.onVelocityCallbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.onVelocityCallbacks.delete(callback);
    };
  }

  /**
   * Add a scroll trigger
   * Requirement: Scroll-triggered animation system
   */
  public addScrollTrigger(trigger: ScrollTrigger): void {
    this.scrollTriggers.set(trigger.id, trigger);
  }

  /**
   * Remove a scroll trigger
   */
  public removeScrollTrigger(id: string): void {
    this.scrollTriggers.delete(id);
  }

  /**
   * Check scroll triggers and fire callbacks
   */
  private checkScrollTriggers(scroll: number): void {
    this.scrollTriggers.forEach((trigger) => {
      const { start, end, onEnter, onLeave, onProgress } = trigger;

      // Check if element is in viewport
      if (trigger.element) {
        const rect = trigger.element.getBoundingClientRect();
        const elementTop = scroll + rect.top;
        const elementBottom = elementTop + rect.height;
        const viewportHeight = window.innerHeight;

        // Calculate if element is in view
        const isInView =
          elementTop < scroll + viewportHeight && elementBottom > scroll;

        // Fire enter/leave callbacks
        const wasInView = trigger.element.dataset.inView === 'true';

        if (isInView && !wasInView) {
          trigger.element.dataset.inView = 'true';
          onEnter?.();
        } else if (!isInView && wasInView) {
          trigger.element.dataset.inView = 'false';
          onLeave?.();
        }

        // Calculate progress
        if (onProgress && isInView) {
          const progress = Math.max(
            0,
            Math.min(
              1,
              (scroll + viewportHeight - elementTop) /
                (viewportHeight + rect.height)
            )
          );
          onProgress(progress);
        }
      } else {
        // Position-based trigger
        if (scroll >= start && scroll <= end) {
          const progress = (scroll - start) / (end - start);
          onProgress?.(progress);
        }
      }
    });
  }

  /**
   * Get the Lenis instance for advanced usage
   */
  public getInstance(): Lenis | null {
    return this.lenis;
  }
}

/**
 * Create a singleton instance for global use
 */
let globalSmoothScroll: SmoothScroll | null = null;

export function initSmoothScroll(config?: SmoothScrollConfig): SmoothScroll {
  if (typeof window === 'undefined') {
    return null as any;
  }

  if (!globalSmoothScroll) {
    globalSmoothScroll = new SmoothScroll(config);
  }

  return globalSmoothScroll;
}

export function getSmoothScroll(): SmoothScroll | null {
  return globalSmoothScroll;
}

export function destroySmoothScroll(): void {
  if (globalSmoothScroll) {
    globalSmoothScroll.destroy();
    globalSmoothScroll = null;
  }
}
