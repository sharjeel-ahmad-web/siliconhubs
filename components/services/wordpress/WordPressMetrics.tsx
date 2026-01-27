'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * WordPressMetrics Component
 *
 * Displays performance metrics comparison showing loading speed, SEO score,
 * accessibility, and conversion rate improvements with counting animation.
 *
 * Validates: Requirements 12.3, 12.4
 */

export interface MetricItem {
  label: string;
  before: number;
  after: number;
  unit: string;
  format: 'number' | 'percentage' | 'score';
  inverse?: boolean; // true if lower is better (like loading speed)
}

export interface WordPressMetricsProps {
  metrics?: MetricItem[];
}

const defaultMetrics: MetricItem[] = [
  {
    label: 'Loading Speed',
    before: 4.2,
    after: 1.3,
    unit: 's',
    format: 'number',
    inverse: true,
  },
  {
    label: 'SEO Score',
    before: 72,
    after: 96,
    unit: '/100',
    format: 'score',
  },
  {
    label: 'Accessibility',
    before: 68,
    after: 94,
    unit: '/100',
    format: 'score',
  },
  {
    label: 'Conversion Rate',
    before: 2.1,
    after: 4.8,
    unit: '%',
    format: 'percentage',
  },
];

function useCountAnimation(
  end: number,
  duration: number = 2000,
  shouldStart: boolean = false
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function (power2.out)
      const easeOut = 1 - Math.pow(1 - progress, 2);
      setCount(end * easeOut);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, shouldStart]);

  return count;
}

function MetricCard({ metric, index }: { metric: MetricItem; index: number }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const beforeCount = useCountAnimation(metric.before, 2000, isInView);
  const afterCount = useCountAnimation(metric.after, 2000, isInView);

  const improvement = metric.inverse
    ? ((metric.before - metric.after) / metric.before) * 100
    : ((metric.after - metric.before) / metric.before) * 100;

  const formatValue = (value: number) => {
    if (metric.format === 'number') {
      return value.toFixed(1);
    }
    return Math.round(value);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="rounded-xl border border-[#F97316]/30 bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 transition-colors duration-300 hover:border-[#F97316]"
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#64748B]">
        {metric.label}
      </h3>

      <div className="mb-4 flex items-center justify-between">
        {/* Before */}
        <div className="text-center">
          <p className="mb-1 text-xs text-[#64748B]">Before</p>
          <p className="text-2xl font-bold text-white">
            {formatValue(beforeCount)}
            <span className="ml-1 text-sm text-[#64748B]">{metric.unit}</span>
          </p>
        </div>

        {/* Arrow */}
        <div className="flex flex-1 items-center justify-center px-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
          >
            <svg
              className="h-8 w-8 text-[#F97316]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.div>
        </div>

        {/* After */}
        <div className="text-center">
          <p className="mb-1 text-xs text-[#64748B]">After</p>
          <p className="text-2xl font-bold text-[#F97316]">
            {formatValue(afterCount)}
            <span className="ml-1 text-sm text-[#64748B]">{metric.unit}</span>
          </p>
        </div>
      </div>

      {/* Improvement percentage */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ delay: index * 0.1 + 1, duration: 0.8 }}
        className="h-2 w-full origin-left overflow-hidden rounded-full bg-[#0F172A]"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${Math.min(improvement, 100)}%` } : {}}
          transition={{ delay: index * 0.1 + 1.2, duration: 1 }}
          className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C]"
        />
      </motion.div>

      <p className="mt-2 text-center text-sm font-semibold text-[#F97316]">
        +{improvement.toFixed(0)}% improvement
      </p>
    </motion.div>
  );
}

export function WordPressMetrics({
  metrics: propMetrics,
}: WordPressMetricsProps) {
  const metrics =
    propMetrics && propMetrics.length > 0 ? propMetrics : defaultMetrics;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.label} metric={metric} index={index} />
        ))}
      </div>
    </div>
  );
}
