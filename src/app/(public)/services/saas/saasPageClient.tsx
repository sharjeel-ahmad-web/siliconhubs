'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { GradientHero } from '@/modules/public/components/gradient-hero';
import ServiceCaseStudies from '@/modules/public/sections/ServiceCaseStudies';
import ServiceCTA from '@/modules/public/sections/ServiceCTA';
import { SectionHeading } from '@/modules/public/components/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { withDefaults, ensureCta } from '@/lib/cms-content';

const StackFeatureSection = dynamic(
  () => import('@/modules/public/components/stack-feature-section'),
  {
    ssr: false,
  }
);

const ServiceVideoSection = dynamic(
  () => import('@/modules/public/sections/ServiceVideoSection'),
  {
    ssr: false,
  }
);

const LiveDashboardDemo = dynamic(
  () => import('@/modules/public/components/services/saas/LiveDashboardDemo'),
  {
    ssr: false,
  }
);

const HowItWorks = dynamic(
  () => import('@/modules/public/components/services/saas/HowItWorks'),
  {
    ssr: false,
  }
);

const ROICalculator = dynamic(
  () => import('@/modules/public/components/services/saas/ROICalculator'),
  {
    ssr: false,
  }
);

const FeatureRequestForm = dynamic(
  () => import('@/modules/public/components/services/saas/FeatureRequestForm'),
  {
    ssr: false,
  }
);

// Define interfaces for CMS content types
interface HeroContent {
  badge: string;
  titleHighlight: string;
  title: string;
  description: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
  image: string;
  imageAlt: string;
  video?: string;
}

interface VideoContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  videoSrc: string;
  ctaText: string;
  ctaHref: string;
}

interface FeatureItem {
  title: string;
  desc: string;
  icon: string;
  borderColor?: string;
}

interface FeaturesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  features: FeatureItem[];
}

interface SolutionItem {
  title: string;
  desc: string;
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
}

interface SolutionsContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  solutions: SolutionItem[];
}

interface CaseStudy {
  img: string;
  title: string;
  desc: string;
  sliderName: string;
}

interface CaseStudiesContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  studies: CaseStudy[];
}

interface CTAContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

interface DashboardMetric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  color: string;
  icon: string;
}

interface DashboardChartData {
  label: string;
  value: number;
}

interface DashboardNotification {
  message: string;
  time: string;
  type: 'success' | 'info' | 'warning';
}

interface LiveDashboardContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  metrics: DashboardMetric[];
  chartData: DashboardChartData[];
  notifications: DashboardNotification[];
  dashboardTitle: string;
  chartTitle: string;
  notificationsTitle: string;
}

interface ProcessStep {
  title: string;
  description: string;
  details: string;
  icon: string;
  color: string;
}

interface HowItWorksContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  steps: ProcessStep[];
}

interface SliderConfig {
  label: string;
  min: number;
  max: number;
  default: number;
  prefix?: string;
  suffix?: string;
}

interface ROICalculatorContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  sliders: SliderConfig[];
  savingsMultiplier: number;
  ctaText: string;
  ctaHref: string;
  resultLabels: {
    currentCost: string;
    estimatedSavings: string;
    roi: string;
    paybackPeriod: string;
  };
  accentColor: string;
}

interface FeatureOption {
  label: string;
  value: string;
}

interface BudgetOption {
  label: string;
  value: string;
}

interface FeatureRequestContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  featureOptions: FeatureOption[];
  budgetOptions: BudgetOption[];
  submitButtonText: string;
  successMessage: string;
  successSubtext: string;
  placeholders: {
    name: string;
    email: string;
    company: string;
    description: string;
  };
  accentColor: string;
}

// Default fallback content
const defaultHeroContent: HeroContent = {
  badge: 'Custom Software Solutions',
  titleHighlight: 'SaaS',
  title: 'for Your Business',
  description:
    'Custom software solutions that scale with your business and streamline operations. From CRM to inventory management, we build what you need.',
  primaryCta: { text: 'Start Your Project', href: '/contact' },
  secondaryCta: { text: 'View Our Work', href: '/portfolio' },
  image: '/media/services/saas/hero/saas-dashboard.jpg',
  imageAlt: 'SaaS Dashboard',
  video: '/media/services/saas/video/hero-video.mp4',
};

