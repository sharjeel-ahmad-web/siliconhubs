/**
 * WorkflowBuilder utility functions and types
 * Extracted for testability - Requirements: 2.1, 2.2
 */

// Exported interfaces for CMS integration - Requirements: 2.1, 2.2
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'output';
  label: string;
  x: number;
  y: number;
  connections: string[];
}

export interface NodeTypeColors {
  trigger: string;
  action: string;
  condition: string;
  output: string;
}

// Default nodes configuration - Requirements: 2.3
export const defaultNodes: WorkflowNode[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    label: 'Webhook Trigger',
    x: 100,
    y: 200,
    connections: ['action-1'],
  },
  {
    id: 'action-1',
    type: 'action',
    label: 'Process Data',
    x: 300,
    y: 200,
    connections: ['condition-1'],
  },
  {
    id: 'condition-1',
    type: 'condition',
    label: 'Check Status',
    x: 500,
    y: 200,
    connections: ['output-1'],
  },
  {
    id: 'output-1',
    type: 'output',
    label: 'Send Email',
    x: 700,
    y: 200,
    connections: [],
  },
];

// Default node colors - Requirements: 2.2
export const defaultNodeColors: NodeTypeColors = {
  trigger: '#2563EB', // Primary Blue
  action: '#37AFE1', // Brand Blue
  condition: '#F59E0B', // Warning Amber
  output: '#31A4DB', // Brand Cyan
};

/**
 * Get node color from color mapping
 * Requirements: 2.2
 */
export const getNodeColorFromMapping = (
  type: WorkflowNode['type'],
  colors: NodeTypeColors
): string => {
  return colors[type];
};
