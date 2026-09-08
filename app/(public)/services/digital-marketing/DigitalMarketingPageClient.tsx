'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  Globe2,
  LineChart,
  MapPin,
  Megaphone,
  MousePointerClick,
  Search,
  Settings2,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap,
  Star,
  Mail,
  Gauge,
  MessageSquare,
  Layers3,
  Eye,
  RefreshCw,
} from 'lucide-react';

import {
  ServicesHeroSection,
  ServiceItem,
} from '@/components/ui/services-hero-section';
import ServiceCaseStudies from '@/components/sections/ServiceCaseStudies';
import ServiceCTA from '@/components/sections/ServiceCTA';
import { SectionHeading } from '@/components/ui/section-heading';

/* =========================================================
   COLORS
   ========================================================= */

const ORANGE = '#FC4C00';
const NAVY = '#0A192F';
const CREAM = '#FFF9F0';

/* =========================================================
   TYPES
   ========================================================= */

type Capability = {
  id: string;
  label: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  image: string;
};

type FAQ = {
  question: string;
  answer: string;
};

/* =========================================================
   ANIMATION
   ========================================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: 'easeOut',
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/* =========================================================
   SERVICES
   ========================================================= */

const services = [
  {
    title: 'Performance Marketing',
    description:
      'Data-driven paid campaigns designed to generate qualified traffic, leads, sales and measurable business outcomes.',
    icon: Megaphone,
  },
  {
    title: 'SEO',
    description:
      'Technical, content and authority-focused SEO built around search intent and sustainable organic visibility.',
    icon: Search,
  },
  {
    title: 'Local SEO & GMB',
    description:
      'Google Business Profile and local search optimization designed to improve local discovery and customer actions.',
    icon: MapPin,
  },
  {
    title: 'GEO & AEO',
    description:
      'Content and entity architecture prepared for generative search and answer engines.',
    icon: Sparkles,
  },
  {
    title: 'Social Media',
    description:
      'Platform-specific content, community building, creative strategy and paid social campaigns.',
    icon: Smartphone,
  },
  {
    title: 'CRO & Funnels',
    description:
      'Conversion-focused landing pages, experiments and funnel optimization to turn traffic into customers.',
    icon: MousePointerClick,
  },
  {
    title: 'Lifecycle Automation',
    description:
      'Email, WhatsApp, CRM and behavioral automation that nurtures leads and improves retention.',
    icon: Workflow,
  },
  {
    title: 'Analytics & Attribution',
    description:
      'Tracking infrastructure, dashboards and attribution systems that make marketing performance measurable.',
    icon: BarChart3,
  },
];

/* =========================================================
   HERO SERVICES (shaped for ServicesHeroSection)
   ========================================================= */

const heroServices: ServiceItem[] = [
  {
    id: 'performance-marketing',
    name: 'Performance Marketing',
    url: '/services/digital-marketing',
    description:
      'Data-driven paid campaigns that generate qualified traffic, leads and sales.',
    imgSrc: '/media/home/featured-services/seo.jpg',
  },
  {
    id: 'seo',
    name: 'SEO',
    url: '/services/seo',
    description:
      'Technical, content and authority-focused SEO for sustainable organic visibility.',
    imgSrc: '/media/portfolio/hero/seo.jpg',
  },
  {
    id: 'local-seo-gmb',
    name: 'Local SEO & GMB',
    url: '/services/seo',
    description:
      'Google Business Profile and local search optimization for local discovery.',
    imgSrc: '/media/portfolio/featured-projects/seo-campaign.jpg',
  },
  {
    id: 'geo-aeo',
    name: 'GEO & AEO',
    url: '/services/digital-marketing',
    description:
      'Content and entity architecture prepared for generative search and answer engines.',
    imgSrc: '/media/home/featured-services/web-design.jpg',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    url: '/services/digital-marketing',
    description:
      'Platform-specific content, community building and paid social campaigns.',
    imgSrc: '/media/home/featured-services/chatbot-development.png',
  },
  {
    id: 'cro-funnels',
    name: 'CRO & Funnels',
    url: '/services/shopify',
    description:
      'Conversion-focused landing pages and experiments that turn traffic into customers.',
    imgSrc: '/media/home/featured-services/shopify.png',
  },
  {
    id: 'lifecycle-automation',
    name: 'Lifecycle Automation',
    url: '/services/n8n-automations',
    description:
      'Email, WhatsApp, CRM and behavioral automation that nurtures and retains leads.',
    imgSrc: '/media/home/case-studies/workflow-automation.jpg',
  },
  {
    id: 'analytics-attribution',
    name: 'Analytics & Attribution',
    url: '/services/digital-marketing',
    description:
      'Tracking infrastructure, dashboards and attribution that make marketing measurable.',
    imgSrc: '/media/portfolio/hero/automation.jpg',
  },
];

