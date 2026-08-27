'use client';

import dynamic from 'next/dynamic';
import CompanyTimeline from '@/modules/public/sections/about/CompanyTimeline';
import SkillVisualization from '@/modules/public/sections/about/SkillVisualization';
import OfficeTour from '@/modules/public/sections/about/OfficeTour';
import MiniCTA from '@/modules/public/sections/MiniCTA';
import { Hero1 } from '@/modules/public/components/hero-1';
import { SectionHeading } from '@/modules/public/components/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { BatchSectionProvider } from '@/modules/public/sections/BatchSectionProvider';
import OptimizedSectionWrapper from '@/modules/public/sections/OptimizedSectionWrapper';

const AgencyShowreel = dynamic(
  () => import('@/modules/public/sections/AgencyShowreel'),
  {
    ssr: false,
    loading: () => (
      <section className="flex h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#fc4c00]/30 border-t-[#fc4c00]" />
      </section>
    ),
  }
);

const HolographicTeam = dynamic(
  () => import('@/modules/public/sections/HolographicTeam'),
  {
    ssr: false,
    loading: () => (
      <section className="flex min-h-screen items-center justify-center bg-black py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </section>
    ),
  }
);

const PremiumTestimonials = dynamic(
  () =>
    import('@/modules/public/components/premium-testimonials').then((mod) => ({
      default: mod.PremiumTestimonials,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="flex items-center justify-center bg-black py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#fc4c00]/30 border-t-[#fc4c00]" />
      </section>
    ),
  }
);

export default function AboutPageClient() {
  // Fetch CMS content for each section
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  }>('about', 'hero');

  // Team content available for CMS integration
  useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    socialText?: string;
  }>('about', 'team');

  const { content: skillsContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('about', 'skills');

  const { content: timelineContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('about', 'timeline');

  const { content: officeTourContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
  }>('about', 'officeTour');

  const { content: ctaContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>('about', 'cta');

  // All sections for batch fetching
  const ABOUT_SECTIONS = [
    'hero',
    'showreel',
    'team',
    'skills',
    'timeline',
    'officeTour',
    'testimonials',
    'cta',
  ];

  return (
    <BatchSectionProvider page="about" sections={ABOUT_SECTIONS}>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <OptimizedSectionWrapper section="hero">
          <Hero1
            eyebrow={heroContent?.eyebrow || 'Who We Are'}
            title={heroContent?.title || 'About Silicon Hubs'}
            subtitle={
              heroContent?.subtitle ||
              "We're a team of passionate developers, designers, and strategists dedicated to creating exceptional digital experiences that drive results."
            }
            ctaLabel={heroContent?.ctaLabel || 'Meet Our Team'}
            ctaHref={heroContent?.ctaHref || '#team'}
          />
        </OptimizedSectionWrapper>

        {/* Scroll Animated Video Showreel */}
        <OptimizedSectionWrapper section="showreel">
          <AgencyShowreel />
        </OptimizedSectionWrapper>

        {/* Team Section - Holographic Carousel */}
        <OptimizedSectionWrapper section="team">
          <div id="team">
            <HolographicTeam />
          </div>
        </OptimizedSectionWrapper>

        {/* Skills Visualization */}
        <OptimizedSectionWrapper section="skills">
          <section className="bg-black px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow={skillsContent?.eyebrow || 'What We Do Best'}
                title={skillsContent?.title || 'Our'}
                titleHighlight={skillsContent?.titleHighlight || 'Expertise'}
              />
              <SkillVisualization />
            </div>
          </section>
        </OptimizedSectionWrapper>

        {/* Company Timeline */}
        <OptimizedSectionWrapper section="timeline">
          <section className="bg-black px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow={timelineContent?.eyebrow || 'Our Story'}
                title={timelineContent?.title || 'Our'}
                titleHighlight={timelineContent?.titleHighlight || 'Journey'}
              />
              <CompanyTimeline />
            </div>
          </section>
        </OptimizedSectionWrapper>

        {/* Office Tour */}
        <OptimizedSectionWrapper section="officeTour">
          <section className="bg-black px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeading
                eyebrow={officeTourContent?.eyebrow || 'Virtual Experience'}
                title={officeTourContent?.title || '360°'}
                titleHighlight={
                  officeTourContent?.titleHighlight || 'Office Tour'
                }
              />
              <OfficeTour />
            </div>
          </section>
        </OptimizedSectionWrapper>

        {/* Testimonials */}
        <OptimizedSectionWrapper section="testimonials">
          <PremiumTestimonials />
        </OptimizedSectionWrapper>

        {/* CTA Section */}
        <OptimizedSectionWrapper section="cta">
          <MiniCTA
            eyebrow={ctaContent?.eyebrow || 'Start a Project'}
            title={ctaContent?.title || "Let's Build Something"}
            titleHighlight={ctaContent?.titleHighlight || 'Amazing'}
            subtitle={
              ctaContent?.subtitle ||
              "Ready to transform your digital presence? Let's discuss your project."
            }
            ctaText={ctaContent?.ctaText || 'Get in Touch'}
            ctaLink={ctaContent?.ctaLink || '/contact'}
          />
        </OptimizedSectionWrapper>
      </div>
    </BatchSectionProvider>
  );
}

