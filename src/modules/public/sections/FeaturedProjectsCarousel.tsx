'use client';

import { useState, useEffect } from 'react';
import {
  ScrollXCarousel,
  ScrollXCarouselContainer,
  ScrollXCarouselProgress,
  ScrollXCarouselWrap,
} from '@/modules/public/components/scroll-x-carousel';
import {
  CardHoverReveal,
  CardHoverRevealContent,
  CardHoverRevealMain,
} from '@/modules/public/components/reveal-on-hover';
import { Badge } from '@/modules/public/components/badge';
import { useSiteContent, toAbsoluteImagePath } from '@/lib/hooks/useSiteContent';

interface Project {
  id: string;
  _id?: string;
  title: string;
  description: string;
  tags: string[];
  thumbnail: string;
  featured?: boolean;
}

interface FeaturedSlide {
  id: string;
  title: string;
  description: string;
  services: string[];
  type: string;
  imageUrl: string;
}

interface FeaturedWorkContent {
  eyebrow?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
}

const DEFAULT_HEADINGS: FeaturedWorkContent = {
  eyebrow: 'Featured Work',
  title: 'Projects That',
  titleHighlight: 'Deliver Results',
  subtitle:
    'Scroll to explore our latest projects and see how we help businesses grow.',
};

interface FeaturedProjectsCarouselProps {
  /** Optional heading content. If not provided, uses DEFAULT_HEADINGS. */
  content?: FeaturedWorkContent | null;
  /** When provided, used as slides directly without API fetch. */
  slides?: FeaturedSlide[];
}

/** Static section heading. Fixed DOM structure (no conditionals that add/remove nodes) for hydration. */
function StaticCarouselHeading({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}) {
  return (
    <div className="mb-12 text-center">
      <div className={`mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 backdrop-blur-sm ${!eyebrow ? 'invisible' : ''}`}>
        <span className="text-sm font-medium text-white/80">✨ {eyebrow || '\u00A0'}</span>
        <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
      </div>
      <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title || '\u00A0'}
        </span>
        <span className="bg-gradient-to-r from-[#fc4c00] via-[#06b6d4] to-[#fc4c00] bg-clip-text text-transparent">
          {' '}{titleHighlight || '\u00A0'}
        </span>
      </h2>
      <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
        {subtitle || '\u00A0'}
      </p>
    </div>
  );
}

/** Static shell: same DOM shape as CarouselView, no motion/scroll hooks, so server/first-client match. */
function CarouselStaticShell({
  content,
}: {
  content: FeaturedWorkContent;
}) {
  const eyebrow = content?.eyebrow ?? DEFAULT_HEADINGS.eyebrow ?? '';
  const title = content?.title ?? DEFAULT_HEADINGS.title ?? '';
  const titleHighlight = content?.titleHighlight ?? DEFAULT_HEADINGS.titleHighlight ?? '';
  const subtitle = content?.subtitle ?? DEFAULT_HEADINGS.subtitle ?? '';

  return (
    <section className="relative bg-black">
      <div className="px-6 py-16">
        <StaticCarouselHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />
      </div>
      <div className="relative h-[150vh] w-screen max-w-full" aria-hidden="true" />
    </section>
  );
}

