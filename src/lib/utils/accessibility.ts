/**
 * Accessibility Utilities
 * Provides functions for validating and ensuring accessibility compliance
 */

/**
 * Validates heading hierarchy in HTML content
 * Ensures headings follow proper order (H1 -> H2 -> H3) without skipping levels
 */
export function validateHeadingHierarchy(html: string): {
  isValid: boolean;
  errors: string[];
  headings: { level: number; text: string }[];
} {
  const errors: string[] = [];
  const headings: { level: number; text: string }[] = [];

  // Extract all heading tags (h1-h6)
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim(); // Strip inner HTML tags
    headings.push({ level, text });
  }

  // Validate hierarchy
  let previousLevel = 0;

  for (let i = 0; i < headings.length; i++) {
    const currentLevel = headings[i].level;

    // First heading should be H1
    if (i === 0 && currentLevel !== 1) {
      errors.push(`First heading should be H1, but found H${currentLevel}`);
    }

    // Check for skipped levels
    if (currentLevel > previousLevel + 1) {
      errors.push(
        `Heading level skipped: jumped from H${previousLevel} to H${currentLevel} (text: "${headings[i].text}")`
      );
    }

    previousLevel = currentLevel;
  }

  return {
    isValid: errors.length === 0,
    errors,
    headings,
  };
}

/**
 * Checks if an element has visible focus indicators
 */
export function hasFocusIndicator(styles: CSSStyleDeclaration): boolean {
  const outline = styles.outline;
  const outlineWidth = styles.outlineWidth;
  const outlineStyle = styles.outlineStyle;
  const outlineColor = styles.outlineColor;

  // Check if outline is explicitly set to none
  if (outline === 'none' || outlineStyle === 'none') {
    return false;
  }

  // Check if outline width is at least 2px
  const widthValue = parseFloat(outlineWidth);
  if (widthValue < 2) {
    return false;
  }

  // Check if outline color is not transparent
  if (outlineColor === 'transparent' || outlineColor === 'rgba(0, 0, 0, 0)') {
    return false;
  }

  return true;
}

/**
 * Validates ARIA labels on interactive elements
 */
export function validateAriaLabels(html: string): {
  isValid: boolean;
  errors: string[];
  elements: { tag: string; hasLabel: boolean; labelText?: string }[];
} {
  const errors: string[] = [];
  const elements: { tag: string; hasLabel: boolean; labelText?: string }[] = [];

  // Interactive elements that require ARIA labels
  const interactiveElements = [
    'button',
    'a',
    'input',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
  ];

  // Check each type of interactive element
  for (const selector of interactiveElements) {
    const tagName = selector.replace(/\[.*?\]/, '');
    const regex = new RegExp(`<${tagName}[^>]*>.*?<\/${tagName}>`, 'gis');
    let match;

    while ((match = regex.exec(html)) !== null) {
      const elementHtml = match[0];

      // Check for aria-label
      const ariaLabelMatch = elementHtml.match(/aria-label=["']([^"']+)["']/i);

      // Check for aria-labelledby
      const ariaLabelledByMatch = elementHtml.match(
        /aria-labelledby=["']([^"']+)["']/i
      );

      // Check for text content (for buttons and links)
      // Extract content between opening and closing tags
      const contentMatch = elementHtml.match(
        new RegExp(`<${tagName}[^>]*>(.*?)<\/${tagName}>`, 'is')
      );
      const content = contentMatch
        ? contentMatch[1].replace(/<[^>]*>/g, '').trim()
        : '';
      const hasTextContent = content.length > 0;

      // Check for alt attribute (for images in links/buttons)
      const hasAlt = elementHtml.includes('alt=');

      const hasLabel = !!(
        ariaLabelMatch ||
        ariaLabelledByMatch ||
        hasTextContent ||
        hasAlt
      );

      elements.push({
        tag: selector,
        hasLabel,
        labelText: ariaLabelMatch?.[1] || ariaLabelledByMatch?.[1],
      });

      if (!hasLabel) {
        errors.push(
          `Interactive element <${selector}> missing accessible label`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    elements,
  };
}

/**
 * Calculates color contrast ratio between two colors
 * Based on WCAG 2.1 guidelines
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // Convert hex to RGB
  const hexToRgb = (
    hex: string
  ): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex colors (e.g., #FFFFFF)');
  }

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validates color contrast meets WCAG standards
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false
): {
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  requiredRatio: number;
} {
  const ratio = calculateContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3.0 : 4.5;
  const requiredRatioAAA = isLargeText ? 4.5 : 7.0;

  return {
    ratio,
    meetsAA: ratio >= requiredRatio,
    meetsAAA: ratio >= requiredRatioAAA,
    requiredRatio,
  };
}

/**
 * Checks if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Validates Core Web Vitals metrics
 */
export interface CoreWebVitals {
  lcp: number; // Largest Contentful Paint (ms)
  fid: number; // First Input Delay (ms)
  cls: number; // Cumulative Layout Shift (score)
}

export function validateCoreWebVitals(metrics: CoreWebVitals): {
  isValid: boolean;
  errors: string[];
  metrics: {
    lcp: { value: number; threshold: number; passes: boolean };
    fid: { value: number; threshold: number; passes: boolean };
    cls: { value: number; threshold: number; passes: boolean };
  };
} {
  const errors: string[] = [];

  const lcpThreshold = 1800; // 1.8 seconds
  const fidThreshold = 10; // 10ms
  const clsThreshold = 0.05; // 0.05 score

  // Check for invalid values (NaN, Infinity)
  if (!Number.isFinite(metrics.lcp)) {
    errors.push(`LCP value is invalid: ${metrics.lcp}`);
  }
  if (!Number.isFinite(metrics.fid)) {
    errors.push(`FID value is invalid: ${metrics.fid}`);
  }
  if (!Number.isFinite(metrics.cls)) {
    errors.push(`CLS value is invalid: ${metrics.cls}`);
  }

  const lcpPasses = Number.isFinite(metrics.lcp) && metrics.lcp <= lcpThreshold;
  const fidPasses = Number.isFinite(metrics.fid) && metrics.fid <= fidThreshold;
  const clsPasses = Number.isFinite(metrics.cls) && metrics.cls <= clsThreshold;

  if (Number.isFinite(metrics.lcp) && !lcpPasses) {
    errors.push(`LCP ${metrics.lcp}ms exceeds threshold of ${lcpThreshold}ms`);
  }

  if (Number.isFinite(metrics.fid) && !fidPasses) {
    errors.push(`FID ${metrics.fid}ms exceeds threshold of ${fidThreshold}ms`);
  }

  if (Number.isFinite(metrics.cls) && !clsPasses) {
    errors.push(`CLS ${metrics.cls} exceeds threshold of ${clsThreshold}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    metrics: {
      lcp: { value: metrics.lcp, threshold: lcpThreshold, passes: lcpPasses },
      fid: { value: metrics.fid, threshold: fidThreshold, passes: fidPasses },
      cls: { value: metrics.cls, threshold: clsThreshold, passes: clsPasses },
    },
  };
}
