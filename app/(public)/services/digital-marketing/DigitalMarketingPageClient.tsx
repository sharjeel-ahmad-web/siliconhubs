'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Megaphone,
  Search,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  ServicesHeroSection,
  ServiceItem,
} from '@/components/ui/services-hero-section';
import ServiceCaseStudies, {
  CaseStudy,
} from '@/components/sections/ServiceCaseStudies';
import ServiceCTA from '@/components/sections/ServiceCTA';
import { SectionHeading } from '@/components/ui/section-heading';

const services: ServiceItem[] = [
  {
    id: 'performance-marketing',
    name: 'Performance Marketing',
    url: '/contact',
    description: 'Campaigns optimized around measurable growth.',
    imgSrc: '/media/portfolio/featured-projects/seo-campaign.jpg',
  },
  {
    id: 'social-media',
    name: 'Social Media Marketing',
    url: '/contact',
    description: 'Content and campaigns that build active communities.',
    imgSrc: '/media/home/case-studies/enterprise-platform.jpg',
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy',
    url: '/contact',
    description: 'Search-led content that earns attention and trust.',
    imgSrc: '/media/portfolio/case-studies/digital-transformation.jpg',
  },
  {
    id: 'paid-advertising',
    name: 'Paid Advertising',
    url: '/contact',
    description: 'Smarter paid search and social campaigns.',
    imgSrc: '/media/portfolio/case-studies/ecommerce.jpg',
  },
];

const caseStudies: CaseStudy[] = [
  {
    img: '/media/services/seo/case-studies/ecommerce-seo.jpg',
    title: 'Demand Generation',
    desc: 'Turn qualified attention into a reliable pipeline.',
    sliderName: 'demand-generation',
  },
  {
    img: '/media/services/seo/case-studies/local-business.jpg',
    title: 'Brand Growth',
    desc: 'Build a recognizable brand across the channels that matter.',
    sliderName: 'brand-growth',
  },
];

const capabilities = [
  {
    icon: Target,
    title: 'Audience Strategy',
    description:
      'Find the people, intent, and moments that create your best opportunities.',
  },
  {
    icon: Megaphone,
    title: 'Campaign Creative',
    description:
      'Translate your positioning into focused creative that earns action.',
  },
  {
    icon: BarChart3,
    title: 'Measurement',
    description: 'Connect campaign activity to leads, revenue, and decisions.',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Growth',
    description: 'Use performance data to improve every campaign cycle.',
  },
];

export default function DigitalMarketingPageClient() {
  return (
    <main className="digital-marketing-page min-h-screen bg-warm-cream pt-20 text-[#14213D]">
      <ServicesHeroSection
        eyebrow="Digital Growth Studio"
        title="Make Your Brand Impossible to Ignore"
        highlightedWord="Brand"
        highlightedWord2="Ignore"
        subtitle="Strategy, creative, and performance marketing that turns attention into sustainable business growth."
        services={services}
        ctaLabel="Plan Your Growth"
        ctaHref="/contact"
      />

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Approach"
            title="Marketing Built Around"
            titleHighlight="Momentum"
            subtitle="Every channel has a job. We connect them into one clear growth system."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(({ icon: Icon, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-[#E8D8C5] bg-light-cream p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange hover:shadow-xl hover:shadow-orange/10"
              >
                <Icon className="mb-6 h-8 w-8 text-orange" />
                <h3 className="mb-3 text-xl text-dark-grey">{title}</h3>
                <p className="text-sm leading-6 text-slate-grey">
                  {description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-cream px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Full-Funnel Thinking"
              title="From First Click to"
              titleHighlight="Loyal Customer"
              subtitle="We bring SEO, social, paid media, email, and analytics together around the customer journey."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                { step: '01', label: 'Discover', Icon: Search },
                { step: '02', label: 'Engage', Icon: Users },
                { step: '03', label: 'Convert', Icon: Target },
                { step: '04', label: 'Retain', Icon: TrendingUp },
              ] satisfies Array<{
                step: string;
                label: string;
                Icon: LucideIcon;
              }>
            ).map(({ step, label, Icon }) => (
              <div
                key={String(label)}
                className="rounded-2xl border border-[#E8D8C5] bg-warm-cream p-5"
              >
                <span className="text-sm font-semibold text-orange">
                  {step}
                </span>
                <Icon className="my-6 h-7 w-7 text-orange" />
                <h3 className="text-lg text-dark-grey">{String(label)}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceCaseStudies
        eyebrow="Campaign Results"
        title="Growth You Can"
        titleHighlight="Measure"
        subtitle="Clear reporting and focused execution keep every marketing decision accountable."
        caseStudies={caseStudies}
      />
      <ServiceCTA
        eyebrow="Ready to Grow?"
        title="Put Your Marketing"
        titleHighlight="to Work"
        subtitle="Let’s build a digital growth system designed around your next stage."
        ctaText="Start a Conversation"
        ctaLink="/contact"
      />
    </main>
  );
}
