/**
 * Utility functions for BeforeAfterSlider component
 * Used for property-based testing of fallback behavior
 */

// Re-export types from the component
export interface ProcessStep {
  step: number;
  text: string;
  time: string;
}

export interface ProcessConfig {
  title: string;
  steps: ProcessStep[];
  totalTime: string;
  summary: string;
}

// Default fallback content - must match the component's defaults
export const defaultManualProcess: ProcessConfig = {
  title: 'Manual Process',
  steps: [
    { step: 1, text: 'Receive email notification', time: '5 min' },
    { step: 2, text: 'Copy data to spreadsheet', time: '10 min' },
    { step: 3, text: 'Validate information', time: '8 min' },
    { step: 4, text: 'Update CRM manually', time: '12 min' },
    { step: 5, text: 'Send confirmation email', time: '5 min' },
  ],
  totalTime: '40 minutes',
  summary: 'High error rate, manual effort',
};

export const defaultAutomatedProcess: ProcessConfig = {
  title: 'Automated Process',
  steps: [
    { step: 1, text: 'Webhook receives data', time: '< 1 sec' },
    { step: 2, text: 'Auto-validate & parse', time: '< 1 sec' },
    { step: 3, text: 'Update CRM via API', time: '< 1 sec' },
    { step: 4, text: 'Send confirmation', time: '< 1 sec' },
    { step: 5, text: 'Log to analytics', time: '< 1 sec' },
  ],
  totalTime: '5 seconds',
  summary: 'Zero errors, fully automated',
};

/**
 * Resolves process config with fallback to defaults
 * This function mirrors the component's fallback logic for testing
 *
 * @param manualProcess - Optional manual process config from CMS
 * @param automatedProcess - Optional automated process config from CMS
 * @returns Resolved process configs with defaults applied
 */
export function resolveProcessConfigs(
  manualProcess?: ProcessConfig | null,
  automatedProcess?: ProcessConfig | null
): { manual: ProcessConfig; automated: ProcessConfig } {
  return {
    manual: manualProcess || defaultManualProcess,
    automated: automatedProcess || defaultAutomatedProcess,
  };
}

/**
 * Validates that a ProcessConfig has all required fields
 *
 * @param config - The process config to validate
 * @returns true if valid, false otherwise
 */
export function isValidProcessConfig(config: unknown): config is ProcessConfig {
  if (!config || typeof config !== 'object') return false;

  const c = config as Record<string, unknown>;

  if (typeof c.title !== 'string' || c.title.length === 0) return false;
  if (typeof c.totalTime !== 'string' || c.totalTime.length === 0) return false;
  if (typeof c.summary !== 'string' || c.summary.length === 0) return false;
  if (!Array.isArray(c.steps) || c.steps.length === 0) return false;

  // Validate each step
  for (const step of c.steps) {
    if (!step || typeof step !== 'object') return false;
    const s = step as Record<string, unknown>;
    if (typeof s.step !== 'number') return false;
    if (typeof s.text !== 'string' || s.text.length === 0) return false;
    if (typeof s.time !== 'string' || s.time.length === 0) return false;
  }

  return true;
}
