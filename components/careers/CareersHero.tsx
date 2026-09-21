'use client';

/**
 * Careers hero — eyebrow, headline, description, dual CTAs and a premium
 * framed image treatment.
 */
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Building2 } from 'lucide-react';
import { CareerSettings } from '@/types/careers';

interface CareersHeroProps {
  content: CareerSettings['hero'];
  openJobsCount: number;
}

export function CareersHero({ content, openJobsCount }: CareersHeroProps) {
  return (
    <section
      id="careers-hero"
      className="relative overflow-hidden bg-[#FFF4E6] pt-8"
      aria-labelledby="careers-heading"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[#F4511E]/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 md:pb-28 md:pt-16 lg:grid-cols-[1.05fr_.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 0.86, 0.39, 0.96] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F4511E]/30 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FC4C00]">
              <Sparkles className="h-3.5 w-3.5" />
              {content.eyebrow}
            </span>
          </div>

          <h1
            id="careers-heading"
            className="mb-5 max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-tight text-[#14213D] md:text-5xl lg:text-7xl"
          >
            {content.title}{' '}
            {content.titleHighlight && (
              <span
                className="bg-gradient-to-r from-[#FC4C00] via-[#F4511E] to-[#FC4C00] bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 6s ease-in-out infinite',
                }}
              >
                {content.titleHighlight}
              </span>
            )}
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-[#5F6368] md:text-xl">
            {content.description}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={content.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FC4C00] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FC4C00]/30 transition-all hover:-translate-y-0.5 hover:bg-[#E04300] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FC4C00] focus-visible:ring-offset-2"
            >
              {content.primaryCta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={content.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-xl border border-[#14213D]/15 bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#14213D] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[#FC4C00]/40 hover:text-[#FC4C00]"
            >
              <Users className="h-4 w-4" />
              {content.secondaryCta.text}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-[#E8D8C5] pt-6 text-sm text-[#5F6368]">
            <span className="inline-flex items-center gap-2">
              <span className="text-2xl font-bold text-[#14213D]">
                {openJobsCount}
              </span>
              Open positions
            </span>
            <span className="h-8 w-px bg-[#E8D8C5]" />
            <span className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#FC4C00]" />
              Remote-first agency
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
          className="relative"
        >
          <div className="relative mx-auto max-w-md rounded-[2rem] bg-[#14213D] p-2 shadow-2xl shadow-[#14213D]/20">
            <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full border border-[#F4511E]/40" />
            <div className="relative overflow-hidden rounded-[1.55rem] border border-white/15">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={content.image}
                  alt="SiliconHubs team and culture"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14213D]/50 via-transparent to-transparent" />
              </div>

              <div className="absolute left-4 top-4 rounded-2xl border border-white/30 bg-white/85 px-4 py-3 backdrop-blur-md">
                <p className="text-xs font-medium text-[#5F6368]">Now hiring</p>
                <p className="text-sm font-bold text-[#FC4C00]">
                  {openJobsCount > 0
                    ? `${openJobsCount} roles open`
                    : 'We are hiring'}
                </p>
              </div>

              <div className="absolute bottom-4 right-4 rounded-2xl border border-white/30 bg-[#14213D]/85 px-4 py-3 text-white backdrop-blur-md">
                <p className="text-xs text-white/70">Life at</p>
                <p className="text-sm font-bold">SiliconHubs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CareersHero;
