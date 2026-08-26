/**
 * Feature: n8n-components-cms, Property 4: Node Color Mapping Consistency
 * Validates: Requirements 2.2
 *
 * Property: For any node type (trigger, action, condition, output), the color returned
 * by the color mapping function should match the configured color for that type.
 */

import * as fc from 'fast-check';
import {
  getNodeColorFromMapping,
  NodeTypeColors,
  WorkflowNode,
} from '../workflowBuilderUtils';

// All valid node types
const NODE_TYPES: WorkflowNode['type'][] = [
  'trigger',
  'action',
  'condition',
  'output',
];

// Default node colors - must match the component's defaults
const defaultNodeColors: NodeTypeColors = {
  trigger: '#2563EB', // Primary Blue
  action: '#7C3AED', // Secondary Purple
  condition: '#F59E0B', // Warning Amber
  output: '#10B981', // Success Green
};

/**
 * Generator for valid hex color strings
 */
const hexColorArb = fc.stringMatching(/^#[0-9A-Fa-f]{6}$/);

/**
 * Generator for valid NodeTypeColors objects
 */
const nodeTypeColorsArb: fc.Arbitrary<NodeTypeColors> = fc.record({
  trigger: hexColorArb,
  action: hexColorArb,
  condition: hexColorArb,
  output: hexColorArb,
});

/**
 * Generator for valid node types
 */
const nodeTypeArb: fc.Arbitrary<WorkflowNode['type']> = fc.constantFrom(
  ...NODE_TYPES
);

describe('WorkflowBuilder Node Color Mapping', () => {
  /**
   * Property 4: Node Color Mapping Consistency
   * For any node type and color mapping, the returned color should match the configured color
   */
  test('Property 4: Color mapping returns configured color for each node type', () => {
    fc.assert(
      fc.property(nodeTypeArb, nodeTypeColorsArb, (nodeType, colors) => {
        const returnedColor = getNodeColorFromMapping(nodeType, colors);

        // The returned color should exactly match the configured color for that type
        expect(returnedColor).toBe(colors[nodeType]);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 4: Default colors are returned correctly for all node types', () => {
    fc.assert(
      fc.property(nodeTypeArb, (nodeType) => {
        const returnedColor = getNodeColorFromMapping(
          nodeType,
          defaultNodeColors
        );

        // Should return the correct default color for each type
        expect(returnedColor).toBe(defaultNodeColors[nodeType]);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 4: Color mapping is deterministic', () => {
    fc.assert(
      fc.property(nodeTypeArb, nodeTypeColorsArb, (nodeType, colors) => {
        // Calling the function multiple times with same inputs should return same result
        const result1 = getNodeColorFromMapping(nodeType, colors);
        const result2 = getNodeColorFromMapping(nodeType, colors);

        expect(result1).toBe(result2);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 4: All node types have distinct colors in default mapping', () => {
    fc.assert(
      fc.property(fc.constant(defaultNodeColors), (colors) => {
        const colorValues = Object.values(colors);
        const uniqueColors = new Set(colorValues);

        // All default colors should be unique
        expect(uniqueColors.size).toBe(colorValues.length);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 4: Color mapping covers all node types', () => {
    fc.assert(
      fc.property(nodeTypeColorsArb, (colors) => {
        // Every node type should have a color defined
        NODE_TYPES.forEach((nodeType) => {
          const color = getNodeColorFromMapping(nodeType, colors);
          expect(color).toBeDefined();
          expect(typeof color).toBe('string');
          expect(color.length).toBeGreaterThan(0);
        });
      }),
      { numRuns: 100 }
    );
  });

  test('Property 4: Custom colors override defaults correctly', () => {
    const customColors: NodeTypeColors = {
      trigger: '#FF0000',
      action: '#00FF00',
      condition: '#0000FF',
      output: '#FFFF00',
    };

    fc.assert(
      fc.property(nodeTypeArb, (nodeType) => {
        const returnedColor = getNodeColorFromMapping(nodeType, customColors);

        // Custom colors should be returned, not defaults
        expect(returnedColor).toBe(customColors[nodeType]);
        expect(returnedColor).not.toBe(defaultNodeColors[nodeType]);
      }),
      { numRuns: 100 }
    );
  });
});
