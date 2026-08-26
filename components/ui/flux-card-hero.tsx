'use client';

import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

// Export CardConfig interface for CMS integration
export interface CardConfig {
  bgColor: string;
  content: {
    type?: 'analytics' | 'projects' | 'chat-history';
    greeting?: string;
    subtitle?: string;
    title?: string;
  };
}

interface FluxCardHeroProps {
  title?: React.ReactNode;
  subtitle?: string;
  ctaButton?: {
    label: string;
    href: string;
  };
  cards?: CardConfig[];
}

// Default card configurations - used as fallback when CMS content is not available
const defaultCardConfigs: CardConfig[] = [
  {
    bgColor: 'bg-cyan',
    content: {
      greeting: 'Automate your workflows with N8N',
      subtitle: 'Connect apps and services seamlessly',
    },
  },
  {
    bgColor: 'bg-cyan',
    content: {
      type: 'analytics',
      greeting: 'Performance Analytics',
      subtitle: 'Automation Usage This Month',
    },
  },
  {
    bgColor: 'bg-orange',
    content: {
      type: 'projects',
      title: 'Active Workflows',
      subtitle: 'Your Automation Pipelines',
    },
  },
  {
    bgColor: 'bg-cyan',
    content: {
      type: 'chat-history',
    },
  },
];

