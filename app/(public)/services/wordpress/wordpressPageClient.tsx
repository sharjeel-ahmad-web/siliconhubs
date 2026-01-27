'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  ModularGrid,
  WordPressMetrics,
  PluginConstellation,
} from '@/components/services/wordpress';
import {
  ServicesHeroSection,
  ServiceItem,
} from '@/components/ui/services-hero-section';
import ServiceCaseStudies from '@/components/sections/ServiceCaseStudies';
import ServiceCTA from '@/components/sections/ServiceCTA';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { withDefaults } from '@/lib/cms-content';

const StackFeatureSection = dynamic(
  () => import('@/components/ui/stack-feature-section'),
  {
    ssr: false,
  }
);

const ServiceVideoSection = dynamic(
  () => import('@/components/sections/ServiceVideoSection'),
  {
    ssr: false,
  }
);

// Define interfaces for CMS content types
interface HeroContent {
  eyebrow: string;
  title: string;
  highlightedWord: string;
  highlightedWord2: string;
  subtitle: string;
  services: ServiceItem[];
  ctaLabel: string;
  ctaHref: string;
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

interface SectionHeadingContent {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}

// ModularGrid content types
interface ModuleItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  position: { row: number; col: number };
}

interface ModularGridContent extends SectionHeadingContent {
  modules?: ModuleItem[];
  successMessage?: string;
}

// WordPressMetrics content types
interface MetricItem {
  label: string;
  before: number;
  after: number;
  unit: string;
  format: 'number' | 'percentage' | 'score';
  inverse?: boolean;
}

interface MetricsContent extends SectionHeadingContent {
  metrics?: MetricItem[];
}

// PluginConstellation content types
interface PluginItem {
  id: string;
  name: string;
  category: string;
  x: number;
  y: number;
  relatedTo: string[];
}

interface CategoryColor {
  category: string;
  color: string;
}

