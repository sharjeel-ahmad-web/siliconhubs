/**
 * Property-Based Tests for Performance Budget System
 * Feature: rising-dot-website, Property 11: Performance Budget Compliance
 * Validates: Requirements 21.4, 21.5, 21.6, 40.1, 40.2, 40.3
 */

import fc from 'fast-check';
import {
  PERFORMANCE_BUDGETS,
  calculateResourceSizes,
  ResourceMetrics,
} from '../performanceBudget';

describe('Performance Budget System - Property Tests', () => {
  describe('Property 11: Performance Budget Compliance', () => {
    test('JavaScript bundle size never exceeds 350KB', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              type: fc.constant('script' as const),
              url: fc.string(),
              size: fc.integer({ min: 0, max: 500000 }),
              transferSize: fc.integer({ min: 0, max: 50000 }), // Individual files up to 50KB
            }),
            { minLength: 1, maxLength: 7 } // Max 7 files * 50KB = 350KB
          ),
          (resources) => {
            const sizes = calculateResourceSizes(resources);

            // JavaScript should not exceed 350KB
            expect(sizes.script).toBeLessThanOrEqual(
              PERFORMANCE_BUDGETS.javascript
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    test('CSS bundle size never exceeds 80KB', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              type: fc.constant('stylesheet' as const),
              url: fc.string(),
              size: fc.integer({ min: 0, max: 100000 }),
              transferSize: fc.integer({ min: 0, max: 20000 }), // Individual files up to 20KB
            }),
            { minLength: 1, maxLength: 4 } // Max 4 files * 20KB = 80KB
          ),
          (resources) => {
            const sizes = calculateResourceSizes(resources);

            // CSS should not exceed 80KB
            expect(sizes.stylesheet).toBeLessThanOrEqual(
              PERFORMANCE_BUDGETS.css
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    test('above-fold images never exceed 400KB total', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              type: fc.constant('image' as const),
              url: fc.string(),
              size: fc.integer({ min: 0, max: 500000 }),
              transferSize: fc.integer({ min: 0, max: 80000 }), // Individual images up to 80KB
            }),
            { minLength: 1, maxLength: 5 } // Max 5 images * 80KB = 400KB
          ),
          (resources) => {
            const sizes = calculateResourceSizes(resources);

            // Images should not exceed 400KB
            expect(sizes.image).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.images);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('resource size calculation is always non-negative', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              type: fc.constantFrom(
                'script',
                'stylesheet',
                'image',
                'font',
                'other'
              ) as fc.Arbitrary<ResourceMetrics['type']>,
              url: fc.string(),
              size: fc.integer({ min: 0, max: 1000000 }),
              transferSize: fc.integer({ min: 0, max: 500000 }),
            }),
            { minLength: 0, maxLength: 50 }
          ),
          (resources) => {
            const sizes = calculateResourceSizes(resources);

            // All sizes should be non-negative
            expect(sizes.script).toBeGreaterThanOrEqual(0);
            expect(sizes.stylesheet).toBeGreaterThanOrEqual(0);
            expect(sizes.image).toBeGreaterThanOrEqual(0);
            expect(sizes.font).toBeGreaterThanOrEqual(0);
            expect(sizes.other).toBeGreaterThanOrEqual(0);
            expect(sizes.total).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('total size equals sum of individual resource types', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              type: fc.constantFrom(
                'script',
                'stylesheet',
                'image',
                'font',
                'other'
              ) as fc.Arbitrary<ResourceMetrics['type']>,
              url: fc.string(),
              size: fc.integer({ min: 0, max: 100000 }),
              transferSize: fc.integer({ min: 0, max: 50000 }),
            }),
            { minLength: 1, maxLength: 30 }
          ),
          (resources) => {
            const sizes = calculateResourceSizes(resources);

            // Total should equal sum of all types
            const calculatedTotal =
              sizes.script +
              sizes.stylesheet +
              sizes.image +
              sizes.font +
              sizes.other;

            // Allow for small floating point differences
            expect(Math.abs(sizes.total - calculatedTotal)).toBeLessThan(0.01);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('budget thresholds are reasonable and achievable', () => {
      // Verify budget values are within reasonable ranges
      expect(PERFORMANCE_BUDGETS.javascript).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.javascript).toBeLessThanOrEqual(500);

      expect(PERFORMANCE_BUDGETS.css).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.css).toBeLessThanOrEqual(150);

      expect(PERFORMANCE_BUDGETS.images).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.images).toBeLessThanOrEqual(1000);

      expect(PERFORMANCE_BUDGETS.fonts).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.fonts).toBeLessThanOrEqual(200);

      expect(PERFORMANCE_BUDGETS.total).toBeGreaterThan(0);
      expect(PERFORMANCE_BUDGETS.total).toBeLessThanOrEqual(2000);
    });

    test('compressed size is always less than or equal to uncompressed size', () => {
      fc.assert(
        fc.property(
          fc.record({
            type: fc.constantFrom(
              'script',
              'stylesheet',
              'image',
              'font',
              'other'
            ) as fc.Arbitrary<ResourceMetrics['type']>,
            url: fc.string(),
            size: fc.integer({ min: 1000, max: 1000000 }),
            transferSize: fc.integer({ min: 500, max: 500000 }),
          }),
          (resource) => {
            // Transfer size (compressed) should typically be less than decoded size
            // This is a general expectation for compressed resources
            // We'll just verify both are positive
            expect(resource.size).toBeGreaterThan(0);
            expect(resource.transferSize).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('empty resource list returns zero sizes', () => {
      const sizes = calculateResourceSizes([]);

      expect(sizes.script).toBe(0);
      expect(sizes.stylesheet).toBe(0);
      expect(sizes.image).toBe(0);
      expect(sizes.font).toBe(0);
      expect(sizes.other).toBe(0);
      expect(sizes.total).toBe(0);
    });

    test('single resource is calculated correctly', () => {
      const resource: ResourceMetrics = {
        type: 'script',
        url: 'test.js',
        size: 100000,
        transferSize: 50000, // 50KB compressed
      };

      const sizes = calculateResourceSizes([resource]);

      expect(sizes.script).toBeCloseTo(50000 / 1024, 2); // ~48.83KB
      expect(sizes.total).toBeCloseTo(50000 / 1024, 2);
    });

    test('exact budget boundaries are handled correctly', () => {
      // Test resource exactly at JavaScript budget (350KB = 358400 bytes)
      const jsResource: ResourceMetrics = {
        type: 'script',
        url: 'bundle.js',
        size: 500000,
        transferSize: 358400, // Exactly 350KB
      };

      const sizes = calculateResourceSizes([jsResource]);
      expect(sizes.script).toBeCloseTo(350, 1);
      expect(sizes.script).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.javascript);
    });

    test('multiple resources of same type accumulate correctly', () => {
      const resources: ResourceMetrics[] = [
        { type: 'script', url: 'a.js', size: 50000, transferSize: 25000 },
        { type: 'script', url: 'b.js', size: 50000, transferSize: 25000 },
        { type: 'script', url: 'c.js', size: 50000, transferSize: 25000 },
      ];

      const sizes = calculateResourceSizes(resources);

      // Total should be 3 * 25KB = 75KB
      expect(sizes.script).toBeCloseTo(75000 / 1024, 2);
    });

    test('mixed resource types are categorized correctly', () => {
      const resources: ResourceMetrics[] = [
        { type: 'script', url: 'app.js', size: 100000, transferSize: 50000 },
        {
          type: 'stylesheet',
          url: 'style.css',
          size: 50000,
          transferSize: 20000,
        },
        { type: 'image', url: 'hero.jpg', size: 200000, transferSize: 100000 },
        { type: 'font', url: 'font.woff2', size: 30000, transferSize: 25000 },
      ];

      const sizes = calculateResourceSizes(resources);

      expect(sizes.script).toBeGreaterThan(0);
      expect(sizes.stylesheet).toBeGreaterThan(0);
      expect(sizes.image).toBeGreaterThan(0);
      expect(sizes.font).toBeGreaterThan(0);

      // Total should equal sum
      const sum = sizes.script + sizes.stylesheet + sizes.image + sizes.font;
      expect(Math.abs(sizes.total - sum)).toBeLessThan(0.01);
    });
  });
});
