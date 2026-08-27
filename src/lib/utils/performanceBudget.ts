/**
 * Performance Budget Checker
 * Validates that bundle sizes and resource sizes meet performance budgets
 */

export interface PerformanceBudget {
  javascript: number; // in KB
  css: number; // in KB
  images: number; // in KB
  fonts: number; // in KB
  total: number; // in KB
}

export const PERFORMANCE_BUDGETS: PerformanceBudget = {
  javascript: 350, // 350KB compressed
  css: 80, // 80KB
  images: 400, // 400KB above-fold
  fonts: 100, // 100KB
  total: 1000, // 1MB total initial load
};

export interface ResourceMetrics {
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'other';
  url: string;
  size: number; // in bytes
  transferSize: number; // compressed size in bytes
}

/**
 * Get all resource metrics from Performance API
 */
export function getResourceMetrics(): ResourceMetrics[] {
  if (typeof window === 'undefined' || !window.performance) {
    return [];
  }

  const resources = performance.getEntriesByType(
    'resource'
  ) as PerformanceResourceTiming[];

  return resources.map((resource) => {
    let type: ResourceMetrics['type'] = 'other';

    if (resource.initiatorType === 'script' || resource.name.endsWith('.js')) {
      type = 'script';
    } else if (
      resource.initiatorType === 'css' ||
      resource.name.endsWith('.css')
    ) {
      type = 'stylesheet';
    } else if (
      resource.initiatorType === 'img' ||
      /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(resource.name)
    ) {
      type = 'image';
    } else if (/\.(woff|woff2|ttf|otf|eot)$/i.test(resource.name)) {
      type = 'font';
    }

    return {
      type,
      url: resource.name,
      size: resource.decodedBodySize || 0,
      transferSize: resource.transferSize || 0,
    };
  });
}

/**
 * Calculate total size by resource type
 */
export function calculateResourceSizes(
  metrics: ResourceMetrics[]
): Record<string, number> {
  const sizes: Record<string, number> = {
    script: 0,
    stylesheet: 0,
    image: 0,
    font: 0,
    other: 0,
    total: 0,
  };

  metrics.forEach((metric) => {
    const sizeInKB = metric.transferSize / 1024;
    sizes[metric.type] += sizeInKB;
    sizes.total += sizeInKB;
  });

  return sizes;
}

/**
 * Check if performance budgets are met
 */
export function checkPerformanceBudgets(): {
  passed: boolean;
  budgets: PerformanceBudget;
  actual: Record<string, number>;
  violations: string[];
} {
  const metrics = getResourceMetrics();
  const actual = calculateResourceSizes(metrics);
  const violations: string[] = [];

  if (actual.script > PERFORMANCE_BUDGETS.javascript) {
    violations.push(
      `JavaScript budget exceeded: ${actual.script.toFixed(2)}KB / ${PERFORMANCE_BUDGETS.javascript}KB`
    );
  }

  if (actual.stylesheet > PERFORMANCE_BUDGETS.css) {
    violations.push(
      `CSS budget exceeded: ${actual.stylesheet.toFixed(2)}KB / ${PERFORMANCE_BUDGETS.css}KB`
    );
  }

  if (actual.image > PERFORMANCE_BUDGETS.images) {
    violations.push(
      `Image budget exceeded: ${actual.image.toFixed(2)}KB / ${PERFORMANCE_BUDGETS.images}KB`
    );
  }

  if (actual.font > PERFORMANCE_BUDGETS.fonts) {
    violations.push(
      `Font budget exceeded: ${actual.font.toFixed(2)}KB / ${PERFORMANCE_BUDGETS.fonts}KB`
    );
  }

  if (actual.total > PERFORMANCE_BUDGETS.total) {
    violations.push(
      `Total budget exceeded: ${actual.total.toFixed(2)}KB / ${PERFORMANCE_BUDGETS.total}KB`
    );
  }

  return {
    passed: violations.length === 0,
    budgets: PERFORMANCE_BUDGETS,
    actual,
    violations,
  };
}

/**
 * Get Core Web Vitals metrics
 */
export interface CoreWebVitals {
  lcp: number | null; // Largest Contentful Paint (ms)
  fid: number | null; // First Input Delay (ms)
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint (ms)
  ttfb: number | null; // Time to First Byte (ms)
}

export function getCoreWebVitals(): CoreWebVitals {
  if (typeof window === 'undefined' || !window.performance) {
    return {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
    };
  }

  const vitals: CoreWebVitals = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
  };

  // Get navigation timing for TTFB
  const navigation = performance.getEntriesByType(
    'navigation'
  )[0] as PerformanceNavigationTiming;
  if (navigation) {
    vitals.ttfb = navigation.responseStart - navigation.requestStart;
  }

  // Get paint timing for FCP
  const paintEntries = performance.getEntriesByType('paint');
  const fcpEntry = paintEntries.find(
    (entry) => entry.name === 'first-contentful-paint'
  );
  if (fcpEntry) {
    vitals.fcp = fcpEntry.startTime;
  }

  // LCP, FID, and CLS require web-vitals library or PerformanceObserver
  // These would be set up separately with the web-vitals library

  return vitals;
}

/**
 * Check if Core Web Vitals meet requirements
 */
export function checkCoreWebVitals(vitals: CoreWebVitals): {
  passed: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // LCP should be under 1.8 seconds (1800ms)
  if (vitals.lcp !== null && vitals.lcp > 1800) {
    violations.push(
      `LCP too slow: ${vitals.lcp.toFixed(0)}ms (target: <1800ms)`
    );
  }

  // FID should be under 10ms
  if (vitals.fid !== null && vitals.fid > 10) {
    violations.push(`FID too slow: ${vitals.fid.toFixed(2)}ms (target: <10ms)`);
  }

  // CLS should be under 0.05
  if (vitals.cls !== null && vitals.cls > 0.05) {
    violations.push(`CLS too high: ${vitals.cls.toFixed(3)} (target: <0.05)`);
  }

  // FCP should be under 1.8 seconds
  if (vitals.fcp !== null && vitals.fcp > 1800) {
    violations.push(
      `FCP too slow: ${vitals.fcp.toFixed(0)}ms (target: <1800ms)`
    );
  }

  // TTFB should be under 600ms
  if (vitals.ttfb !== null && vitals.ttfb > 600) {
    violations.push(
      `TTFB too slow: ${vitals.ttfb.toFixed(0)}ms (target: <600ms)`
    );
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}
