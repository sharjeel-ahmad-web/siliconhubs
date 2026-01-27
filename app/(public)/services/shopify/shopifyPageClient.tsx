'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
  ConversionFunnel,
  ProductPreview,
  ShopifyDashboard,
  MobileExperience,
} from '@/components/services/shopify';
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

// Shopify component content types
interface FunnelStage {
  name: string;
  percentage: number;
  color: string;
}

interface ConversionFunnelContent extends SectionHeadingContent {
  stages?: FunnelStage[];
  conversionLabel?: string;
  abandonmentLabel?: string;
}

interface ColorSwatch {
  name: string;
  color: string;
  image: string;
}

interface ProductPreviewContent extends SectionHeadingContent {
  colorSwatches?: ColorSwatch[];
  productLabel?: string;
  addToCartText?: string;
  dragHint?: string;
  scrollHint?: string;
}

interface MetricData {
  label: string;
  target: number;
  unit: string;
  color: string;
}

interface DashboardContent extends SectionHeadingContent {
  metrics?: MetricData[];
  chartTitle?: string;
  liveDataLabel?: string;
  monthLabels?: string[];
}

interface MobileProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface MobileFeature {
  icon: string;
  title: string;
  desc: string;
}

interface MobileExperienceContent extends SectionHeadingContent {
  products?: MobileProduct[];
  features?: MobileFeature[];
  shopTitle?: string;
  shopSubtitle?: string;
  checkoutText?: string;
  continueShoppingText?: string;
  addedToCartText?: string;
  featuresTitle?: string;
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
  eyebrow: 'E-Commerce Excellence',
  title: 'Build Your Shopify Empire with Expert Development',
  highlightedWord: 'Shopify',
  highlightedWord2: 'Expert',
  subtitle:
    'High-converting online stores that drive sales and delight customers. From custom themes to seamless integrations, we build e-commerce experiences that scale.',
  services: [
    {
      id: 'custom-themes',
      name: 'Custom Themes',
      url: '/portfolio?category=shopify-themes',
      description: 'Unique store designs that stand out',
      imgSrc: '/media/services/shopify/services/custom-themes.jpg',
    },
    {
      id: 'store-setup',
      name: 'Store Setup',
      url: '/portfolio?category=shopify-setup',
      description: 'Complete Shopify store configuration',
      imgSrc: '/media/services/shopify/services/store-setup.jpg',
    },
    {
      id: 'app-integration',
      name: 'App Integration',
      url: '/portfolio?category=shopify-apps',
      description: 'Seamless third-party integrations',
      imgSrc: '/media/services/shopify/services/app-integration.jpg',
    },
    {
      id: 'conversion-optimization',
      name: 'Conversion Optimization',
      url: '/portfolio?category=shopify-cro',
      description: 'Boost your sales with proven strategies',
      imgSrc: '/media/services/shopify/services/conversion-optimization.jpg',
    },
    {
      id: 'payment-setup',
      name: 'Payment Setup',
      url: '/portfolio?category=shopify-payments',
      description: 'Secure payment gateway integration',
      imgSrc: '/media/services/shopify/services/payment-setup.jpg',
    },
    {
      id: 'migration',
      name: 'Store Migration',
      url: '/portfolio?category=shopify-migration',
      description: 'Seamless migration from any platform',
      imgSrc: '/media/services/shopify/services/migration.jpg',
    },
  ],
  ctaLabel: 'Start Your Store',
  ctaHref: '/contact',
};

const defaultVideoContent: VideoContent = {
  eyebrow: 'See Shopify In Action',
  title: 'Watch How We Build',
  titleHighlight: 'E-Commerce Stores',
  subtitle:
    'Experience our development process and see the high-converting Shopify stores we create for our clients.',
  videoSrc: '/media/services/shopify/video/hero-video.mp4',
  ctaText: 'Start Your Shopify Store',
  ctaHref: '/contact',
};

const defaultConversionFunnelContent: ConversionFunnelContent = {
  eyebrow: 'Sales Analytics',
  title: 'Conversion Funnel',
  titleHighlight: 'Visualization',
  subtitle:
    'Watch how customers flow through your sales funnel with real-time particle visualization.',
  stages: [
    { name: 'Visitors', percentage: 100, color: '#2563EB' },
    { name: 'Product Views', percentage: 65, color: '#F97316' },
    { name: 'Add to Cart', percentage: 35, color: '#2563EB' },
    { name: 'Checkout', percentage: 20, color: '#F97316' },
    { name: 'Purchase', percentage: 15, color: '#31A4DB' },
  ],
  conversionLabel: 'Conversions',
  abandonmentLabel: 'Abandonment',
};

