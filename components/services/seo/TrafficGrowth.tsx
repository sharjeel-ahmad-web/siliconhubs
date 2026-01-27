'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface DataPoint {
  month: string;
  traffic: number;
  conversions: number;
}

export interface Milestone {
  index: number;
  label: string;
  icon: string;
}

export interface TrafficGrowthProps {
  data?: DataPoint[];
  milestones?: Milestone[];
  title?: string;
  subtitle?: string;
  totalGrowthLabel?: string;
  monthlyVisitorsLabel?: string;
  conversionsLabel?: string;
  conversionRateLabel?: string;
}

const defaultData: DataPoint[] = [
  { month: 'Jan', traffic: 1200, conversions: 24 },
  { month: 'Feb', traffic: 1800, conversions: 36 },
  { month: 'Mar', traffic: 2500, conversions: 50 },
  { month: 'Apr', traffic: 3200, conversions: 64 },
  { month: 'May', traffic: 4100, conversions: 82 },
  { month: 'Jun', traffic: 5300, conversions: 106 },
  { month: 'Jul', traffic: 6800, conversions: 136 },
  { month: 'Aug', traffic: 8500, conversions: 170 },
  { month: 'Sep', traffic: 10200, conversions: 204 },
  { month: 'Oct', traffic: 12500, conversions: 250 },
  { month: 'Nov', traffic: 15000, conversions: 300 },
  { month: 'Dec', traffic: 18000, conversions: 360 },
];

const defaultMilestones: Milestone[] = [
  { index: 2, label: '2.5K Visitors', icon: '🎯' },
  { index: 5, label: '5K Visitors', icon: '🚀' },
  { index: 8, label: '10K Visitors', icon: '⭐' },
  { index: 11, label: '18K Visitors', icon: '🎉' },
];

/**
 * TrafficGrowth Component
 *
 * Performance timeline showing organic traffic growth with animated line chart.
 * Displays milestone celebrations with particle effects at key achievements.
 *
 * Validates: Requirements 14.4, 14.7, 14.8
 */
