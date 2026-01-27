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

// Default fallback content
const defaultContent: AdvantagesContent = {
  eyebrow: 'Our Advantage',
  title: 'Why Clients',
  titleHighlight: 'Choose Us',
  subtitle:
    'We deliver exceptional results through innovative solutions, cutting-edge technology, and a commitment to excellence in every project.',
  stats: [
    { value: '50+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '24/7', label: 'Support Available' },
  ],
  features: [
    {
      title: 'Lightning Fast',
      description:
        'Optimized performance with sub-second load times and smooth interactions.',
      icon: 'Zap',
      color: '#37AFE1',
    },
    {
      title: 'Powerful Tech',
      description:
        'Built with cutting-edge technologies for scalability and reliability.',
      icon: 'Cpu',
      color: '#F58122',
    },
    {
      title: 'Secure & Safe',
      description:
        'Enterprise-grade security with best practices and regular audits.',
      icon: 'Lock',
      color: '#37AFE1',
    },
    {
      title: 'AI Powered',
      description:
        'Intelligent automation and AI integration for smarter solutions.',
      icon: 'Sparkles',
      color: '#F58122',
    },
  ],
};

export default function PortfolioFeatures({ content: contentProp }: PortfolioFeaturesProps = {}) {
  const { content: apiContent } = useSiteContent<AdvantagesContent>('home', 'advantages');
  const advantagesData = contentProp ?? apiContent ?? defaultContent;
  const { eyebrow, title, titleHighlight, subtitle, stats, features } =
    advantagesData;

  return (
    <section className="bg-black py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-12 px-6">
        {/* Header */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Featured Image */}
        <div className="relative overflow-hidden rounded-3xl p-3 md:-mx-8 lg:col-span-3">
          <div className="relative aspect-[88/36]">
            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black to-transparent"></div>

            {/* Main showcase image */}
            <img
              src="/media/portfolio/portfolio-features/showcase.jpg"
              className="absolute inset-0 h-full w-full rounded-2xl object-cover opacity-80"
              alt="Portfolio showcase"
            />

            {/* Floating UI elements overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="grid max-w-3xl grid-cols-3 gap-4 p-8">
                {/* Stats cards - dynamically rendered from CMS */}
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border bg-black/60 p-4 backdrop-blur-lg ${
                      index % 2 === 0
                        ? 'border-[#37AFE1]/20'
                        : 'border-[#F58122]/20'
                    }`}
                  >
                    <p
                      className={`text-3xl font-bold ${
                        index % 2 === 0 ? 'text-[#37AFE1]' : 'text-[#F58122]'
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Zap;
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <IconComponent
                      className="size-4"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-white">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
