/**
 * Performance Monitoring System
 * Tracks FPS and performance metrics for adaptive quality adjustments
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  droppedFrames: number;
}

export class PerformanceMonitor {
  private frameCount: number = 0;
  private lastTime: number = 0;
  private fps: number = 60;
  private frameTimes: number[] = [];
  private readonly maxSamples: number = 60; // Track last 60 frames
  private animationFrameId: number | null = null;
  private callbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();

  constructor() {
    this.lastTime = performance.now();
  }

  /**
   * Start monitoring performance
   */
  start(): void {
    if (this.animationFrameId !== null) return;

    const measure = (currentTime: number) => {
      const deltaTime = currentTime - this.lastTime;
      this.lastTime = currentTime;

      // Calculate FPS
      if (deltaTime > 0) {
        const currentFPS = 1000 / deltaTime;
        this.frameTimes.push(currentFPS);

        // Keep only the last N samples
        if (this.frameTimes.length > this.maxSamples) {
          this.frameTimes.shift();
        }

        // Calculate average FPS
        this.fps =
          this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      }

      this.frameCount++;

      // Notify callbacks every 10 frames
      if (this.frameCount % 10 === 0) {
        const metrics = this.getMetrics();
        this.callbacks.forEach((callback) => callback(metrics));
      }

      this.animationFrameId = requestAnimationFrame(measure);
    };

    this.animationFrameId = requestAnimationFrame(measure);
  }

  /**
   * Stop monitoring performance
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const averageFPS =
      this.frameTimes.length > 0
        ? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
        : 60;

    const minFPS =
      this.frameTimes.length > 0 ? Math.min(...this.frameTimes) : 60;

    const maxFPS =
      this.frameTimes.length > 0 ? Math.max(...this.frameTimes) : 60;

    const droppedFrames = this.frameTimes.filter((fps) => fps < 30).length;

    return {
      fps: this.fps,
      frameTime: 1000 / this.fps,
      averageFPS,
      minFPS,
      maxFPS,
      droppedFrames,
    };
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    return this.fps;
  }

  /**
   * Subscribe to performance updates
   */
  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.frameCount = 0;
    this.frameTimes = [];
    this.fps = 60;
    this.lastTime = performance.now();
  }
}

// Singleton instance
let performanceMonitorInstance: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor();
  }
  return performanceMonitorInstance;
}
