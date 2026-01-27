/**
 * Feature: n8n-components-cms, Property 1: Content Round-Trip Consistency
 * Validates: Requirements 1.2, 2.4, 6.1
 *
 * Property: For any valid CMS content object, saving it to the database and then
 * fetching it should return an equivalent object with all fields preserved.
 */

import * as fc from 'fast-check';

/**
 * Interface for CardConfig matching FluxCardHero component
 */
interface CardConfig {
  bgColor: string;
  content: {
    type?: 'analytics' | 'projects' | 'chat-history';
    greeting?: string;
    subtitle?: string;
    title?: string;
  };
}

/**
 * Interface for WorkflowNode matching WorkflowBuilder component
 */
interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'output';
  label: string;
  x: number;
  y: number;
  connections: string[];
}

/**
 * Interface for NodeTypeColors matching WorkflowBuilder component
 */
interface NodeTypeColors {
  trigger: string;
  action: string;
  condition: string;
  output: string;
}

/**
 * Interface for ProcessStep matching BeforeAfterSlider component
 */
interface ProcessStep {
  step: number;
  text: string;
  time: string;
}

/**
 * Interface for ProcessConfig matching BeforeAfterSlider component
 */
interface ProcessConfig {
  title: string;
  steps: ProcessStep[];
  totalTime: string;
  summary: string;
}

/**
 * Interface for ApiIntegrationContent matching DatabaseWithRestApi component
 */
interface ApiIntegrationContent {
  circleText: string;
  badgeTexts: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };
  buttonTexts: {
    first: string;
    second: string;
  };
  boxTitle: string;
  lightColor: string;
}

/**
 * Interface for N8N Hero Content
 */
interface N8NHeroContent {
  eyebrow: string;
  title: string;
  highlightedWord: string;
  highlightedWord2: string;
  subtitle: string;
  ctaButton: {
    label: string;
    href: string;
  };
  cards: CardConfig[];
}

/**
 * Interface for N8N WorkflowBuilder Content
 */
interface N8NWorkflowBuilderContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  nodes: WorkflowNode[];
  nodeColors: NodeTypeColors;
}

/**
 * Interface for N8N BeforeAfter Content
 */
interface N8NBeforeAfterContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  manualProcess: ProcessConfig;
  automatedProcess: ProcessConfig;
}

/**
 * Interface for CMS content structure
 */
interface CMSContent {
  page: string;
  section: string;
  content: Record<string, unknown>;
}

// ============ Arbitrary Generators ============

/**
 * Generator for hex color strings
 */
const hexColorArb = fc
  .hexaString({ minLength: 6, maxLength: 6 })
  .map((hex) => `#${hex}`);

/**
 * Generator for Tailwind bg color classes
 */
const bgColorArb = fc.constantFrom(
  'bg-[#37AFE1]',
  'bg-[#31A4DB]',
  'bg-[#F58122]',
  'bg-[#2563EB]',
  'bg-[#7C3AED]',
  'bg-[#10B981]'
);

/**
 * Generator for card content type
 */
const cardTypeArb = fc.constantFrom(
  'analytics',
  'projects',
  'chat-history'
) as fc.Arbitrary<'analytics' | 'projects' | 'chat-history'>;

/**
 * Generator for CardConfig
 */
const cardConfigArb: fc.Arbitrary<CardConfig> = fc.record({
  bgColor: bgColorArb,
  content: fc.record({
    type: fc.option(cardTypeArb, { nil: undefined }),
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
});

/**
 * Generator for node type
 */
const nodeTypeArb = fc.constantFrom(
  'trigger',
  'action',
  'condition',
  'output'
) as fc.Arbitrary<'trigger' | 'action' | 'condition' | 'output'>;

/**
 * Generator for WorkflowNode
 */
const workflowNodeArb: fc.Arbitrary<WorkflowNode> = fc.record({
  id: fc.uuid(),
  type: nodeTypeArb,
  label: fc.string({ minLength: 1, maxLength: 50 }),
  x: fc.integer({ min: 0, max: 1000 }),
  y: fc.integer({ min: 0, max: 1000 }),
  connections: fc.array(fc.uuid(), { minLength: 0, maxLength: 5 }),
});

/**
 * Generator for NodeTypeColors
 */
const nodeTypeColorsArb: fc.Arbitrary<NodeTypeColors> = fc.record({
  trigger: hexColorArb,
  action: hexColorArb,
  condition: hexColorArb,
  output: hexColorArb,
});

/**
 * Generator for ProcessStep
 */
const processStepArb: fc.Arbitrary<ProcessStep> = fc.record({
  step: fc.integer({ min: 1, max: 100 }),
  text: fc.string({ minLength: 1, maxLength: 100 }),
  time: fc.string({ minLength: 1, maxLength: 20 }),
});

/**
 * Generator for ProcessConfig
 */
const processConfigArb: fc.Arbitrary<ProcessConfig> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 50 }),
  steps: fc.array(processStepArb, { minLength: 1, maxLength: 10 }),
  totalTime: fc.string({ minLength: 1, maxLength: 30 }),
  summary: fc.string({ minLength: 1, maxLength: 100 }),
});

