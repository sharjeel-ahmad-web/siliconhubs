'use client';

import { useRef, useCallback } from 'react';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import { StarButton } from '@/components/ui/star-button';
import Link from 'next/link';

// Dynamic import of AnimatedBackground (client-side only, avoid SSR/chunk issues)
const AnimatedBackground = dynamic(
  () =>
    import('@/components/backgrounds/AnimatedBackground').catch(() => ({
      default: () => null,
    })),
  { ssr: false }
);

export default function CleanHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTrackedInteraction = useRef(false);
  const { trackEvent } = useAnalytics();

  // Fetch CMS content
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>('home', 'hero');

  // Default values matching the design requirements
  const eyebrow =
    heroContent?.eyebrow ||
    "We Design websites that matter, user's can't resist";
  const title = heroContent?.title || 'Design That Powers Real Business Growth';
  const subtitle =
    heroContent?.subtitle ||
    'Elevating brands through innovative and engaging web solutions.';
  const ctaText = heroContent?.ctaText || 'Get Started';
  const ctaLink = heroContent?.ctaLink || '/contact';

  // Track interaction
  const trackHeroInteraction = useCallback(() => {
    if (!hasTrackedInteraction.current) {
      hasTrackedInteraction.current = true;
      trackEvent('hero_interaction', { type: 'engagement', section: 'hero' });
    }
  }, [trackEvent]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden pb-8 md:pb-12"
      style={{ isolation: 'isolate' }}
      onMouseMove={trackHeroInteraction}
      onTouchStart={trackHeroInteraction}
    >
      {/* New AnimatedBackground - replaces ParticleBackground, PlanetGlow, and gradient overlays */}
      <AnimatedBackground />

      {/* Content with z-10 */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 pt-16 md:py-12">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs backdrop-blur-sm sm:px-5 sm:text-sm">
              <span className="font-medium text-white/90">{eyebrow}</span>
              <ArrowRight className="h-4 w-4 text-[#37AFE1]" />
            </div>

            {/* Main Heading */}
            <h1 className="bg-clip-text font-montserrat text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text">
                {title}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base text-white/80 sm:text-lg md:text-xl">
              {subtitle}
            </p>

            {/* CTA Section */}
            <div className="mt-4 flex flex-col items-center gap-6">
              {/* Primary CTA Button */}
              <Link href={ctaLink ?? '/'}>
                <StarButton className="h-10 px-6 text-sm font-semibold transition-transform hover:scale-105 sm:h-12 sm:px-8 sm:text-base">
                  {ctaText}
                </StarButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
