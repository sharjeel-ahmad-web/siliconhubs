/**
 * Adaptive Quality Engine
 * Automatically adjusts animation quality based on device capabilities and performance
 */

import { getDeviceCapabilities, DeviceCapabilities } from './deviceDetection';
import {
  getPerformanceMonitor,
  PerformanceMetrics,
} from './performanceMonitor';
import { getDeviceType } from './responsive';

export type QualityLevel = 'low' | 'medium' | 'high';

export interface QualitySettings {
  level: QualityLevel;
  particleCount: number;
  useWebGL: boolean;
  use3DTransforms: boolean;
  useBloom: boolean;
  useMotionBlur: boolean;
  shadowQuality: 'none' | 'low' | 'high';
  textureQuality: 'low' | 'medium' | 'high';
  targetFPS: number;
}

export interface AdaptiveQualityConfig {
  autoAdjust: boolean;
  fpsThreshold: number; // Reduce quality if FPS drops below this
  manualOverride?: QualityLevel;
  performanceMode: boolean;
}

export class AdaptiveQualityEngine {
  private currentQuality: QualityLevel = 'high';
  private config: AdaptiveQualityConfig;
  private capabilities: DeviceCapabilities | null = null;
  private performanceMonitor = getPerformanceMonitor();
  private listeners: Set<(settings: QualitySettings) => void> = new Set();
  private unsubscribePerformance: (() => void) | null = null;

  constructor(config: Partial<AdaptiveQualityConfig> = {}) {
    this.config = {
      autoAdjust: true,
      fpsThreshold: 45,
      performanceMode: false,
      ...config,
    };

    // Load saved preference from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quality-preference');
      if (saved && ['low', 'medium', 'high'].includes(saved)) {
        this.config.manualOverride = saved as QualityLevel;
      }
    }
  }

  /**
   * Initialize the adaptive quality engine
   */
  async initialize(): Promise<void> {
    // Detect device capabilities
    this.capabilities = await getDeviceCapabilities();

    // Determine initial quality level
    this.currentQuality = this.determineInitialQuality();

    // Start performance monitoring if auto-adjust is enabled
    if (this.config.autoAdjust && !this.config.manualOverride) {
      this.performanceMonitor.start();
      this.unsubscribePerformance = this.performanceMonitor.subscribe(
        this.handlePerformanceUpdate.bind(this)
      );
    }

    // Notify listeners of initial settings
    this.notifyListeners();
  }

  /**
   * Determine initial quality level based on device capabilities
   */
  private determineInitialQuality(): QualityLevel {
    // Manual override takes precedence
    if (this.config.manualOverride) {
      return this.config.manualOverride;
    }

    // Performance mode forces low quality
    if (this.config.performanceMode) {
      return 'low';
    }

    if (!this.capabilities) {
      return 'medium';
    }

    const { gpuPower, memory, isBatterySaver, connectionSpeed, supportsWebGL } =
      this.capabilities;

    // Battery saver mode forces low quality
    if (isBatterySaver) {
      return 'low';
    }

    // Low memory devices get low quality
    if (memory < 2) {
      return 'low';
    }

    // Slow connection gets low quality
    if (connectionSpeed === '2g') {
      return 'low';
    }

    // No WebGL support limits to medium
    if (!supportsWebGL) {
      return 'medium';
    }

    // High-end devices get high quality
    if (gpuPower === 'high' && memory >= 4) {
      return 'high';
    }

    // Medium-end devices get medium quality
    if (gpuPower === 'medium' || memory >= 2) {
      return 'medium';
    }

    // Default to low for everything else
    return 'low';
  }

  /**
   * Handle performance updates and adjust quality if needed
   */
  private handlePerformanceUpdate(metrics: PerformanceMetrics): void {
    if (!this.config.autoAdjust || this.config.manualOverride) {
      return;
    }

    const { averageFPS } = metrics;

    // If FPS drops below threshold, reduce quality
    if (averageFPS < this.config.fpsThreshold) {
      if (this.currentQuality === 'high') {
        this.setQuality('medium');
      } else if (this.currentQuality === 'medium') {
        this.setQuality('low');
      }
    }

    // If FPS is consistently high, we could increase quality
    // But we'll be conservative and not auto-increase
  }

  /**
   * Set quality level manually
   */
  setQuality(level: QualityLevel): void {
    if (this.currentQuality === level) return;

    this.currentQuality = level;
    this.notifyListeners();
  }

  /**
   * Set manual quality override
   */
  setManualOverride(level: QualityLevel | null): void {
    this.config.manualOverride = level ?? undefined;

    if (level) {
      this.setQuality(level);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('quality-preference', level);
      }
    } else {
      // Remove override and re-determine quality
      if (typeof window !== 'undefined') {
        localStorage.removeItem('quality-preference');
      }
      this.currentQuality = this.determineInitialQuality();
      this.notifyListeners();
    }
  }

  /**
   * Toggle performance mode
   */
  setPerformanceMode(enabled: boolean): void {
    this.config.performanceMode = enabled;

    if (enabled) {
      this.setQuality('low');
    } else {
      this.currentQuality = this.determineInitialQuality();
      this.notifyListeners();
    }
  }

  /**
   * Get current quality settings
   */
  getQualitySettings(): QualitySettings {
    const viewportWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1920;
    const deviceType = getDeviceType(viewportWidth);

    switch (this.currentQuality) {
      case 'high':
        return {
          level: 'high',
          particleCount: 5000,
          useWebGL: true,
          use3DTransforms: true,
          useBloom: true,
          useMotionBlur: true,
          shadowQuality: 'high',
          textureQuality: 'high',
          targetFPS: 60,
        };

      case 'medium':
        return {
          level: 'medium',
          particleCount: 2500,
          useWebGL: deviceType !== 'mobile',
          use3DTransforms: true,
          useBloom: false,
          useMotionBlur: false,
          shadowQuality: 'low',
          textureQuality: 'medium',
          targetFPS: 50,
        };

      case 'low':
        return {
          level: 'low',
          particleCount: 500,
          useWebGL: false,
          use3DTransforms: false,
          useBloom: false,
          useMotionBlur: false,
          shadowQuality: 'none',
          textureQuality: 'low',
          targetFPS: 45,
        };
    }
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): QualityLevel {
    return this.currentQuality;
  }

  /**
   * Subscribe to quality changes
   */
  subscribe(callback: (settings: QualitySettings) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of quality changes
   */
  private notifyListeners(): void {
    const settings = this.getQualitySettings();
    this.listeners.forEach((callback) => callback(settings));
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.unsubscribePerformance) {
      this.unsubscribePerformance();
      this.unsubscribePerformance = null;
    }
    this.performanceMonitor.stop();
    this.listeners.clear();
  }
}

// Singleton instance
let adaptiveQualityEngineInstance: AdaptiveQualityEngine | null = null;

export function getAdaptiveQualityEngine(): AdaptiveQualityEngine {
  if (!adaptiveQualityEngineInstance) {
    adaptiveQualityEngineInstance = new AdaptiveQualityEngine();
  }
  return adaptiveQualityEngineInstance;
}