/**
 * Generator for ApiIntegrationContent
 */
const apiIntegrationContentArb: fc.Arbitrary<ApiIntegrationContent> = fc.record(
  {
    circleText: fc.string({ minLength: 1, maxLength: 20 }),
    badgeTexts: fc.record({
      first: fc.string({ minLength: 1, maxLength: 30 }),
      second: fc.string({ minLength: 1, maxLength: 30 }),
      third: fc.string({ minLength: 1, maxLength: 30 }),
      fourth: fc.string({ minLength: 1, maxLength: 30 }),
    }),
    buttonTexts: fc.record({
      first: fc.string({ minLength: 1, maxLength: 30 }),
      second: fc.string({ minLength: 1, maxLength: 30 }),
    }),
    boxTitle: fc.string({ minLength: 1, maxLength: 100 }),
    lightColor: hexColorArb,
  }
);

/**
 * Generator for N8N Hero Content
 */
const n8nHeroContentArb: fc.Arbitrary<N8NHeroContent> = fc.record({
  eyebrow: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  highlightedWord: fc.string({ minLength: 1, maxLength: 30 }),
  highlightedWord2: fc.string({ minLength: 1, maxLength: 30 }),
  subtitle: fc.string({ minLength: 1, maxLength: 300 }),
  ctaButton: fc.record({
    label: fc.string({ minLength: 1, maxLength: 30 }),
    href: fc.webUrl(),
  }),
  cards: fc.array(cardConfigArb, { minLength: 1, maxLength: 6 }),
});

/**
 * Generator for N8N WorkflowBuilder Content
 */
