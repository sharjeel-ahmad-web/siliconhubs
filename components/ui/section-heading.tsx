'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 0.86, 0.39, 0.96] },
    },
  };

  // Use consistent className for both server and client
  const baseClassName = `mb-12 ${centered ? 'text-center' : ''}`;

  return (
    <motion.div
      className={baseClassName}
      initial="hidden"
      whileInView={mounted ? 'visible' : undefined}
      animate={!mounted ? 'visible' : undefined}
      viewport={mounted ? { once: true, margin: '-50px' } : undefined}
    >
      {eyebrow && (
        <motion.div
          className={`mb-6 inline-flex items-center gap-3 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 backdrop-blur-sm ${centered ? '' : ''}`}
          variants={fadeInUp}
          whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.3)' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="h-4 w-4 text-orange" />
          </motion.div>
          <span className="text-sm font-medium text-white/80">
            ✨ {eyebrow}
          </span>
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
        </motion.div>
      )}

      <motion.h2
        className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        variants={fadeInUp}
      >
        <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {title}
        </span>
        {titleHighlight && (
          <>
            {' '}
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
          </>
        )}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={`text-lg leading-relaxed text-white/60 sm:text-xl ${centered ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}
          variants={fadeInUp}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
