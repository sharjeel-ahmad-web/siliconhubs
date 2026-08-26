import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebSiteSchema } from '@/lib/seo/structuredData';
import dynamic from 'next/dynamic';
import SimpleCTA from '@/components/sections/SimpleCTA';
import { BatchSectionProvider } from '@/components/sections/BatchSectionProvider';
import OptimizedSectionWrapper from '@/components/sections/OptimizedSectionWrapper';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/');
}

// Fallback component when a dynamic chunk fails to load (avoids "options.factory" crash)
const NullComponent = () => null;

// Hero component - Clean hero with particle background (client-side only)
const CleanHero = dynamic(
  () =>
    import('@/components/sections/CleanHero').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section
        className="flex min-h-screen items-center justify-center"
        style={{ background: '#0a192f' }}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
      </section>
    ),
  }
);

// Connect section - dynamic import for framer-motion animations
const Connect = dynamic(
  () =>
    import('@/components/sections/Connect').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-warm-cream py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
      </section>
    ),
  }
);

// HolographicContact - dynamic import for WebGL globe (SSR disabled)
const HolographicContact = dynamic(
  () =>
    import('@/components/sections/HolographicContact').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-navy py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </section>
    ),
  }
);

// Portfolio Gallery - dynamic import for image gallery
const PortfolioGallery = dynamic(
  () =>
    import('@/components/sections/PortfolioGallery').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-warm-cream py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
      </section>
    ),
  }
);

// ServicesShowcase - Alternating image/content layout for featured services
const ServicesShowcase = dynamic(
  () =>
    import('@/components/sections/ServicesShowcase').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-warm-cream py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
      </section>
    ),
  }
);

// HolographicTeam - Team carousel section
const HolographicTeam = dynamic(
  () =>
    import('@/components/sections/HolographicTeam').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-[#0A0F1E] py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </section>
    ),
  }
);

// TechStackMarquee - Infinite scrolling tech logos
const TechStackMarquee = dynamic(
  () =>
    import('@/components/sections/TechStackMarquee').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-16 md:py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </section>
    ),
  }
);

// About Section - Who we are
const AboutSection = dynamic(
  () =>
    import('@/components/ui/about-section').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-warm-cream py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
      </section>
    ),
  }
);

// CaseStudiesCarousel - Progressive auto-advancing carousel
const CaseStudiesCarousel = dynamic(
  () =>
    import('@/components/sections/CaseStudiesCarousel').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20 md:py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F58122]/30 border-t-[#F58122]" />
      </section>
    ),
  }
);

// PremiumTestimonials - Premium testimonials with animations
const PremiumTestimonials = dynamic(
  () =>
    import('@/components/ui/premium-testimonials')
      .then((mod) => ({ default: mod.PremiumTestimonials }))
      .catch(() => ({ default: NullComponent })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-gradient-to-br from-navy via-navy to-navy py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-orange/30 border-t-orange" />
      </section>
    ),
  }
);

// BlogSection - Latest blog posts
const BlogSection = dynamic(
  () =>
    import('@/components/sections/BlogSection').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </section>
    ),
  }
);

// Bento Grid - Services showcase
const BentoGridSection = dynamic(
  () =>
    import('@/components/sections/BentoGridSection').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-warm-cream py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
      </section>
    ),
  }
);

// ISR with 30-second revalidation - CMS changes appear within 30 seconds
export const revalidate = 30;

// All sections on homepage
const HOME_SECTIONS = [
  'hero',
  'servicesShowcase',
  'portfolioGallery',
  'about',
  'bentoGrid',
  'techStack',
  'caseStudies',
  'testimonials',
  'blog',
  'connect',
  'team',
  'contact',
  'cta',
];

// Server Component - SEO optimized
export default function Home() {
  return (
    <>
      {/* WebSite Schema for homepage */}
      <StructuredData schema={generateWebSiteSchema()} />
      <BatchSectionProvider page="home" sections={HOME_SECTIONS}>
        <main className="min-h-screen bg-warm-cream">
          <OptimizedSectionWrapper section="hero">
            <CleanHero />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="servicesShowcase">
            <ServicesShowcase />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="portfolioGallery">
            <PortfolioGallery />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="about">
            <AboutSection />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="bentoGrid">
            <BentoGridSection />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="techStack">
            <TechStackMarquee />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="caseStudies">
            <CaseStudiesCarousel />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="testimonials">
            <PremiumTestimonials />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="blog">
            <BlogSection />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="connect">
            <Connect />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="team">
            <HolographicTeam />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="contact">
            <HolographicContact />
          </OptimizedSectionWrapper>
          <OptimizedSectionWrapper section="cta">
            <SimpleCTA />
          </OptimizedSectionWrapper>
        </main>
      </BatchSectionProvider>
    </>
  );
}