/* =========================================================
   CAPABILITIES
   ========================================================= */

const capabilities: Capability[] = [
  {
    id: 'performance',
    label: 'Performance',
    icon: Megaphone,
    title: 'Performance Marketing',
    description:
      'Build, launch and continuously optimize paid acquisition campaigns across the channels where your customers spend time.',
    features: [
      'Google Search, Display & YouTube',
      'Meta Ads & paid social',
      'Retargeting campaigns',
      'Audience segmentation',
      'Creative testing',
      'Budget allocation',
      'CPA, CPL & ROAS monitoring',
      'GA4 & conversion tracking',
    ],
    image: '/media/portfolio/featured-projects/seo-campaign.jpg',
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: Search,
    title: 'Search Engine Optimization',
    description:
      'A technical and content-led SEO system designed to build stronger organic visibility around commercial search intent.',
    features: [
      'Technical SEO audits',
      'Keyword & intent research',
      'On-page optimization',
      'Content clusters',
      'Internal linking',
      'Core Web Vitals',
      'Schema implementation',
      'Authority building',
      'Search Console monitoring',
    ],
    image: '/media/services/seo/case-studies/ecommerce-seo.jpg',
  },
  {
    id: 'local',
    label: 'Local SEO',
    icon: MapPin,
    title: 'Local SEO & Google Business Profile',
    description:
      'Strengthen local discovery through Google Business Profile optimization, location signals and conversion-focused local content.',
    features: [
      'Google Business Profile optimization',
      'Primary & secondary categories',
      'Services and business information',
      'Photos & Google Posts',
      'Review strategy',
      'NAP consistency',
      'Local citations',
      'Location landing pages',
      'LocalBusiness schema',
      'Maps visibility tracking',
    ],
    image: '/media/services/seo/case-studies/local-business.jpg',
  },
  {
    id: 'geo',
    label: 'GEO + AEO',
    icon: Sparkles,
    title: 'Generative Engine & Answer Engine Optimization',
    description:
      'Prepare your website and content architecture for AI-powered discovery, conversational queries and answer-driven search experiences.',
    features: [
      'Generative search readiness',
      'Answer-focused content',
      'Entity optimization',
      'FAQ architecture',
      'Conversational query coverage',
      'Citation-friendly content',
      'Structured data',
      'Topical authority',
      'Knowledge/entity signals',
    ],
    image: '/media/portfolio/case-studies/digital-transformation.jpg',
  },
  {
    id: 'social',
    label: 'Social',
    icon: Smartphone,
    title: 'Social Media Growth',
    description:
      'Build an active digital presence with content systems designed around attention, trust, engagement and conversion.',
    features: [
      'Content strategy',
      'Reels & short-form video',
      'Carousel content',
      'Community management',
      'Paid social',
      'Creator campaigns',
      'Platform-specific content',
      'Social reporting',
    ],
    image: '/media/home/case-studies/enterprise-platform.jpg',
  },
  {
    id: 'cro',
    label: 'CRO',
    icon: MousePointerClick,
    title: 'Conversion Rate Optimization',
    description:
      'Remove friction from your customer journey and turn more of your existing traffic into qualified actions.',
    features: [
      'Landing page optimization',
      'UX friction analysis',
      'CTA optimization',
      'Offer positioning',
      'A/B testing strategy',
      'Heatmap analysis',
      'Session behavior analysis',
      'Checkout optimization',
      'Lead form optimization',
    ],
    image: '/media/portfolio/case-studies/ecommerce.jpg',
  },
  {
    id: 'automation',
    label: 'Automation',
    icon: Bot,
    title: 'Lifecycle & Marketing Automation',
    description:
      'Connect acquisition, CRM and retention through automated customer journeys.',
    features: [
      'Email automation',
      'WhatsApp workflows',
      'Welcome sequences',
      'Lead nurturing',
      'Abandoned cart recovery',
      'Re-engagement',
      'Customer segmentation',
      'CRM automation',
      'Behavior-based campaigns',
    ],
    image: '/media/portfolio/case-studies/digital-transformation.jpg',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    title: 'Analytics & Attribution',
    description:
      'Create a measurement layer that connects marketing activity with actual business outcomes.',
    features: [
      'Google Analytics 4',
      'Google Tag Manager',
      'Search Console',
      'Looker Studio dashboards',
      'Meta Pixel',
      'Conversion API planning',
      'UTM architecture',
      'CRM attribution',
      'Campaign reporting',
    ],
    image: '/media/portfolio/featured-projects/seo-campaign.jpg',
  },
];

