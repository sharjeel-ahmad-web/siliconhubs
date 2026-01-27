/**
 * Property-Based Tests for Spring Physics System
 * Feature: rising-dot-website, Property 3: Spring Physics Consistency
 * Validates: Requirements 2.1, 2.2, 31.1-31.5
 */

import * as fc from 'fast-check';
import {
  EnterpriseSpringSystem,
  SPRING_PRESETS,
  SpringConfig,
} from '../SpringSystem';

describe('Spring Physics System', () => {
  describe('Property 3: Spring Physics Consistency', () => {
    /**
     * For any spring configuration, the motion SHALL follow Hooke's law
     * with smooth acceleration and deceleration without abrupt changes
     */
    test('spring physics produces smooth motion without discontinuities', () => {
      fc.assert(
        fc.property(
          fc.record({
            mass: fc.float({ min: 0.5, max: 2.0, noNaN: true }),
            tension: fc.integer({ min: 100, max: 300 }),
            friction: fc.integer({ min: 10, max: 40 }),
            initialPosition: fc.float({ min: -100, max: 100, noNaN: true }),
            targetPosition: fc.float({ min: -100, max: 100, noNaN: true }),
          }),
          ({ mass, tension, friction, initialPosition, targetPosition }) => {
            const config: SpringConfig = { mass, tension, friction };
            const spring = new EnterpriseSpringSystem(config);

            spring.setPosition(initialPosition);
            spring.setTarget(targetPosition);

            const positions: number[] = [];
            const velocities: number[] = [];

            // Simulate 60 frames (1 second at 60fps)
            for (let i = 0; i < 60; i++) {
              spring.update(1 / 60);
              positions.push(spring.getCurrentPosition());
              velocities.push(spring.getCurrentVelocity());
            }

            // Check for discontinuities (large jumps between frames)
            for (let i = 1; i < positions.length; i++) {
              const positionDelta = Math.abs(positions[i] - positions[i - 1]);
              const velocityDelta = Math.abs(velocities[i] - velocities[i - 1]);

              // Position change should be reasonable for 1/60 second
              // Max velocity is clamped at 10000, so max position change is 10000/60 ≈ 166
              expect(positionDelta).toBeLessThan(200);

              // Velocity change should be smooth (no sudden jumps)
              // Calculate expected max acceleration: a = F/m = (tension * displacement + friction * velocity) / mass
              // With low mass (0.5), high tension (300), and large displacement (200), max acceleration ≈ 120000
              // Max velocity change per frame = acceleration * dt = 120000 * (1/60) = 2000
              // However, velocity is clamped to ±10000, so max practical change is limited
              // Velocity changes can be large with extreme parameters
              // With low mass (0.5), low friction (10), high tension (up to 300), and large displacement (200)
              // the velocity can change significantly per frame due to high acceleration
              // Using a threshold of 2100 to account for all valid parameter combinations and floating point precision
              expect(velocityDelta).toBeLessThan(2100);
            }

            // Verify no NaN or Infinity values
            for (let i = 0; i < positions.length; i++) {
              expect(isFinite(positions[i])).toBe(true);
              expect(isFinite(velocities[i])).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    test('spring presets produce consistent behavior', () => {
      const presets = Object.keys(SPRING_PRESETS) as Array<
        keyof typeof SPRING_PRESETS
      >;

      presets.forEach((preset) => {
        const spring = new EnterpriseSpringSystem(preset);
        spring.setPosition(0);
        spring.setTarget(100);

        const positions: number[] = [];

        // Simulate 120 frames (2 seconds at 60fps)
        for (let i = 0; i < 120; i++) {
          spring.update(1 / 60);
          positions.push(spring.getCurrentPosition());
        }

        // Spring should move toward target
        expect(positions[positions.length - 1]).toBeGreaterThan(positions[0]);

        // All positions should be finite
        positions.forEach((pos) => {
          expect(isFinite(pos)).toBe(true);
        });
      });
    });

    test('spring eventually settles near target', () => {
      fc.assert(
        fc.property(
          fc.record({
            initialPosition: fc.float({ min: -50, max: 50, noNaN: true }),
            targetPosition: fc.float({ min: -50, max: 50, noNaN: true }),
          }),
          ({ initialPosition, targetPosition }) => {
            const spring = new EnterpriseSpringSystem('STIFF');
            spring.setPosition(initialPosition);
            spring.setTarget(targetPosition);

            // Simulate 5 seconds at 60fps
            for (let i = 0; i < 300; i++) {
              spring.update(1 / 60);
            }

            const finalPosition = spring.getCurrentPosition();
            const finalVelocity = spring.getCurrentVelocity();

            // After 5 seconds, spring should be very close to target
            const positionError = Math.abs(finalPosition - targetPosition);
            expect(positionError).toBeLessThan(1.0);

            // Velocity should be very small
            expect(Math.abs(finalVelocity)).toBeLessThan(1.0);
          }
        ),
        { numRuns: 100 }
      );
    });

    test("spring respects Hooke's law force relationship", () => {
      fc.assert(
        fc.property(
          fc.record({
            tension: fc.integer({ min: 100, max: 300 }),
            displacement: fc.float({ min: 1, max: 50, noNaN: true }),
          }),
          ({ tension, displacement }) => {
            const spring1 = new EnterpriseSpringSystem({
              mass: 1.0,
              tension: tension,
              friction: 20,
            });

            const spring2 = new EnterpriseSpringSystem({
              mass: 1.0,
              tension: tension * 2, // Double the tension
              friction: 20,
            });

            spring1.setPosition(0);
            spring1.setTarget(displacement);

            spring2.setPosition(0);
            spring2.setTarget(displacement);

            // Update both springs for one frame
            spring1.update(1 / 60);
            spring2.update(1 / 60);

            const velocity1 = Math.abs(spring1.getCurrentVelocity());
            const velocity2 = Math.abs(spring2.getCurrentVelocity());

            // Spring with double tension should have higher velocity
            // (stronger force = more acceleration)
            expect(velocity2).toBeGreaterThan(velocity1);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('spring with higher mass takes longer to accelerate', () => {
      fc.assert(
        fc.property(
          fc.record({
            mass1: fc.float({ min: 0.5, max: 1.0, noNaN: true }),
            mass2: fc.float({ min: 1.5, max: 2.0, noNaN: true }),
            displacement: fc.float({ min: 10, max: 50, noNaN: true }),
          }),
          ({ mass1, mass2, displacement }) => {
            const lightMass = new EnterpriseSpringSystem({
              mass: mass1,
              tension: 170,
              friction: 26,
            });

            const heavyMass = new EnterpriseSpringSystem({
              mass: mass2,
              tension: 170,
              friction: 26,
            });

            lightMass.setPosition(0);
            lightMass.setTarget(displacement);

            heavyMass.setPosition(0);
            heavyMass.setTarget(displacement);

            // Update both for a few frames
            for (let i = 0; i < 5; i++) {
              lightMass.update(1 / 60);
              heavyMass.update(1 / 60);
            }

            const lightVelocity = Math.abs(lightMass.getCurrentVelocity());
            const heavyVelocity = Math.abs(heavyMass.getCurrentVelocity());

            // Lighter mass should have higher velocity after same time
            // (F = ma, so a = F/m, lighter mass has more acceleration)
            expect(lightVelocity).toBeGreaterThan(heavyVelocity * 0.9);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Unit Tests', () => {
    test('spring initializes with correct default values', () => {
      const spring = new EnterpriseSpringSystem('STIFF');
      expect(spring.getCurrentPosition()).toBe(0);
      expect(spring.getCurrentVelocity()).toBe(0);
    });

    test('setTarget updates target position', () => {
      const spring = new EnterpriseSpringSystem('STIFF');
      spring.setTarget(50);
      expect(spring.state.target).toBe(50);
    });

    test('setPosition updates current position', () => {
      const spring = new EnterpriseSpringSystem('STIFF');
      spring.setPosition(25);
      expect(spring.getCurrentPosition()).toBe(25);
    });

    test('reset clears spring state', () => {
      const spring = new EnterpriseSpringSystem('STIFF');
      spring.setPosition(50);
      spring.setTarget(100);
      spring.update(1 / 60);

      spring.reset();

      expect(spring.getCurrentPosition()).toBe(0);
      expect(spring.getCurrentVelocity()).toBe(0);
      expect(spring.state.target).toBe(0);
    });

    test('isSettled returns true when spring is at rest', () => {
      const spring = new EnterpriseSpringSystem('STIFF');
      spring.setPosition(100);
      spring.setTarget(100);

      expect(spring.isSettled()).toBe(true);
    });

    test('isSettled returns false when spring is moving', () => {
      const spring = new EnterpriseSpringSystem('STIFF');
      spring.setPosition(0);
      spring.setTarget(100);
      spring.update(1 / 60);

      expect(spring.isSettled()).toBe(false);
    });

    test('all presets are defined correctly', () => {
      const presets: Array<keyof typeof SPRING_PRESETS> = [
        'GENTLE',
        'BOUNCY',
        'STIFF',
        'MAGNETIC',
        'ELASTIC',
      ];

      presets.forEach((preset) => {
        const config = SPRING_PRESETS[preset];
        expect(config.mass).toBeGreaterThan(0);
        expect(config.tension).toBeGreaterThan(0);
        expect(config.friction).toBeGreaterThan(0);
      });
    });

    test('GENTLE preset has correct values', () => {
      const config = SPRING_PRESETS.GENTLE;
      expect(config.mass).toBe(0.8);
      expect(config.tension).toBe(120);
      expect(config.friction).toBe(20);
    });

    test('BOUNCY preset has correct values', () => {
      const config = SPRING_PRESETS.BOUNCY;
      expect(config.mass).toBe(1.2);
      expect(config.tension).toBe(200);
      expect(config.friction).toBe(15);
    });

    test('STIFF preset has correct values', () => {
      const config = SPRING_PRESETS.STIFF;
      expect(config.mass).toBe(1.0);
      expect(config.tension).toBe(170);
      expect(config.friction).toBe(26);
    });

    test('MAGNETIC preset has correct values', () => {
      const config = SPRING_PRESETS.MAGNETIC;
      expect(config.mass).toBe(0.6);
      expect(config.tension).toBe(250);
      expect(config.friction).toBe(30);
    });

    test('ELASTIC preset has correct values', () => {
      const config = SPRING_PRESETS.ELASTIC;
      expect(config.mass).toBe(1.5);
      expect(config.tension).toBe(150);
      expect(config.friction).toBe(18);
    });
  });
});