interface PluginConstellationContent extends SectionHeadingContent {
  plugins?: PluginItem[];
  categoryColors?: CategoryColor[];
  legendTitle?: string;
  instructionText?: string;
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

// Default fallback content
const defaultHeroContent: HeroContent = {
  eyebrow: 'WordPress Experts',
  title: 'Build Scalable WordPress Solutions with Modular Architecture',
  highlightedWord: 'WordPress',
  highlightedWord2: 'Modular',
  subtitle:
    'Scalable, modular WordPress solutions that grow with your business. From custom themes to powerful plugins, we build websites that perform.',
  services: [
    {
      id: 'custom-themes',
      name: 'Custom Themes',
      url: '/portfolio?category=wordpress-themes',
      description: 'Bespoke WordPress themes tailored to your brand',
      imgSrc: '/media/services/wordpress/services/custom-themes.jpg',
    },
    {
      id: 'plugin-development',
      name: 'Plugin Development',
      url: '/portfolio?category=wordpress-plugins',
      description: 'Custom plugins for unique functionality',
      imgSrc: '/media/services/wordpress/services/plugin-development.jpg',
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      url: '/portfolio?category=woocommerce',
      description: 'Powerful e-commerce solutions',
      imgSrc: '/media/services/wordpress/services/woocommerce.jpg',
    },
    {
      id: 'speed-optimization',
      name: 'Speed Optimization',
      url: '/portfolio?category=wordpress-speed',
      description: 'Lightning-fast loading times',
      imgSrc: '/media/services/wordpress/services/speed-optimization.jpg',
    },
    {
      id: 'security',
      name: 'Security Hardening',
      url: '/portfolio?category=wordpress-security',
      description: 'Protect your site from threats',
      imgSrc: '/media/services/wordpress/services/security.jpg',
    },
    {
      id: 'maintenance',
      name: 'Maintenance Plans',
      url: '/portfolio?category=wordpress-maintenance',
      description: 'Keep your site running smoothly',
      imgSrc: '/media/services/wordpress/services/maintenance.jpg',
    },
  ],
  ctaLabel: 'Start Your Project',
  ctaHref: '/contact',
};

const defaultVideoContent: VideoContent = {
  eyebrow: 'See WordPress In Action',
  title: 'Watch How We Build',
  titleHighlight: 'WordPress Sites',
  subtitle:
    'Experience our development process and see the powerful WordPress solutions we create for our clients.',
  videoSrc: '/media/services/wordpress/video/hero-video.mp4',
  ctaText: 'Start Your WordPress Project',
  ctaHref: '/contact',
};

const defaultModularGridContent: ModularGridContent = {
  eyebrow: 'Architecture',
  title: 'Modular Component',
  titleHighlight: 'System',
  subtitle:
    'Watch how WordPress components snap together like puzzle pieces to create powerful websites.',
  modules: [
    {
      id: 'header',
      title: 'Header',
      icon: '📋',
      color: '#2563EB',
      position: { row: 0, col: 0 },
    },
    {
      id: 'hero',
      title: 'Hero Section',
      icon: '🎯',
      color: '#F97316',
      position: { row: 0, col: 1 },
    },
    {
      id: 'nav',
      title: 'Navigation',
      icon: '🧭',
      color: '#2563EB',
      position: { row: 0, col: 2 },
    },
    {
      id: 'search',
      title: 'Search',
      icon: '🔍',
      color: '#F97316',
      position: { row: 0, col: 3 },
    },
    {
      id: 'content',
      title: 'Content Block',
      icon: '📝',
      color: '#F97316',
      position: { row: 1, col: 0 },
    },
    {
      id: 'sidebar',
      title: 'Sidebar',
      icon: '📊',
      color: '#2563EB',
      position: { row: 1, col: 1 },
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: '🖼️',
      color: '#F97316',
      position: { row: 1, col: 2 },
    },
    {
      id: 'forms',
      title: 'Forms',
      icon: '📋',
      color: '#2563EB',
      position: { row: 1, col: 3 },
    },
    {
      id: 'testimonials',
      title: 'Testimonials',
      icon: '💬',
      color: '#2563EB',
      position: { row: 2, col: 0 },
    },
    {
      id: 'cta',
      title: 'Call to Action',
      icon: '🎯',
      color: '#F97316',
      position: { row: 2, col: 1 },
    },
    {
      id: 'footer',
      title: 'Footer',
      icon: '📌',
      color: '#2563EB',
      position: { row: 2, col: 2 },
    },
    {
      id: 'social',
      title: 'Social Links',
      icon: '🔗',
      color: '#F97316',
      position: { row: 2, col: 3 },
    },
  ],
  successMessage: '✨ Modular components assembled successfully!',
};

const defaultMetricsContent: MetricsContent = {
  eyebrow: 'Analytics',
  title: 'Performance That',
  titleHighlight: 'Matters',
  subtitle:
    'See the dramatic improvements our WordPress optimization delivers.',
  metrics: [
    {
      label: 'Loading Speed',
      before: 4.2,
      after: 1.3,
      unit: 's',
      format: 'number',
      inverse: true,
    },
    {
      label: 'SEO Score',
      before: 72,
      after: 96,
      unit: '/100',
      format: 'score',
    },
    {
      label: 'Accessibility',
      before: 68,
      after: 94,
      unit: '/100',
      format: 'score',
    },
    {
      label: 'Conversion Rate',
      before: 2.1,
      after: 4.8,
      unit: '%',
      format: 'percentage',
    },
  ],
};

const defaultPluginConstellationContent: PluginConstellationContent = {
  eyebrow: 'Integrations',
  title: 'Plugin',
  titleHighlight: 'Ecosystem',
  subtitle:
    'Explore our curated selection of WordPress plugins and their relationships.',
  plugins: [
    // Security plugins - top left area
    {
      id: 'wordfence',
      name: 'Wordfence',
      category: 'security',
      x: 12,
      y: 15,
      relatedTo: ['jetpack', 'ithemes'],
    },
    {
      id: 'ithemes',
      name: 'iThemes Security',
      category: 'security',
      x: 8,
      y: 32,
      relatedTo: ['wordfence', 'sucuri'],
    },
    {
      id: 'sucuri',
      name: 'Sucuri',
      category: 'security',
      x: 18,
      y: 45,
      relatedTo: ['ithemes', 'wordfence'],
    },
    // Performance plugins - top center area
    {
      id: 'wp-rocket',
      name: 'WP Rocket',
      category: 'performance',
      x: 38,
      y: 12,
      relatedTo: ['autoptimize', 'smush'],
    },
    {
      id: 'autoptimize',
      name: 'Autoptimize',
      category: 'performance',
      x: 48,
      y: 25,
      relatedTo: ['wp-rocket', 'smush'],
    },
    {
      id: 'smush',
      name: 'Smush',
      category: 'performance',
      x: 58,
      y: 15,
      relatedTo: ['wp-rocket', 'autoptimize', 'imagify'],
    },
    {
      id: 'imagify',
      name: 'Imagify',
      category: 'performance',
      x: 68,
      y: 28,
      relatedTo: ['smush'],
    },
    // SEO plugins - top right area
    {
      id: 'yoast',
      name: 'Yoast SEO',
      category: 'seo',
      x: 78,
      y: 18,
      relatedTo: ['rank-math', 'aioseo'],
    },
    {
      id: 'rank-math',
      name: 'Rank Math',
      category: 'seo',
      x: 88,
      y: 32,
      relatedTo: ['yoast', 'aioseo'],
    },
    {
      id: 'aioseo',
      name: 'All in One SEO',
      category: 'seo',
      x: 82,
      y: 48,
      relatedTo: ['yoast', 'rank-math'],
    },
    // E-commerce plugins - bottom left area
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      category: 'ecommerce',
      x: 28,
      y: 62,
      relatedTo: ['stripe', 'paypal', 'mailchimp'],
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'ecommerce',
      x: 38,
      y: 78,
      relatedTo: ['woocommerce', 'paypal'],
    },
    {
      id: 'paypal',
      name: 'PayPal',
      category: 'ecommerce',
      x: 22,
      y: 82,
      relatedTo: ['woocommerce', 'stripe'],
    },
    // Content plugins - center area
    {
      id: 'elementor',
      name: 'Elementor',
      category: 'content',
      x: 15,
      y: 68,
      relatedTo: ['acf', 'gutenberg'],
    },
    {
      id: 'acf',
      name: 'ACF',
      category: 'content',
      x: 8,
      y: 52,
      relatedTo: ['elementor', 'wpbakery'],
    },
    {
      id: 'gutenberg',
      name: 'Gutenberg',
      category: 'content',
      x: 32,
      y: 88,
      relatedTo: ['elementor'],
    },
    {
      id: 'wpbakery',
      name: 'WPBakery',
      category: 'content',
      x: 5,
      y: 75,
      relatedTo: ['acf', 'elementor'],
    },
    // Analytics plugins - right side
    {
      id: 'monsterinsights',
      name: 'MonsterInsights',
      category: 'analytics',
      x: 72,
      y: 62,
      relatedTo: ['google-analytics', 'jetpack'],
    },
    {
      id: 'google-analytics',
      name: 'GA Dashboard',
      category: 'analytics',
      x: 85,
      y: 72,
      relatedTo: ['monsterinsights'],
    },
    // Utility plugins - scattered
    {
      id: 'jetpack',
      name: 'Jetpack',
      category: 'utility',
      x: 55,
      y: 52,
      relatedTo: ['wordfence', 'mailchimp', 'monsterinsights'],
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      category: 'utility',
      x: 48,
      y: 42,
      relatedTo: ['woocommerce', 'jetpack'],
    },
    {
      id: 'contact-form-7',
      name: 'Contact Form 7',
      category: 'utility',
      x: 62,
      y: 38,
      relatedTo: ['mailchimp'],
    },
    // Backup plugins
    {
      id: 'updraftplus',
      name: 'UpdraftPlus',
      category: 'backup',
      x: 75,
      y: 85,
      relatedTo: ['jetpack'],
    },
    {
      id: 'duplicator',
      name: 'Duplicator',
      category: 'backup',
      x: 88,
      y: 58,
      relatedTo: ['updraftplus'],
    },
  ],
  categoryColors: [
    { category: 'security', color: '#EF4444' },
    { category: 'performance', color: '#2563EB' },
    { category: 'seo', color: '#31A4DB' },
    { category: 'ecommerce', color: '#F59E0B' },
    { category: 'content', color: '#F97316' },
    { category: 'analytics', color: '#37AFE1' },
    { category: 'utility', color: '#64748B' },
    { category: 'backup', color: '#22C55E' },
  ],
  legendTitle: 'Plugin Categories',
  instructionText: 'over plugins to see related connections',
};

