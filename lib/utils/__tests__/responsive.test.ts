/**
 * Property-Based Tests for Responsive Design System
 * Feature: rising-dot-website, Property 10: Responsive Particle Count Adaptation
 * Validates: Requirements 20.1, 20.2, 20.3
 */

import fc from 'fast-check';
import {
  getDeviceType,
  getAdaptiveParticleCount,
  getTargetFPS,
  shouldUseWebGL,
  getAnimationStrategy,
  BREAKPOINTS,
} from '../responsive';

describe('Responsive Design System - Property Tests', () => {
  describe('Property 10: Responsive Particle Count Adaptation', () => {
    test('particle count adapts correctly to viewport width', () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 3840 }), (viewportWidth) => {
          const particleCount = getAdaptiveParticleCount(viewportWidth);

          if (viewportWidth >= BREAKPOINTS.desktop) {
            // Desktop: >1024px should have 5000 particles
            expect(particleCount).toBe(5000);
          } else if (viewportWidth >= BREAKPOINTS.mobile) {
            // Tablet: 768-1024px should have 2500 particles
            expect(particleCount).toBe(2500);
          } else {
            // Mobile: <768px should have 500 particles
            expect(particleCount).toBe(500);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('device type classification is consistent', () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 3840 }), (viewportWidth) => {
          const deviceType = getDeviceType(viewportWidth);

          // Device type should be one of the three valid types
          expect(['mobile', 'tablet', 'desktop']).toContain(deviceType);

          // Verify boundaries
          if (viewportWidth < BREAKPOINTS.mobile) {
            expect(deviceType).toBe('mobile');
          } else if (viewportWidth < BREAKPOINTS.desktop) {
            expect(deviceType).toBe('tablet');
          } else {
            expect(deviceType).toBe('desktop');
          }
        }),
        { numRuns: 100 }
      );
    });

    test('particle count is always positive and reasonable', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 10000 }), (viewportWidth) => {
          const particleCount = getAdaptiveParticleCount(viewportWidth);

          // Particle count should always be positive
          expect(particleCount).toBeGreaterThan(0);

          // Particle count should be one of the three valid values
          expect([500, 2500, 5000]).toContain(particleCount);

          // Particle count should never exceed desktop maximum
          expect(particleCount).toBeLessThanOrEqual(5000);
        }),
        { numRuns: 100 }
      );
    });

    test('target FPS matches device capabilities', () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 3840 }), (viewportWidth) => {
          const deviceType = getDeviceType(viewportWidth);
          const targetFPS = getTargetFPS(deviceType);

          // FPS should match requirements
          if (deviceType === 'desktop') {
            expect(targetFPS).toBe(60);
          } else if (deviceType === 'tablet') {
            expect(targetFPS).toBe(50);
          } else {
            expect(targetFPS).toBe(45);
          }

          // FPS should always be reasonable
          expect(targetFPS).toBeGreaterThanOrEqual(30);
          expect(targetFPS).toBeLessThanOrEqual(60);
        }),
        { numRuns: 100 }
      );
    });

    test('WebGL usage is appropriate for device type', () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 3840 }), (viewportWidth) => {
          const deviceType = getDeviceType(viewportWidth);
          const useWebGL = shouldUseWebGL(deviceType);

          // Only desktop should use WebGL
          if (deviceType === 'desktop') {
            expect(useWebGL).toBe(true);
          } else {
            expect(useWebGL).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    test('animation strategy matches device capabilities', () => {
      fc.assert(
        fc.property(fc.integer({ min: 320, max: 3840 }), (viewportWidth) => {
          const deviceType = getDeviceType(viewportWidth);
          const strategy = getAnimationStrategy(deviceType);

          // Strategy should match device type
          if (deviceType === 'desktop') {
            expect(strategy).toBe('3d');
          } else if (deviceType === 'tablet') {
            expect(strategy).toBe('2d');
          } else {
            expect(strategy).toBe('css');
          }

          // Strategy should be one of the valid options
          expect(['css', '2d', '3d']).toContain(strategy);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('exact breakpoint boundaries are handled correctly', () => {
      // Test exact mobile breakpoint (768px)
      expect(getDeviceType(767)).toBe('mobile');
      expect(getDeviceType(768)).toBe('tablet');
      expect(getAdaptiveParticleCount(767)).toBe(500);
      expect(getAdaptiveParticleCount(768)).toBe(2500);

      // Test exact desktop breakpoint (1024px)
      expect(getDeviceType(1023)).toBe('tablet');
      expect(getDeviceType(1024)).toBe('desktop');
      expect(getAdaptiveParticleCount(1023)).toBe(2500);
      expect(getAdaptiveParticleCount(1024)).toBe(5000);
    });

    test('extreme viewport widths are handled gracefully', () => {
      // Very small viewport
      expect(getAdaptiveParticleCount(320)).toBe(500);
      expect(getDeviceType(320)).toBe('mobile');

      // Very large viewport
      expect(getAdaptiveParticleCount(3840)).toBe(5000);
      expect(getDeviceType(3840)).toBe('desktop');
    });

    test('particle count reduction maintains performance budget', () => {
      const mobileCount = getAdaptiveParticleCount(375);
      const tabletCount = getAdaptiveParticleCount(768);
      const desktopCount = getAdaptiveParticleCount(1920);

      // Each tier should be significantly less than the next
      expect(mobileCount).toBeLessThan(tabletCount);
      expect(tabletCount).toBeLessThan(desktopCount);

      // Ratios should be reasonable (5x between mobile and tablet, 2x between tablet and desktop)
      expect(tabletCount / mobileCount).toBe(5);
      expect(desktopCount / tabletCount).toBe(2);
    });
  });
});
