'use client';

/**
 * Careers section heading tuned for the cream background, keeping the
 * animated-gradient accent pattern used across SiliconHubs.
 */
import { motion } from 'framer-motion';

interface CareersSectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function CareersSectionHeading({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  centered = true,
  className = '',
}: CareersSectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] }}
      className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <div
          className={`mb-5 inline-flex items-center gap-2 rounded-full border border-[#FC4C00]/20 bg-white/60 px-4 py-2 backdrop-blur-sm ${
            centered ? '' : ''
          }`}
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#FC4C00]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FC4C00]">
            {eyebrow}
          </span>
        </div>
      )}

      <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#14213D] md:text-4xl lg:text-5xl">
        {title}{' '}
        {titleHighlight && (
          <span
            className="bg-gradient-to-r from-[#FC4C00] via-[#F4511E] to-[#FC4C00] bg-clip-text text-transparent"
            style={{
              backgroundSize: '200% 100%',
              animation: 'gradient-shift 6s ease-in-out infinite',
            }}
          >
            {titleHighlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p
          className={`text-base leading-relaxed text-[#5F6368] md:text-lg ${
            centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default CareersSectionHeading;