const defaultCaseStudiesContent: CaseStudiesContent = {
  eyebrow: 'WordPress Success Stories',
  title: 'WordPress Projects That',
  titleHighlight: 'Deliver',
  subtitle:
    "See how we've helped businesses build powerful WordPress solutions that drive results.",
  studies: [
    {
      img: '/media/services/wordpress/case-studies/blog-platform.jpg',
      title: 'Blog Platform',
      desc: 'High-performance WordPress blog with 120% increase in organic traffic and 98/100 SEO score.',
      sliderName: 'blog',
    },
    {
      img: '/media/services/wordpress/case-studies/woocommerce-store.jpg',
      title: 'WooCommerce Store',
      desc: 'Custom WooCommerce solution with 45% conversion rate improvement and optimized checkout.',
      sliderName: 'woocommerce',
    },
    {
      img: '/media/services/wordpress/case-studies/corporate-site.jpg',
      title: 'Corporate Site',
      desc: 'Enterprise WordPress site with custom plugins and 1.2s load time optimization.',
      sliderName: 'corporate',
    },
    {
      img: '/media/services/wordpress/case-studies/membership-portal.jpg',
      title: 'Membership Portal',
      desc: 'Secure membership site with custom user roles and protected content management.',
      sliderName: 'membership',
    },
  ],
};

