'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProgressiveBlur } from '@/modules/public/components/progressive-blur';
import { TimelineContent } from '@/modules/public/components/timeline-animation';
import { useRef } from 'react';
import { ParticleWrapper } from '@/modules/public/components/particle-button';
import { StarButton } from '@/modules/public/components/star-button';

export interface ServiceItem {
  id: string;
  name: string;
  url: string;
  description: string;
  imgSrc: string;
}

interface ServicesHeroSectionProps {
  eyebrow?: string;
  eyebrowLink?: string;
  title: string;
  highlightedWord?: string;
  highlightedWord2?: string;
  subtitle: string;
  services?: ServiceItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function ServicesHeroSection({
  eyebrow,
  eyebrowLink = '#',
  title,
  highlightedWord,
  highlightedWord2,
  subtitle,
  services = [],
  ctaLabel = 'Get Started',
  ctaHref = '/contact',
}: ServicesHeroSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const safeServices: ServiceItem[] = services != null && Array.isArray(services) ? services : [];

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: 'blur(10px)',
      y: -20,
      opacity: 0,
    },
  };

  // Split title to insert highlighted words with animated gradient
  const renderTitle = () => {
    if (!highlightedWord) return title;

    const animatedGradientStyle = {
      backgroundImage:
        'linear-gradient(90deg, #06b6d4, #fc4c00, #06b6d4, #fc4c00)',
      backgroundSize: '300% 100%',
      animation: 'gradient-shift 4s ease-in-out infinite',
    };

    const parts = title.split(highlightedWord);
    return (
      <>
        {parts[0]}
        <span
          className="bg-clip-text font-semibold text-transparent"
          style={animatedGradientStyle}
        >
          {highlightedWord}
        </span>
        {highlightedWord2 ? (
          <>
            {parts[1]?.split(highlightedWord2)[0]}
            <span
              className="bg-clip-text font-semibold text-transparent"
              style={animatedGradientStyle}
            >
              {highlightedWord2}
            </span>
            {parts[1]?.split(highlightedWord2)[1]}
          </>
        ) : (
          parts[1]
        )}
      </>
    );
  };

  return (
    <main ref={timelineRef} className="bg-black">
      <div className="mx-auto min-h-screen max-w-screen-2xl px-4 pb-5 pt-28">
        <article className="mx-auto w-fit max-w-2xl space-y-6 text-center xl:max-w-4xl 2xl:max-w-5xl">
          {/* Eyebrow */}
          {eyebrow && (
            <TimelineContent
              as="a"
              href={eyebrowLink ?? '#'}
              animationNum={1}
              timelineRef={timelineRef}
              customVariants={revealVariants}
              className="mx-auto flex w-fit items-center gap-1 rounded-full border-2 border-[#06b6d4]/30 bg-[#06b6d4]/20 py-0.5 pl-0.5 pr-3 text-xs"
            >
              <div className="rounded-full bg-[#06b6d4] px-2 py-1 text-xs font-medium text-white">
                New
              </div>
              <p className="inline-block text-xs text-white sm:text-base">
                ✨ {eyebrow}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3 w-3 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </TimelineContent>
          )}

          {/* Title */}
          <TimelineContent
            as="h1"
            animationNum={2}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="text-3xl leading-[100%] text-white sm:text-4xl xl:text-5xl 2xl:text-6xl"
          >
            {renderTitle()}
          </TimelineContent>

          {/* Subtitle */}
          <TimelineContent
            as="p"
            animationNum={3}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="mx-auto max-w-2xl text-sm text-gray-400 sm:text-lg lg:text-xl"
          >
            {subtitle}
          </TimelineContent>

          {/* CTA Button */}
          <TimelineContent
            animationNum={4}
            timelineRef={timelineRef}
            customVariants={revealVariants}
            className="pt-4"
          >
            <ParticleWrapper>
              <Link href={ctaHref ?? '/contact'}>
                <StarButton
                  className="h-12 px-6 text-sm font-semibold transition-transform hover:scale-105"
                  duration={2.5}
                >
                  {ctaLabel}
                </StarButton>
              </Link>
            </ParticleWrapper>
          </TimelineContent>
        </article>

        {/* Services Grid - guard so .map is never called on non-array */}
        <div className="grid grid-cols-2 gap-6 pt-20 md:grid-cols-3">
          {(safeServices ?? []).map((service, index) => (
            <TimelineContent
              as="div"
              animationNum={index + 5}
              timelineRef={timelineRef}
              key={service.id}
              customVariants={revealVariants}
              className="group relative aspect-video cursor-default overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm transition-all hover:border-[#06b6d4]/50"
            >
              <figure className="relative h-full w-full">
                <Image
                  src={service.imgSrc}
                  alt={service.name}
                  width={400}
                  height={300}
                  className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </figure>
              {/* Dark overlay */}
              <div className="absolute inset-0 rounded-xl bg-black/40 transition-colors duration-300 group-hover:bg-black/30" />
              <ProgressiveBlur
                className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-full"
                blurIntensity={0.5}
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 sm:px-4 sm:py-2">
                <h3 className="text-sm font-medium capitalize leading-[140%] text-white md:text-lg xl:text-xl 2xl:text-xl">
                  {service.name}
                </h3>
                <p className="mt-1 text-xs text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-sm">
                  {service.description}
                </p>
              </div>
            </TimelineContent>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ServicesHeroSection;
