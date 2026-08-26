import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import { generateWebSiteSchema } from '@/lib/seo/structuredData';
import dynamic from 'next/dynamic';
import SimpleCTA from '@/modules/public/sections/SimpleCTA';
import { BatchSectionProvider } from '@/modules/public/sections/BatchSectionProvider';
import OptimizedSectionWrapper from '@/modules/public/sections/OptimizedSectionWrapper';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/');
}

// Fallback component when a dynamic chunk fails to load (avoids "options.factory" crash)
const NullComponent = () => null;

// Hero component - Clean hero with particle background (client-side only)
const CleanHero = dynamic(
  () => import('@/modules/public/sections/CleanHero').catch(() => ({ default: NullComponent })),
  {

    loading: () => (
      <section
        className="flex min-h-screen items-center justify-center"
        style={{ background: '#000212' }}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#4285F4]/30 border-t-[#4285F4]" />
      </section>
    ),
  }
);

// Connect section - dynamic import for framer-motion animations
const Connect = dynamic(
  () => import('@/modules/public/sections/Connect').catch(() => ({ default: NullComponent })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

// HolographicContact - dynamic import for WebGL globe (SSR disabled)
const HolographicContact = dynamic(
  () =>
    import('@/modules/public/sections/HolographicContact').catch(() => ({
      default: NullComponent,
    })),
  {

    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-[#0A0F1E] py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </section>
    ),
  }
);

// Portfolio Gallery - dynamic import for image gallery
const PortfolioGallery = dynamic(
  () =>
    import('@/modules/public/sections/PortfolioGallery').catch(() => ({
      default: NullComponent,
    })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

// ServicesShowcase - Alternating image/content layout for featured services
const ServicesShowcase = dynamic(
  () =>
    import('@/modules/public/sections/ServicesShowcase').catch(() => ({
      default: NullComponent,
    })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

// HolographicTeam - Team carousel section
const HolographicTeam = dynamic(
  () =>
    import('@/modules/public/sections/HolographicTeam').catch(() => ({
      default: NullComponent,
    })),
  {

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
    import('@/modules/public/sections/TechStackMarquee').catch(() => ({
      default: NullComponent,
    })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-16 md:py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

// About Section - Who we are
const AboutSection = dynamic(
  () => import('@/modules/public/sections/AboutSection').catch(() => ({ default: NullComponent })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

// CaseStudiesCarousel - Progressive auto-advancing carousel
const CaseStudiesCarousel = dynamic(
  () =>
    import('@/modules/public/sections/CaseStudiesCarousel').catch(() => ({
      default: NullComponent,
    })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-20 md:py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#fc4c00]/30 border-t-[#fc4c00]" />
      </section>
    ),
  }
);

// PremiumTestimonials - Premium testimonials with animations
const PremiumTestimonials = dynamic(
  () =>
    import('@/modules/public/components/premium-testimonials')
      .then((mod) => ({ default: mod.PremiumTestimonials }))
      .catch(() => ({ default: NullComponent })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-gradient-to-br from-black via-[#0F172A] to-black py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#fc4c00]/30 border-t-[#fc4c00]" />
      </section>
    ),
  }
);

// BlogSection - Latest blog posts
const BlogSection = dynamic(
  () => import('@/modules/public/sections/BlogSection').catch(() => ({ default: NullComponent })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

// Bento Grid - Services showcase
const BentoGridSection = dynamic(
  () =>
    import('@/modules/public/sections/BentoGridSection').catch(() => ({
      default: NullComponent,
    })),
  {

    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
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
        <main className="min-h-screen bg-black">
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
