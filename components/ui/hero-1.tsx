'use client';

import { ChevronRight } from 'lucide-react';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Hero1({
  eyebrow,
  title,
  subtitle,
  ctaLabel = 'Explore Now',
  ctaHref = '#',
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto min-h-[58vh] w-full overflow-hidden rounded-b-[2rem] bg-[#14213D] px-6 pt-28 text-center md:px-8"
    >
      {/* Grid BG */}
      <div
        className="absolute inset-0 -z-10 h-[420px] w-full bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:6rem_5rem] opacity-60"
        style={{
          maskImage:
            'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)',
        }}
      />

      {/* Radial Accent Container */}
      <div className="absolute inset-x-0 bottom-0 h-[350px] overflow-hidden lg:h-[525px]">
        <div
          className="absolute bottom-[-280px] left-1/2 h-[350px] w-[490px] -translate-x-1/2 rounded-[100%] border border-cyan/30 md:h-[350px] md:w-[770px] lg:bottom-[-420px] lg:h-[525px] lg:w-[980px]"
          style={{
            background:
              'radial-gradient(closest-side at 50% 50%, #000 82%, #06b6d4)',
          }}
        />
      </div>

      {/* Content Container with Padding */}
      <div className="relative z-10 pb-12 pt-12">
        {/* Eyebrow */}
        {eyebrow && (
          <div className="group inline-block">
            <span className="mx-auto flex w-fit items-center justify-center rounded-3xl border border-[#F4511E]/40 bg-[#FFF4E6]/10 px-5 py-2 text-sm uppercase tracking-tight text-[#FFB38F]">
              {eyebrow}
              <ChevronRight className="ml-2 inline h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        )}

        {/* Title with Animated Gradient */}
        <h1
          className="animate-fade-in -translate-y-4 text-balance bg-clip-text py-6 text-4xl font-semibold leading-none tracking-tighter text-transparent opacity-0 sm:text-5xl md:text-6xl lg:text-6xl"
          style={{
            backgroundImage:
              'linear-gradient(90deg, #FFF4E6, #F4511E, #FFF4E6, #F4511E)',
            backgroundSize: '300% 100%',
            animation:
              'gradient-shift 4s ease-in-out infinite, fade-in 0.6s ease-out forwards',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in mx-auto mb-12 max-w-3xl -translate-y-4 text-balance px-4 text-lg tracking-tight text-[#F7E3C6] opacity-0 md:text-xl">
          {subtitle}
        </p>

        {/* CTA */}
        {ctaLabel && (
          <div className="flex justify-center">
            <ParticleWrapper>
              <a href={ctaHref ?? '#'}>
                <StarButton className="shadow-[0_0_30px_rgba(252, 76, 0,0.4)] z-20 mt-[-20px] w-fit text-center text-lg tracking-tighter md:w-52">
                  {ctaLabel}
                </StarButton>
              </a>
            </ParticleWrapper>
          </div>
        )}
      </div>

      {/* Bottom Fade */}
      <div className="animate-fade-up relative mt-20 opacity-0 [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_10%,transparent)]" />
    </section>
  );
}

export default Hero1;
