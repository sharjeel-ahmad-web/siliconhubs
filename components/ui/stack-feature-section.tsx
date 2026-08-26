'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import {
  FaReact,
  FaAws,
  FaDocker,
  FaNodeJs,
  FaWordpress,
  FaShopify,
  FaGoogle,
  FaSlack,
} from 'react-icons/fa';
import {
  SiNextdotjs,
  SiVercel,
  SiTypescript,
  SiTailwindcss,
  SiOpenai,
  SiN8N,
  SiStripe,
  SiSupabase,
} from 'react-icons/si';

// Icon mapping for dynamic rendering from CMS
const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  FaReact,
  FaAws,
  FaDocker,
  FaNodeJs,
  FaWordpress,
  FaShopify,
  FaGoogle,
  FaSlack,
  SiNextdotjs,
  SiVercel,
  SiTypescript,
  SiTailwindcss,
  SiOpenai,
  SiN8N,
  SiStripe,
  SiSupabase,
};

const defaultIconConfigs = [
  { icon: 'FaReact', color: '#61DAFB' },
  { icon: 'FaAws', color: '#FF9900' },
  { icon: 'FaDocker', color: '#2496ED' },
  { icon: 'FaNodeJs', color: '#339933' },
  { icon: 'SiNextdotjs', color: '#FFFFFF' },
  { icon: 'SiVercel', color: '#FFFFFF' },
  { icon: 'SiTypescript', color: '#3178C6' },
  { icon: 'SiTailwindcss', color: '#06B6D4' },
  { icon: 'FaWordpress', color: '#21759B' },
  { icon: 'FaShopify', color: '#7AB55C' },
  { icon: 'SiOpenai', color: '#10A37F' },
  { icon: 'SiN8N', color: '#EA4B71' },
  { icon: 'FaGoogle', color: '#DB4437' },
  { icon: 'FaSlack', color: '#4A154B' },
  { icon: 'SiStripe', color: '#635BFF' },
  { icon: 'SiSupabase', color: '#3ECF8E' },
];

interface StackFeatureSectionProps {
  page?: string;
}

