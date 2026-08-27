/**
 * Feature: n8n-components-cms, Property 2: Fallback Behavior Consistency
 * Validates: Requirements 3.4
 *
 * Property: For any component that uses CMS content, if the CMS returns null or undefined,
 * the component should render with default values without throwing errors.
 */

import * as fc from 'fast-check';
import {
  resolveProcessConfigs,
  isValidProcessConfig,
  defaultManualProcess,
  defaultAutomatedProcess,
  ProcessConfig,
  ProcessStep,
} from '../beforeAfterSliderUtils';

/**
 * Generator for valid ProcessStep objects
 */
const processStepArb: fc.Arbitrary<ProcessStep> = fc.record({
  step: fc.integer({ min: 1, max: 100 }),
  text: fc.string({ minLength: 1, maxLength: 100 }),
  time: fc.string({ minLength: 1, maxLength: 20 }),
});

/**
 * Generator for valid ProcessConfig objects
 */
const processConfigArb: fc.Arbitrary<ProcessConfig> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 50 }),
  steps: fc.array(processStepArb, { minLength: 1, maxLength: 10 }),
  totalTime: fc.string({ minLength: 1, maxLength: 30 }),
  summary: fc.string({ minLength: 1, maxLength: 100 }),
});

/**
 * Generator for nullable ProcessConfig (simulates CMS returning null/undefined)
 */
const nullableProcessConfigArb: fc.Arbitrary<ProcessConfig | null | undefined> =
  fc.oneof(processConfigArb, fc.constant(null), fc.constant(undefined));

describe('BeforeAfterSlider Fallback Behavior', () => {
  /**
   * Property 2: Fallback Behavior Consistency
   * When CMS returns null or undefined, defaults should be used
   */
  test('Property 2: Null manual process falls back to default', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        processConfigArb,
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Manual should fall back to default
          expect(result.manual).toEqual(defaultManualProcess);
          // Automated should use provided value
          expect(result.automated).toEqual(automatedProcess);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Undefined manual process falls back to default', () => {
    fc.assert(
      fc.property(
        fc.constant(undefined),
        processConfigArb,
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Manual should fall back to default
          expect(result.manual).toEqual(defaultManualProcess);
          // Automated should use provided value
          expect(result.automated).toEqual(automatedProcess);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Null automated process falls back to default', () => {
    fc.assert(
      fc.property(
        processConfigArb,
        fc.constant(null),
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Manual should use provided value
          expect(result.manual).toEqual(manualProcess);
          // Automated should fall back to default
          expect(result.automated).toEqual(defaultAutomatedProcess);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Undefined automated process falls back to default', () => {
    fc.assert(
      fc.property(
        processConfigArb,
        fc.constant(undefined),
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Manual should use provided value
          expect(result.manual).toEqual(manualProcess);
          // Automated should fall back to default
          expect(result.automated).toEqual(defaultAutomatedProcess);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Both null falls back to both defaults', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        fc.constant(null),
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Both should fall back to defaults
          expect(result.manual).toEqual(defaultManualProcess);
          expect(result.automated).toEqual(defaultAutomatedProcess);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Both undefined falls back to both defaults', () => {
    fc.assert(
      fc.property(
        fc.constant(undefined),
        fc.constant(undefined),
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Both should fall back to defaults
          expect(result.manual).toEqual(defaultManualProcess);
          expect(result.automated).toEqual(defaultAutomatedProcess);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Valid CMS content is used when provided', () => {
    fc.assert(
      fc.property(
        processConfigArb,
        processConfigArb,
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Both should use provided values
          expect(result.manual).toEqual(manualProcess);
          expect(result.automated).toEqual(automatedProcess);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Resolved configs are always valid', () => {
    fc.assert(
      fc.property(
        nullableProcessConfigArb,
        nullableProcessConfigArb,
        (manualProcess, automatedProcess) => {
          const result = resolveProcessConfigs(manualProcess, automatedProcess);

          // Both resolved configs should always be valid
          expect(isValidProcessConfig(result.manual)).toBe(true);
          expect(isValidProcessConfig(result.automated)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Default configs are valid', () => {
    expect(isValidProcessConfig(defaultManualProcess)).toBe(true);
    expect(isValidProcessConfig(defaultAutomatedProcess)).toBe(true);
  });

  test('Property 2: Fallback is deterministic', () => {
    fc.assert(
      fc.property(
        nullableProcessConfigArb,
        nullableProcessConfigArb,
        (manualProcess, automatedProcess) => {
          // Calling the function multiple times with same inputs should return same result
          const result1 = resolveProcessConfigs(
            manualProcess,
            automatedProcess
          );
          const result2 = resolveProcessConfigs(
            manualProcess,
            automatedProcess
          );

          expect(result1.manual).toEqual(result2.manual);
          expect(result1.automated).toEqual(result2.automated);
        }
      ),
      { numRuns: 100 }
    );
  });
});