/* =========================================================
   METHODOLOGY
   ========================================================= */

const methodology = [
  {
    number: '01',
    icon: Target,
    title: 'Audience Intelligence',
    description:
      'Understand customer intent, pain points, buying behavior and high-value segments before spending aggressively.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Creative Systems',
    description:
      'Develop messaging and creative variations that can be tested, measured and continuously improved.',
  },
  {
    number: '03',
    icon: LineChart,
    title: 'Measurement',
    description:
      'Build reliable tracking around conversions, acquisition costs, revenue and customer behavior.',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Optimization',
    description:
      'Use campaign and website signals to identify opportunities, reduce friction and scale what works.',
  },
];

/* =========================================================
   FUNNEL
   ========================================================= */

const funnel = [
  {
    stage: '01',
    title: 'Discover',
    icon: Eye,
    description: 'Reach relevant audiences.',
    channels: ['SEO', 'Paid Media', 'Social', 'GEO'],
  },
  {
    stage: '02',
    title: 'Engage',
    icon: Users,
    description: 'Build trust and interest.',
    channels: ['Content', 'Video', 'Email', 'Retargeting'],
  },
  {
    stage: '03',
    title: 'Convert',
    icon: MousePointerClick,
    description: 'Turn intent into action.',
    channels: ['Landing Pages', 'CRO', 'Offers', 'Lead Forms'],
  },
  {
    stage: '04',
    title: 'Retain',
    icon: RefreshCw,
    description: 'Increase customer lifetime value.',
    channels: ['CRM', 'WhatsApp', 'Email', 'Automation'],
  },
];

/* =========================================================
   EXECUTION FLOW
   ========================================================= */

const executionFlow = [
  'Audit',
  'Strategy',
  'Build',
  'Launch',
  'Optimize',
  'Scale',
];

/* =========================================================
   TOOLS
   ========================================================= */

const tools = [
  'Google Ads',
  'Meta Ads',
  'TikTok Ads',
  'GA4',
  'Google Search Console',
  'Google Tag Manager',
  'Looker Studio',
  'SEMrush',
  'Ahrefs',
  'Hotjar',
  'HubSpot',
  'Klaviyo',
];

/* =========================================================
   FAQ
   ========================================================= */