export default function StackFeatureSection({
  page = 'home',
}: StackFeatureSectionProps) {
  // Fetch CMS content
  const { content } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    centerText?: string;
    icons?: { icon: string; color: string }[];
    colors?: {
      borderColor?: string;
      orbitBorderColor?: string;
      iconBgColor?: string;
      iconBorderColor?: string;
      gradientStart?: string;
      gradientEnd?: string;
    };
  }>(page, 'stackFeature');

  // Use CMS data or fallback to defaults - ensure href is ALWAYS a valid non-empty string
  const eyebrow = content?.eyebrow || '✨ Our Tech Stack';
  const title = content?.title || 'Build Your';
  const titleHighlight = content?.titleHighlight || 'Digital Empire';
  const subtitle =
    content?.subtitle ||
    'We leverage cutting-edge technologies to deliver scalable, high-performance solutions that drive your business forward.';
  const ctaText = content?.ctaText || 'Start Your Project';
  const ctaHrefRaw = content?.ctaHref;
  const ctaHref =
    typeof ctaHrefRaw === 'string' && ctaHrefRaw !== ''
      ? ctaHrefRaw
      : '/contact';
  const secondaryCtaText = content?.secondaryCtaText || 'View Our Work';
  const secondaryCtaHrefRaw = content?.secondaryCtaHref;
  const secondaryCtaHref =
    typeof secondaryCtaHrefRaw === 'string' && secondaryCtaHrefRaw !== ''
      ? secondaryCtaHrefRaw
      : '/portfolio';
  const centerText = content?.centerText || 'RISING';
  const iconConfigs = content?.icons || defaultIconConfigs;

  // Color configuration
  const colors = {
    borderColor: content?.colors?.borderColor || '#06b6d4',
    orbitBorderColor: content?.colors?.orbitBorderColor || '#06b6d4',
    iconBgColor: content?.colors?.iconBgColor || '#0a192f',
    iconBorderColor: content?.colors?.iconBorderColor || '#06b6d4',
    gradientStart: content?.colors?.gradientStart || '#fc4c00',
    gradientEnd: content?.colors?.gradientEnd || '#06b6d4',
  };
  const orbitCount = 3;
  const orbitGap = 8;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section
      className="relative mx-auto my-12 flex min-h-[26rem] max-w-6xl flex-col items-center justify-between overflow-hidden rounded-3xl bg-transparent px-4 sm:my-16 sm:px-6 md:my-24 md:flex-row md:px-10"
      style={{ border: `1px solid ${colors.borderColor}30` }}
    >
      {/* Left side: Heading and Text */}
      <div className="z-10 w-full py-6 sm:py-8 md:w-1/2 md:py-0">
        <motion.div
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-xs backdrop-blur-sm sm:mb-6 sm:gap-3 sm:text-sm"
          whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.3)' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-3 w-3 text-orange sm:h-4 sm:w-4" />
          </motion.div>
          <span className="font-medium text-white/80">{eyebrow}</span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
        </motion.div>
        <h2 className="mb-3 text-2xl font-bold tracking-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            {title}
          </span>{' '}
          <motion.span
            className="bg-gradient-to-r from-[#fc4c00] via-[#06b6d4] to-[#fc4c00] bg-clip-text text-transparent"
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
        <p className="mb-6 max-w-lg text-base leading-relaxed text-white/60 sm:mb-8 sm:text-lg">
          {subtitle}
        </p>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={ctaHref ?? '/contact'}>
              <StarButton
                className="h-10 px-6 text-sm font-semibold sm:h-12 sm:text-base"
                duration={2.5}
              >
                {ctaText}
              </StarButton>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={secondaryCtaHref ?? '/portfolio'}>
              <StarButton
                variant="secondary"
                className="h-10 px-6 text-sm font-semibold sm:h-12 sm:text-base"
                duration={3}
              >
                {secondaryCtaText}
              </StarButton>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right side: Orbit animation - responsive */}
      <div className="relative flex h-[20rem] w-full items-center justify-center overflow-hidden sm:h-[24rem] md:h-full md:w-1/2 md:justify-start">
        <div className="relative flex h-[40rem] w-[40rem] items-center justify-center md:h-[50rem] md:w-[50rem] md:translate-x-[30%]">
          {/* Center Circle */}
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full shadow-lg md:h-24 md:w-24"
            style={{
              background: `linear-gradient(to bottom right, ${colors.gradientStart}, ${colors.gradientEnd})`,
            }}
          >
            <span className="text-xs font-bold text-white md:text-sm">
              {centerText}
            </span>
          </div>

          {/* Generate Orbits */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${10 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border border-dashed"
                style={{
                  width: size,
                  height: size,
                  borderColor: `${colors.orbitBorderColor}30`,
                  animation: `spin ${20 + orbitIdx * 8}s linear infinite ${orbitIdx % 2 === 0 ? '' : 'reverse'}`,
                }}
              >
                {iconConfigs
                  .slice(
                    orbitIdx * iconsPerOrbit,
                    orbitIdx * iconsPerOrbit + iconsPerOrbit
                  )
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);
                    const IconComponent = iconMap[cfg.icon];

                    if (!IconComponent) return null;

                    return (
                      <div
                        key={iconIdx}
                        className="absolute rounded-full p-2 shadow-md"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: colors.iconBgColor,
                          border: `1px solid ${colors.iconBorderColor}20`,
                          animation: `spin ${20 + orbitIdx * 8}s linear infinite ${orbitIdx % 2 === 0 ? 'reverse' : ''}`,
                        }}
                      >
                        <IconComponent
                          className="h-6 w-6 md:h-8 md:w-8"
                          style={{ color: cfg.color }}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