const defaultVideoContent: VideoContent = {
  eyebrow: 'See SaaS In Action',
  title: 'Watch How We Build',
  titleHighlight: 'Custom Software',
  subtitle:
    'Experience our development process and see the scalable SaaS solutions we create for our clients.',
  videoSrc: '/media/services/saas/video/hero-video.mp4',
  ctaText: 'Start Your SaaS Project',
  ctaHref: '/contact',
};

const defaultFeaturesContent: FeaturesContent = {
  eyebrow: 'Why Choose Us',
  title: 'Why Choose Our',
  titleHighlight: 'SaaS Solutions?',
  subtitle:
    'We build scalable, secure, and user-friendly software tailored to your needs.',
  features: [
    {
      title: 'Scalable Architecture',
      desc: 'Built to grow with your business from day one',
      icon: '🚀',
      borderColor: '#06b6d4',
    },
    {
      title: 'Cloud-Native',
      desc: 'Deployed on modern cloud infrastructure for reliability',
      icon: '☁️',
      borderColor: '#2563EB',
    },
    {
      title: 'API-First Design',
      desc: 'Seamless integrations with your existing tools',
      icon: '🔗',
      borderColor: '#fc4c00',
    },
    {
      title: 'Real-Time Analytics',
      desc: 'Data-driven insights to make informed decisions',
      icon: '📊',
      borderColor: '#06b6d4',
    },
    {
      title: 'Enterprise Security',
      desc: 'Bank-level security to protect your data',
      icon: '🔒',
      borderColor: '#fc4c00',
    },
    {
      title: '24/7 Support',
      desc: 'Round-the-clock support when you need it',
      icon: '💬',
      borderColor: '#06b6d4',
    },
  ],
};

const defaultSolutionsContent: SolutionsContent = {
  eyebrow: 'Solutions',
  title: 'Our SaaS',
  titleHighlight: 'Solutions',
  subtitle:
    'From CRM to inventory management, we build what your business needs.',
  solutions: [
    {
      title: 'CRM Systems',
      desc: 'Manage customer relationships and sales pipelines effectively',
      gradientFrom: '#fc4c00',
      gradientTo: '#06b6d4',
      borderColor: '#06b6d4',
    },
    {
      title: 'Inventory Management',
      desc: 'Track stock levels, orders, and suppliers in real-time',
      gradientFrom: '#06b6d4',
      gradientTo: '#2563EB',
      borderColor: '#2563EB',
    },
    {
      title: 'Project Management',
      desc: 'Collaborate with teams and track project progress',
      gradientFrom: '#2563EB',
      gradientTo: '#06b6d4',
      borderColor: '#06b6d4',
    },
    {
      title: 'HR & Payroll',
      desc: 'Streamline employee management and payroll processing',
      gradientFrom: '#06b6d4',
      gradientTo: '#fc4c00',
      borderColor: '#fc4c00',
    },
  ],
};

const defaultCaseStudiesContent: CaseStudiesContent = {
  eyebrow: 'SaaS Success Stories',
  title: 'Software That',
  titleHighlight: 'Scales',
  subtitle:
    "See how we've helped businesses build custom software solutions that drive growth.",
  studies: [
    {
      img: '/media/services/saas/case-studies/project-management.jpg',
      title: 'CRM Platform',
      desc: 'Custom CRM serving 500+ users with real-time analytics and 99.9% uptime.',
      sliderName: 'crm',
    },
    {
      img: '/media/services/saas/case-studies/inventory-system.jpg',
      title: 'Inventory System',
      desc: 'Real-time inventory management tracking 50,000+ SKUs across multiple warehouses.',
      sliderName: 'inventory',
    },
    {
      img: '/media/services/saas/case-studies/project-management.jpg',
      title: 'Project Management',
      desc: 'Team collaboration platform with 10,000+ daily active users and advanced reporting.',
      sliderName: 'project',
    },
    {
      img: '/media/services/saas/case-studies/hr-payroll.jpg',
      title: 'HR & Payroll',
      desc: 'Automated payroll processing for 2,000+ employees with compliance management.',
      sliderName: 'hr',
    },
  ],
};