const defaultProductPreviewContent: ProductPreviewContent = {
  eyebrow: 'Product Display',
  title: 'Interactive 3D',
  titleHighlight: 'Product Preview',
  subtitle:
    'Give customers an immersive product experience with 3D rotation and color customization.',
  colorSwatches: [
    { name: 'Midnight Black', color: '#1E293B', image: 'black' },
    { name: 'Ocean Blue', color: '#2563EB', image: 'blue' },
    { name: 'Sunset Orange', color: '#F97316', image: 'orange' },
    { name: 'Ocean Cyan', color: '#31A4DB', image: 'green' },
  ],
  productLabel: 'SHOP',
  addToCartText: 'Add to Cart',
  dragHint: 'Drag to rotate',
  scrollHint: 'Scroll to zoom',
};

const defaultDashboardContent: DashboardContent = {
  eyebrow: 'Analytics',
  title: 'Real-Time Performance',
  titleHighlight: 'Dashboard',
  subtitle:
    "Track your store's performance with live metrics and animated visualizations.",
  metrics: [
    { label: 'Revenue', target: 125000, unit: '$', color: '#31A4DB' },
    { label: 'Orders', target: 1250, unit: '', color: '#2563EB' },
    { label: 'Conversion Rate', target: 3.8, unit: '%', color: '#F97316' },
    { label: 'Avg Order Value', target: 98, unit: '$', color: '#F59E0B' },
  ],
  chartTitle: 'Revenue Trend',
  liveDataLabel: 'Live Data',
  monthLabels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
};

const defaultMobileExperienceContent: MobileExperienceContent = {
  eyebrow: 'Mobile First',
  title: 'Mobile Shopping',
  titleHighlight: 'Experience',
  subtitle: 'Deliver a seamless mobile shopping experience that converts.',
  products: [
    { id: 1, name: 'Premium Headphones', price: 299, image: '🎧' },
    { id: 2, name: 'Smart Watch', price: 399, image: '⌚' },
    { id: 3, name: 'Wireless Earbuds', price: 199, image: '🎵' },
  ],
  features: [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      desc: 'Optimized for mobile performance',
    },
    {
      icon: '👆',
      title: 'Touch Optimized',
      desc: 'Intuitive gestures and interactions',
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      desc: 'Stunning visuals on any screen',
    },
    {
      icon: '🔒',
      title: 'Secure Checkout',
      desc: 'Safe and encrypted transactions',
    },
  ],
  shopTitle: 'Shop',
  shopSubtitle: 'Discover amazing products',
  checkoutText: 'Checkout',
  continueShoppingText: 'Continue Shopping',
  addedToCartText: 'Added to Cart!',
  featuresTitle: 'Mobile-First Experience',
};

const defaultCaseStudiesContent: CaseStudiesContent = {
  eyebrow: 'E-Commerce Success Stories',
  title: 'Shopify Stores That',
  titleHighlight: 'Convert',
  subtitle:
    "See how we've helped businesses build high-converting Shopify stores that drive sales.",
  studies: [
    {
      img: '/media/services/shopify/case-studies/fashion-boutique.jpg',
      title: 'Fashion Boutique',
      desc: 'Custom Shopify store with 3.8% conversion rate and 35% increase in average order value.',
      sliderName: 'fashion',
    },
    {
      img: '/media/services/shopify/case-studies/electronics-store.jpg',
      title: 'Electronics Store',
      desc: 'High-volume e-commerce with advanced filtering and 40% reduction in cart abandonment.',
      sliderName: 'electronics',
    },
    {
      img: '/media/services/shopify/case-studies/subscription-box.jpg',
      title: 'Subscription Box',
      desc: 'Recurring revenue model with seamless subscription management and 95% retention rate.',
      sliderName: 'subscription',
    },
    {
      img: '/media/services/shopify/case-studies/marketplace.jpg',
      title: 'Multi-vendor Marketplace',
      desc: 'Platform migration with 200+ vendors and zero downtime during transition.',
      sliderName: 'marketplace',
    },
  ],
};

const defaultCTAContent: CTAContent = {
  eyebrow: 'E-Commerce Ready',
  title: 'Launch Your',
  titleHighlight: 'Store',
  subtitle:
    "Let's build a Shopify store that turns visitors into loyal customers",
  ctaText: 'Start Your Project',
  ctaHref: '/contact',
};

