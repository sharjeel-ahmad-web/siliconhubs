'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  epoch: number;
  accuracy: number;
}

interface MetricConfig {
  label: string;
  color: string;
  prefix?: string;
  suffix?: string;
  value?: string;
}

interface ChartConfig {
  xAxisLabel: string;
  yAxisLabel: string;
  lineColor: string;
  gridColor: string;
}

export interface AccuracyChartProps {
  metrics?: MetricConfig[];
  chartConfig?: ChartConfig;
}

const defaultMetrics: MetricConfig[] = [
  { label: 'Current Accuracy', color: '#37AFE1', suffix: '%' },
  { label: 'Improvement', color: '#F97316', prefix: '+', suffix: '%' },
  { label: 'Training Epochs', color: '#31A4DB', suffix: '' },
  { label: 'Response Time', color: '#F97316', value: '<100ms' },
];

const defaultChartConfig: ChartConfig = {
  xAxisLabel: 'Training Epochs',
  yAxisLabel: 'Accuracy (%)',
  lineColor: '#37AFE1',
  gridColor: '#64748B',
};

export const AccuracyChart: React.FC<AccuracyChartProps> = ({
  metrics: propMetrics,
  chartConfig: propChartConfig,
}) => {
  const metrics =
    propMetrics && propMetrics.length > 0 ? propMetrics : defaultMetrics;
  const chartConfig = propChartConfig || defaultChartConfig;

  const [data, setData] = useState<DataPoint[]>([]);
  const [animatedData, setAnimatedData] = useState<DataPoint[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Generate accuracy improvement data
    const points: DataPoint[] = [];
    const epochs = 20;

    for (let i = 0; i <= epochs; i++) {
      // Simulate learning curve: starts low, improves quickly, then plateaus
      const baseAccuracy = 50;
      const improvement = 45 * (1 - Math.exp(-i / 5));
      const noise = (Math.random() - 0.5) * 3;
      const accuracy = Math.min(98, baseAccuracy + improvement + noise);

      points.push({
        epoch: i,
        accuracy: Math.round(accuracy * 10) / 10,
      });
    }

    setData(points);
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    // Animate data points appearing one by one
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < data.length) {
        setAnimatedData((prev) => [...prev, data[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (!canvasRef.current || animatedData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = chartConfig.gridColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // Draw axes
    ctx.strokeStyle = chartConfig.gridColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = chartConfig.gridColor;
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';

    // Y-axis labels (accuracy)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * (5 - i);
      const value = 50 + i * 10;
      ctx.fillText(`${value}%`, padding - 10, y + 4);
    }

    // X-axis labels (epochs)
    ctx.textAlign = 'center';
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      const value = i * 2;
      ctx.fillText(`${value}`, x, height - padding + 20);
    }

    // Axis titles
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(chartConfig.xAxisLabel, width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(chartConfig.yAxisLabel, 0, 0);
    ctx.restore();

    // Draw line chart
    const validData = animatedData.filter(
      (point): point is DataPoint =>
        point !== undefined &&
        point !== null &&
        typeof point.epoch === 'number' &&
        typeof point.accuracy === 'number'
    );

    if (validData.length > 1) {
      ctx.strokeStyle = chartConfig.lineColor;
      ctx.lineWidth = 3;
      ctx.beginPath();

      validData.forEach((point, i) => {
        const x = padding + (point.epoch / 20) * chartWidth;
        const y = height - padding - ((point.accuracy - 50) / 50) * chartHeight;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw gradient fill under line
      const lastPoint = validData[validData.length - 1];
      ctx.lineTo(
        padding + (lastPoint.epoch / 20) * chartWidth,
        height - padding
      );
      ctx.lineTo(padding, height - padding);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(
        0,
        padding,
        0,
        height - padding
      );
      gradient.addColorStop(0, `${chartConfig.lineColor}4D`); // 30% opacity
      gradient.addColorStop(1, `${chartConfig.lineColor}00`); // 0% opacity
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw data points
      validData.forEach((point) => {
        const x = padding + (point.epoch / 20) * chartWidth;
        const y = height - padding - ((point.accuracy - 50) / 50) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = chartConfig.lineColor;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = chartConfig.lineColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
  }, [animatedData, chartConfig]);

  // Use final data values when animation is complete, otherwise use animated values
  const isAnimationComplete =
    animatedData.length === data.length && data.length > 0;
  const displayPoint = isAnimationComplete
    ? data[data.length - 1]
    : animatedData.length > 0
      ? animatedData[animatedData.length - 1]
      : null;
  const currentAccuracy = displayPoint?.accuracy ?? 0;
  const currentEpoch = displayPoint?.epoch ?? 0;

  // Calculate metric values
  const getMetricValue = (index: number): string => {
    const metric = metrics[index];
    if (metric?.value) return metric.value;

    switch (index) {
      case 0: // Current Accuracy
        return `${metric?.prefix || ''}${currentAccuracy.toFixed(1)}${metric?.suffix || ''}`;
      case 1: // Improvement
        return `${metric?.prefix || '+'}${currentAccuracy > 0 ? (currentAccuracy - 50).toFixed(1) : 0}${metric?.suffix || '%'}`;
      case 2: // Training Epochs
        return `${metric?.prefix || ''}${currentEpoch}${metric?.suffix || ''}`;
      case 3: // Response Time
        return metric?.value || '<100ms';
      default:
        return '';
    }
  };

  return (
    <div className="w-full">
      <div className="relative h-[500px] w-full overflow-hidden rounded-lg border border-[#64748B]/20 bg-[#0F172A] p-6">
        <canvas
          ref={canvasRef}
          width={1000}
          height={500}
          className="h-full w-full"
        />
      </div>

      {/* Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            className="rounded-lg border border-[#64748B]/20 bg-[#0F172A] p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="mb-2 text-sm text-[#64748B]">{metric.label}</div>
            <div className="text-3xl font-bold" style={{ color: metric.color }}>
              {getMetricValue(index)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