const defaultCTAContent: CTAContent = {
  eyebrow: 'WordPress Experts',
  title: 'Build Your',
  titleHighlight: 'Website',
  subtitle:
    "Let's create a scalable, high-performance WordPress solution tailored to your needs",
  ctaText: 'Start Your Project',
  ctaHref: '/contact',
};

export default function WordPressPageClient() {
  // Fetch CMS content for all sections
  // Requirements: 4.1, 4.2, 4.3, 7.1
  const { content: heroContent } = useSiteContent<HeroContent>(
    'services-wordpress',
    'hero'
  );
  const { content: videoContent } = useSiteContent<VideoContent>(
    'services-wordpress',
    'video'
  );
  const { content: modularGridContent } = useSiteContent<ModularGridContent>(
    'services-wordpress',
    'modularGrid'
  );
  const { content: metricsContent } = useSiteContent<MetricsContent>(
    'services-wordpress',
    'metrics'
  );
  const { content: pluginConstellationContent } =
    useSiteContent<PluginConstellationContent>(
      'services-wordpress',
      'pluginConstellation'
    );
  const { content: caseStudiesContent } = useSiteContent<CaseStudiesContent>(
    'services-wordpress',
    'caseStudies'
  );
  const { content: ctaContent } = useSiteContent<CTAContent>(
    'services-wordpress',
    'cta'
  );

  // Safe merge: preserve defaults, allow partial CMS; ensure ctaHref is always a string
  const hero = withDefaults(defaultHeroContent, heroContent ?? undefined, ['ctaHref']);
  const video = withDefaults(defaultVideoContent, videoContent ?? undefined, ['ctaHref']);
  const modularGrid = modularGridContent ?? defaultModularGridContent;
  const metrics = metricsContent ?? defaultMetricsContent;
  const pluginConstellation =
    pluginConstellationContent ?? defaultPluginConstellationContent;
  const caseStudies = caseStudiesContent ?? defaultCaseStudiesContent;
  const cta = withDefaults(defaultCTAContent, ctaContent ?? undefined, ['ctaHref']);

  return (
    <main className="min-h-screen bg-black pt-20">
      {/* Services Hero Section - Uses CMS content with fallback */}
      <ServicesHeroSection
        eyebrow={hero.eyebrow}
        title={hero.title}
        highlightedWord={hero.highlightedWord}
        highlightedWord2={hero.highlightedWord2}
        subtitle={hero.subtitle}
        services={Array.isArray(hero?.services) ? hero.services : []}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
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

      {/* Modular Grid Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={modularGrid.eyebrow}
            title={modularGrid.title}
            titleHighlight={modularGrid.titleHighlight}
            subtitle={modularGrid.subtitle}
          />
          <ModularGrid
            modules={modularGrid.modules}
            successMessage={modularGrid.successMessage}
          />
        </div>
      </section>

      {/* Metrics Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={metrics.eyebrow}
            title={metrics.title}
            titleHighlight={metrics.titleHighlight}
            subtitle={metrics.subtitle}
          />
          <WordPressMetrics metrics={metrics.metrics} />
        </div>
      </section>

      {/* Plugin Constellation Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={pluginConstellation.eyebrow}
            title={pluginConstellation.title}
            titleHighlight={pluginConstellation.titleHighlight}
            subtitle={pluginConstellation.subtitle}
          />
          <PluginConstellation
            plugins={pluginConstellation.plugins}
            categoryColors={pluginConstellation.categoryColors}
            legendTitle={pluginConstellation.legendTitle}
            instructionText={pluginConstellation.instructionText}
          />
        </div>
      </section>

      {/* WordPress Case Studies - Uses CMS content with fallback */}
      <ServiceCaseStudies
        eyebrow={caseStudies.eyebrow}
        title={caseStudies.title}
        titleHighlight={caseStudies.titleHighlight}
        subtitle={caseStudies.subtitle}
        caseStudies={caseStudies.studies}
      />

      {/* Tech Stack Section - Uses CMS content with fallback */}
      <StackFeatureSection page="services-wordpress" />

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
