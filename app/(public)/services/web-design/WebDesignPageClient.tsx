'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  WireframeMorph,
  DesignTimeline,
  StyleShowcase,
  ResponsivePreview,
} from '@/components/services/webdesign';
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

interface FeatureCard {
  title: string;
  description: string;
}

interface ColorScheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

interface FontOption {
  name: string;
  family: string;
}

interface StyleShowcaseContent extends SectionHeadingContent {
  featureCards?: FeatureCard[];
  brandTitle?: string;
  brandDescription?: string;
  ctaText?: string;
  colorSchemes?: ColorScheme[];
  fonts?: FontOption[];
}

interface PhaseCard {
  title: string;
  description: string;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  color: string;
  position: number;
  cards?: PhaseCard[];
}

interface DesignTimelineContent extends SectionHeadingContent {
  phases?: Phase[];
}

interface WireframeMorphContent extends SectionHeadingContent {
  logoText?: string;
  navItems?: string[];
  heroTitle?: string;
  heroSubtitle?: string;
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
  eyebrow: 'Creative Design Solutions',
  title: 'Build Stunning Websites with Premium Quality Design',
  highlightedWord: 'Premium',
  highlightedWord2: 'Design',
  subtitle:
    'We craft beautiful, functional websites that captivate your audience and convert visitors into customers. From wireframes to stunning final designs.',
  services: [
    {
      id: 'landing-pages',
      name: 'Landing Pages',
      url: '/portfolio?category=landing',
      description: 'High-converting landing pages that capture leads',
      imgSrc: '/media/services/web-design/services/landing-pages.jpg',
    },
    {
      id: 'corporate-websites',
      name: 'Corporate Websites',
      url: '/portfolio?category=corporate',
      description: 'Professional websites for established businesses',
      imgSrc: '/media/services/web-design/services/corporate-websites.jpg',
    },
    {
      id: 'portfolio-sites',
      name: 'Portfolio Sites',
      url: '/portfolio?category=portfolio',
      description: 'Showcase your work with stunning portfolios',
      imgSrc: '/media/services/web-design/services/portfolio-sites.jpg',
    },
    {
      id: 'ui-ux-design',
      name: 'UI/UX Design',
      url: '/portfolio?category=uiux',
      description: 'User-centered design that delights',
      imgSrc: '/media/services/web-design/services/ui-ux-design.jpg',
    },
    {
      id: 'responsive-design',
      name: 'Responsive Design',
      url: '/portfolio?category=responsive',
      description: 'Pixel-perfect on every device',
      imgSrc: '/media/services/web-design/services/responsive-design.jpg',
    },
    {
      id: 'brand-identity',
      name: 'Brand Identity',
      url: '/portfolio?category=branding',
      description: 'Complete visual identity systems',
      imgSrc: '/media/services/web-design/services/brand-identity.jpg',
    },
  ],
  ctaLabel: 'Start Your Project',
  ctaHref: '/contact',
};

const defaultVideoContent: VideoContent = {
  eyebrow: 'See Design In Action',
  title: 'Watch How We Create',
  titleHighlight: 'Stunning Designs',
  subtitle:
    'Experience our creative process and see the beautiful, functional designs we craft for our clients.',
  videoSrc: '/media/services/web-design/video/hero-video.mp4',
  ctaText: 'Start Your Design Project',
  ctaHref: '/contact',
};

const defaultWireframeMorphContent: WireframeMorphContent = {
  eyebrow: 'Transformation',
  title: 'Watch Design',
  titleHighlight: 'Come to Life',
  subtitle:
    'See how we transform simple wireframes into beautiful, functional designs.',
  logoText: 'Logo',
  navItems: ['Home', 'About', 'Services', 'Contact'],
  heroTitle: 'Beautiful Design',
  heroSubtitle: 'Crafted with precision',
};

