'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface MetricData {
  label: string;
  target: number;
  unit: string;
  color: string;
}

export interface ShopifyDashboardProps {
  metrics?: MetricData[];
  chartTitle?: string;
  liveDataLabel?: string;
  monthLabels?: string[];
}

const defaultMetrics: MetricData[] = [
  { label: 'Revenue', target: 125000, unit: '$', color: '#F97316' },
  { label: 'Orders', target: 1250, unit: '', color: '#2563EB' },
  { label: 'Conversion Rate', target: 3.8, unit: '%', color: '#F97316' },
  { label: 'Avg Order Value', target: 98, unit: '$', color: '#2563EB' },
];

const defaultMonthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * ShopifyDashboard Component
 *
 * Performance dashboard displaying real-time charts with animated line/bar graphs.
 * Revenue flows represented as particles flowing into revenue visualization.
 *
 * Validates: Requirements 13.7, 13.8
 */
export function ShopifyDashboard({
  metrics: propMetrics,
  chartTitle = 'Revenue Trend',
  liveDataLabel = 'Live Data',
  monthLabels: propMonthLabels,
}: ShopifyDashboardProps) {
  const initialMetrics =
    propMetrics && propMetrics.length > 0 ? propMetrics : defaultMetrics;
  const monthLabels =
    propMonthLabels && propMonthLabels.length > 0
      ? propMonthLabels
      : defaultMonthLabels;

  const [animatedMetrics, setAnimatedMetrics] = useState(
    initialMetrics.map((m) => ({ ...m, value: 0 }))
  );

  const [chartData, setChartData] = useState<number[]>([
    65, 72, 58, 80, 75, 68, 82, 90, 78, 85, 92, 88,
  ]);

  // Animate metrics counting up
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedMetrics(
        initialMetrics.map((metric) => ({
          ...metric,
          value: Math.floor(metric.target * progress),
        }))
      );

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev.slice(1), 60 + Math.random() * 40];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {animatedMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="relative rounded-xl border border-white/10 bg-[#0F172A] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Label */}
            <div className="mb-2 text-sm text-white/60">{metric.label}</div>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              {metric.unit === '$' && (
                <span className="text-2xl font-bold text-white">
                  {metric.unit}
                </span>
              )}
              <motion.span
                className="text-4xl font-bold"
                style={{ color: metric.color }}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {metric.value.toLocaleString()}
              </motion.span>
              {metric.unit === '%' && (
                <span className="text-2xl font-bold text-white">
                  {metric.unit}
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: metric.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(metric.value / metric.target) * 100}%` }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>

            {/* Sparkle effect */}
            <motion.div
              className="absolute right-2 top-2 h-2 w-2 rounded-full"
              style={{ backgroundColor: metric.color }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        className="rounded-xl border border-white/10 bg-[#0F172A] p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="mb-6 text-2xl font-bold text-white">{chartTitle}</h3>

        {/* Chart */}
        <div className="relative h-64">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-t border-white/5" />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between gap-2">
            {chartData.map((value, index) => {
              const height = (value / 100) * 100;
              const barColor =
                value > 70 ? '#F97316' : value > 40 ? '#2563EB' : '#F97316';

              return (
                <motion.div
                  key={index}
                  className="group relative flex-1 rounded-t-lg"
                  style={{
                    background: `linear-gradient(to top, ${barColor}, ${barColor}80)`,
                    boxShadow: `0 0 20px ${barColor}40`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: 'easeOut',
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                    ${Math.round(value * 1000).toLocaleString()}
                  </div>

                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-t-lg"
                    style={{
                      background: `linear-gradient(to top, transparent, ${barColor}40)`,
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Revenue particles */}
          <div className="pointer-events-none absolute inset-0">
            {[15, 35, 55, 75, 90].map((leftPos, i) => (
              <motion.div
                key={i}
                className="absolute h-2 w-2 rounded-full bg-[#F97316]"
                style={{
                  left: `${leftPos}%`,
                  boxShadow: '0 0 10px #F97316',
                }}
                animate={{
                  y: [0, -250],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="mt-4 flex justify-between text-sm text-white/40">
          {monthLabels.map((month, index) => (
            <div
              key={month}
              className={index >= chartData.length ? 'opacity-30' : ''}
            >
              {month}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Real-time indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-white/60">
        <motion.div
          className="h-2 w-2 rounded-full bg-[#F97316]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <span>{liveDataLabel}</span>
      </div>
    </div>
  );
}
