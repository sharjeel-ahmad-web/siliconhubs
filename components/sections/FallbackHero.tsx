'use client';

import { StarButton } from '@/components/ui/star-button';

export default function FallbackHero() {
  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: 'rgb(0, 2, 15)' }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 50%, rgba(55, 175, 225, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 129, 34, 0.3) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#37AFE1]/30 bg-[#37AFE1]/10 px-6 py-3 text-sm font-medium uppercase tracking-wider text-[#37AFE1] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#37AFE1] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#37AFE1]"></span>
            </span>
            Digital Excellence Delivered
          </span>

          {/* Heading */}
          <h1 className="font-montserrat text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #37AFE1 0%, #F58122 100%)',
              }}
            >
              Rising Dot Agency
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/80 md:text-2xl">
            We craft stunning websites, powerful automations, and intelligent
            chatbots.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <a href="/contact">
              <StarButton
                className="h-14 px-8 text-base font-semibold"
                duration={2.5}
                style={{
                  background:
                    'linear-gradient(135deg, #37AFE1 0%, #31A4DB 100%)',
                }}
              >
                Get Started
              </StarButton>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
