'use client';

import dynamic from 'next/dynamic';
import OptimizedSectionWrapper from '@/modules/public/sections/OptimizedSectionWrapper';
import SimpleCTA from '@/modules/public/sections/SimpleCTA';

const NullComponent = () => null;

const CleanHero = dynamic(
  () => import('@/modules/public/sections/CleanHero').catch(() => ({ default: NullComponent })),
  {
    ssr: false,
    loading: () => (
      <section className="flex min-h-screen items-center justify-center" style={{ background: '#000212' }}>
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#4285F4]/30 border-t-[#4285F4]" />
      </section>
    ),
  }
);

const Connect = dynamic(
  () => import('@/modules/public/sections/Connect').catch(() => ({ default: NullComponent })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

const HolographicContact = dynamic(
  () =>
    import('@/modules/public/sections/HolographicContact').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-[#0A0F1E] py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
      </section>
    ),
  }
);

const PortfolioGallery = dynamic(
  () =>
    import('@/modules/public/sections/PortfolioGallery').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

const ServicesShowcase = dynamic(
  () =>
    import('@/modules/public/sections/ServicesShowcase').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

const HolographicTeam = dynamic(
  () =>
    import('@/modules/public/sections/HolographicTeam').catch(() => ({
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

const TechStackMarquee = dynamic(
  () =>
    import('@/modules/public/sections/TechStackMarquee').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-16 md:py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

const AboutSection = dynamic(
  () => import('@/modules/public/sections/AboutSection').catch(() => ({ default: NullComponent })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

const CaseStudiesCarousel = dynamic(
  () =>
    import('@/modules/public/sections/CaseStudiesCarousel').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20 md:py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#fc4c00]/30 border-t-[#fc4c00]" />
      </section>
    ),
  }
);

const PremiumTestimonials = dynamic(
  () =>
    import('@/modules/public/components/premium-testimonials')
      .then((mod) => ({ default: mod.PremiumTestimonials }))
      .catch(() => ({ default: NullComponent })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-gradient-to-br from-black via-[#0F172A] to-black py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#fc4c00]/30 border-t-[#fc4c00]" />
      </section>
    ),
  }
);

const BlogSection = dynamic(
  () => import('@/modules/public/sections/BlogSection').catch(() => ({ default: NullComponent })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

const BentoGridSection = dynamic(
  () =>
    import('@/modules/public/sections/BentoGridSection').catch(() => ({
      default: NullComponent,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

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

export default function HomeSections() {
  return (
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
  );
}
