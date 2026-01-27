'use client';

import { useState, useCallback, useRef } from 'react';

import { StarButton } from '@/components/ui/star-button';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';
import { GradientMeshBackground } from '@/components/ui/gradient-mesh-bg';

interface HeroProps {
  typewriterSpeed?: number;
}

export default function Hero({ typewriterSpeed = 80 }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);
  const hasTrackedInteraction = useRef(false);
  const { trackEvent } = useAnalytics();

  // Fetch CMS content
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    scrollText?: string;
  }>('home', 'hero');

  // Default values
  const eyebrow = heroContent?.eyebrow || 'Digital Excellence Delivered';
  const title = heroContent?.title || 'Rising Dot Agency';
  const subtitle =
    heroContent?.subtitle ||
    'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.';
  const ctaText = heroContent?.ctaText || 'Get Started';
  const scrollText = heroContent?.scrollText || 'Scroll to explore';

  // Track hero interaction on first user engagement
  const trackHeroInteraction = useCallback(() => {
    if (!hasTrackedInteraction.current) {
      hasTrackedInteraction.current = true;
      trackEvent('hero_interaction', { type: 'engagement', section: 'hero' });
    }
  }, [trackEvent]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-transparent"
      onMouseMove={trackHeroInteraction}
      onTouchStart={trackHeroInteraction}
    >
      {/* Modern Gradient Mesh Background - z-0 */}
      <GradientMeshBackground />

      {/* Single Column Content - z-10 */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <p className="font-inter text-lg uppercase tracking-wide text-[#F97316] md:text-xl">
            {eyebrow}
          </p>

          <h1
            className="bg-clip-text font-montserrat text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            {title}
          </h1>

          <p className="max-w-2xl text-lg text-white/80 md:text-xl">
            {subtitle}
          </p>

          <div className="mt-6">
            <StarButton
              className="h-12 px-8 text-base font-semibold transition-transform hover:scale-105"
              duration={2.5}
            >
              {ctaText}
            </StarButton>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 z-[10] flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ${isAnimationComplete ? 'opacity-100' : 'opacity-0'}`}
      >
        <span className="font-inter text-sm text-[#37AFE1]">{scrollText}</span>
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-[#37AFE1] pt-2">
          <div className="h-3 w-1.5 animate-bounce rounded-full bg-[#F97316]" />
        </div>
      </div>
    </section>
  );
}