export function FluxCardHero({
  title = (
    <>
      Automation Reimagined,
      <br />
      Efficiency Amplified
    </>
  ),
  subtitle = 'Transform manual workflows into intelligent automation systems that save time and reduce errors.',
  ctaButton = {
    label: 'Get Started',
    href: '/contact',
  },
  cards,
}: FluxCardHeroProps) {
  const [currentCard, setCurrentCard] = useState(0);

  // Use CMS cards with fallback to default cardConfigs
  // Requirements: 1.1, 1.3 - Accept cards from CMS with fallback to defaults
  const activeCards = cards && cards.length > 0 ? cards : defaultCardConfigs;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % activeCards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeCards.length]);

  const currentConfig = activeCards[currentCard];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-navy">
      {/* Gradient Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-32">
        {/* Main Heading */}
        <div className="mb-12 text-center">
          <h1
            className="mb-6 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent md:text-4xl lg:text-5xl"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #ffffff, #06b6d4, #fc4c00, #06b6d4, #ffffff)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            {title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400">
            {subtitle}
          </p>
        </div>

        {/* CTA Button */}
        <ParticleWrapper className="mb-16">
          <Link href={ctaButton?.href ?? '/'}>
            <StarButton
              className="group h-12 px-6 text-sm font-semibold transition-transform hover:scale-105"
              duration={2.5}
            >
              {ctaButton.label}
              <Zap className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </StarButton>
          </Link>
        </ParticleWrapper>

        {/* Animated Layered Cards Interface */}
        <div className="relative mx-auto w-full max-w-3xl">
          {/* Background Cards */}
          <div className="absolute inset-0 rotate-3 scale-95 transform transition-all duration-1000 ease-in-out">
            <div
              className={`h-72 w-full rounded-3xl bg-orange/60 opacity-50 shadow-2xl transition-all duration-1000 ${
                currentCard === 1 ? 'scale-105 opacity-70' : ''
              }`}
            />
          </div>
          <div className="scale-96 absolute inset-0 -rotate-2 transform transition-all delay-300 duration-1000 ease-in-out">
            <div
              className={`h-76 w-full rounded-3xl bg-cyan/60 opacity-60 shadow-2xl transition-all duration-1000 ${
                currentCard === 2 ? 'scale-105 opacity-80' : ''
              }`}
            />
          </div>
          <div className="scale-97 absolute inset-0 rotate-1 transform transition-all delay-500 duration-1000 ease-in-out">
            <div
              className={`h-72 w-full rounded-3xl bg-cyan/50 opacity-50 shadow-2xl transition-all duration-1000 ${
                currentCard === 3 ? 'scale-105 opacity-70' : ''
              }`}
            />
          </div>
          <div className="scale-98 absolute inset-0 -rotate-1 transform transition-all delay-700 duration-1000 ease-in-out">
            <div
              className={`h-72 w-full rounded-3xl bg-orange/40 opacity-40 shadow-2xl transition-all duration-1000 ${
                currentCard === 0 ? 'scale-105 opacity-60' : ''
              }`}
            />
          </div>

          {/* Main Animated Card */}
          <div
            className={`relative z-10 h-80 w-full ${currentConfig.bgColor} flex transform flex-col rounded-3xl p-6 shadow-2xl transition-all duration-1000 ease-in-out hover:scale-[1.02]`}
          >
            {/* Card Interface */}
            <div className="flex-1 rounded-2xl bg-white/25 p-5 backdrop-blur-sm transition-all duration-500">
              {/* Card Header */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="rounded-full bg-white/30 px-2 py-1 text-xs font-medium text-black/70">
                  N8N Workflow
                </span>
              </div>

              {/* Card Content */}
              <div className="space-y-4">
                {currentConfig.content.type === 'chat-history' ? (
                  <WorkflowHistory />
                ) : currentConfig.content.type === 'projects' ? (
                  <WorkflowDiagram />
                ) : currentConfig.content.type === 'analytics' ? (
                  <UsageAnalytics />
                ) : (
                  <DefaultContent config={currentConfig} />
                )}
              </div>
            </div>
          </div>

          {/* Card Indicators - Requirements: 1.4 - Indicator dots match card count */}
          <div className="mt-8 flex justify-center space-x-2">
            {activeCards.map((_, index) => (
              <ParticleWrapper key={index}>
                <button
                  onClick={() => setCurrentCard(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    currentCard === index
                      ? 'scale-125 bg-cyan'
                      : 'bg-gray-600 hover:bg-gray-400'
                  }`}
                />
              </ParticleWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-components for card content
function WorkflowHistory() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black/90">
          Recent Workflows
        </h3>
        <div className="h-1 w-12 rounded-full bg-white/60" />
      </div>
      <div className="space-y-3">
        <div className="flex cursor-pointer items-center space-x-3 rounded-xl bg-white/30 p-3 transition-all duration-200 hover:bg-white/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-black/90">
              Email Automation
            </div>
            <div className="text-xs text-black/60">12 min ago</div>
          </div>
          <div className="rounded-full bg-white/40 px-2 py-1 text-xs text-black/60">
            Active
          </div>
        </div>
        <div className="flex cursor-pointer items-center space-x-3 rounded-xl bg-white/30 p-3 transition-all duration-200 hover:bg-white/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-black/90">Data Sync</div>
            <div className="text-xs text-black/60">1 hour ago</div>
          </div>
          <div className="rounded-full bg-white/40 px-2 py-1 text-xs text-black/60">
            Completed
          </div>
        </div>
      </div>
    </>
  );
}

function WorkflowDiagram() {
  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black/90">N8N Workflow</h3>
        <div className="h-1 w-12 rounded-full bg-white/60" />
      </div>
      <div className="mb-2 rounded-xl bg-white/20 p-3">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/40 px-2 py-1 text-xs text-black/60">
            Demo Workflow
          </div>
          <div className="text-xs font-medium text-green-600">Running</div>
        </div>
        <div className="relative mt-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs text-black/80">Webhook</div>
            </div>
            <div className="relative mx-2 h-0.5 flex-1 bg-white/30">
              <div className="absolute -top-1 right-0 h-3 w-3 animate-ping rounded-full bg-cyan" />
            </div>
            <div className="text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-orange">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs text-black/80">Process</div>
            </div>
            <div className="relative mx-2 h-0.5 flex-1 bg-white/30">
              <div className="absolute -top-1 right-0 h-3 w-3 animate-ping rounded-full bg-orange" />
            </div>
            <div className="text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs text-black/80">Output</div>
            </div>
          </div>
        </div>
        <div className="mt-3 border-t border-white/20 pt-3">
          <div className="flex justify-between text-xs">
            <div className="text-black/60">Last run:</div>
            <div className="font-medium text-black/90">2 min ago</div>
          </div>
        </div>
      </div>
    </>
  );
}

function UsageAnalytics() {
  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black/90">Usage Analytics</h3>
        <div className="h-1 w-12 rounded-full bg-white/60" />
      </div>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium text-black/90">
              Workflows executed today
            </span>
            <span className="text-sm text-black/70">142 / 500</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/30">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-cyan to-orange"
              style={{ width: '28%' }}
            />
          </div>
          <div className="mt-1 text-xs text-black/60">28% of daily quota</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/20 p-3">
            <div className="mb-1 text-xs text-black/60">Time Saved</div>
            <div className="text-xl font-bold text-black/90">48hrs</div>
            <div className="mt-1 text-xs text-green-600">This month</div>
          </div>
          <div className="rounded-xl bg-white/20 p-3">
            <div className="mb-1 text-xs text-black/60">Success Rate</div>
            <div className="text-xl font-bold text-black/90">99.2%</div>
            <div className="mt-1 text-xs text-cyan">Excellent</div>
          </div>
        </div>
      </div>
    </>
  );
}

function DefaultContent({ config }: { config: CardConfig }) {
  return (
    <>
      <div className="transform text-black/80 transition-all duration-500">
        <span className="text-lg font-medium">{config.content.greeting}</span>
      </div>
      <div className="text-sm font-light text-black/60 transition-all duration-500">
        {config.content.subtitle}
      </div>
    </>
  );
}

export default FluxCardHero;
