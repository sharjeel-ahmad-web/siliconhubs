'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Megaphone,
  Search,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  Workflow,
  Filter,
  Zap,
  LineChart,
  ShieldCheck,
  Layers,
  Globe,
  Sparkles,
  PieChart,
  Repeat,
  Mail,
  Share2,
  CheckCircle2,
  ArrowRight,
  MousePointerClick,
  Bot,
  DollarSign,
  Eye,
  UserPlus,
  ShoppingCart,
  Gauge,
  CalendarDays,
  FileText,
  Bell,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Smartphone,
  Monitor,
  Award,
  Lightbulb,
  Activity,
  Database,
  BarChart,
  CircleDollarSign,
  ChevronRight,
  Check,
  Clock,
  Rocket,
  Crosshair,
  RefreshCw,
  Workflow as WorkflowIcon,
} from 'lucide-react';

import {
  ServicesHeroSection,
  ServiceItem,
} from '@/components/ui/services-hero-section';

import ServiceCaseStudies, {
  CaseStudy,
} from '@/components/sections/ServiceCaseStudies';

import ServiceCTA from '@/components/sections/ServiceCTA';

import { SectionHeading } from '@/components/ui/section-heading';

/* =========================================================
   SILICONHUBS BRAND COLORS
========================================================= */

const COLORS = {
  orange: '#FC4C00',
  navy: '#071B3A',
  cream: '#FFE8C1',
  lightCream: '#FFF5E8',
  white: '#FFFFFF',
  border: '#E8D8C5',
  muted: '#526071',
};

/* =========================================================
   ANIMATIONS
========================================================= */

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   SERVICES
========================================================= */

const services: ServiceItem[] = [
  {
    id: 'performance-marketing',
    name: 'Performance Marketing',
    url: '/contact',
    description:
      'Data-engineered paid campaigns tuned for high ROAS, qualified leads and scalable customer acquisition.',
    imgSrc: '/media/portfolio/featured-projects/seo-campaign.jpg',
  },
  {
    id: 'seo-organic',
    name: 'SEO & Organic Growth',
    url: '/contact',
    description:
      'Technical SEO, content strategy and authority building designed for sustainable search growth.',
    imgSrc: '/media/portfolio/case-studies/digital-transformation.jpg',
  },
  {
    id: 'social-media',
    name: 'Social Media Strategy',
    url: '/contact',
    description:
      'Creative social strategies designed to increase reach, engagement, community and conversions.',
    imgSrc: '/media/home/case-studies/enterprise-platform.jpg',
  },
  {
    id: 'cro-funnels',
    name: 'CRO & Funnel Design',
    url: '/contact',
    description:
      'High-converting landing pages, offers and customer journeys engineered to turn traffic into revenue.',
    imgSrc: '/media/portfolio/case-studies/ecommerce.jpg',
  },
  {
    id: 'lifecycle-automation',
    name: 'Email & Lifecycle Automation',
    url: '/contact',
    description:
      'Automated customer journeys that increase retention, repeat purchases and lifetime value.',
    imgSrc: '/media/services/seo/case-studies/ecommerce-seo.jpg',
  },
  {
    id: 'influencer-affiliate',
    name: 'Influencer & Digital PR',
    url: '/contact',
    description:
      'Creator partnerships and digital PR campaigns that increase authority, trust and brand visibility.',
    imgSrc: '/media/services/seo/case-studies/local-business.jpg',
  },
];

/* =========================================================
   MARKETING PILLARS
========================================================= */

