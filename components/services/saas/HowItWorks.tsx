'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Palette,
  Code,
  TestTube,
  Rocket,
  ChevronDown,
} from 'lucide-react';

interface Step {
  title: string;
  description: string;
  details: string;
  icon: string;
  color: string;
}

interface HowItWorksProps {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    title: 'Discovery',
    description: 'Understanding your needs',
    details:
      'We dive deep into your business requirements, analyze workflows, and identify opportunities for automation and improvement.',
    icon: 'search',
    color: '#37AFE1',
  },
  {
    title: 'Design',
    description: 'Crafting the solution',
    details:
      'Our designers create intuitive interfaces and user experiences that align with your brand and delight your users.',
    icon: 'palette',
    color: '#2563EB',
  },
  {
    title: 'Development',
    description: 'Building your platform',
    details:
      'Our engineers build scalable, secure, and performant applications using cutting-edge technologies and best practices.',
    icon: 'code',
    color: '#F97316',
  },
  {
    title: 'Testing',
    description: 'Ensuring quality',
    details:
      'Rigorous testing across devices and scenarios ensures your application is bug-free and performs flawlessly.',
    icon: 'test',
    color: '#31A4DB',
  },
  {
    title: 'Launch',
    description: 'Going live',
    details:
      'We handle deployment, monitoring, and provide ongoing support to ensure your SaaS succeeds in the market.',
    icon: 'rocket',
    color: '#F58122',
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  search: Search,
  palette: Palette,
  code: Code,
  test: TestTube,
  rocket: Rocket,
};

export default function HowItWorks({
  eyebrow = 'Our Process',
  title = 'How We Build Your',
  titleHighlight = 'SaaS',
  subtitle = 'A proven methodology that delivers results every time.',
  steps = defaultSteps,
}: HowItWorksProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-sm font-medium uppercase tracking-wider text-[#37AFE1]">
            {eyebrow}
          </span>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {title} <span className="text-[#37AFE1]">{titleHighlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#94A3B8]">
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 bg-gradient-to-b from-[#37AFE1] via-[#2563EB] to-[#F97316] md:block" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, i) => {
              const Icon = iconMap[step.icon] || Search;
              const isExpanded = expandedStep === i;
              const isEven = i % 2 === 0;

              return (
                <motion.div
                  key={i}
                  className={`relative flex flex-col items-center gap-4 md:flex-row md:gap-8 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Content Card */}
                  <div
                    className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}
                  >
                    <motion.div
                      className="cursor-pointer rounded-2xl border border-slate-700/50 bg-[#1E293B] p-6 transition-colors hover:border-slate-600"
                      onClick={() => setExpandedStep(isExpanded ? null : i)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div
                        className={`flex items-center gap-3 ${isEven ? 'md:flex-row-reverse' : ''}`}
                      >
                        <span
                          className="rounded-full px-3 py-1 text-sm font-bold"
                          style={{
                            backgroundColor: `${step.color}20`,
                            color: step.color,
                          }}
                        >
                          Step {i + 1}
                        </span>
                        <h3 className="text-xl font-bold text-white">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-[#94A3B8]">{step.description}</p>

                      {/* Expandable Details */}
                      <motion.div
                        initial={false}
                        animate={{
                          height: isExpanded ? 'auto' : 0,
                          opacity: isExpanded ? 1 : 0,
                        }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 border-t border-slate-700/50 pt-4 text-sm text-slate-400">
                          {step.details}
                        </p>
                      </motion.div>

                      <div
                        className={`mt-3 flex items-center gap-1 text-sm ${isEven ? 'md:justify-end' : ''}`}
                        style={{ color: step.color }}
                      >
                        <span>{isExpanded ? 'Less' : 'Learn more'}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Center Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#0F172A]"
                      style={{ backgroundColor: step.color }}
                      whileHover={{ scale: 1.1 }}
                      whileInView={{ rotate: [0, 360] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>
                  </div>

                  {/* Empty space for alignment */}
                  <div className="hidden flex-1 md:block" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