const defaultCTAContent: CTAContent = {
  eyebrow: 'SaaS Experts',
  title: 'Ready to Transform',
  titleHighlight: 'Your Business?',
  subtitle:
    "Let's build a custom SaaS solution that drives your business forward",
  ctaText: 'Get Started Today',
  ctaHref: '/contact',
};

const defaultLiveDashboardContent: LiveDashboardContent = {
  eyebrow: 'Live Preview',
  title: 'See Your Dashboard',
  titleHighlight: 'In Action',
  subtitle:
    'Experience a live preview of what your custom SaaS dashboard could look like.',
  metrics: [
    {
      label: 'Total Revenue',
      value: 124500,
      prefix: '$',
      change: 12.5,
      color: '#06b6d4',
      icon: 'dollar',
    },
    {
      label: 'Active Users',
      value: 8420,
      change: 8.3,
      color: '#2563EB',
      icon: 'users',
    },
    {
      label: 'Orders Today',
      value: 342,
      change: -2.1,
      color: '#fc4c00',
      icon: 'cart',
    },
    {
      label: 'Growth Rate',
      value: 23.5,
      suffix: '%',
      change: 5.7,
      color: '#06b6d4',
      icon: 'trending',
    },
  ],
  chartData: [
    { label: 'Mon', value: 65 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 52 },
    { label: 'Thu', value: 91 },
    { label: 'Fri', value: 84 },
    { label: 'Sat', value: 67 },
    { label: 'Sun', value: 95 },
  ],
  notifications: [
    { message: 'New user registered', time: '2 min ago', type: 'success' },
    { message: 'Order #1234 completed', time: '5 min ago', type: 'info' },
    { message: 'Server load at 85%', time: '10 min ago', type: 'warning' },
  ],
  dashboardTitle: 'Analytics Dashboard',
  chartTitle: 'Weekly Performance',
  notificationsTitle: 'Recent Activity',
};

const defaultHowItWorksContent: HowItWorksContent = {
  eyebrow: 'Our Process',
  title: 'How We Build Your',
  titleHighlight: 'SaaS',
  subtitle: 'A proven methodology that delivers results every time.',
  steps: [
    {
      title: 'Discovery',
      description: 'Understanding your needs',
      details:
        'We dive deep into your business requirements, analyze workflows, and identify opportunities for automation and improvement.',
      icon: 'search',
      color: '#06b6d4',
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
      color: '#fc4c00',
    },
    {
      title: 'Testing',
      description: 'Ensuring quality',
      details:
        'Rigorous testing across devices and scenarios ensures your application is bug-free and performs flawlessly.',
      icon: 'test',
      color: '#06b6d4',
    },
    {
      title: 'Launch',
      description: 'Going live',
      details:
        'We handle deployment, monitoring, and provide ongoing support to ensure your SaaS succeeds in the market.',
      icon: 'rocket',
      color: '#fc4c00',
    },
  ],
};

const defaultROICalculatorContent: ROICalculatorContent = {
  eyebrow: 'Calculate Your Savings',
  title: 'ROI',
  titleHighlight: 'Calculator',
  subtitle:
    'See how much you could save by automating your workflows with a custom SaaS solution.',
  sliders: [
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
  ],
  savingsMultiplier: 0.7,
  ctaText: 'Get Custom Quote',
  ctaHref: '/contact',
  resultLabels: {
    currentCost: 'Current Yearly Cost',
    estimatedSavings: 'Estimated Yearly Savings',
    roi: 'Return on Investment',
    paybackPeriod: 'Payback Period',
  },
  accentColor: '#06b6d4',
};