const marketingPillars = [
  {
    id: 'paid-media',
    label: 'Paid Media',
    icon: Target,
    tagline: 'Precision Audience Acquisition',
    features: [
      {
        title: 'Google & YouTube Ads',
        desc: 'Capture high-intent searches and video audiences using optimized campaign structures.',
      },
      {
        title: 'Meta & Instagram Ads',
        desc: 'Full-funnel Facebook and Instagram advertising with creative testing and audience optimization.',
      },
      {
        title: 'TikTok Advertising',
        desc: 'Performance-focused short-form advertising designed around modern buying behavior.',
      },
      {
        title: 'Retargeting Architecture',
        desc: 'Reconnect with website visitors, abandoned carts and high-intent prospects.',
      },
      {
        title: 'Campaign Optimization',
        desc: 'Continuous budget, audience, creative and bidding optimization.',
      },
      {
        title: 'ROAS & CAC Management',
        desc: 'Optimize campaigns around business outcomes rather than vanity metrics.',
      },
    ],
  },

  {
    id: 'organic-seo',
    label: 'SEO & Authority',
    icon: Search,
    tagline: 'Sustainable Search Dominance',
    features: [
      {
        title: 'Technical SEO',
        desc: 'Technical audits, crawl optimization, indexing, Core Web Vitals and structured data.',
      },
      {
        title: 'Keyword Strategy',
        desc: 'Research and prioritization of high-intent commercial and informational keywords.',
      },
      {
        title: 'Content Engine',
        desc: 'Content systems designed to capture search demand and build topical authority.',
      },
      {
        title: 'Digital PR & Link Building',
        desc: 'Authority-building campaigns focused on relevant and high-quality placements.',
      },
      {
        title: 'Local SEO',
        desc: 'Location-based optimization for businesses targeting local customers.',
      },
      {
        title: 'SEO Reporting',
        desc: 'Track rankings, organic traffic, impressions, clicks and conversions.',
      },
    ],
  },

  {
    id: 'funnel-cro',
    label: 'CRO & Funnels',
    icon: Zap,
    tagline: 'Turning Clicks Into Revenue',
    features: [
      {
        title: 'Landing Page Optimization',
        desc: 'High-performance landing pages designed around conversion psychology.',
      },
      {
        title: 'A/B Testing',
        desc: 'Test headlines, offers, layouts, CTAs and user experiences.',
      },
      {
        title: 'Heatmap Analysis',
        desc: 'Identify friction points using behavioral analytics and session recordings.',
      },
      {
        title: 'Offer Engineering',
        desc: 'Improve value propositions, offers and conversion triggers.',
      },
      {
        title: 'Checkout Optimization',
        desc: 'Reduce abandonment and improve the customer purchase experience.',
      },
      {
        title: 'Conversion Tracking',
        desc: 'Track every important customer action from click to conversion.',
      },
    ],
  },

  {
    id: 'retention-crm',
    label: 'Automation & CRM',
    icon: Mail,
    tagline: 'Maximizing Customer Lifetime Value',
    features: [
      {
        title: 'Email Automation',
        desc: 'Welcome, nurture, abandoned cart and re-engagement campaigns.',
      },
      {
        title: 'WhatsApp Marketing',
        desc: 'Conversational marketing flows for leads and customers.',
      },
      {
        title: 'Customer Segmentation',
        desc: 'Segment users based on behavior, value and lifecycle stage.',
      },
      {
        title: 'Lead Scoring',
        desc: 'Identify high-quality leads and prioritize sales opportunities.',
      },
      {
        title: 'Retention Campaigns',
        desc: 'Automated strategies designed to increase repeat purchases.',
      },
      {
        title: 'Referral Systems',
        desc: 'Create automated referral and loyalty loops.',
      },
    ],
  },
];

/* =========================================================
   PERFORMANCE FLOW
========================================================= */

const performanceFlow = [
  {
    icon: Filter,
    step: '01',
    title: 'Data Ecosystem Audit',
    description:
      'We audit analytics, tracking, pixels, CRM data and attribution systems.',
  },
  {
    icon: Workflow,
    step: '02',
    title: 'Growth Architecture',
    description:
      'We design the complete acquisition, conversion and retention system.',
  },
  {
    icon: Megaphone,
    step: '03',
    title: 'Omnichannel Deployment',
    description:
      'We launch campaigns across search, social, content, email and automation.',
  },
  {
    icon: LineChart,
    step: '04',
    title: 'Optimization & Scale',
    description:
      'We continuously analyze performance and move budget toward winning channels.',
  },
];

/* =========================================================
   CASE STUDIES
========================================================= */

const caseStudies: CaseStudy[] = [
  {
    img: '/media/services/seo/case-studies/ecommerce-seo.jpg',
    title: 'Full-Funnel Demand Generation',
    desc: 'Scaled E-commerce revenue through unified Meta, Google, content and conversion optimization.',
    sliderName: 'demand-generation',
  },
  {
    img: '/media/services/seo/case-studies/local-business.jpg',
    title: 'B2B Market Authority',
    desc: 'Built a content-led acquisition engine generating qualified pipeline through search and digital authority.',
    sliderName: 'brand-growth',
  },
];

/* =========================================================
   EXECUTIVE DASHBOARD DATA
========================================================= */

const dashboardStats = [
  {
    icon: Globe,
    label: 'Website Visitors',
    value: '24,850',
    growth: '+32.4%',
  },
  {
    icon: UserPlus,
    label: 'Generated Leads',
    value: '1,284',
    growth: '+48.2%',
  },
  {
    icon: ShoppingCart,
    label: 'Conversions',
    value: '347',
    growth: '+21.7%',
  },
  {
    icon: CircleDollarSign,
    label: 'Revenue',
    value: '$18,750',
    growth: '+37.2%',
  },
  {
    icon: Megaphone,
    label: 'Ad Spend',
    value: '$2,450',
    growth: '-8.4%',
  },
  {
    icon: Gauge,
    label: 'ROAS',
    value: '7.65x',
    growth: '+18.3%',
  },
];