/** Pure presentational carousel. Uses static heading so server/client markup matches. */
function CarouselView({
  content,
  slides,
}: {
  content: FeaturedWorkContent;
  slides: FeaturedSlide[];
}) {
  const eyebrow = content?.eyebrow ?? DEFAULT_HEADINGS.eyebrow ?? '';
  const title = content?.title ?? DEFAULT_HEADINGS.title ?? '';
  const titleHighlight = content?.titleHighlight ?? DEFAULT_HEADINGS.titleHighlight ?? '';
  const subtitle = content?.subtitle ?? DEFAULT_HEADINGS.subtitle ?? '';

  return (
    <section className="relative bg-black">
      <div className="px-6 py-16">
        <StaticCarouselHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />
      </div>

      <ScrollXCarousel className="h-[150vh]">
        <ScrollXCarouselContainer className="flex h-dvh flex-col place-content-center gap-8 py-12">
          <div className="pointer-events-none absolute inset-[0_auto_0_0] z-10 h-[103%] w-[12vw] bg-[linear-gradient(90deg,_#000_35%,_transparent)]" />
          <div className="pointer-events-none absolute inset-[0_0_0_auto] z-10 h-[103%] w-[15vw] bg-[linear-gradient(270deg,_#000_35%,_transparent)]" />

          <ScrollXCarouselWrap className="flex-4/5 flex space-x-8 [&>*:first-child]:ml-8">
            {slides.map((slide) => (
              <CardHoverReveal
                key={slide.id}
                className="min-w-[45vw] rounded-xl border border-white/10 shadow-xl md:min-w-[25vw] xl:min-w-[20vw]"
              >
                <CardHoverRevealMain>
                  <img
                    alt={slide.title}
                    src={slide.imageUrl}
                    className="h-[500px] w-full object-cover md:h-[550px]"
                  />
                </CardHoverRevealMain>
                <CardHoverRevealContent className="space-y-4 rounded-2xl bg-[rgba(0,0,0,.7)] p-4 backdrop-blur-xl">
                  <div className="space-y-2">
                    <h3 className="text-sm text-white/80">Type</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="rounded-full border-none bg-[#fc4c00] capitalize text-white">
                        {slide.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm text-white/80">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {slide.services.map((service) => (
                        <Badge
                          key={service}
                          className="rounded-full border border-[#06b6d4]/30 bg-[#06b6d4]/20 capitalize text-[#06b6d4]"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 space-y-2">
                    <h3 className="text-lg font-medium capitalize text-white">
                      {slide.title}
                    </h3>
                    <p className="text-sm text-white/80">{slide.description}</p>
                  </div>
                </CardHoverRevealContent>
              </CardHoverReveal>
            ))}
          </ScrollXCarouselWrap>

          <ScrollXCarouselProgress
            className="mx-8 h-1 overflow-hidden rounded-full bg-white/10"
            progressStyle="size-full bg-gradient-to-r from-[#fc4c00] to-[#06b6d4] rounded-full"
          />
        </ScrollXCarouselContainer>
      </ScrollXCarousel>
    </section>
  );
}

/** Fetches content and slides via useSiteContent + /api/projects when slides prop not provided. */
function FeaturedProjectsCarouselWithData({
  content: contentProp,
  slides: slidesProp,
}: FeaturedProjectsCarouselProps = {}) {
  const { content: apiContent } = useSiteContent<FeaturedWorkContent>(
    'home',
    'featuredWork'
  );
  const [slides, setSlides] = useState<FeaturedSlide[]>([]);

  useEffect(() => {
    if (slidesProp !== undefined) return;

    let cancelled = false;
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects?featured=true');
        if (cancelled || !res.ok) return;
        const data = await res.json();
        const projects: Project[] = data.projects || [];
        if (projects.length > 0) {
          setSlides(
            projects.map((p) => ({
              id: (p._id ?? p.id) as string,
              title: p.title,
              description: p.description,
              services: p.tags,
              type: p.tags[0] || 'Project',
              imageUrl: p.thumbnail
                ? toAbsoluteImagePath(p.thumbnail)
                : '/media/portfolio/featured-projects/ecommerce-platform.jpg',
            }))
          );
        }
      } catch {}
    };
    fetchProjects();
    return () => {
      cancelled = true;
    };
  }, [slidesProp]);

  const content = contentProp ?? apiContent ?? DEFAULT_HEADINGS;
  const displaySlides = slidesProp ?? slides;
  const loading =
    slidesProp === undefined && slides.length === 0;

  if (slidesProp !== undefined) {
    return slidesProp && slidesProp.length > 0 ? (
      <CarouselView content={content} slides={slidesProp} />
    ) : null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-black py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#06b6d4]/30 border-t-[#06b6d4]" />
      </div>
    );
  }

  return <CarouselView content={content} slides={displaySlides} />;
}

/**
 * FeaturedProjectsCarousel - renders a horizontal scroll carousel of featured projects.
 * 
 * Usage:
 * 1. With static slides (e.g., portfolio page): Pass content and slides props
 * 2. With data fetching (e.g., home page): Don't pass slides, it will fetch from API
 * 
 * This component uses client-side only rendering to avoid hydration mismatches
 * caused by scroll-based animations and useScroll hooks.
 */
export default function FeaturedProjectsCarousel({
  content,
  slides,
}: FeaturedProjectsCarouselProps = {}) {
  const [isClient, setIsClient] = useState(false);
  const hasStaticSlides = typeof slides !== 'undefined' && Array.isArray(slides);

  // Only render on client to avoid hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return null during SSR and first client render to match server HTML
  if (!isClient) {
    return null;
  }

  // When slides are provided, render the carousel directly
  if (hasStaticSlides) {
    if (slides.length === 0) return null;
    return <CarouselView content={content ?? DEFAULT_HEADINGS} slides={slides} />;
  }

  // Otherwise, use the data-fetching version
  return <FeaturedProjectsCarouselWithData content={content} />;
}
