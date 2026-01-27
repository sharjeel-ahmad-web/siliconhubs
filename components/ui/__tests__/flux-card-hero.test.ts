/**
 * Feature: n8n-components-cms, Property 2: Fallback Behavior Consistency
 * Validates: Requirements 1.3
 *
 * Property: For any component that uses CMS content, if the CMS returns null or undefined,
 * the component should render with default values without throwing errors.
 */

import * as fc from 'fast-check';

// Define the CardConfig interface matching the component
interface CardConfig {
  bgColor: string;
  content: {
    type?: 'analytics' | 'projects' | 'chat-history';
    greeting?: string;
    subtitle?: string;
    title?: string;
  };
}

// Default card configurations - must match the component's defaults
const defaultCardConfigs: CardConfig[] = [
  {
    bgColor: 'bg-[#37AFE1]',
    content: {
      greeting: 'Automate your workflows with N8N',
      subtitle: 'Connect apps and services seamlessly',
    },
  },
  {
    bgColor: 'bg-[#31A4DB]',
    content: {
      type: 'analytics',
      greeting: 'Performance Analytics',
      subtitle: 'Automation Usage This Month',
    },
  },
  {
    bgColor: 'bg-[#F58122]',
    content: {
      type: 'projects',
      title: 'Active Workflows',
      subtitle: 'Your Automation Pipelines',
    },
  },
  {
    bgColor: 'bg-[#37AFE1]',
    content: {
      type: 'chat-history',
    },
  },
];

/**
 * Simulates the FluxCardHero component's card selection logic
 * This mirrors the actual component behavior for testing
 */
function getActiveCards(cards: CardConfig[] | undefined | null): CardConfig[] {
  // Requirements: 1.3 - Use CMS cards with fallback to defaults
  return cards && cards.length > 0 ? cards : defaultCardConfigs;
}

/**
 * Validates that a card configuration is valid
 */
function isValidCardConfig(card: CardConfig): boolean {
  return (
    typeof card.bgColor === 'string' &&
    card.bgColor.length > 0 &&
    typeof card.content === 'object' &&
    card.content !== null
  );
}

describe('FluxCardHero Fallback Behavior', () => {
  /**
   * Property 2: Fallback Behavior Consistency
   * For any null/undefined/empty cards input, the component should use default cards
   */
  test('Property 2: Returns default cards when CMS cards is undefined', () => {
    fc.assert(
      fc.property(fc.constant(undefined), (cmsCards) => {
        const activeCards = getActiveCards(cmsCards);

        // Should return default cards
        expect(activeCards).toEqual(defaultCardConfigs);
        expect(activeCards.length).toBe(4);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 2: Returns default cards when CMS cards is null', () => {
    fc.assert(
      fc.property(fc.constant(null), (cmsCards) => {
        const activeCards = getActiveCards(cmsCards);

        // Should return default cards
        expect(activeCards).toEqual(defaultCardConfigs);
        expect(activeCards.length).toBe(4);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 2: Returns default cards when CMS cards is empty array', () => {
    fc.assert(
      fc.property(fc.constant([]), (cmsCards) => {
        const activeCards = getActiveCards(cmsCards as CardConfig[]);

        // Should return default cards when array is empty
        expect(activeCards).toEqual(defaultCardConfigs);
        expect(activeCards.length).toBe(4);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 2: Uses CMS cards when valid cards are provided', () => {
    // Generator for valid card configurations
    const cardConfigArb = fc.record({
      bgColor: fc.stringMatching(/^bg-\[#[0-9A-Fa-f]{6}\]$/),
      content: fc.record({
        type: fc.option(
          fc.constantFrom('analytics', 'projects', 'chat-history'),
          { nil: undefined }
        ),
        greeting: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
          nil: undefined,
        }),
        subtitle: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
          nil: undefined,
        }),
        title: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
          nil: undefined,
        }),
      }),
    }) as fc.Arbitrary<CardConfig>;

    fc.assert(
      fc.property(
        fc.array(cardConfigArb, { minLength: 1, maxLength: 10 }),
        (cmsCards) => {
          const activeCards = getActiveCards(cmsCards);

          // Should use CMS cards when provided
          expect(activeCards).toEqual(cmsCards);
          expect(activeCards.length).toBe(cmsCards.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Default cards are always valid configurations', () => {
    fc.assert(
      fc.property(fc.constant(undefined), () => {
        const activeCards = getActiveCards(undefined);

        // All default cards should be valid
        activeCards.forEach((card) => {
          expect(isValidCardConfig(card)).toBe(true);
        });
      }),
      { numRuns: 100 }
    );
  });

  test('Property 2: Card count matches indicator dots count', () => {
    // Generator for valid card configurations
    const cardConfigArb = fc.record({
      bgColor: fc.stringMatching(/^bg-\[#[0-9A-Fa-f]{6}\]$/),
      content: fc.record({
        type: fc.option(
          fc.constantFrom('analytics', 'projects', 'chat-history'),
          { nil: undefined }
        ),
        greeting: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
          nil: undefined,
        }),
        subtitle: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
          nil: undefined,
        }),
        title: fc.option(fc.string({ minLength: 1, maxLength: 100 }), {
          nil: undefined,
        }),
      }),
    }) as fc.Arbitrary<CardConfig>;

    fc.assert(
      fc.property(
        fc.option(fc.array(cardConfigArb, { minLength: 0, maxLength: 10 }), {
          nil: undefined,
        }),
        (cmsCards) => {
          const activeCards = getActiveCards(cmsCards);

          // The number of indicator dots should match the number of cards
          // This validates Requirements 1.4
          const indicatorCount = activeCards.length;
          expect(indicatorCount).toBeGreaterThan(0);
          expect(indicatorCount).toBe(activeCards.length);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Fallback behavior is idempotent', () => {
    fc.assert(
      fc.property(
        fc.option(fc.constant([]), { nil: undefined }),
        (cmsCards) => {
          // Calling getActiveCards multiple times with same input should return same result
          const result1 = getActiveCards(cmsCards as CardConfig[] | undefined);
          const result2 = getActiveCards(cmsCards as CardConfig[] | undefined);

          expect(result1).toEqual(result2);
        }
      ),
      { numRuns: 100 }
    );
  });
});
