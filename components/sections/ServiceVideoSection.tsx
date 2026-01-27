'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import {
  ContainerAnimated,
  ContainerInset,
  ContainerScroll,
  ContainerStagger,
} from '@/components/ui/hero-video';
import { StarButton } from '@/components/ui/star-button';
import Link from 'next/link';

interface ServiceVideoSectionProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  videoSrc: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function ServiceVideoSection({
  eyebrow = 'See It In Action',
  title = 'Watch How We',
  titleHighlight = 'Deliver',
  subtitle = 'Experience our process and see the results we achieve for our clients.',
  videoSrc,
  ctaText = 'Start Your Project',
  ctaHref = '/contact',
}: ServiceVideoSectionProps) {
  return (
    <ContainerScroll className="bg-black text-center text-white">
      <ContainerStagger viewport={{ once: false }}>
        <ContainerAnimated animation="top">
          <motion.div
            className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 backdrop-blur-sm"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-4 w-4 text-[#F58122]" />
            </motion.div>
            <span className="text-sm font-medium text-white/80">
              ✨ {eyebrow}
            </span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </ContainerAnimated>
        <ContainerAnimated animation="bottom">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              {title}
            </span>{' '}
            <motion.span
              className="bg-gradient-to-r from-[#F58122] via-[#37AFE1] to-[#F58122] bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              {titleHighlight}
            </motion.span>
          </h2>
        </ContainerAnimated>
        <ContainerAnimated animation="blur" className="my-4">
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/60 sm:text-xl">
            {subtitle}
          </p>
        </ContainerAnimated>
        <ContainerAnimated
          animation="blur"
          className="mt-6 flex justify-center gap-4"
        >
          {typeof ctaHref === 'string' && ctaHref !== '' && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={ctaHref}>
                <StarButton
                  className="h-12 px-6 text-base font-semibold"
                  duration={2.5}
                >
                  {ctaText}
                </StarButton>
              </Link>
            </motion.div>
          )}
        </ContainerAnimated>
      </ContainerStagger>
      <ContainerInset insetXRange={[30, 0]} className="mx-8">
        <video
          width="100%"
          height="100%"
          loop
          playsInline
          autoPlay
          muted
          className="relative z-10 block h-auto max-h-full max-w-full rounded-2xl object-contain align-middle"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </ContainerInset>
    </ContainerScroll>
  );
}