export function TrafficGrowth({
  data: propData,
  milestones: propMilestones,
  title = 'Organic Traffic Growth',
  subtitle = 'Watch your website traffic soar with strategic SEO',
  totalGrowthLabel = 'Total Growth',
  monthlyVisitorsLabel = 'Monthly Visitors',
  conversionsLabel = 'Conversions',
  conversionRateLabel = 'Conversion Rate',
}: TrafficGrowthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const data = propData && propData.length > 0 ? propData : defaultData;
  const milestones =
    propMilestones && propMilestones.length > 0
      ? propMilestones
      : defaultMilestones;

  useEffect(() => {
    // Animate progress from 0 to 1 over 2 seconds
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animate();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Draw chart
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const padding = 40;
      const chartWidth = canvas.offsetWidth - padding * 2;
      const chartHeight = canvas.offsetHeight - padding * 2;
      const maxTraffic = Math.max(...data.map((d) => d.traffic));

      // Calculate points
      const points = data.map((d, i) => ({
        x: padding + (i / (data.length - 1)) * chartWidth,
        y: padding + chartHeight - (d.traffic / maxTraffic) * chartHeight,
      }));

      // Draw grid lines
      ctx.strokeStyle = '#64748B20';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
      }

      // Draw area under curve
      const gradient = ctx.createLinearGradient(
        0,
        padding,
        0,
        padding + chartHeight
      );
      gradient.addColorStop(0, '#F9731640');
      gradient.addColorStop(1, '#F9731600');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding + chartHeight);

      const visiblePoints = Math.floor(points.length * animationProgress);
      for (let i = 0; i <= visiblePoints; i++) {
        const point = points[Math.min(i, points.length - 1)];
        ctx.lineTo(point.x, point.y);
      }

      ctx.lineTo(
        points[Math.min(visiblePoints, points.length - 1)].x,
        padding + chartHeight
      );
      ctx.closePath();
      ctx.fill();

      // Draw line
      ctx.strokeStyle = '#F97316';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i <= visiblePoints; i++) {
        const point = points[Math.min(i, points.length - 1)];
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();

      // Draw points
      points.slice(0, visiblePoints + 1).forEach((point, i) => {
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          point.x,
          point.y,
          0,
          point.x,
          point.y,
          15
        );
        glowGradient.addColorStop(0, '#F9731680');
        glowGradient.addColorStop(1, '#F9731600');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Point
        ctx.fillStyle = hoveredPoint === i ? '#F97316' : '#2563EB';
        ctx.beginPath();
        ctx.arc(point.x, point.y, hoveredPoint === i ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        // White center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    draw();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [animationProgress, hoveredPoint, data]);

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden rounded-2xl bg-[#0F172A] p-8">
      {/* Background effect */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, #F97316 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <h3 className="mb-2 text-3xl font-bold text-white">{title}</h3>
        <p className="text-[#64748B]">{subtitle}</p>
      </div>

      {/* Chart */}
      <div className="relative z-10 mb-6">
        <canvas
          ref={canvasRef}
          className="h-[350px] w-full"
          style={{ width: '100%', height: '350px' }}
        />

        {/* Month labels */}
        <div className="mt-2 flex justify-between px-10">
          {data.map((d, i) => (
            <div
              key={d.month}
              className="cursor-pointer text-sm text-[#64748B] transition-colors hover:text-white"
              onMouseEnter={() => setHoveredPoint(i)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {d.month}
            </div>
          ))}
        </div>

        {/* Milestone markers */}
        {milestones.map((milestone) => {
          const isVisible = animationProgress >= milestone.index / data.length;

          return (
            isVisible && (
              <motion.div
                key={milestone.index}
                className="absolute"
                style={{
                  left: `${(milestone.index / (data.length - 1)) * 100}%`,
                  top: '20%',
                }}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: (milestone.index / data.length) * 2,
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 200,
                }}
              >
                <div className="relative -translate-x-1/2 transform">
                  {/* Particle burst effect */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 2, 0] }}
                    transition={{
                      delay: (milestone.index / data.length) * 2 + 0.3,
                      duration: 1,
                    }}
                  >
                    <div className="text-4xl">{milestone.icon}</div>
                  </motion.div>

                  {/* Label */}
                  <div className="whitespace-nowrap rounded-lg bg-[#F97316] px-3 py-2 text-sm font-bold text-white shadow-lg">
                    {milestone.label}
                  </div>
                </div>
              </motion.div>
            )
          );
        })}
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-4 gap-4">
        <motion.div
          className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          <div className="mb-1 text-sm text-[#64748B]">{totalGrowthLabel}</div>
          <div className="text-2xl font-bold text-[#F97316]">
            {Math.round(
              (data[data.length - 1].traffic / data[0].traffic - 1) * 100
            )}
            %
          </div>
        </motion.div>

        <motion.div
          className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.5 }}
        >
          <div className="mb-1 text-sm text-[#64748B]">
            {monthlyVisitorsLabel}
          </div>
          <div className="text-2xl font-bold text-white">
            {(data[data.length - 1].traffic / 1000).toFixed(1)}K
          </div>
        </motion.div>

        <motion.div
          className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.5 }}
        >
          <div className="mb-1 text-sm text-[#64748B]">{conversionsLabel}</div>
          <div className="text-2xl font-bold text-white">
            {data[data.length - 1].conversions}
          </div>
        </motion.div>

        <motion.div
          className="rounded-lg border border-[#64748B]/30 bg-[#1E293B]/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.5 }}
        >
          <div className="mb-1 text-sm text-[#64748B]">
            {conversionRateLabel}
          </div>
          <div className="text-2xl font-bold text-white">
            {(
              (data[data.length - 1].conversions /
                data[data.length - 1].traffic) *
              100
            ).toFixed(1)}
            %
          </div>
        </motion.div>
      </div>
    </div>
  );
}
