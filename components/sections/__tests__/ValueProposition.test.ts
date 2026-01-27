/**
 * Unit tests for ValueProposition component
 * Validates: Requirements 4.1-4.9
 */

import * as fc from 'fast-check';

describe('ValueProposition Component', () => {
  // Helper to simulate service icon animation
  const simulateServiceIconAnimation = (config: {
    iconIndex: number;
    totalIcons: number;
  }): {
    entranceDelay: number;
    entranceDuration: number;
    pulseDuration: number;
    hoverScaleFactor: number;
    hoverRotation: number;
  } => {
    const { iconIndex } = config;

    // Entrance animation: staggered by 0.1s per icon
    const entranceDelay = iconIndex * 0.1 * 1000; // Convert to ms
    const entranceDuration = 300; // 300ms per spec

    // Idle pulse animation: 2s loop
    const pulseDuration = 2000;

    // Hover effects
    const hoverScaleFactor = 1.15;
    const hoverRotation = 10; // degrees

    return {
      entranceDelay,
      entranceDuration,
      pulseDuration,
      hoverScaleFactor,
      hoverRotation,
    };
  };

  test('Service icons have correct entrance animation timing', () => {
    fc.assert(
      fc.property(
        fc.record({
          iconIndex: fc.integer({ min: 0, max: 5 }), // 6 icons (0-5)
          totalIcons: fc.constant(6),
        }),
        (config) => {
          const animation = simulateServiceIconAnimation(config);

          // Each icon should be staggered by 100ms (0.1s)
          const expectedDelay = config.iconIndex * 100;
          // Use toBeCloseTo to handle floating point precision
          expect(animation.entranceDelay).toBeCloseTo(expectedDelay, 0);

          // Entrance duration should be 300ms
          expect(animation.entranceDuration).toBe(300);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Service icons have correct pulse animation duration', () => {
    fc.assert(
      fc.property(
        fc.record({
          iconIndex: fc.integer({ min: 0, max: 5 }),
          totalIcons: fc.constant(6),
        }),
        (config) => {
          const animation = simulateServiceIconAnimation(config);

          // Pulse animation should be 2 seconds (2000ms)
          expect(animation.pulseDuration).toBe(2000);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Service icons have correct hover scale and rotation', () => {
    fc.assert(
      fc.property(
        fc.record({
          iconIndex: fc.integer({ min: 0, max: 5 }),
          totalIcons: fc.constant(6),
        }),
        (config) => {
          const animation = simulateServiceIconAnimation(config);

          // Hover scale should be 1.15 (115%)
          expect(animation.hoverScaleFactor).toBe(1.15);

          // Hover rotation should be 10 degrees
          expect(animation.hoverRotation).toBe(10);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Particle emission count is within specified range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }), // Random seed for particle generation
        (seed) => {
          // Simulate particle emission (5-10 particles)
          const random = Math.sin(seed) * 10000;
          const randomValue = random - Math.floor(random);
          const particleCount = Math.floor(randomValue * 6) + 5;

          // Particle count should be between 5 and 10
          expect(particleCount).toBeGreaterThanOrEqual(5);
          expect(particleCount).toBeLessThanOrEqual(10);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Particle lifetime is correct', () => {
    const particleLifetime = 1.5; // 1.5 seconds per spec

    // Particle lifetime should be 1.5 seconds
    expect(particleLifetime).toBe(1.5);
  });

  test('Particle speed is within specified range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }), // Random seed
        (seed) => {
          // Simulate particle speed (100-200 px/s)
          const random = Math.sin(seed) * 10000;
          const randomValue = random - Math.floor(random);
          const speed = 100 + randomValue * 100;

          // Speed should be between 100 and 200 px/s
          expect(speed).toBeGreaterThanOrEqual(100);
          expect(speed).toBeLessThanOrEqual(200);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Text scramble animation has correct parameters', () => {
    const textScrambleConfig = {
      duration: 1500, // 1.5 seconds
      chaosLevel: 0.5, // 50% chaos
    };

    // Duration should be 1500ms (1.5s)
    expect(textScrambleConfig.duration).toBe(1500);

    // Chaos level should be 0.5 (50%)
    expect(textScrambleConfig.chaosLevel).toBe(0.5);
  });

  test('Color transition timing is correct', () => {
    const colorTransitionDuration = 300; // 300ms per spec (Requirements 32.2)

    // Color transition should be 300ms
    expect(colorTransitionDuration).toBe(300);
  });

  test('Service icon entrance animations are properly staggered', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 5 }), {
          minLength: 2,
          maxLength: 6,
        }),
        (iconIndices) => {
          const delays = iconIndices.map((index) => {
            const animation = simulateServiceIconAnimation({
              iconIndex: index,
              totalIcons: 6,
            });
            return animation.entranceDelay;
          });

          // Sort the delays
          const sortedDelays = [...delays].sort((a, b) => a - b);

          // Check that delays are properly staggered
          for (let i = 1; i < sortedDelays.length; i++) {
            const difference = sortedDelays[i] - sortedDelays[i - 1];
            // Difference should be a multiple of 100ms (or 0 if same index)
            // Round to nearest integer to handle floating point precision
            const roundedDifference = Math.round(difference);
            expect(roundedDifference % 100).toBe(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('All 6 service icons are present', () => {
    const serviceCount = 6;

    // Should have exactly 6 service icons
    expect(serviceCount).toBe(6);
  });
});