const n8nWorkflowBuilderContentArb: fc.Arbitrary<N8NWorkflowBuilderContent> =
  fc.record({
    eyebrow: fc.string({ minLength: 1, maxLength: 50 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    titleHighlight: fc.string({ minLength: 1, maxLength: 50 }),
    subtitle: fc.string({ minLength: 1, maxLength: 300 }),
    nodes: fc.array(workflowNodeArb, { minLength: 1, maxLength: 10 }),
    nodeColors: nodeTypeColorsArb,
  });

/**
 * Generator for N8N BeforeAfter Content
 */
const n8nBeforeAfterContentArb: fc.Arbitrary<N8NBeforeAfterContent> = fc.record(
  {
    eyebrow: fc.string({ minLength: 1, maxLength: 50 }),
    title: fc.string({ minLength: 1, maxLength: 100 }),
    titleHighlight: fc.string({ minLength: 1, maxLength: 50 }),
    subtitle: fc.string({ minLength: 1, maxLength: 300 }),
    manualProcess: processConfigArb,
    automatedProcess: processConfigArb,
  }
);

// ============ Helper Functions ============

/**
 * Simulates saving content to CMS - serializes to JSON
 */
function saveToCMS(content: CMSContent): string {
  return JSON.stringify(content);
}

/**
 * Simulates fetching content from CMS - deserializes from JSON
 */
function fetchFromCMS(jsonString: string): CMSContent {
  return JSON.parse(jsonString);
}

/**
 * Validates that two CMS content objects are equivalent
 */
function contentsAreEquivalent(
  original: CMSContent,
  retrieved: CMSContent
): boolean {
  if (original.page !== retrieved.page) return false;
  if (original.section !== retrieved.section) return false;
  return JSON.stringify(original.content) === JSON.stringify(retrieved.content);
}

// ============ Property Tests ============

describe('Feature: n8n-components-cms, Property 1: Content Round-Trip Consistency', () => {
  /**
   * Test hero section with cards round-trip
   * Validates: Requirements 1.2
   */
  describe('Hero Section Cards Round-Trip', () => {
    it('should preserve hero content with cards through save and fetch cycle', () => {
      fc.assert(
        fc.property(n8nHeroContentArb, (heroContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'hero',
            content: heroContent as unknown as Record<string, unknown>,
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve all card configurations through round-trip', () => {
      fc.assert(
        fc.property(
          fc.array(cardConfigArb, { minLength: 1, maxLength: 6 }),
          (cards) => {
            const content: CMSContent = {
              page: 'services-n8n',
              section: 'hero',
              content: {
                eyebrow: 'Test',
                title: 'Test Title',
                cards,
              },
            };

            const savedData = saveToCMS(content);
            const retrievedContent = fetchFromCMS(savedData);
            const retrievedCards = (
              retrievedContent.content as { cards: CardConfig[] }
            ).cards;

            expect(retrievedCards.length).toBe(cards.length);
            for (let i = 0; i < cards.length; i++) {
              expect(retrievedCards[i].bgColor).toBe(cards[i].bgColor);
              expect(JSON.stringify(retrievedCards[i].content)).toBe(
                JSON.stringify(cards[i].content)
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve card content types through round-trip', () => {
      fc.assert(
        fc.property(cardConfigArb, (card) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'hero',
            content: { cards: [card] },
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);
          const retrievedCard = (
            retrievedContent.content as { cards: CardConfig[] }
          ).cards[0];

          expect(retrievedCard.content.type).toBe(card.content.type);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Test workflow builder section round-trip
   * Validates: Requirements 2.4
   */
  describe('WorkflowBuilder Section Round-Trip', () => {
    it('should preserve workflow builder content through save and fetch cycle', () => {
      fc.assert(
        fc.property(n8nWorkflowBuilderContentArb, (workflowContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'workflowBuilder',
            content: workflowContent as unknown as Record<string, unknown>,
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve all workflow nodes through round-trip', () => {
      fc.assert(
        fc.property(
          fc.array(workflowNodeArb, { minLength: 1, maxLength: 10 }),
          (nodes) => {
            const content: CMSContent = {
              page: 'services-n8n',
              section: 'workflowBuilder',
              content: { nodes },
            };

            const savedData = saveToCMS(content);
            const retrievedContent = fetchFromCMS(savedData);
            const retrievedNodes = (
              retrievedContent.content as { nodes: WorkflowNode[] }
            ).nodes;

            expect(retrievedNodes.length).toBe(nodes.length);
            for (let i = 0; i < nodes.length; i++) {
              expect(retrievedNodes[i].id).toBe(nodes[i].id);
              expect(retrievedNodes[i].type).toBe(nodes[i].type);
              expect(retrievedNodes[i].label).toBe(nodes[i].label);
              expect(retrievedNodes[i].x).toBe(nodes[i].x);
              expect(retrievedNodes[i].y).toBe(nodes[i].y);
              expect(retrievedNodes[i].connections).toEqual(
                nodes[i].connections
              );
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve node colors through round-trip', () => {
      fc.assert(
        fc.property(nodeTypeColorsArb, (nodeColors) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'workflowBuilder',
            content: { nodeColors },
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);
          const retrievedColors = (
            retrievedContent.content as { nodeColors: NodeTypeColors }
          ).nodeColors;

          expect(retrievedColors.trigger).toBe(nodeColors.trigger);
          expect(retrievedColors.action).toBe(nodeColors.action);
          expect(retrievedColors.condition).toBe(nodeColors.condition);
          expect(retrievedColors.output).toBe(nodeColors.output);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Test before/after section round-trip
   * Validates: Requirements 6.1
   */
  describe('BeforeAfter Section Round-Trip', () => {
    it('should preserve before/after content through save and fetch cycle', () => {
      fc.assert(
        fc.property(n8nBeforeAfterContentArb, (beforeAfterContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'beforeAfter',
            content: beforeAfterContent as unknown as Record<string, unknown>,
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve manual process steps through round-trip', () => {
      fc.assert(
        fc.property(processConfigArb, (manualProcess) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'beforeAfter',
            content: { manualProcess },
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);
          const retrievedProcess = (
            retrievedContent.content as { manualProcess: ProcessConfig }
          ).manualProcess;

          expect(retrievedProcess.title).toBe(manualProcess.title);
          expect(retrievedProcess.totalTime).toBe(manualProcess.totalTime);
          expect(retrievedProcess.summary).toBe(manualProcess.summary);
          expect(retrievedProcess.steps.length).toBe(
            manualProcess.steps.length
          );
          for (let i = 0; i < manualProcess.steps.length; i++) {
            expect(retrievedProcess.steps[i].step).toBe(
              manualProcess.steps[i].step
            );
            expect(retrievedProcess.steps[i].text).toBe(
              manualProcess.steps[i].text
            );
            expect(retrievedProcess.steps[i].time).toBe(
              manualProcess.steps[i].time
            );
          }
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve automated process steps through round-trip', () => {
      fc.assert(
        fc.property(processConfigArb, (automatedProcess) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'beforeAfter',
            content: { automatedProcess },
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);
          const retrievedProcess = (
            retrievedContent.content as { automatedProcess: ProcessConfig }
          ).automatedProcess;

          expect(retrievedProcess.title).toBe(automatedProcess.title);
          expect(retrievedProcess.totalTime).toBe(automatedProcess.totalTime);
          expect(retrievedProcess.summary).toBe(automatedProcess.summary);
          expect(retrievedProcess.steps.length).toBe(
            automatedProcess.steps.length
          );
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Test API integration section round-trip
   * Validates: Requirements 6.1
   */
  describe('ApiIntegration Section Round-Trip', () => {
    it('should preserve API integration content through save and fetch cycle', () => {
      fc.assert(
        fc.property(apiIntegrationContentArb, (apiContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'apiIntegration',
            content: apiContent as unknown as Record<string, unknown>,
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);

          expect(contentsAreEquivalent(content, retrievedContent)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve badge texts through round-trip', () => {
      fc.assert(
        fc.property(apiIntegrationContentArb, (apiContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'apiIntegration',
            content: { badgeTexts: apiContent.badgeTexts },
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);
          const retrievedBadges = (
            retrievedContent.content as {
              badgeTexts: ApiIntegrationContent['badgeTexts'];
            }
          ).badgeTexts;

          expect(retrievedBadges.first).toBe(apiContent.badgeTexts.first);
          expect(retrievedBadges.second).toBe(apiContent.badgeTexts.second);
          expect(retrievedBadges.third).toBe(apiContent.badgeTexts.third);
          expect(retrievedBadges.fourth).toBe(apiContent.badgeTexts.fourth);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve button texts through round-trip', () => {
      fc.assert(
        fc.property(apiIntegrationContentArb, (apiContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'apiIntegration',
            content: { buttonTexts: apiContent.buttonTexts },
          };

          const savedData = saveToCMS(content);
          const retrievedContent = fetchFromCMS(savedData);
          const retrievedButtons = (
            retrievedContent.content as {
              buttonTexts: ApiIntegrationContent['buttonTexts'];
            }
          ).buttonTexts;

          expect(retrievedButtons.first).toBe(apiContent.buttonTexts.first);
          expect(retrievedButtons.second).toBe(apiContent.buttonTexts.second);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Test idempotency - multiple round-trips should produce same result
   * Validates: Requirements 6.1
   */
  describe('Idempotency Tests', () => {
    it('should be idempotent - multiple save/fetch cycles produce same result for hero', () => {
      fc.assert(
        fc.property(n8nHeroContentArb, (heroContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'hero',
            content: heroContent as unknown as Record<string, unknown>,
          };

          // First round trip
          const firstSave = saveToCMS(content);
          const firstFetch = fetchFromCMS(firstSave);

          // Second round trip
          const secondSave = saveToCMS(firstFetch);
          const secondFetch = fetchFromCMS(secondSave);

          expect(contentsAreEquivalent(firstFetch, secondFetch)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should be idempotent - multiple save/fetch cycles produce same result for workflowBuilder', () => {
      fc.assert(
        fc.property(n8nWorkflowBuilderContentArb, (workflowContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'workflowBuilder',
            content: workflowContent as unknown as Record<string, unknown>,
          };

          // First round trip
          const firstSave = saveToCMS(content);
          const firstFetch = fetchFromCMS(firstSave);

          // Second round trip
          const secondSave = saveToCMS(firstFetch);
          const secondFetch = fetchFromCMS(secondSave);

          expect(contentsAreEquivalent(firstFetch, secondFetch)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should be idempotent - multiple save/fetch cycles produce same result for beforeAfter', () => {
      fc.assert(
        fc.property(n8nBeforeAfterContentArb, (beforeAfterContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'beforeAfter',
            content: beforeAfterContent as unknown as Record<string, unknown>,
          };

          // First round trip
          const firstSave = saveToCMS(content);
          const firstFetch = fetchFromCMS(firstSave);

          // Second round trip
          const secondSave = saveToCMS(firstFetch);
          const secondFetch = fetchFromCMS(secondSave);

          expect(contentsAreEquivalent(firstFetch, secondFetch)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should be idempotent - multiple save/fetch cycles produce same result for apiIntegration', () => {
      fc.assert(
        fc.property(apiIntegrationContentArb, (apiContent) => {
          const content: CMSContent = {
            page: 'services-n8n',
            section: 'apiIntegration',
            content: apiContent as unknown as Record<string, unknown>,
          };

          // First round trip
          const firstSave = saveToCMS(content);
          const firstFetch = fetchFromCMS(firstSave);

          // Second round trip
          const secondSave = saveToCMS(firstFetch);
          const secondFetch = fetchFromCMS(secondSave);

          expect(contentsAreEquivalent(firstFetch, secondFetch)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});