const defaultFeatureRequestContent: FeatureRequestContent = {
  eyebrow: 'Tell Us Your Vision',
  title: 'Feature',
  titleHighlight: 'Request',
  subtitle:
    'Share your ideas and let us help you build the perfect SaaS solution for your business.',
  featureOptions: [
    { label: 'User Dashboard', value: 'dashboard' },
    { label: 'Analytics & Reports', value: 'analytics' },
    { label: 'User Management', value: 'user-management' },
    { label: 'Payment Integration', value: 'payments' },
    { label: 'API Access', value: 'api' },
    { label: 'Mobile App', value: 'mobile' },
    { label: 'Notifications', value: 'notifications' },
    { label: 'Integrations', value: 'integrations' },
  ],
  budgetOptions: [
    { label: '$5,000 - $15,000', value: '5k-15k' },
    { label: '$15,000 - $30,000', value: '15k-30k' },
    { label: '$30,000 - $50,000', value: '30k-50k' },
    { label: '$50,000+', value: '50k+' },
    { label: 'Not sure yet', value: 'unsure' },
  ],
  submitButtonText: 'Submit Request',
  successMessage: 'Request Submitted!',
  successSubtext: "We'll get back to you within 24 hours.",
  placeholders: {
    name: 'Your name',
    email: 'your@email.com',
    company: 'Company name (optional)',
    description: 'Describe your ideal SaaS solution...',
  },
  accentColor: '#06b6d4',
};

interface SaasPageClientProps {
  /** Hero <video src>. Must be passed from Server Component only; do not derive from useSiteContent or effects. */
  heroVideoSrc: string;
}