const faqs: FAQ[] = [
  {
    question: 'What digital marketing services does SiliconHubs provide?',
    answer:
      'SiliconHubs provides performance marketing, SEO, local SEO and Google Business Profile optimization, GEO and AEO strategy, social media marketing, CRO, lifecycle automation and analytics.',
  },
  {
    question: 'Do you provide Google Business Profile and local SEO services?',
    answer:
      'Yes. Our local SEO approach can include Google Business Profile optimization, business categories, services, reviews, local citations, NAP consistency, location pages, local schema and local visibility tracking.',
  },
  {
    question: 'What is GEO and AEO optimization?',
    answer:
      'GEO refers to Generative Engine Optimization while AEO refers to Answer Engine Optimization. The goal is to structure useful, authoritative and entity-aware content so it is better prepared for AI-powered and answer-focused search experiences.',
  },
  {
    question: 'Do you guarantee Google rankings or AI search citations?',
    answer:
      'No responsible agency can guarantee specific rankings, traffic or AI citations. Our work focuses on strong technical foundations, useful content, search intent, structured data, authority and continuous optimization.',
  },
  {
    question: 'Can you manage paid advertising campaigns?',
    answer:
      'Yes. Performance marketing can cover Google Ads, Meta advertising, retargeting, creative testing, audience segmentation, campaign optimization and conversion measurement.',
  },
  {
    question: 'How do you measure digital marketing performance?',
    answer:
      'Measurement can include leads, sales, conversion rate, CPA, CPL, ROAS, traffic quality, organic visibility, engagement and customer lifecycle metrics depending on the business model.',
  },
];

/* =========================================================
   FEATURE CARD
   ========================================================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl border border-[#FC4C00]/20 bg-[#FFF9F0] p-7 transition-all duration-300 hover:border-[#FC4C00]"
    >
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#FC4C00]/10 transition-transform duration-500 group-hover:scale-[2]" />

      <div className="relative">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A192F] text-[#FC4C00] transition-all duration-300 group-hover:bg-[#FC4C00] group-hover:text-[#FFF9F0]">
          <Icon size={25} />
        </div>

        <h3 className="mb-3 text-xl font-bold text-[#0A192F]">{title}</h3>

        <p className="leading-7 text-[#0A192F]/70">{description}</p>

        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#FC4C00]">
          Explore capability
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-2"
          />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   FAQ ITEM
   ========================================================= */

