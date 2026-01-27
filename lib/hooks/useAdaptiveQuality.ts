/**
 * React Hook for Adaptive Quality
 * Provides easy access to adaptive quality settings in React components
 */

'use client';

import { useState, useEffect } from 'react';
import {
  getAdaptiveQualityEngine,
  QualitySettings,
  QualityLevel,
} from '../utils/adaptiveQuality';

export function useAdaptiveQuality() {
  const [settings, setSettings] = useState<QualitySettings>({
    level: 'medium',
    particleCount: 2500,
    useWebGL: false,
    use3DTransforms: true,
    useBloom: false,
    useMotionBlur: false,
    shadowQuality: 'low',
    textureQuality: 'medium',
    targetFPS: 50,
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const engine = getAdaptiveQualityEngine();

    // Initialize engine
    engine.initialize().then(() => {
      setSettings(engine.getQualitySettings());
      setIsInitialized(true);
    });

    // Subscribe to quality changes
    const unsubscribe = engine.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const setQuality = (level: QualityLevel) => {
    const engine = getAdaptiveQualityEngine();
    engine.setManualOverride(level);
  };

  const setPerformanceMode = (enabled: boolean) => {
    const engine = getAdaptiveQualityEngine();
    engine.setPerformanceMode(enabled);
  };

  const resetToAuto = () => {
    const engine = getAdaptiveQualityEngine();
    engine.setManualOverride(null);
  };

  return {
    settings,
    isInitialized,
    setQuality,
    setPerformanceMode,
    resetToAuto,
  };
}