/* =========================================================
   SOCIAL DATA
========================================================= */

const socialPlatforms = [
  {
    icon: Instagram,
    name: 'Instagram',
    followers: '24.8K',
    growth: '+14.2%',
  },
  {
    icon: Facebook,
    name: 'Facebook',
    followers: '18.4K',
    growth: '+9.7%',
  },
  {
    icon: Linkedin,
    name: 'LinkedIn',
    followers: '8.7K',
    growth: '+18.4%',
  },
  {
    icon: Youtube,
    name: 'YouTube',
    followers: '12.1K',
    growth: '+21.3%',
  },
];

/* =========================================================
   CAMPAIGNS
========================================================= */

const campaigns = [
  {
    name: 'Summer Sale',
    platform: 'Meta Ads',
    spend: '$500',
    leads: '142',
    cpl: '$3.52',
    roas: '6.4x',
  },
  {
    name: 'Lead Generation',
    platform: 'Google Ads',
    spend: '$350',
    leads: '96',
    cpl: '$3.64',
    roas: '5.8x',
  },
  {
    name: 'Retargeting',
    platform: 'Meta Ads',
    spend: '$220',
    leads: '87',
    cpl: '$2.52',
    roas: '8.1x',
  },
  {
    name: 'Brand Awareness',
    platform: 'YouTube',
    spend: '$180',
    leads: '41',
    cpl: '$4.39',
    roas: '3.7x',
  },
];

/* =========================================================
   SEO DATA
========================================================= */

const seoKeywords = [
  {
    keyword: 'digital marketing agency',
    position: '#3',
    change: '+4',
  },
  {
    keyword: 'web development agency',
    position: '#5',
    change: '+2',
  },
  {
    keyword: 'AI automation services',
    position: '#7',
    change: '+6',
  },
  {
    keyword: 'Shopify development',
    position: '#4',
    change: '+3',
  },
];

/* =========================================================
   CONTENT DATA
========================================================= */

const contentItems = [
  {
    type: 'Reel',
    title: 'Why Your Ads Are Not Converting',
    platform: 'Instagram',
    status: 'Published',
  },
  {
    type: 'Carousel',
    title: '5 Digital Marketing Mistakes',
    platform: 'LinkedIn',
    status: 'Scheduled',
  },
  {
    type: 'Post',
    title: 'Build. Automate. Scale.',
    platform: 'Facebook',
    status: 'Approved',
  },
  {
    type: 'Blog',
    title: 'Complete SEO Growth Guide',
    platform: 'Website',
    status: 'Draft',
  },
];

/* =========================================================
   COMPETITOR DATA
========================================================= */

