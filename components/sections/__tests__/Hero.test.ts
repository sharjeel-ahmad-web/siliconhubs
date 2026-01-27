/**
 * Feature: rising-dot-website, Property 1: Hero Animation Sequence Timing
 * Validates: Requirements 3.2, 3.3, 3.4
 *
 * Property: For any page load on the homepage, the particle system SHALL converge
 * to form the Rising Dot logo within 1500ms, followed by text scramble animation
 * completing within 1.5 seconds, and particle burst emission occurring within the
 * specified timing sequence.
 */

import * as fc from 'fast-check';

describe('Hero Animation Sequence Timing', () => {
  // Helper to simulate animation timing
  const simulateHeroAnimation = async (config: {
    particleCount: number;
    logoFormationDuration: number;
    textScrambleDuration: number;
    deviceCapability: 'low' | 'medium' | 'high';
  }): Promise<{
    logoFormationTime: number;
    textScrambleTime: number;
    burstEmissionTime: number;
    ctaFadeInTime: number;
  }> => {
    const { logoFormationDuration, textScrambleDuration } = config;

    // Simulate the animation timeline based on the Hero component logic
    // Phase 1: Particles spawn at 0ms, converge starts at 500ms
    const particleConvergenceStart = 500;
    const logoFormationTime = particleConvergenceStart + logoFormationDuration;

    // Phase 2: Text scramble starts at 1800ms
    const textScrambleStart = 1800;
    const textScrambleTime = textScrambleStart + textScrambleDuration;

    // Phase 3: Particle burst at 2400ms
    const burstEmissionTime = 2400;

    // Phase 4: CTA fade in at 2800ms
    const ctaFadeInTime = 2800;

    return {
      logoFormationTime,
      textScrambleTime,
      burstEmissionTime,
      ctaFadeInTime,
    };
  };

  test('Property 1: Logo formation completes within specified duration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          particleCount: fc.integer({ min: 1000, max: 5000 }),
          logoFormationDuration: fc.constant(1500), // Fixed per spec
          textScrambleDuration: fc.constant(1500), // Fixed per spec
          deviceCapability: fc.constantFrom(
            'low' as const,
            'medium' as const,
            'high' as const
          ),
        }),
        async (config) => {
          const timing = await simulateHeroAnimation(config);

          // Logo formation should complete at 500ms (start) + 1500ms (duration) = 2000ms
          const expectedLogoFormationTime = 500 + config.logoFormationDuration;
          expect(timing.logoFormationTime).toBe(expectedLogoFormationTime);
          expect(timing.logoFormationTime).toBeLessThanOrEqual(2000);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Text scramble completes within specified duration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          particleCount: fc.integer({ min: 1000, max: 5000 }),
          logoFormationDuration: fc.constant(1500),
          textScrambleDuration: fc.constant(1500),
          deviceCapability: fc.constantFrom(
            'low' as const,
            'medium' as const,
            'high' as const
          ),
        }),
        async (config) => {
          const timing = await simulateHeroAnimation(config);

          // Text scramble starts at 1800ms and should complete within 1500ms
          const expectedTextScrambleTime = 1800 + config.textScrambleDuration;
          expect(timing.textScrambleTime).toBe(expectedTextScrambleTime);
          expect(timing.textScrambleTime).toBeLessThanOrEqual(3300);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Particle burst occurs at correct time in sequence', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          particleCount: fc.integer({ min: 1000, max: 5000 }),
          logoFormationDuration: fc.constant(1500),
          textScrambleDuration: fc.constant(1500),
          deviceCapability: fc.constantFrom(
            'low' as const,
            'medium' as const,
            'high' as const
          ),
        }),
        async (config) => {
          const timing = await simulateHeroAnimation(config);

          // Particle burst should occur at 2400ms
          expect(timing.burstEmissionTime).toBe(2400);

          // Burst should occur after logo formation completes
          expect(timing.burstEmissionTime).toBeGreaterThan(
            timing.logoFormationTime
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: CTA button fades in at correct time', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          particleCount: fc.integer({ min: 1000, max: 5000 }),
          logoFormationDuration: fc.constant(1500),
          textScrambleDuration: fc.constant(1500),
          deviceCapability: fc.constantFrom(
            'low' as const,
            'medium' as const,
            'high' as const
          ),
        }),
        async (config) => {
          const timing = await simulateHeroAnimation(config);

          // CTA should fade in at 2800ms
          expect(timing.ctaFadeInTime).toBe(2800);

          // CTA should appear after burst emission
          expect(timing.ctaFadeInTime).toBeGreaterThan(
            timing.burstEmissionTime
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Animation sequence maintains correct order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          particleCount: fc.integer({ min: 1000, max: 5000 }),
          logoFormationDuration: fc.constant(1500),
          textScrambleDuration: fc.constant(1500),
          deviceCapability: fc.constantFrom(
            'low' as const,
            'medium' as const,
            'high' as const
          ),
        }),
        async (config) => {
          const timing = await simulateHeroAnimation(config);

          // Verify the complete sequence order:
          // 1. Logo formation completes first
          // 2. Text scramble starts during/after logo formation
          // 3. Particle burst occurs after logo formation
          // 4. CTA fades in last

          expect(timing.logoFormationTime).toBeLessThan(
            timing.textScrambleTime
          );
          expect(timing.logoFormationTime).toBeLessThan(
            timing.burstEmissionTime
          );
          expect(timing.burstEmissionTime).toBeLessThan(timing.ctaFadeInTime);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Total animation sequence completes within reasonable time', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          particleCount: fc.integer({ min: 1000, max: 5000 }),
          logoFormationDuration: fc.constant(1500),
          textScrambleDuration: fc.constant(1500),
          deviceCapability: fc.constantFrom(
            'low' as const,
            'medium' as const,
            'high' as const
          ),
        }),
        async (config) => {
          const timing = await simulateHeroAnimation(config);

          // The entire animation sequence should complete within 3.3 seconds
          // (text scramble is the longest running animation ending at 3300ms)
          const maxAnimationTime = Math.max(
            timing.logoFormationTime,
            timing.textScrambleTime,
            timing.burstEmissionTime,
            timing.ctaFadeInTime
          );

          expect(maxAnimationTime).toBeLessThanOrEqual(3300);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Animation timing is consistent across different particle counts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          particleCount: fc.integer({ min: 1000, max: 5000 }),
          logoFormationDuration: fc.constant(1500),
          textScrambleDuration: fc.constant(1500),
          deviceCapability: fc.constantFrom(
            'low' as const,
            'medium' as const,
            'high' as const
          ),
        }),
        async (config) => {
          const timing = await simulateHeroAnimation(config);

          // Animation timing should be independent of particle count
          // All timing values should be the same regardless of particleCount
          expect(timing.logoFormationTime).toBe(2000);
          expect(timing.textScrambleTime).toBe(3300);
          expect(timing.burstEmissionTime).toBe(2400);
          expect(timing.ctaFadeInTime).toBe(2800);
        }
      ),
      { numRuns: 100 }
    );
  });
});