export default function SaasPageClient({ heroVideoSrc }: SaasPageClientProps) {
  // CMS content for copy only; hero media src is exclusively heroVideoSrc (server prop)
  const { content: heroContent } = useSiteContent<HeroContent>(
    'services-saas',
    'hero'
  );
  const { content: videoContent } = useSiteContent<VideoContent>(
    'services-saas',
    'video'
  );
  const { content: featuresContent } = useSiteContent<FeaturesContent>(
    'services-saas',
    'features'
  );
  const { content: solutionsContent } = useSiteContent<SolutionsContent>(
    'services-saas',
    'solutions'
  );
  const { content: caseStudiesContent } = useSiteContent<CaseStudiesContent>(
    'services-saas',
    'caseStudies'
  );
  const { content: ctaContent } = useSiteContent<CTAContent>(
    'services-saas',
    'cta'
  );
  const { content: liveDashboardContent } =
    useSiteContent<LiveDashboardContent>('services-saas', 'liveDashboard');
  const { content: howItWorksContent } = useSiteContent<HowItWorksContent>(
    'services-saas',
    'howItWorks'
  );
  const { content: roiCalculatorContent } =
    useSiteContent<ROICalculatorContent>('services-saas', 'roiCalculator');
  const { content: featureRequestContent } =
    useSiteContent<FeatureRequestContent>('services-saas', 'featureRequest');

  // Safe merge: preserve defaults, allow partial CMS; ensure CTA hrefs are always strings
  const heroMerged = withDefaults(defaultHeroContent, heroContent ?? undefined);
  const hero = {
    ...heroMerged,
    primaryCta: ensureCta(defaultHeroContent.primaryCta, heroContent?.primaryCta),
    secondaryCta: ensureCta(defaultHeroContent.secondaryCta, heroContent?.secondaryCta),
  };
  // Hero video: use only heroVideoSrc (server prop). Do not use hero.video — ensures identical src on server and client.
  const video = withDefaults(defaultVideoContent, videoContent ?? undefined, ['ctaHref']);
  const features = featuresContent ?? defaultFeaturesContent;
  const solutions = solutionsContent ?? defaultSolutionsContent;
  const caseStudies = caseStudiesContent ?? defaultCaseStudiesContent;
  const cta = withDefaults(defaultCTAContent, ctaContent ?? undefined, ['ctaHref']);
  const liveDashboard = liveDashboardContent ?? defaultLiveDashboardContent;
  const howItWorks = howItWorksContent ?? defaultHowItWorksContent;
  const roiCalculator = withDefaults(defaultROICalculatorContent, roiCalculatorContent ?? undefined, ['ctaHref']);
  const featureRequest = featureRequestContent ?? defaultFeatureRequestContent;

  return (
    <main className="min-h-screen bg-black">
      {/* Hero: video src is server-provided (heroVideoSrc) for deterministic hydration */}
      <GradientHero
        badge={hero.badge}
        titleHighlight={hero.titleHighlight}
        title={hero.title}
        description={hero.description}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        image={hero.image}
        imageAlt={hero.imageAlt}
        video={heroVideoSrc}
        videoPoster={hero.image}
      />

      {/* Video Section - Uses CMS content with fallback */}
      <ServiceVideoSection
        eyebrow={video.eyebrow}
        title={video.title}
        titleHighlight={video.titleHighlight}
        subtitle={video.subtitle}
        videoSrc={video.videoSrc}
        ctaText={video.ctaText}
        ctaHref={video.ctaHref}
      />

      {/* Features Section - Uses CMS content with fallback */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={features.eyebrow}
            title={features.title}
            titleHighlight={features.titleHighlight}
            subtitle={features.subtitle}
          />

          <div className="grid gap-8 md:grid-cols-3">
            {features.features.map((feature, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border bg-black p-8"
                style={{ borderColor: `${feature.borderColor || '#06b6d4'}33` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ borderColor: feature.borderColor || '#06b6d4' }}
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-[#64748B]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={solutions.eyebrow}
            title={solutions.title}
            titleHighlight={solutions.titleHighlight}
            subtitle={solutions.subtitle}
          />

          <div className="grid gap-8 md:grid-cols-2">
            {solutions.solutions.map((solution, i) => (
              <motion.div
                key={i}
                className="rounded-2xl border p-8"
                style={{
                  background: `linear-gradient(135deg, ${solution.gradientFrom || '#fc4c00'}15, ${solution.gradientTo || '#06b6d4'}15)`,
                  borderColor: `${solution.borderColor || '#06b6d4'}4D`,
                }}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="mb-3 text-2xl font-bold text-white">
                  {solution.title}
                </h3>
                <p className="text-lg text-[#94A3B8]">{solution.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Dashboard Demo - Uses CMS content with fallback */}
      <LiveDashboardDemo
        eyebrow={liveDashboard.eyebrow}
        title={liveDashboard.title}
        titleHighlight={liveDashboard.titleHighlight}
        subtitle={liveDashboard.subtitle}
        metrics={liveDashboard.metrics}
        chartData={liveDashboard.chartData}
        notifications={liveDashboard.notifications}
        dashboardTitle={liveDashboard.dashboardTitle}
        chartTitle={liveDashboard.chartTitle}
        notificationsTitle={liveDashboard.notificationsTitle}
      />

      {/* How It Works - Uses CMS content with fallback */}
      <HowItWorks
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        titleHighlight={howItWorks.titleHighlight}
        subtitle={howItWorks.subtitle}
        steps={howItWorks.steps}
      />

      {/* SaaS Case Studies - Uses CMS content with fallback */}
      <ServiceCaseStudies
        eyebrow={caseStudies.eyebrow}
        title={caseStudies.title}
        titleHighlight={caseStudies.titleHighlight}
        subtitle={caseStudies.subtitle}
        caseStudies={caseStudies.studies}
      />

      {/* ROI Calculator - Uses CMS content with fallback */}
      <ROICalculator
        eyebrow={roiCalculator.eyebrow}
        title={roiCalculator.title}
        titleHighlight={roiCalculator.titleHighlight}
        subtitle={roiCalculator.subtitle}
        sliders={roiCalculator.sliders}
        savingsMultiplier={roiCalculator.savingsMultiplier}
        ctaText={roiCalculator.ctaText}
        ctaHref={roiCalculator.ctaHref}
        resultLabels={roiCalculator.resultLabels}
        accentColor={roiCalculator.accentColor}
      />

      {/* Tech Stack Section - Uses CMS content with fallback */}
      <StackFeatureSection page="services-saas" />

      {/* Feature Request Form - Uses CMS content with fallback */}
      <FeatureRequestForm
        eyebrow={featureRequest.eyebrow}
        title={featureRequest.title}
        titleHighlight={featureRequest.titleHighlight}
        subtitle={featureRequest.subtitle}
        featureOptions={featureRequest.featureOptions}
        budgetOptions={featureRequest.budgetOptions}
        submitButtonText={featureRequest.submitButtonText}
        successMessage={featureRequest.successMessage}
        successSubtext={featureRequest.successSubtext}
        placeholders={featureRequest.placeholders}
        accentColor={featureRequest.accentColor}
      />

      {/* CTA Section with Social Links - Uses CMS content with fallback */}
      <ServiceCTA
        eyebrow={cta.eyebrow}
        title={cta.title}
        titleHighlight={cta.titleHighlight}
        subtitle={cta.subtitle}
        ctaText={cta.ctaText}
        ctaLink={cta.ctaHref}
      />
    </main>
  );
}