const competitors = [
  {
    name: 'Your Brand',
    followers: '24.8K',
    engagement: '5.8%',
    posts: '18/mo',
  },
  {
    name: 'Competitor A',
    followers: '18.2K',
    engagement: '3.2%',
    posts: '12/mo',
  },
  {
    name: 'Competitor B',
    followers: '31.7K',
    engagement: '4.1%',
    posts: '21/mo',
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DigitalMarketingPageClient() {
  const [activeTab, setActiveTab] = useState('paid-media');

  const currentPillar =
    marketingPillars.find((p) => p.id === activeTab) || marketingPillars[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFF5E8] pt-20 text-[#071B3A]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <ServicesHeroSection
        eyebrow="SiliconHubs Digital Growth Studio"
        title="Engineering Unfair Growth Advantages"
        highlightedWord="Unfair"
        highlightedWord2="Advantages"
        subtitle="End-to-end digital marketing systems combining strategy, performance media, creative, automation, analytics and AI to turn attention into predictable revenue."
        services={services}
        ctaLabel="Plan Your Growth System"
        ctaHref="/contact"
        variant="digital-marketing"
      />

      {/* =====================================================
          IMPACT STATS
      ===================================================== */}

      <section className="border-y border-[#E8D8C5] bg-[#FFE8C1] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {[
              ['4.8x', 'Average Blended ROAS'],
              ['38%', 'Average CAC Reduction'],
              ['100M+', 'Tracked User Signals'],
              ['94%', 'Client Retention Rate'],
            ].map(([metric, label]) => (
              <motion.div
                key={label}
                variants={fadeInUp}
                className="text-center"
              >
                <p className="text-4xl font-black text-[#FC4C00] md:text-5xl">
                  {metric}
                </p>

                <p className="mt-2 text-xs font-bold uppercase tracking-wider text-[#071B3A]/70">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          EXECUTIVE GROWTH DASHBOARD
      ===================================================== */}

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Transparent Performance"
            title="Your Entire Growth Engine"
            titleHighlight="In One View"
            subtitle="Every important marketing signal brought together into a single performance dashboard."
          />

          {/* Dashboard shell */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 overflow-hidden rounded-[30px] border border-[#E8D8C5] bg-white shadow-2xl"
          >
            {/* Dashboard header */}

            <div className="flex flex-col justify-between gap-5 border-b border-[#E8D8C5] bg-[#071B3A] p-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#FC4C00]">
                  SiliconHubs Growth OS
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                  Executive Performance Dashboard
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Live Data
                </span>

                <span className="rounded-full bg-[#FC4C00] px-4 py-2 text-xs font-bold text-white">
                  September 2026
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* KPI cards */}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dashboardStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.label}
                      className="group rounded-2xl border border-[#E8D8C5] bg-[#FFF5E8] p-5 transition-all hover:-translate-y-1 hover:border-[#FC4C00] hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-[#071B3A] p-3 text-[#FC4C00]">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="text-xs font-bold text-green-600">
                          {stat.growth}
                        </span>
                      </div>

                      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#526071]">
                        {stat.label}
                      </p>

                      <p className="mt-1 text-3xl font-black text-[#071B3A]">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Dashboard lower area */}

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {/* Growth graph */}

                <div className="rounded-2xl border border-[#E8D8C5] p-6 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-[#071B3A]">
                        Revenue & Lead Growth
                      </h4>

                      <p className="mt-1 text-xs text-[#526071]">
                        Monthly performance trend
                      </p>
                    </div>

                    <LineChart className="h-5 w-5 text-[#FC4C00]" />
                  </div>

                  <div className="mt-8 flex h-56 items-end gap-3">
                    {[38, 48, 42, 62, 58, 74, 68, 86, 79, 94, 88, 100].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="group flex flex-1 flex-col justify-end"
                        >
                          <div
                            style={{ height: `${height}%` }}
                            className="rounded-t-lg bg-[#FC4C00] transition-all duration-500 group-hover:bg-[#071B3A]"
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 flex justify-between text-[10px] font-bold text-[#526071]">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                  </div>
                </div>

                {/* AI insight */}

                <div className="rounded-2xl bg-[#071B3A] p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#FC4C00] p-3">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#FC4C00]">
                        AI Insight
                      </p>

                      <h4 className="font-black">Growth Opportunity</h4>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-white/70">
                    Retargeting currently generates your strongest return.
                    Increasing qualified retargeting traffic could improve
                    conversion efficiency.
                  </p>

                  <div className="mt-6 rounded-xl bg-white/10 p-4">
                    <div className="flex justify-between">
                      <span className="text-xs text-white/60">
                        Current ROAS
                      </span>

                      <strong className="text-[#FC4C00]">8.1x</strong>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[81%] rounded-full bg-[#FC4C00]" />
                    </div>
                  </div>

                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FC4C00] px-5 py-3 text-sm font-bold transition hover:bg-white hover:text-[#071B3A]">
                    Generate Full Analysis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          SOCIAL MEDIA ANALYTICS
      ===================================================== */}

      <section className="bg-[#FFE8C1] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Social Intelligence"
            title="One Brand."
            titleHighlight="Every Platform."
            subtitle="Track audience growth, engagement and social performance across your entire digital presence."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;

              return (
                <motion.div
                  key={platform.name}
                  whileHover={{ y: -7 }}
                  className="rounded-2xl border border-[#E8D8C5] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-[#FFF5E8] p-3 text-[#FC4C00]">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="text-xs font-bold text-green-600">
                      {platform.growth}
                    </span>
                  </div>

                  <h3 className="mt-6 font-bold text-[#071B3A]">
                    {platform.name}
                  </h3>

                  <p className="mt-2 text-3xl font-black text-[#071B3A]">
                    {platform.followers}
                  </p>

                  <p className="mt-1 text-xs text-[#526071]">Followers</p>

                  <div className="mt-5 h-2 rounded-full bg-[#FFF5E8]">
                    <div className="h-full w-[76%] rounded-full bg-[#FC4C00]" />
                  </div>

                  <div className="mt-4 flex justify-between text-xs text-[#526071]">
                    <span>Engagement</span>
                    <strong>5.8%</strong>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          METHODOLOGY
      ===================================================== */}

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Our Methodology"
            title="Marketing Built Around"
            titleHighlight="Momentum"
            subtitle="Isolated channels fail. We interconnect search, paid media, creative, analytics and automation into one compounding growth engine."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                icon: Target,
                title: 'Audience Strategy',
                desc: 'Identify buying signals, intent cohorts and high-value market opportunities.',
              },
              {
                icon: Megaphone,
                title: 'High-Converting Creative',
                desc: 'Create visual and video assets designed around attention and action.',
              },
              {
                icon: Database,
                title: 'First-Party Attribution',
                desc: 'Connect marketing interactions with CRM and business outcomes.',
              },
              {
                icon: TrendingUp,
                title: 'Algorithmic Scaling',
                desc: 'Scale winning campaigns while continuously controlling acquisition costs.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.article
                key={title}
                variants={fadeInUp}
                className="group rounded-2xl border border-[#E8D8C5] bg-white p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#FC4C00] hover:shadow-xl"
              >
                <div className="mb-6 inline-flex rounded-xl bg-[#FFF5E8] p-3 text-[#FC4C00] transition group-hover:bg-[#FC4C00] group-hover:text-white">
                  <Icon className="h-8 w-8" />
                </div>

                <h3 className="mb-3 text-xl font-bold text-[#071B3A]">
                  {title}
                </h3>

                <p className="text-sm leading-relaxed text-[#526071]">{desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          CAMPAIGN PERFORMANCE
      ===================================================== */}

      <section className="bg-white px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Paid Media Intelligence"
            title="Every Campaign."
            titleHighlight="Accountable."
            subtitle="See where your advertising budget is going and which campaigns are actually producing results."
          />

          <div className="mt-14 overflow-hidden rounded-3xl border border-[#E8D8C5] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-[#071B3A] text-white">
                  <tr>
                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Campaign
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Platform
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Spend
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Leads
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      CPL
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      ROAS
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign.name}
                      className="border-b border-[#E8D8C5] transition hover:bg-[#FFF5E8]"
                    >
                      <td className="p-5 font-bold text-[#071B3A]">
                        {campaign.name}
                      </td>

                      <td className="p-5 text-sm text-[#526071]">
                        {campaign.platform}
                      </td>

                      <td className="p-5 font-bold">{campaign.spend}</td>

                      <td className="p-5 font-bold">{campaign.leads}</td>

                      <td className="p-5">{campaign.cpl}</td>

                      <td className="p-5 font-black text-[#FC4C00]">
                        {campaign.roas}
                      </td>

                      <td className="p-5">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LEAD FUNNEL
      ===================================================== */}

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Lead Generation"
                title="From First Click"
                titleHighlight="To Customer"
                subtitle="Build a measurable funnel that shows exactly how prospects move from awareness to revenue."
              />

              <div className="mt-12 space-y-5">
                {[
                  ['Website Visitors', '24,850', '100%'],
                  ['Marketing Leads', '1,284', '72%'],
                  ['Qualified Leads', '672', '54%'],
                  ['Sales Opportunities', '481', '42%'],
                  ['Conversions', '347', '31%'],
                ].map(([label, value, width], index) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm font-bold text-[#071B3A]">
                        {label}
                      </span>

                      <span className="text-sm font-black text-[#FC4C00]">
                        {value}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-[#FFE8C1]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.1,
                        }}
                        className="h-full rounded-full bg-[#FC4C00]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#071B3A] p-8 text-white md:p-10">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-[#FC4C00] p-3">
                  <Users className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FC4C00]">
                    CRM Intelligence
                  </p>

                  <h3 className="text-2xl font-black">Lead Management</h3>
                </div>
              </div>

              <div className="mt-10 space-y-4">
                {[
                  ['New Leads', '1,284'],
                  ['Contacted', '1,021'],
                  ['Qualified', '672'],
                  ['Proposal', '481'],
                  ['Won', '347'],
                ].map(([stage, count], index) => (
                  <div
                    key={stage}
                    className="flex items-center justify-between rounded-xl bg-white/10 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FC4C00] text-xs font-black">
                        {index + 1}
                      </span>

                      <span className="font-semibold">{stage}</span>
                    </div>

                    <strong className="text-[#FC4C00]">{count}</strong>
                  </div>
                ))}
              </div>

              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FC4C00] px-5 py-4 font-bold transition hover:bg-white hover:text-[#071B3A]">
                Explore CRM
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SEO DASHBOARD
      ===================================================== */}

      <section className="bg-[#FFE8C1] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Organic Growth"
            title="Know Exactly Where"
            titleHighlight="You Rank"
            subtitle="Track keyword visibility, search growth and SEO opportunities in one clear interface."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-[#071B3A] p-8 text-white">
              <Search className="h-10 w-10 text-[#FC4C00]" />

              <p className="mt-8 text-sm text-white/60">Organic Traffic</p>

              <h3 className="mt-2 text-4xl font-black">42,850</h3>

              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-green-400">
                <TrendingUp className="h-4 w-4" />
                +36.8%
              </div>

              <div className="mt-8 h-3 rounded-full bg-white/10">
                <div className="h-full w-[82%] rounded-full bg-[#FC4C00]" />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#071B3A]">
                    Keyword Rankings
                  </h3>

                  <p className="mt-1 text-sm text-[#526071]">
                    Search visibility this month
                  </p>
                </div>

                <Award className="h-6 w-6 text-[#FC4C00]" />
              </div>

              <div className="space-y-4">
                {seoKeywords.map((item) => (
                  <div
                    key={item.keyword}
                    className="flex items-center justify-between rounded-xl border border-[#E8D8C5] p-4"
                  >
                    <div>
                      <p className="font-bold text-[#071B3A]">{item.keyword}</p>

                      <p className="mt-1 text-xs text-[#526071]">
                        Google Search
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="text-xl font-black text-[#071B3A]">
                        {item.position}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        ↑ {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WEBSITE ANALYTICS
      ===================================================== */}

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Website Intelligence"
            title="Traffic Is Good."
            titleHighlight="Conversions Are Better."
            subtitle="Understand where visitors come from, what they do and which pages generate business."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Eye,
                value: '24.8K',
                label: 'Visitors',
              },
              {
                icon: MousePointerClick,
                value: '8.4%',
                label: 'Conversion Rate',
              },
              {
                icon: Activity,
                value: '2m 48s',
                label: 'Avg. Session',
              },
              {
                icon: Repeat,
                value: '34.2%',
                label: 'Returning Users',
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-[#E8D8C5] bg-white p-7 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF5E8] text-[#FC4C00]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <p className="mt-6 text-3xl font-black text-[#071B3A]">
                    {item.value}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#526071]">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT MANAGEMENT
      ===================================================== */}

      <section className="bg-white px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Content Operations"
            title="Every Post."
            titleHighlight="Planned."
            subtitle="Give clients complete visibility into what is being created, approved, scheduled and published."
          />

          <div className="mt-14 overflow-hidden rounded-3xl border border-[#E8D8C5]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead className="bg-[#FFF5E8]">
                  <tr>
                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Content
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Type
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Platform
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Status
                    </th>

                    <th className="p-5 text-left text-xs uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {contentItems.map((item) => (
                    <tr key={item.title} className="border-t border-[#E8D8C5]">
                      <td className="p-5 font-bold text-[#071B3A]">
                        {item.title}
                      </td>

                      <td className="p-5 text-sm">{item.type}</td>

                      <td className="p-5 text-sm text-[#526071]">
                        {item.platform}
                      </td>

                      <td className="p-5">
                        <span className="rounded-full bg-[#FFE8C1] px-3 py-1 text-xs font-bold text-[#071B3A]">
                          {item.status}
                        </span>
                      </td>

                      <td className="p-5">
                        <button className="rounded-lg bg-[#071B3A] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#FC4C00]">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          AI MARKETING ASSISTANT
      ===================================================== */}

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[35px] bg-[#071B3A]">
            <div className="grid lg:grid-cols-2">
              <div className="p-8 md:p-14">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-[#FC4C00]">
                  <Sparkles className="h-4 w-4" />
                  AI-POWERED MARKETING
                </div>

                <h2 className="mt-7 text-4xl font-black leading-tight text-white md:text-5xl">
                  Your Marketing
                  <span className="block text-[#FC4C00]">Gets Smarter.</span>
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">
                  AI analyzes campaign performance, customer behavior and
                  marketing data to surface opportunities before they become
                  obvious.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    'Generate campaign insights',
                    'Create high-converting ad copy',
                    'Generate social content ideas',
                    'Identify underperforming campaigns',
                    'Recommend budget allocation',
                    'Summarize monthly performance',
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-white/80"
                    >
                      <CheckCircle2 className="h-5 w-5 text-[#FC4C00]" />

                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center bg-white/5 p-8 md:p-14">
                <div className="w-full rounded-3xl bg-white p-6 shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-[#E8D8C5] pb-5">
                    <div className="rounded-xl bg-[#FC4C00] p-3 text-white">
                      <Bot className="h-6 w-6" />
                    </div>

                    <div>
                      <p className="font-black text-[#071B3A]">
                        SiliconHubs AI
                      </p>

                      <p className="text-xs text-[#526071]">
                        Marketing Intelligence
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#FFF5E8] p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#FC4C00]">
                      AI Recommendation
                    </p>

                    <p className="mt-3 text-sm leading-7 text-[#071B3A]">
                      Your retargeting campaign has the lowest cost per lead and
                      highest ROAS. Consider reallocating 10–15% of the
                      awareness budget toward high-intent audiences.
                    </p>
                  </div>

                  <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FC4C00] px-5 py-4 text-sm font-bold text-white">
                    Ask AI Anything
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          COMPETITOR INTELLIGENCE
      ===================================================== */}

      <section className="bg-[#FFE8C1] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Competitive Intelligence"
            title="Don't Just Track Yourself."
            titleHighlight="Track The Market."
            subtitle="Understand how your digital presence compares with competitors."
          />

          <div className="mt-14 overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-[#071B3A] text-white">
                  <tr>
                    <th className="p-6 text-left">Brand</th>

                    <th className="p-6 text-left">Followers</th>

                    <th className="p-6 text-left">Engagement</th>

                    <th className="p-6 text-left">Content</th>

                    <th className="p-6 text-left">Position</th>
                  </tr>
                </thead>

                <tbody>
                  {competitors.map((competitor, index) => (
                    <tr
                      key={competitor.name}
                      className="border-b border-[#E8D8C5]"
                    >
                      <td className="p-6 font-bold text-[#071B3A]">
                        <div className="flex items-center gap-3">
                          {index === 0 && (
                            <span className="rounded-lg bg-[#FC4C00] p-2 text-white">
                              <Award className="h-4 w-4" />
                            </span>
                          )}

                          {competitor.name}
                        </div>
                      </td>

                      <td className="p-6 font-bold">{competitor.followers}</td>

                      <td className="p-6 font-bold text-[#FC4C00]">
                        {competitor.engagement}
                      </td>

                      <td className="p-6">{competitor.posts}</td>

                      <td className="p-6">
                        <span
                          className={
                            index === 0
                              ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700'
                              : 'rounded-full bg-[#FFF5E8] px-3 py-1 text-xs font-bold text-[#071B3A]'
                          }
                        >
                          {index === 0 ? 'You' : `Competitor ${index}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTERACTIVE MARKETING SUITE
      ===================================================== */}

      <section className="bg-white px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="360° Digital Capabilities"
            title="Every Digital Channel,"
            titleHighlight="Mastered"
            subtitle="Explore the complete marketing capabilities SiliconHubs can deploy for your business."
          />

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {marketingPillars.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activeTab === pillar.id;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveTab(pillar.id)}
                  className={`flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? 'border-[#FC4C00] bg-[#FC4C00] text-white shadow-lg shadow-[#FC4C00]/20'
                      : 'border-[#E8D8C5] bg-[#FFF5E8] text-[#071B3A] hover:border-[#FC4C00]'
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  {pillar.label}
                </button>
              );
            })}
          </div>

          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -16,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="rounded-3xl border border-[#E8D8C5] bg-[#FFF5E8] p-8 md:p-12"
              >
                <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#E8D8C5] pb-6 md:flex-row md:items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FC4C00]">
                      Capability Focus
                    </span>

                    <h3 className="mt-2 text-3xl font-black text-[#071B3A]">
                      {currentPillar.label}
                    </h3>
                  </div>

                  <p className="rounded-xl border border-[#E8D8C5] bg-white px-5 py-3 text-sm font-bold text-[#FC4C00]">
                    {currentPillar.tagline}
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {currentPillar.features.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-[#E8D8C5] bg-white p-6 transition hover:-translate-y-1 hover:border-[#FC4C00] hover:shadow-lg"
                    >
                      <CheckCircle2 className="h-6 w-6 text-[#FC4C00]" />

                      <h4 className="mt-5 font-bold text-[#071B3A]">
                        {feature.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[#526071]">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* =====================================================
          EXECUTION FLOW
      ===================================================== */}

      <section className="bg-[#071B3A] px-6 py-28 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-20 max-w-3xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-[#FC4C00]">
              Execution Engine
            </span>

            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              The SiliconHubs
              <span className="text-[#FC4C00]"> Performance Flow</span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-white/65">
              We replace guesswork with an engineered marketing system designed
              to create predictable and measurable growth.
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-4"
          >
            {performanceFlow.map(({ icon: Icon, step, title, description }) => (
              <motion.div
                key={step}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#071B3A] bg-[#FC4C00] shadow-xl shadow-[#FC4C00]/20 transition hover:scale-110">
                  <Icon className="h-9 w-9" />
                </div>

                <span className="mt-6 block text-xs font-bold tracking-widest text-[#FC4C00]">
                  PHASE {step}
                </span>

                <h3 className="mt-2 text-xl font-black">{title}</h3>

                <p className="mt-3 text-sm leading-7 text-white/60">
                  {description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-20 text-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-[#FC4C00] px-10 py-5 font-bold text-white shadow-xl shadow-[#FC4C00]/20 transition hover:scale-105 hover:bg-white hover:text-[#071B3A]"
            >
              Request Performance Audit
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          FULL FUNNEL
      ===================================================== */}

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="Unified Strategy"
                title="Full-Funnel Growth"
                titleHighlight="Architecture"
                subtitle="We connect awareness, engagement, conversion and retention into one measurable customer journey."
              />

              <div className="mt-10 flex flex-wrap gap-2">
                {[
                  'Google Ads',
                  'Meta Ads',
                  'GA4',
                  'Looker Studio',
                  'HubSpot',
                  'Klaviyo',
                  'SEMrush',
                  'Ahrefs',
                  'Hotjar',
                  'PostHog',
                  'TikTok Ads',
                  'WhatsApp',
                ].map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-[#E8D8C5] bg-white px-4 py-2 text-xs font-bold text-[#071B3A] shadow-sm transition hover:border-[#FC4C00] hover:text-[#FC4C00]"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  step: '01',
                  label: 'Discover',
                  icon: Search,
                  desc: 'Capture high-intent audiences.',
                },
                {
                  step: '02',
                  label: 'Engage',
                  icon: Users,
                  desc: 'Build trust and attention.',
                },
                {
                  step: '03',
                  label: 'Convert',
                  icon: MousePointerClick,
                  desc: 'Turn traffic into customers.',
                },
                {
                  step: '04',
                  label: 'Retain',
                  icon: Repeat,
                  desc: 'Increase lifetime value.',
                },
              ].map(({ step, label, icon: Icon, desc }) => (
                <motion.div
                  key={label}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-[#E8D8C5] bg-white p-6 shadow-sm transition hover:border-[#FC4C00]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#FC4C00]">{step}</span>

                    <Icon className="h-6 w-6 text-[#071B3A]" />
                  </div>

                  <h3 className="mt-6 text-xl font-black text-[#071B3A]">
                    {label}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#526071]">
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REPORTING / CLIENT EXPERIENCE
      ===================================================== */}

      <section className="bg-[#FFE8C1] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Client Experience"
            title="No More Marketing"
            titleHighlight="Guesswork."
            subtitle="Your clients should always know what was done, what happened and what comes next."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileText,
                title: 'Monthly Reports',
                desc: 'Beautiful performance reports with insights and recommendations.',
              },
              {
                icon: CheckCircle2,
                title: 'Content Approval',
                desc: 'Clients can review and approve posts before publishing.',
              },
              {
                icon: Bell,
                title: 'Smart Alerts',
                desc: 'Important campaign and performance changes trigger alerts.',
              },
              {
                icon: MessageSquare,
                title: 'Client Communication',
                desc: 'Keep strategy, feedback and campaign discussions organized.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-[#E8D8C5] bg-white p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071B3A] text-[#FC4C00]">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-6 font-black text-[#071B3A]">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-[#526071]">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CASE STUDIES
      ===================================================== */}

      <ServiceCaseStudies
        eyebrow="Validated Impact"
        title="Data Speaks Louder Than"
        titleHighlight="Promises"
        subtitle="Explore how SiliconHubs transforms digital activity into measurable business growth."
        caseStudies={caseStudies}
      />

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="bg-[#071B3A] px-6 py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FC4C00] text-white shadow-xl shadow-[#FC4C00]/20">
            <Rocket className="h-9 w-9" />
          </div>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest text-[#FC4C00]">
            Ready To Grow?
          </p>

          <h2 className="mt-4 text-4xl font-black text-white md:text-6xl">
            Turn Your Marketing Into
            <span className="block text-[#FC4C00]">A Growth Engine.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/65">
            Let SiliconHubs build a measurable digital marketing system designed
            around your customers, your market and your revenue goals.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#FC4C00] px-9 py-5 font-bold text-white transition hover:scale-105 hover:bg-white hover:text-[#071B3A]"
            >
              Start Your Growth Session
              <ArrowRight className="h-5 w-5" />
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-9 py-5 font-bold text-white transition hover:bg-white hover:text-[#071B3A]"
            >
              Request Free Audit
              <Search className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