export default function ShopifyPageClient() {
  // Fetch CMS content for all sections
  // Requirements: 3.2, 3.3, 3.4, 7.1
  const { content: heroContent } = useSiteContent<HeroContent>(
    'services-shopify',
    'hero'
  );
  const { content: videoContent } = useSiteContent<VideoContent>(
    'services-shopify',
    'video'
  );
  const { content: conversionFunnelContent } =
    useSiteContent<ConversionFunnelContent>(
      'services-shopify',
      'conversionFunnel'
    );
  const { content: productPreviewContent } =
    useSiteContent<ProductPreviewContent>('services-shopify', 'productPreview');
  const { content: dashboardContent } = useSiteContent<DashboardContent>(
    'services-shopify',
    'dashboard'
  );
  const { content: mobileExperienceContent } =
    useSiteContent<MobileExperienceContent>(
      'services-shopify',
      'mobileExperience'
    );
  const { content: caseStudiesContent } = useSiteContent<CaseStudiesContent>(
    'services-shopify',
    'caseStudies'
  );
  const { content: ctaContent } = useSiteContent<CTAContent>(
    'services-shopify',
    'cta'
  );

  // Safe merge: preserve defaults, allow partial CMS; ensure ctaHref is always a string
  const hero = withDefaults(defaultHeroContent, heroContent ?? undefined, ['ctaHref']);
  const video = withDefaults(defaultVideoContent, videoContent ?? undefined, ['ctaHref']);
  const conversionFunnel =
    conversionFunnelContent ?? defaultConversionFunnelContent;
  const productPreview = productPreviewContent ?? defaultProductPreviewContent;
  const dashboard = dashboardContent ?? defaultDashboardContent;
  const mobileExperience =
    mobileExperienceContent ?? defaultMobileExperienceContent;
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

      {/* Conversion Funnel Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={conversionFunnel.eyebrow}
            title={conversionFunnel.title}
            titleHighlight={conversionFunnel.titleHighlight}
            subtitle={conversionFunnel.subtitle}
          />
          <ConversionFunnel
            stages={conversionFunnel.stages}
            conversionLabel={conversionFunnel.conversionLabel}
            abandonmentLabel={conversionFunnel.abandonmentLabel}
          />
        </div>
      </section>

      {/* Product Preview Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={productPreview.eyebrow}
            title={productPreview.title}
            titleHighlight={productPreview.titleHighlight}
            subtitle={productPreview.subtitle}
          />
          <ProductPreview
            colorSwatches={productPreview.colorSwatches}
            productLabel={productPreview.productLabel}
            addToCartText={productPreview.addToCartText}
            dragHint={productPreview.dragHint}
            scrollHint={productPreview.scrollHint}
          />
        </div>
      </section>

      {/* Dashboard Section - Uses CMS content with fallback */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={dashboard.eyebrow}
            title={dashboard.title}
            titleHighlight={dashboard.titleHighlight}
            subtitle={dashboard.subtitle}
          />
          <ShopifyDashboard
            metrics={dashboard.metrics}
            chartTitle={dashboard.chartTitle}
            liveDataLabel={dashboard.liveDataLabel}
            monthLabels={dashboard.monthLabels}
          />
        </div>
      </section>

      {/* Mobile Experience Section - Uses CMS content with fallback */}
      <section className="bg-black px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={mobileExperience.eyebrow}
            title={mobileExperience.title}
            titleHighlight={mobileExperience.titleHighlight}
            subtitle={mobileExperience.subtitle}
          />
          <MobileExperience
            products={mobileExperience.products}
            features={mobileExperience.features}
            shopTitle={mobileExperience.shopTitle}
            shopSubtitle={mobileExperience.shopSubtitle}
            checkoutText={mobileExperience.checkoutText}
            continueShoppingText={mobileExperience.continueShoppingText}
            addedToCartText={mobileExperience.addedToCartText}
            featuresTitle={mobileExperience.featuresTitle}
          />
        </div>
      </section>

      {/* Shopify Case Studies - Uses CMS content with fallback */}
      <ServiceCaseStudies
        eyebrow={caseStudies.eyebrow}
        title={caseStudies.title}
        titleHighlight={caseStudies.titleHighlight}
        subtitle={caseStudies.subtitle}
        caseStudies={caseStudies.studies}
      />

      {/* Tech Stack Section - Uses CMS content with fallback */}
      <StackFeatureSection page="services-shopify" />

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