const defaultDesignTimelineContent: DesignTimelineContent = {
  eyebrow: 'Methodology',
  title: 'Our Design',
  titleHighlight: 'Process',
  subtitle: 'Explore each phase of our comprehensive design methodology.',
  phases: [
    {
      id: 'discovery',
      name: 'Discovery',
      description: 'Research & Strategy',
      color: '#64748B',
      position: 0,
      cards: [
        {
          title: 'User Research',
          description: 'Understanding your target audience',
        },
        {
          title: 'Competitor Analysis',
          description: 'Market positioning insights',
        },
        { title: 'Goal Definition', description: 'Clear objectives & KPIs' },
      ],
    },
    {
      id: 'wireframe',
      name: 'Wireframe',
      description: 'Structure & Layout',
      color: '#2563EB',
      position: 25,
      cards: [
        {
          title: 'Information Architecture',
          description: 'Content organization',
        },
        { title: 'User Flows', description: 'Navigation pathways' },
        { title: 'Low-Fi Mockups', description: 'Basic layout structure' },
      ],
    },
    {
      id: 'design',
      name: 'Design',
      description: 'Visual Identity',
      color: '#37AFE1',
      position: 50,
      cards: [
        { title: 'Visual Design', description: 'Colors, typography & imagery' },
        { title: 'UI Components', description: 'Buttons, forms & elements' },
        {
          title: 'Responsive Layouts',
          description: 'Multi-device optimization',
        },
      ],
    },
    {
      id: 'development',
      name: 'Development',
      description: 'Build & Test',
      color: '#F97316',
      position: 75,
      cards: [
        { title: 'Frontend Code', description: 'HTML, CSS & JavaScript' },
        { title: 'CMS Integration', description: 'Content management setup' },
        { title: 'Quality Assurance', description: 'Testing & bug fixes' },
      ],
    },
    {
      id: 'launch',
      name: 'Launch',
      description: 'Deploy & Monitor',
      color: '#31A4DB',
      position: 100,
      cards: [
        { title: 'Deployment', description: 'Go live on production' },
        { title: 'Performance', description: 'Speed optimization' },
        { title: 'Analytics', description: 'Tracking & insights' },
      ],
    },
  ],
};

const defaultStyleShowcaseContent: StyleShowcaseContent = {
  eyebrow: 'Branding',
  title: 'Customize Your',
  titleHighlight: 'Brand',
  subtitle: 'Experiment with colors and typography to find your perfect style.',
  featureCards: [
    { title: 'Feature 1', description: 'Description text' },
    { title: 'Feature 2', description: 'Description text' },
    { title: 'Feature 3', description: 'Description text' },
  ],
  brandTitle: 'Your Brand Title',
  brandDescription:
    'This is how your content will look with the selected style. The typography and colors update in real-time to give you an instant preview of your design choices.',
  ctaText: 'Call to Action',
  colorSchemes: [
    {
      name: 'Ocean',
      primary: '#2563EB',
      secondary: '#37AFE1',
      accent: '#31A4DB',
    },
    {
      name: 'Sunset',
      primary: '#F97316',
      secondary: '#F58122',
      accent: '#F59E0B',
    },
    {
      name: 'Sky',
      primary: '#37AFE1',
      secondary: '#31A4DB',
      accent: '#2563EB',
    },
    {
      name: 'Fire',
      primary: '#F58122',
      secondary: '#F97316',
      accent: '#F59E0B',
    },
    {
      name: 'Midnight',
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#60A5FA',
    },
    {
      name: 'Coral',
      primary: '#F97316',
      secondary: '#FB923C',
      accent: '#FDBA74',
    },
    {
      name: 'Electric',
      primary: '#37AFE1',
      secondary: '#06B6D4',
      accent: '#22D3EE',
    },
    {
      name: 'Amber',
      primary: '#F59E0B',
      secondary: '#FBBF24',
      accent: '#FCD34D',
    },
  ],
  fonts: [
    { name: 'Modern', family: 'Inter, sans-serif' },
    { name: 'Classic', family: 'Georgia, serif' },
    { name: 'Tech', family: 'Fira Code, monospace' },
    { name: 'Elegant', family: 'Montserrat, sans-serif' },
  ],
};

const defaultResponsivePreviewContent: SectionHeadingContent = {
  eyebrow: 'Responsive',
  title: 'Responsive Across',
  titleHighlight: 'All Devices',
  subtitle: 'Your design adapts seamlessly from mobile to desktop.',
};

const defaultCaseStudiesContent: CaseStudiesContent = {
  eyebrow: 'Design Success Stories',
  title: 'Designs That',
  titleHighlight: 'Inspire',
  subtitle:
    "See how we've helped businesses transform their digital presence with stunning designs.",
  studies: [
    {
      img: '/media/services/web-design/case-studies/saas-landing.jpg',
      title: 'SaaS Landing Page',
      desc: 'High-converting landing page with 65% increase in sign-ups and stunning animations.',
      sliderName: 'saas',
    },
    {
      img: '/media/services/web-design/case-studies/corporate-rebrand.jpg',
      title: 'Corporate Rebrand',
      desc: 'Complete visual identity overhaul with modern design system and brand guidelines.',
      sliderName: 'corporate',
    },
    {
      img: '/media/services/web-design/case-studies/creative-portfolio.jpg',
      title: 'Creative Portfolio',
      desc: 'Award-winning portfolio site with immersive animations and 3D interactions.',
      sliderName: 'portfolio',
    },
    {
      img: '/media/services/web-design/case-studies/mobile-app-ui.jpg',
      title: 'Mobile App UI',
      desc: 'User-centered mobile design with 4.9 star rating and 50% improved task completion.',
      sliderName: 'mobile',
    },
  ],
};