function FAQItem({
  faq,
  open,
  onClick,
}: {
  faq: FAQ;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[#FFF9F0]/20">
      <button
        onClick={onClick}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="text-lg font-semibold text-[#FFF9F0]">
          {faq.question}
        </span>

        <ChevronDown
          size={22}
          className={`shrink-0 text-[#FC4C00] transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <p className="pb-6 pr-10 leading-7 text-[#FFF9F0]/70">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function DigitalMarketingPageClient() {
  const [activeCapability, setActiveCapability] = useState('performance');
  const [activeFunnel, setActiveFunnel] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const active =
    capabilities.find((item) => item.id === activeCapability) ??
    capabilities[0];

  return (
    <main className="overflow-hidden bg-[#FFF9F0] text-[#0A192F]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <ServicesHeroSection
        eyebrow="Digital Marketing & Growth"
        title="Turn Attention Into"
        highlightedWord="Predictable Growth"
        highlightedWord2="with Digital Marketing"
        subtitle="SiliconHubs combines performance marketing, SEO, local search, GEO, AEO, social media, CRO and automation into one connected growth system."
        services={heroServices}
        ctaLabel="Build My Growth Strategy"
        ctaHref="/contact"
        variant="digital-marketing"
      />

      {/* =====================================================
          HERO SUPPORT / VALUE STRIP
      ===================================================== */}

      <section className="border-y border-[#FC4C00]/20 bg-[#0A192F]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Target,
              title: 'Full Funnel',
              text: 'From discovery to retention',
            },
            {
              icon: Search,
              title: 'Search Ready',
              text: 'SEO + Local + GEO + AEO',
            },
            {
              icon: Megaphone,
              title: 'Paid Growth',
              text: 'Campaigns built for measurable outcomes',
            },
            {
              icon: BarChart3,
              title: 'Data Driven',
              text: 'Track, test and optimize',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="border-[#FFF9F0]/10 p-6 lg:border-r"
            >
              <item.icon className="mb-4 text-[#FC4C00]" size={24} />
              <h3 className="font-bold text-[#FFF9F0]">{item.title}</h3>
              <p className="mt-1 text-sm text-[#FFF9F0]/60">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =====================================================
          METHODOLOGY
      ===================================================== */}

      <section className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Growth Method"
            title="Marketing Built Around"
            titleHighlight="Business Outcomes"
            subtitle="Instead of treating every marketing channel as a separate activity, we connect acquisition, conversion, measurement and retention."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {methodology.map((item) => (
              <motion.div
                key={item.number}
                variants={fadeUp}
                whileHover={{ y: -8 }}
                className="group rounded-3xl border border-[#0A192F]/10 bg-[#FFF9F0] p-7 transition-all duration-300 hover:border-[#FC4C00]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#FC4C00]">
                    {item.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A192F] text-[#FC4C00] transition-all group-hover:bg-[#FC4C00] group-hover:text-[#FFF9F0]">
                    <item.icon size={22} />
                  </div>
                </div>

                <h3 className="mt-8 text-xl font-bold text-[#0A192F]">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-[#0A192F]/70">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CAPABILITIES
      ===================================================== */}

      <section id="capabilities" className="bg-[#0A192F] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="360° Digital Marketing"
            title="One Growth System."
            titleHighlight="Every Major Channel."
            subtitle="Explore the complete SiliconHubs digital marketing capability stack."
          />

          {/* Tabs */}
          <div className="scrollbar-hide mt-14 flex gap-3 overflow-x-auto pb-4">
            {capabilities.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeCapability;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveCapability(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'border-[#FC4C00] bg-[#FC4C00] text-[#FFF9F0]'
                      : 'border-[#FFF9F0]/20 bg-[#0A192F] text-[#FFF9F0]/70 hover:border-[#FC4C00] hover:text-[#FC4C00]'
                  }`}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Active Capability */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="mt-10 grid overflow-hidden rounded-[2rem] border border-[#FFF9F0]/10 bg-[#FFF9F0] lg:grid-cols-2"
            >
              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FC4C00] text-[#FFF9F0]">
                  <active.icon size={26} />
                </div>

                <h3 className="mt-8 text-3xl font-bold text-[#0A192F] lg:text-4xl">
                  {active.title}
                </h3>

                <p className="mt-5 max-w-xl leading-8 text-[#0A192F]/70">
                  {active.description}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {active.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-3 rounded-xl border border-[#0A192F]/10 p-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FC4C00] text-[#FFF9F0]">
                        <Check size={12} strokeWidth={3} />
                      </div>

                      <span className="text-sm font-medium text-[#0A192F]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#FC4C00] px-6 py-3.5 font-semibold text-[#FFF9F0] transition-all hover:bg-[#0A192F]"
                >
                  Discuss This Capability
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Image */}
              <div className="relative min-h-[400px] overflow-hidden lg:min-h-full">
                <Image
                  src={active.image}
                  alt={`${active.title} - SiliconHubs digital marketing`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                <div className="absolute inset-0 bg-[#0A192F]/50" />

                <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-[#FFF9F0]/20 bg-[#0A192F]/90 p-6 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-[#FC4C00]" size={20} />
                    <span className="font-semibold text-[#FFF9F0]">
                      SiliconHubs Growth System
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#FFF9F0]/65">
                    Strategy, execution, measurement and optimization working
                    together.
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* =====================================================
          PERFORMANCE MARKETING
      ===================================================== */}

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FC4C00]/30 px-4 py-2 text-sm font-semibold text-[#FC4C00]">
                <Megaphone size={16} />
                Performance Marketing
              </div>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-[#0A192F] lg:text-5xl">
                Spend Smarter.
                <span className="block text-[#FC4C00]">
                  Learn Faster. Scale Better.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#0A192F]/70">
                Paid media works best when advertising, creative, landing pages,
                tracking and conversion optimization are connected.
              </p>

              <div className="mt-9 space-y-4">
                {[
                  'Campaign architecture',
                  'Audience segmentation',
                  'Creative experimentation',
                  'Retargeting',
                  'Conversion tracking',
                  'Continuous optimization',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FC4C00] text-[#FFF9F0]">
                      <Check size={14} />
                    </div>
                    <span className="font-medium text-[#0A192F]">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#FC4C00] px-7 py-4 font-bold text-[#FFF9F0] transition-all hover:bg-[#0A192F]"
              >
                Plan a Paid Growth Campaign
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-[2rem] border border-[#0A192F]/10 bg-[#0A192F] p-6 shadow-2xl lg:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#FFF9F0]/60">
                      Campaign Overview
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-[#FFF9F0]">
                      Growth Dashboard
                    </h3>
                  </div>

                  <div className="rounded-xl bg-[#FC4C00] p-3 text-[#FFF9F0]">
                    <BarChart3 size={20} />
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-10 flex h-48 items-end gap-3">
                  {[35, 48, 42, 65, 58, 76, 68, 88, 80, 96].map(
                    (height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.06,
                          duration: 0.6,
                        }}
                        className="flex-1 rounded-t-lg bg-[#FC4C00]"
                      />
                    )
                  )}
                </div>

                <div className="mt-4 flex justify-between text-xs text-[#FFF9F0]/50">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>

                {/* Metrics */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    ['Traffic', '↑'],
                    ['Leads', '↑'],
                    ['Conversions', '↑'],
                  ].map(([label, arrow]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-[#FFF9F0]/10 bg-[#FFF9F0]/5 p-4"
                    >
                      <p className="text-xs text-[#FFF9F0]/50">{label}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <TrendingUp size={15} className="text-[#FC4C00]" />
                        <span className="text-lg font-bold text-[#FFF9F0]">
                          {arrow}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FC4C00] text-[#FFF9F0] shadow-xl">
                <Zap size={28} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEO + LOCAL + GEO/AEO
      ===================================================== */}

      <section className="bg-[#FC4C00] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FFF9F0]/30 px-4 py-2 text-sm font-bold text-[#FFF9F0]">
              <Globe2 size={16} />
              Search Visibility
            </div>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-[#FFF9F0] lg:text-6xl">
              Built for Search.
              <span className="block text-[#0A192F]">
                Built for the Future of Search.
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-[#FFF9F0]/80">
              Search is evolving beyond traditional blue links. Your growth
              strategy needs strong SEO fundamentals while preparing content and
              entities for local, answer and generative search.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: 'Traditional SEO',
                items: [
                  'Technical SEO',
                  'Search intent',
                  'Content clusters',
                  'Internal linking',
                  'Schema',
                ],
              },
              {
                icon: MapPin,
                title: 'Local SEO + GMB',
                items: [
                  'Google Business Profile',
                  'Local citations',
                  'Reviews',
                  'Location pages',
                  'Maps visibility',
                ],
              },
              {
                icon: Sparkles,
                title: 'GEO + AEO',
                items: [
                  'AI-search readiness',
                  'Answer architecture',
                  'Entity optimization',
                  'FAQ content',
                  'Structured data',
                ],
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -8 }}
                className="rounded-3xl border border-[#FFF9F0]/20 bg-[#0A192F] p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FC4C00] text-[#FFF9F0]">
                  <card.icon size={25} />
                </div>

                <h3 className="mt-7 text-2xl font-bold text-[#FFF9F0]">
                  {card.title}
                </h3>

                <ul className="mt-6 space-y-3">
                  {card.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[#FFF9F0]/70"
                    >
                      <Check size={16} className="text-[#FC4C00]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FULL FUNNEL
      ===================================================== */}

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Full-Funnel Growth"
            title="From First Impression"
            titleHighlight="To Customer Retention"
            subtitle="Every stage of the customer journey should have a purpose, a message and a measurable action."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-4">
            {funnel.map((item, index) => {
              const Icon = item.icon;
              const active = activeFunnel === index;

              return (
                <motion.button
                  key={item.title}
                  onClick={() => setActiveFunnel(index)}
                  whileHover={{ y: -8 }}
                  className={`rounded-3xl border p-7 text-left transition-all duration-300 ${
                    active
                      ? 'border-[#FC4C00] bg-[#0A192F]'
                      : 'border-[#0A192F]/10 bg-[#FFF9F0] hover:border-[#FC4C00]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-bold ${
                        active ? 'text-[#FC4C00]' : 'text-[#FC4C00]'
                      }`}
                    >
                      {item.stage}
                    </span>

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        active
                          ? 'bg-[#FC4C00] text-[#FFF9F0]'
                          : 'bg-[#0A192F] text-[#FC4C00]'
                      }`}
                    >
                      <Icon size={21} />
                    </div>
                  </div>

                  <h3
                    className={`mt-7 text-2xl font-bold ${
                      active ? 'text-[#FFF9F0]' : 'text-[#0A192F]'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-3 ${
                      active ? 'text-[#FFF9F0]/65' : 'text-[#0A192F]/65'
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="mt-6 space-y-2">
                    {item.channels.map((channel) => (
                      <div
                        key={channel}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          active
                            ? 'bg-[#FFF9F0]/10 text-[#FFF9F0]/80'
                            : 'bg-[#0A192F]/5 text-[#0A192F]/70'
                        }`}
                      >
                        {channel}
                      </div>
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          EXECUTION FLOW
      ===================================================== */}

      <section className="bg-[#0A192F] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Execution"
            title="A Repeatable Growth"
            titleHighlight="Operating System"
            subtitle="A structured process keeps strategy, execution and optimization aligned."
          />

          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-[#FFF9F0]/15 lg:block" />

            <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-6">
              {executionFlow.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#0A192F] bg-[#FC4C00] font-bold text-[#FFF9F0]">
                    {index + 1}
                  </div>

                  <h3 className="mt-5 font-bold text-[#FFF9F0]">{step}</h3>

                  <p className="mt-2 text-sm text-[#FFF9F0]/50">Growth stage</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MARKETING FEATURES GRID
      ===================================================== */}

      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            eyebrow="Everything Connected"
            title="The Growth Stack"
            titleHighlight="Your Business Needs"
            subtitle="Build a connected digital marketing engine instead of managing disconnected campaigns."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {services.map((service) => (
              <FeatureCard
                key={service.title}
                icon={service.icon}
                title={service.title}
                description={service.description}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <section className="bg-[#FC4C00] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FFF9F0]/30 px-4 py-2 text-sm font-bold text-[#FFF9F0]">
                <BarChart3 size={16} />
                Analytics & Attribution
              </div>

              <h2 className="mt-6 text-4xl font-bold text-[#FFF9F0] lg:text-5xl">
                Stop Guessing.
                <span className="block text-[#0A192F]">Start Measuring.</span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-[#FFF9F0]/80">
                A strong marketing system needs a strong measurement layer. We
                structure analytics around meaningful business events.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  'GA4',
                  'Google Tag Manager',
                  'Search Console',
                  'Looker Studio',
                  'Meta Pixel',
                  'UTM Tracking',
                  'CRM Attribution',
                  'Conversion Tracking',
                ].map((tool) => (
                  <div
                    key={tool}
                    className="flex items-center gap-3 rounded-xl border border-[#FFF9F0]/20 bg-[#0A192F] p-4 text-sm font-semibold text-[#FFF9F0]"
                  >
                    <Check size={16} className="text-[#FC4C00]" />
                    {tool}
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics Card */}
            <div className="rounded-[2rem] border border-[#FFF9F0]/20 bg-[#0A192F] p-7 lg:p-9">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FC4C00] text-[#FFF9F0]">
                  <Gauge size={23} />
                </div>

                <div>
                  <p className="text-sm text-[#FFF9F0]/50">Measurement Layer</p>
                  <h3 className="font-bold text-[#FFF9F0]">Marketing Health</h3>
                </div>
              </div>

              <div className="mt-9 space-y-6">
                {[
                  ['Tracking', 92],
                  ['Attribution', 84],
                  ['Conversion Data', 88],
                  ['Reporting', 95],
                ].map(([label, value]) => (
                  <div key={String(label)}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-[#FFF9F0]/70">{label}</span>
                      <span className="font-bold text-[#FC4C00]">{value}%</span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#FFF9F0]/10">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full rounded-full bg-[#FC4C00]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-9 rounded-2xl border border-[#FFF9F0]/10 bg-[#FFF9F0]/5 p-5">
                <div className="flex gap-3">
                  <BrainCircuit
                    size={20}
                    className="mt-0.5 shrink-0 text-[#FC4C00]"
                  />

                  <p className="text-sm leading-6 text-[#FFF9F0]/65">
                    Better measurement creates better decisions. The exact KPIs
                    depend on your business model, funnel and objectives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TOOLS
      ===================================================== */}

      <section className="py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <span className="font-semibold text-[#FC4C00]">
              MARKETING TECHNOLOGY
            </span>

            <h2 className="mt-3 text-3xl font-bold text-[#0A192F] lg:text-4xl">
              Tools That Power the Workflow
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[#0A192F]/65">
              We work with established marketing, analytics, SEO and automation
              platforms based on your specific requirements.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {tools.map((tool) => (
              <motion.div
                key={tool}
                whileHover={{ y: -4, scale: 1.03 }}
                className="rounded-full border border-[#0A192F]/10 bg-[#FFF9F0] px-5 py-3 text-sm font-semibold text-[#0A192F] transition-colors hover:border-[#FC4C00]"
              >
                {tool}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CASE STUDIES
      ===================================================== */}

      <ServiceCaseStudies
        eyebrow="Selected Work"
        title="Strategy That Turns Into"
        titleHighlight="Real Digital Experiences"
        subtitle="Explore examples of the digital transformation, web, e-commerce and SEO work behind our broader growth approach."
        caseStudies={[
          {
            img: '/media/portfolio/featured-projects/seo-campaign.jpg',
            title: 'SEO Growth System',
            desc: 'A search-focused digital experience built around technical SEO, content architecture and measurable visibility.',
            sliderName: 'SEO',
          },
          {
            img: '/media/portfolio/case-studies/ecommerce.jpg',
            title: 'E-Commerce Growth',
            desc: 'A conversion-focused e-commerce experience connecting discovery, product experience and customer journeys.',
            sliderName: 'E-Commerce',
          },
          {
            img: '/media/portfolio/case-studies/digital-transformation.jpg',
            title: 'Digital Transformation',
            desc: 'A modern digital platform designed to connect technology, content and business growth.',
            sliderName: 'Digital',
          },
        ]}
      />

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="bg-[#0A192F] py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center">
            <span className="font-semibold text-[#FC4C00]">
              FREQUENTLY ASKED QUESTIONS
            </span>

            <h2 className="mt-4 text-4xl font-bold text-[#FFF9F0] lg:text-5xl">
              Digital Marketing
              <span className="text-[#FC4C00]"> FAQs</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#FFF9F0]/65">
              Clear answers to common questions about our digital marketing,
              SEO, local SEO, GEO, AEO and performance marketing services.
            </p>
          </div>

          <div className="mt-14 border-t border-[#FFF9F0]/20">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                faq={faq}
                open={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <ServiceCTA
        eyebrow="Ready to Grow?"
        title="Build a Marketing Engine"
        titleHighlight="That Compounds"
        subtitle="Let's build a digital growth strategy around your business goals, customers, funnel and measurable outcomes."
        ctaText="Start Your Growth Strategy"
        ctaLink="/contact"
      />

      {/* =====================================================
          STRUCTURED DATA / FAQ SEO
      ===================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
