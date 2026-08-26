'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface SliderConfig {
  label: string;
  min: number;
  max: number;
  default: number;
  prefix?: string;
  suffix?: string;
  step?: number;
}

interface ROICalculatorProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  sliders?: SliderConfig[];
  savingsMultiplier?: number;
  ctaText?: string;
  ctaHref?: string;
  resultLabels?: {
    currentCost: string;
    estimatedSavings: string;
    roi: string;
    paybackPeriod: string;
  };
  accentColor?: string;
}

const defaultSliders: SliderConfig[] = [
  {
    label: 'Manual Hours Per Week',
    min: 5,
    max: 100,
    default: 40,
    suffix: ' hrs',
  },
  {
    label: 'Hourly Employee Cost',
    min: 20,
    max: 200,
    default: 50,
    prefix: '$',
  },
  { label: 'Number of Employees', min: 1, max: 50, default: 5 },
];

const defaultResultLabels = {
  currentCost: 'Current Yearly Cost',
  estimatedSavings: 'Estimated Yearly Savings',
  roi: 'Return on Investment',
  paybackPeriod: 'Payback Period',
};

export default function ROICalculator({
  eyebrow = 'Calculate Your Savings',
  title = 'ROI',
  titleHighlight = 'Calculator',
  subtitle = 'See how much you could save by automating your workflows with a custom SaaS solution.',
  sliders = defaultSliders,
  savingsMultiplier = 0.7,
  ctaText = 'Get Custom Quote',
  ctaHref = '/contact',
  resultLabels = defaultResultLabels,
  accentColor = '#06b6d4',
}: ROICalculatorProps) {
  const [values, setValues] = useState<number[]>(sliders.map((s) => s.default));

  const calculations = useMemo(() => {
    const [hours, hourlyRate, employees] = values;
    const weeksPerYear = 52;

    const currentYearlyCost = hours * hourlyRate * employees * weeksPerYear;
    const estimatedSavings = currentYearlyCost * savingsMultiplier;
    const implementationCost = 25000; // Assumed average project cost
    const roi =
      ((estimatedSavings - implementationCost) / implementationCost) * 100;
    const paybackMonths = Math.ceil(
      implementationCost / (estimatedSavings / 12)
    );

    return {
      currentYearlyCost,
      estimatedSavings,
      roi: Math.max(roi, 0),
      paybackMonths: Math.min(paybackMonths, 24),
    };
  }, [values, savingsMultiplier]);

  const handleSliderChange = (index: number, value: number) => {
    setValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  };

  return (
    <section className="bg-navy/50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span
            className="text-sm font-medium uppercase tracking-wider"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {title} <span style={{ color: accentColor }}>{titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#94A3B8]">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Sliders */}
          <motion.div
            className="rounded-2xl border border-slate-700/50 bg-navy p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Calculator
                  className="h-6 w-6"
                  style={{ color: accentColor }}
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                Your Current Situation
              </h3>
            </div>

            <div className="space-y-8">
              {sliders.map((slider, i) => (
                <div key={i}>
                  <div className="mb-2 flex justify-between">
                    <label className="font-medium text-slate-300">
                      {slider.label}
                    </label>
                    <span className="font-bold text-white">
                      {slider.prefix}
                      {values[i]}
                      {slider.suffix}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step || 1}
                    value={values[i]}
                    onChange={(e) =>
                      handleSliderChange(i, Number(e.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-[#06b6d4]"
                    style={{ accentColor }}
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>
                      {slider.prefix}
                      {slider.min}
                      {slider.suffix}
                    </span>
                    <span>
                      {slider.prefix}
                      {slider.max}
                      {slider.suffix}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            className="rounded-2xl border border-slate-700/50 bg-navy p-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="rounded-xl p-3"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <TrendingUp
                  className="h-6 w-6"
                  style={{ color: accentColor }}
                />
              </div>
              <h3 className="text-xl font-bold text-white">
                Your Potential Savings
              </h3>
            </div>

            <div className="space-y-6">
              {/* Current Cost */}
              <div className="rounded-xl border border-slate-700/30 bg-navy p-4">
                <div className="mb-1 flex items-center gap-2 text-slate-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">{resultLabels.currentCost}</span>
                </div>
                <motion.div
                  className="text-3xl font-bold text-white"
                  key={calculations.currentYearlyCost}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  ${calculations.currentYearlyCost.toLocaleString()}
                </motion.div>
              </div>

              {/* Estimated Savings */}
              <div
                className="rounded-xl border-2 p-4"
                style={{
                  backgroundColor: `${accentColor}10`,
                  borderColor: `${accentColor}50`,
                }}
              >
                <div
                  className="mb-1 flex items-center gap-2"
                  style={{ color: accentColor }}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">
                    {resultLabels.estimatedSavings}
                  </span>
                </div>
                <motion.div
                  className="text-4xl font-bold"
                  style={{ color: accentColor }}
                  key={calculations.estimatedSavings}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  ${calculations.estimatedSavings.toLocaleString()}
                </motion.div>
              </div>

              {/* ROI and Payback */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-700/30 bg-navy p-4">
                  <span className="text-sm text-slate-400">
                    {resultLabels.roi}
                  </span>
                  <div className="text-2xl font-bold text-green-400">
                    {calculations.roi.toFixed(0)}%
                  </div>
                </div>
                <div className="rounded-xl border border-slate-700/30 bg-navy p-4">
                  <span className="text-sm text-slate-400">
                    {resultLabels.paybackPeriod}
                  </span>
                  <div className="flex items-center gap-1 text-2xl font-bold text-white">
                    <Clock className="h-5 w-5 text-slate-400" />
                    {calculations.paybackMonths} mo
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href={ctaHref ?? '#'}
                className="block w-full rounded-xl py-4 text-center font-semibold text-white transition-all hover:scale-105"
                style={{ backgroundColor: accentColor }}
              >
                {ctaText}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
