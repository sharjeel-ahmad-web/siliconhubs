'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export interface Metric {
  label: string;
  value: string;
  target: number;
  unit: string;
  color: string;
  icon: string;
}

export interface Benefit {
  title: string;
  description: string;
}

export interface PerformanceMetricsProps {
  metrics?: Metric[];
  benefits?: Benefit[];
  benefitsTitle?: string;
}

const defaultMetrics: Metric[] = [
  {
    label: 'Time Saved',
    value: '95',
    target: 95,
    unit: '%',
    color: '#F97316',
    icon: '⏱️',
  },
  {
    label: 'Cost Reduction',
    value: '80',
    target: 80,
    unit: '%',
    color: '#2563EB',
    icon: '💰',
  },
  {
    label: 'Error Reduction',
    value: '99',
    target: 99,
    unit: '%',
    color: '#31A4DB',
    icon: '✓',
  },
  {
    label: 'Scalability',
    value: '10',
    target: 10,
    unit: 'x',
    color: '#F58122',
    icon: '📈',
  },
];

const defaultBenefits: Benefit[] = [
  {
    title: '24/7 Automation',
    description: 'Workflows run continuously without human intervention',
  },
  {
    title: 'Zero Human Error',
    description: 'Consistent execution eliminates manual mistakes',
  },
  {
    title: 'Instant Scalability',
    description: 'Handle 10x volume without additional resources',
  },
  {
    title: 'Real-time Monitoring',
    description: 'Track performance and identify issues instantly',
  },
];

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  metrics = defaultMetrics,
  benefits = defaultBenefits,
  benefitsTitle = 'Key Benefits',
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    if (isInView) {
      // Animate counting from 0 to target over 2 seconds
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        const newValues: Record<string, number> = {};
        metrics.forEach((metric) => {
          // Ease out animation
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          newValues[metric.label] = Math.floor(metric.target * easedProgress);
        });

        setAnimatedValues(newValues);

        if (currentStep >= steps) {
          clearInterval(timer);
          // Set final values
          const finalValues: Record<string, number> = {};
          metrics.forEach((metric) => {
            finalValues[metric.label] = metric.target;
          });
          setAnimatedValues(finalValues);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          className="relative overflow-hidden rounded-lg border border-[#64748B]/20 bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-10 blur-2xl"
            style={{
              background: `radial-gradient(circle at center, ${metric.color} 0%, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="mb-4 text-4xl">{metric.icon}</div>
            <div className="mb-2">
              <motion.span
                className="text-5xl font-bold"
                style={{ color: metric.color }}
              >
                {animatedValues[metric.label] || 0}
              </motion.span>
              <span className="ml-1 text-3xl font-bold text-white">
                {metric.unit}
              </span>
            </div>
            <p className="text-lg font-medium text-[#64748B]">{metric.label}</p>
          </div>

          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              border: `2px solid ${metric.color}`,
              opacity: 0,
            }}
            animate={
              isInView
                ? {
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.02, 1],
                  }
                : {}
            }
            transition={{
              duration: 2,
              delay: index * 0.1,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      ))}

      {/* Additional Details */}
      <motion.div
        className="col-span-1 mt-8 rounded-lg border border-[#2563EB]/20 bg-gradient-to-r from-[#2563EB]/10 to-[#37AFE1]/10 p-8 md:col-span-2 lg:col-span-4"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3 className="mb-4 text-2xl font-bold text-white">{benefitsTitle}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#37AFE1]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8L6 11L13 4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-white">{benefit.title}</p>
                <p className="text-sm text-[#64748B]">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
