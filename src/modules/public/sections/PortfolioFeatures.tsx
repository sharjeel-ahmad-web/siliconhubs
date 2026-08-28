'use client';

import {
  Cpu,
  Lock,
  Sparkles,
  Zap,
  Users,
  TrendingUp,
  Headphones,
  LucideIcon,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Cpu,
  Lock,
  Sparkles,
  Users,
  TrendingUp,
  Headphones,
};

interface Stat {
  value: string;
  label: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface AdvantagesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  stats: Stat[];
  features: Feature[];
}

interface PortfolioFeaturesProps {
  /** When provided (e.g. from portfolio static data), no useSiteContent('portfolio') is called. */
  content?: AdvantagesContent | null;
}

// Updated premium, convincing content
const defaultContent: AdvantagesContent = {
  eyebrow: 'Our Advantage',
  title: 'Why Top Brands',
  titleHighlight: 'Trust Us',
  subtitle:
    'We don’t just build software; we architect scalable growth engines. From enterprise automation to flawless web experiences, we deliver elite-tier solutions designed to maximize your ROI and dominate your market.',
  stats: [
    { value: '250+', label: 'Enterprise Deployments' },
    { value: '99%', label: 'Client Retention Rate' },
    { value: '24/7', label: 'Dedicated Support' },
  ],
  features: [
    {
      title: 'Lightning Performance',
      description:
        'Sub-second load times engineered through modern headless architectures to boost your SEO and absolute conversion rates.',
      icon: 'Zap',
      color: '#0a192f', // Deep Navy
    },
    {
      title: 'Scalable Infrastructure',
      description:
        'Built on elite tech stacks (Next.js & React) ensuring your platforms scale seamlessly as your user base explodes.',
      icon: 'Cpu',
      color: '#fc4c00', // Vibrant Orange
    },
    {
      title: 'Ironclad Security',
      description:
        'Enterprise-grade protocols, rigorous continuous audits, and data encryption to keep your digital assets impenetrable.',
      icon: 'Lock',
      color: '#0a192f', // Deep Navy
    },
    {
      title: 'AI & Automation Driven',
      description:
        'Transforming manual bottlenecks into intelligent, automated workflows that save hundreds of hours and cut operational costs.',
      icon: 'Sparkles',
      color: '#fc4c00', // Vibrant Orange
    },
  ],
};

export default function PortfolioFeatures({
  content: contentProp,
}: PortfolioFeaturesProps = {}) {
  const { content: apiContent } = useSiteContent<AdvantagesContent>(
    'home',
    'advantages'
  );
  const advantagesData = contentProp ?? apiContent ?? defaultContent;
  const { eyebrow, title, titleHighlight, subtitle, stats, features } =
    advantagesData;

  return (
    // Changed to Warm Cream base
    <section className="bg-[#ffe8c1] py-16 text-[#0a192f] md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        {/* Header - Make sure SectionHeading inherits light mode styling or pass specific props if needed */}
        <div className="text-[#0a192f]">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            titleHighlight={titleHighlight}
            subtitle={subtitle}
          />
        </div>

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-3xl p-3 md:-mx-8 lg:col-span-3">
          <div className="relative aspect-[88/36] overflow-hidden rounded-2xl shadow-2xl">
            {/* Gradient overlay - Changed to complement light theme by providing depth */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/40 to-transparent"></div>

            {/* Main showcase image */}
            <img
              src="/media/portfolio/portfolio-features/showcase.jpg"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
              alt="Portfolio showcase"
            />

            {/* Floating UI elements overlay */}
            <div className="absolute inset-0 z-20 flex items-end justify-center pb-8 md:items-center md:pb-0">
              <div className="grid w-full max-w-3xl grid-cols-1 gap-4 px-6 sm:grid-cols-3 md:p-8">
                {/* Stats cards - Restyled for high contrast over the dark overlay */}
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#112240]/80 p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#fc4c00]/50"
                  >
                    <p
                      className={`text-3xl font-extrabold md:text-4xl ${
                        index % 2 === 0 ? 'text-white' : 'text-[#fc4c00]'
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-1 text-center text-sm font-medium text-gray-300">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative mx-auto grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Zap;
            return (
              <div key={index} className="group space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <IconComponent
                      className="size-6"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a192f]">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm font-medium leading-relaxed text-[#0a192f]/70">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