const defaultCTAContent: CTAContent = {
  eyebrow: 'Design Excellence',
  title: 'Transform Your',
  titleHighlight: 'Brand',
  subtitle: "Let's create a design that sets you apart from the competition",
  ctaText: 'Start Your Project',
  ctaHref: '/contact',
};

export default function WebDesignPageClient() {
  // Fetch CMS content for all sections
  const { content: heroContent } = useSiteContent<HeroContent>(
    'services-webdesign',
    'hero'
  );
  const { content: videoContent } = useSiteContent<VideoContent>(
    'services-webdesign',
    'video'
  );
  const { content: wireframeMorphContent } =
    useSiteContent<WireframeMorphContent>(
      'services-webdesign',
      'wireframeMorph'
    );
  const { content: designTimelineContent } =
    useSiteContent<DesignTimelineContent>(
      'services-webdesign',
      'designTimeline'
    );
  const { content: styleShowcaseContent } =
    useSiteContent<StyleShowcaseContent>('services-webdesign', 'styleShowcase');
  const { content: responsivePreviewContent } =
    useSiteContent<SectionHeadingContent>(
      'services-webdesign',
      'responsivePreview'
    );
  const { content: caseStudiesContent } = useSiteContent<CaseStudiesContent>(
    'services-webdesign',
    'caseStudies'
  );
  const { content: ctaContent } = useSiteContent<CTAContent>(
    'services-webdesign',
    'cta'
  );

  // Safe merge: preserve defaults, allow partial CMS; ensure ctaHref is always a string
  const hero = withDefaults(defaultHeroContent, heroContent ?? undefined, ['ctaHref']);
  const video = withDefaults(defaultVideoContent, videoContent ?? undefined, ['ctaHref']);
  const wireframeMorph = wireframeMorphContent ?? defaultWireframeMorphContent;
  const designTimeline = designTimelineContent ?? defaultDesignTimelineContent;
  const styleShowcase = styleShowcaseContent ?? defaultStyleShowcaseContent;
  const responsivePreview =
    responsivePreviewContent ?? defaultResponsivePreviewContent;
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

      {/* Wireframe Morph Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={wireframeMorph.eyebrow}
            title={wireframeMorph.title}
            titleHighlight={wireframeMorph.titleHighlight}
            subtitle={wireframeMorph.subtitle}
          />
          <WireframeMorph
            logoText={wireframeMorph.logoText}
            navItems={wireframeMorph.navItems}
            heroTitle={wireframeMorph.heroTitle}
            heroSubtitle={wireframeMorph.heroSubtitle}
          />
        </div>
      </section>

      {/* Design Timeline Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={designTimeline.eyebrow}
            title={designTimeline.title}
            titleHighlight={designTimeline.titleHighlight}
            subtitle={designTimeline.subtitle}
          />
          <DesignTimeline phases={designTimeline.phases} />
        </div>
      </section>

      {/* Style Showcase Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={styleShowcase.eyebrow}
            title={styleShowcase.title}
            titleHighlight={styleShowcase.titleHighlight}
            subtitle={styleShowcase.subtitle}
          />
          <StyleShowcase
            featureCards={styleShowcase.featureCards}
            brandTitle={styleShowcase.brandTitle}
            brandDescription={styleShowcase.brandDescription}
            ctaText={styleShowcase.ctaText}
            colorSchemes={styleShowcase.colorSchemes}
            fonts={styleShowcase.fonts}
          />
        </div>
      </section>

      {/* Responsive Preview Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={responsivePreview.eyebrow}
            title={responsivePreview.title}
            titleHighlight={responsivePreview.titleHighlight}
            subtitle={responsivePreview.subtitle}
          />
          <ResponsivePreview />
        </div>
      </section>

      {/* Web Design Case Studies - Uses CMS content with fallback */}
      <ServiceCaseStudies
        eyebrow={caseStudies.eyebrow}
        title={caseStudies.title}
        titleHighlight={caseStudies.titleHighlight}
        subtitle={caseStudies.subtitle}
        caseStudies={caseStudies.studies}
      />

      {/* Tech Stack Section - Uses CMS content with fallback */}
      <StackFeatureSection page="services-web-design" />

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

