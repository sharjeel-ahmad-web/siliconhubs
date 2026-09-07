'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { TimelineContent } from '@/components/ui/timeline-animation';
import { useRef } from 'react';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

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
  variant?: 'default' | 'digital-marketing';
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
  variant = 'default',
}: ServicesHeroSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const safeServices: ServiceItem[] =
    services != null && Array.isArray(services) ? services : [];

  const isDigitalMarketing = variant === 'digital-marketing';

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

  const renderTitle = () => {
    if (!highlightedWord) return title;

    const gradientColors = isDigitalMarketing
      ? 'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)'
      : 'linear-gradient(90deg, #06b6d4, #fc4c00, #06b6d4, #fc4c00)';

    const animatedGradientStyle = {
      backgroundImage: gradientColors,
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

  const heroBackground = isDigitalMarketing ? 'bg-navy' : 'bg-navy';

  const cardBaseClasses = isDigitalMarketing
    ? 'group relative aspect-[4/3] cursor-default overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-orange/50 hover:shadow-2xl hover:shadow-orange/20'
    : 'group relative aspect-video cursor-default overflow-hidden rounded-xl border border-white/10 backdrop-blur-sm transition-all hover:border-cyan/50';

  const overlayClasses = isDigitalMarketing
    ? 'absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent transition-all duration-500 group-hover:from-navy/80 group-hover:via-navy/30'
    : 'absolute inset-0 rounded-xl bg-navy/40 transition-colors duration-300 group-hover:bg-navy/30';

  const titleClasses = isDigitalMarketing
    ? 'text-base font-semibold capitalize leading-tight text-white drop-shadow-lg md:text-lg xl:text-xl'
    : 'text-sm font-medium capitalize leading-[140%] text-white md:text-lg xl:text-xl 2xl:text-xl';

  const descriptionClasses = isDigitalMarketing
    ? 'mt-2 text-xs leading-relaxed text-gray-300 opacity-0 transition-all duration-500 group-hover:opacity-100 md:text-sm'
    : 'mt-1 text-xs text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:text-sm';

  const badgeClasses = isDigitalMarketing
    ? 'absolute left-3 top-3 rounded-full bg-orange/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-300 group-hover:bg-orange'
    : '';

  return (
    <main ref={timelineRef} className={heroBackground}>
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
              className={`mx-auto flex w-fit items-center gap-1 rounded-full border-2 px-3 py-1 text-xs ${
                isDigitalMarketing
                  ? 'border-orange/30 bg-orange/20'
                  : 'border-cyan/30 bg-cyan/20'
              }`}
            >
              <div
                className={`rounded-full px-2 py-1 text-xs font-medium text-white ${
                  isDigitalMarketing ? 'bg-orange' : 'bg-cyan'
                }`}
              >
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
                  className={`h-12 px-6 text-sm font-semibold transition-transform hover:scale-105 ${
                    isDigitalMarketing ? 'bg-orange hover:bg-orange/90' : ''
                  }`}
                  duration={2.5}
                >
                  {ctaLabel}
                </StarButton>
              </Link>
            </ParticleWrapper>
          </TimelineContent>
        </article>

        {/* Services Grid */}
        <div
          className={`grid grid-cols-2 gap-6 pt-20 md:grid-cols-3 ${
            isDigitalMarketing ? 'lg:grid-cols-4' : ''
          }`}
        >
          {(safeServices ?? []).map((service, index) => (
            <TimelineContent
              as="div"
              animationNum={index + 5}
              timelineRef={timelineRef}
              key={service.id}
              customVariants={revealVariants}
              className={cardBaseClasses}
            >
              <figure className="relative h-full w-full">
                <Image
                  src={service.imgSrc}
                  alt={service.name}
                  width={400}
                  height={300}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </figure>
              {/* Overlay */}
              <div className={overlayClasses} />
              {/* Progressive blur at bottom for default variant */}
              {!isDigitalMarketing && (
                <ProgressiveBlur
                  className="pointer-events-none absolute bottom-0 left-0 h-[50%] w-full"
                  blurIntensity={0.5}
                />
              )}
              {/* Badge for digital marketing variant */}
              {isDigitalMarketing && (
                <div className={badgeClasses}>{service.name.split(' ')[0]}</div>
              )}
              <div
                className={`absolute bottom-2 left-2 px-2 py-1 sm:px-4 sm:py-2 ${
                  isDigitalMarketing
                    ? 'bottom-4 left-4 right-4'
                    : 'bottom-2 left-2'
                }`}
              >
                <h3 className={titleClasses}>{service.name}</h3>
                <p className={descriptionClasses}>{service.description}</p>
              </div>
            </TimelineContent>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ServicesHeroSection;
