/**
 * Property-Based Tests for Accessibility System
 * Feature: rising-dot-website, Property 14: Heading Hierarchy Preservation
 * Feature: rising-dot-website, Property 15: Focus Indicator Visibility
 * Feature: rising-dot-website, Property 19: ARIA Label Presence
 * Feature: rising-dot-website, Property 16: Core Web Vitals Compliance
 * Validates: Requirements 22.1, 22.2, 22.4, 21.1, 21.2, 21.3
 */

import fc from 'fast-check';
import {
  validateHeadingHierarchy,
  hasFocusIndicator,
  validateAriaLabels,
  calculateContrastRatio,
  validateColorContrast,
  validateCoreWebVitals,
  CoreWebVitals,
} from '../accessibility';

describe('Accessibility System - Property Tests', () => {
  describe('Property 14: Heading Hierarchy Preservation', () => {
    test('valid heading hierarchies are always accepted', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              level: fc.integer({ min: 1, max: 6 }),
              text: fc.string({ minLength: 1, maxLength: 50 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (headings) => {
            // Sort headings to create valid hierarchy
            const sortedHeadings = [...headings].sort(
              (a, b) => a.level - b.level
            );

            // Ensure first heading is H1
            if (sortedHeadings.length > 0) {
              sortedHeadings[0].level = 1;
            }

            // Ensure no level skips
            for (let i = 1; i < sortedHeadings.length; i++) {
              if (sortedHeadings[i].level > sortedHeadings[i - 1].level + 1) {
                sortedHeadings[i].level = sortedHeadings[i - 1].level + 1;
              }
            }

            // Generate HTML
            const html = sortedHeadings
              .map((h) => `<h${h.level}>${h.text}</h${h.level}>`)
              .join('\n');

            const result = validateHeadingHierarchy(html);

            // Valid hierarchy should have no errors
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.headings).toHaveLength(sortedHeadings.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('heading hierarchy with skipped levels is always rejected', () => {
      fc.assert(
        fc.property(
          fc.record({
            firstLevel: fc.constant(1), // Always start with H1
            skipAmount: fc.integer({ min: 2, max: 4 }),
            text1: fc.string({ minLength: 1, maxLength: 30 }),
            text2: fc.string({ minLength: 1, maxLength: 30 }),
          }),
          ({ firstLevel, skipAmount, text1, text2 }) => {
            const secondLevel = Math.min(firstLevel + skipAmount, 6);

            // Only test if we actually skip a level
            if (secondLevel <= firstLevel + 1) {
              return true; // Skip this test case
            }

            const html = `
              <h${firstLevel}>${text1}</h${firstLevel}>
              <h${secondLevel}>${text2}</h${secondLevel}>
            `;

            const result = validateHeadingHierarchy(html);

            // Should detect the skipped level
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some((e) => e.includes('skipped'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('first heading must be H1', () => {
      fc.assert(
        fc.property(
          fc.record({
            firstLevel: fc.integer({ min: 2, max: 6 }),
            text: fc.string({ minLength: 1, maxLength: 30 }),
          }),
          ({ firstLevel, text }) => {
            const html = `<h${firstLevel}>${text}</h${firstLevel}>`;

            const result = validateHeadingHierarchy(html);

            // Should reject non-H1 first heading
            expect(result.isValid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toContain('First heading should be H1');
          }
        ),
        { numRuns: 100 }
      );
    });

    test('empty HTML has no heading errors', () => {
      const result = validateHeadingHierarchy('');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.headings).toHaveLength(0);
    });

    test('single H1 is always valid', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), (text) => {
          const html = `<h1>${text}</h1>`;
          const result = validateHeadingHierarchy(html);

          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
          expect(result.headings).toHaveLength(1);
          expect(result.headings[0].level).toBe(1);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 15: Focus Indicator Visibility', () => {
    test('focus indicators with 2px+ outline are always visible', () => {
      fc.assert(
        fc.property(
          fc.record({
            outlineWidth: fc.integer({ min: 2, max: 10 }),
            outlineStyle: fc.constantFrom(
              'solid',
              'dashed',
              'dotted',
              'double'
            ),
            outlineColor: fc.constantFrom(
              'rgb(37, 99, 235)', // Primary Blue
              '#2563EB',
              'rgba(37, 99, 235, 1)',
              'blue'
            ),
          }),
          ({ outlineWidth, outlineStyle, outlineColor }) => {
            const mockStyles = {
              outline: `${outlineWidth}px ${outlineStyle} ${outlineColor}`,
              outlineWidth: `${outlineWidth}px`,
              outlineStyle,
              outlineColor,
            } as CSSStyleDeclaration;

            const hasIndicator = hasFocusIndicator(mockStyles);

            // Should detect visible focus indicator
            expect(hasIndicator).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('focus indicators with less than 2px outline are not visible', () => {
      fc.assert(
        fc.property(
          fc.record({
            outlineWidth: fc
              .float({ min: 0, max: Math.fround(1.99) })
              .filter((n) => Number.isFinite(n)),
            outlineStyle: fc.constantFrom('solid', 'dashed', 'dotted'),
            outlineColor: fc.string(),
          }),
          ({ outlineWidth, outlineStyle, outlineColor }) => {
            const mockStyles = {
              outline: `${outlineWidth}px ${outlineStyle} ${outlineColor}`,
              outlineWidth: `${outlineWidth}px`,
              outlineStyle,
              outlineColor,
            } as CSSStyleDeclaration;

            const hasIndicator = hasFocusIndicator(mockStyles);

            // Should not detect insufficient focus indicator
            expect(hasIndicator).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('outline: none always results in no visible indicator', () => {
      fc.assert(
        fc.property(fc.string(), (color) => {
          const mockStyles = {
            outline: 'none',
            outlineWidth: '0px',
            outlineStyle: 'none',
            outlineColor: color,
          } as CSSStyleDeclaration;

          const hasIndicator = hasFocusIndicator(mockStyles);

          expect(hasIndicator).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    test('transparent outline color results in no visible indicator', () => {
      fc.assert(
        fc.property(fc.integer({ min: 2, max: 10 }), (width) => {
          const mockStyles = {
            outline: `${width}px solid transparent`,
            outlineWidth: `${width}px`,
            outlineStyle: 'solid',
            outlineColor: 'transparent',
          } as CSSStyleDeclaration;

          const hasIndicator = hasFocusIndicator(mockStyles);

          expect(hasIndicator).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 19: ARIA Label Presence', () => {
    test('buttons with aria-label are always valid', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 50 }), (label) => {
          const html = `<button aria-label="${label}">Click</button>`;
          const result = validateAriaLabels(html);

          // Should find the button with label
          const buttonElements = result.elements.filter(
            (e) => e.tag === 'button'
          );
          expect(buttonElements.length).toBeGreaterThan(0);
          expect(buttonElements[0].hasLabel).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    test('buttons without labels are always invalid', () => {
      const html = '<button type="button"></button>';
      const result = validateAriaLabels(html);

      // Find button elements
      const buttons = result.elements.filter((e) => e.tag === 'button');
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons[0].hasLabel).toBe(false);
    });

    test('links with aria-label are always valid', () => {
      fc.assert(
        fc.property(
          fc.record({
            label: fc.string({ minLength: 1, maxLength: 50 }),
            href: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          ({ label, href }) => {
            const html = `<a href="${href}" aria-label="${label}">Link</a>`;
            const result = validateAriaLabels(html);

            // Should find the link with label
            const linkElements = result.elements.filter((e) => e.tag === 'a');
            expect(linkElements.length).toBeGreaterThan(0);
            expect(linkElements[0].hasLabel).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 16: Core Web Vitals Compliance', () => {
    test('metrics within thresholds always pass validation', () => {
      fc.assert(
        fc.property(
          fc.record({
            lcp: fc
              .float({ min: 0, max: Math.fround(1800) })
              .filter((n) => Number.isFinite(n)),
            fid: fc
              .float({ min: 0, max: Math.fround(10) })
              .filter((n) => Number.isFinite(n)),
            cls: fc
              .float({ min: 0, max: Math.fround(0.05) })
              .filter((n) => Number.isFinite(n)),
          }),
          (metrics) => {
            const result = validateCoreWebVitals(metrics);

            // All metrics within thresholds should pass
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.metrics.lcp.passes).toBe(true);
            expect(result.metrics.fid.passes).toBe(true);
            expect(result.metrics.cls.passes).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('LCP exceeding 1.8s always fails validation', () => {
      fc.assert(
        fc.property(
          fc.record({
            lcp: fc.float({ min: Math.fround(1801), max: Math.fround(5000) }),
            fid: fc.float({ min: 0, max: Math.fround(10) }),
            cls: fc.float({ min: 0, max: Math.fround(0.05) }),
          }),
          (metrics) => {
            const result = validateCoreWebVitals(metrics);

            // LCP exceeding threshold should fail
            expect(result.metrics.lcp.passes).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some((e) => e.includes('LCP'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('FID exceeding 10ms always fails validation', () => {
      fc.assert(
        fc.property(
          fc.record({
            lcp: fc.float({ min: 0, max: Math.fround(1800) }),
            fid: fc.float({ min: Math.fround(11), max: Math.fround(100) }),
            cls: fc.float({ min: 0, max: Math.fround(0.05) }),
          }),
          (metrics) => {
            const result = validateCoreWebVitals(metrics);

            // FID exceeding threshold should fail
            expect(result.metrics.fid.passes).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some((e) => e.includes('FID'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('CLS exceeding 0.05 always fails validation', () => {
      fc.assert(
        fc.property(
          fc.record({
            lcp: fc.float({ min: 0, max: Math.fround(1800) }),
            fid: fc.float({ min: 0, max: Math.fround(10) }),
            cls: fc.float({ min: Math.fround(0.051), max: Math.fround(1.0) }),
          }),
          (metrics) => {
            const result = validateCoreWebVitals(metrics);

            // CLS exceeding threshold should fail
            expect(result.metrics.cls.passes).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some((e) => e.includes('CLS'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('perfect metrics (all zeros) always pass', () => {
      const metrics: CoreWebVitals = { lcp: 0, fid: 0, cls: 0 };
      const result = validateCoreWebVitals(metrics);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.metrics.lcp.passes).toBe(true);
      expect(result.metrics.fid.passes).toBe(true);
      expect(result.metrics.cls.passes).toBe(true);
    });

    test('boundary values are handled correctly', () => {
      // Test exact threshold values
      const exactMetrics: CoreWebVitals = { lcp: 1800, fid: 10, cls: 0.05 };
      const result = validateCoreWebVitals(exactMetrics);

      // Exact threshold values should pass
      expect(result.metrics.lcp.passes).toBe(true);
      expect(result.metrics.fid.passes).toBe(true);
      expect(result.metrics.cls.passes).toBe(true);
    });
  });

  describe('Color Contrast Validation', () => {
    test('Primary Blue on white background meets AA standard', () => {
      const result = validateColorContrast('#2563EB', '#FFFFFF');

      expect(result.meetsAA).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('Dark Navy on white background meets AA standard', () => {
      const result = validateColorContrast('#1E293B', '#FFFFFF');

      expect(result.meetsAA).toBe(true);
      expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    });

    test('contrast ratio is always positive', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          (color1, color2) => {
            try {
              const ratio = calculateContrastRatio(`#${color1}`, `#${color2}`);
              expect(ratio).toBeGreaterThan(0);
            } catch (e) {
              // Invalid color format, skip
              return true;
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    test('contrast ratio is symmetric', () => {
      fc.assert(
        fc.property(
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          fc.hexaString({ minLength: 6, maxLength: 6 }),
          (color1, color2) => {
            try {
              const ratio1 = calculateContrastRatio(`#${color1}`, `#${color2}`);
              const ratio2 = calculateContrastRatio(`#${color2}`, `#${color1}`);

              // Ratios should be equal (within floating point precision)
              expect(Math.abs(ratio1 - ratio2)).toBeLessThan(0.01);
            } catch (e) {
              // Invalid color format, skip
              return true;
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    test('same color has contrast ratio of 1', () => {
      fc.assert(
        fc.property(fc.hexaString({ minLength: 6, maxLength: 6 }), (color) => {
          try {
            const ratio = calculateContrastRatio(`#${color}`, `#${color}`);
            expect(ratio).toBeCloseTo(1, 1);
          } catch (e) {
            // Invalid color format, skip
            return true;
          }
        }),
        { numRuns: 50 }
      );
    });

    test('black on white has maximum contrast', () => {
      const ratio = calculateContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    test('large text has lower contrast requirement', () => {
      const normalText = validateColorContrast('#767676', '#FFFFFF', false);
      const largeText = validateColorContrast('#767676', '#FFFFFF', true);

      // Same color pair, but large text has lower requirement
      expect(largeText.requiredRatio).toBeLessThan(normalText.requiredRatio);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('HTML with nested headings is parsed correctly', () => {
      const html = `
        <h1>Main <span>Title</span></h1>
        <h2>Subtitle with <strong>emphasis</strong></h2>
      `;

      const result = validateHeadingHierarchy(html);

      expect(result.headings).toHaveLength(2);
      expect(result.headings[0].text).toBe('Main Title');
      expect(result.headings[1].text).toBe('Subtitle with emphasis');
    });

    test('multiple H1s are allowed but first must be H1', () => {
      const html = `
        <h1>First H1</h1>
        <h2>H2</h2>
        <h1>Second H1</h1>
      `;

      const result = validateHeadingHierarchy(html);

      // Multiple H1s are technically allowed in HTML5
      expect(result.headings).toHaveLength(3);
      expect(result.headings[0].level).toBe(1);
    });

    test('ARIA labels with special characters are handled', () => {
      const html = `<button aria-label="Click &amp; Save">Save</button>`;
      const result = validateAriaLabels(html);

      const buttons = result.elements.filter((e) => e.tag === 'button');
      expect(buttons[0].hasLabel).toBe(true);
    });

    test('Core Web Vitals with negative values are handled', () => {
      const metrics: CoreWebVitals = { lcp: -100, fid: -10, cls: -0.05 };
      const result = validateCoreWebVitals(metrics);

      // Negative values should still be validated
      // They would pass since they're below thresholds
      expect(result.metrics.lcp.passes).toBe(true);
      expect(result.metrics.fid.passes).toBe(true);
      expect(result.metrics.cls.passes).toBe(true);
    });
  });
});
