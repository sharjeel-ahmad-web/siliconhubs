'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';

interface FloatingIcon {
  icon: React.ReactNode;
  label: string;
  position: { x: string; y: string };
}

interface Web3MediaHeroProps {
  title: string;
  highlightedText?: string;
  subtitle: string;
  ctaButton?: {
    label: string;
    href: string;
  };
  floatingIcons?: FloatingIcon[];
  trustedByText?: string;
  brands?: Array<{
    name: string;
    logo: React.ReactNode;
  }>;
  className?: string;
  children?: React.ReactNode;
}

export function Web3MediaHero({
  title,
  highlightedText,
  subtitle,
  ctaButton,
  floatingIcons = [],
  trustedByText = 'Trusted by',
  brands = [],
  className,
  children,
}: Web3MediaHeroProps) {
  return (
    <section
      className={cn(
        'relative flex min-h-screen w-full flex-col overflow-hidden bg-black',
        className
      )}
      role="banner"
      aria-label="Hero section"
    >
      {/* Radial Glow Background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            width: '1200px',
            height: '1200px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(55, 175, 225, 0.15) 0%, rgba(55, 175, 225, 0) 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Main Content */}
      {children ? (
        <div className="relative z-10 flex w-full flex-1 items-center justify-center">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-24">
          {/* Floating Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className="absolute flex flex-col items-center gap-2"
              style={{
                left: item.position.x,
                top: item.position.y,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -20, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: 0.3 + index * 0.1 },
                scale: { duration: 0.6, delay: 0.3 + index * 0.1 },
                y: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full md:h-20 md:w-20"
                style={{
                  background: 'rgba(55, 175, 225, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(55, 175, 225, 0.3)',
                  boxShadow: '0 0 40px rgba(55, 175, 225, 0.3)',
                }}
              >
                {item.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-white">
                {item.label}
              </span>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex max-w-4xl flex-col items-center gap-8 text-center"
          >
            {/* Title */}
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
                  backgroundSize: '300% 100%',
                  animation: 'gradient-shift 4s ease-in-out infinite',
                }}
              >
                {title}
              </span>
              {highlightedText && (
                <>
                  <br />
                  <span className="text-white">{highlightedText}</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-lg text-gray-400 md:text-xl">
              {subtitle}
            </p>

            {/* CTA Button */}
            {ctaButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <ParticleWrapper>
                  <Link href={ctaButton?.href ?? '/'}>
                    <StarButton
                      className="h-12 px-6 text-sm font-semibold transition-transform hover:scale-105"
                      duration={2.5}
                    >
                      {ctaButton.label}
                      <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </StarButton>
                  </Link>
                </ParticleWrapper>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}

      {/* Brand Slider */}
      {brands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 w-full overflow-hidden py-16"
        >
          {/* "Trusted by" Text */}
          <div className="mb-8 text-center">
            <span className="text-xs font-normal uppercase tracking-widest text-gray-500">
              {trustedByText}
            </span>
          </div>

          {/* Gradient Overlays */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-48"
            style={{
              background:
                'linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-48"
            style={{
              background:
                'linear-gradient(270deg, #000000 0%, rgba(0, 0, 0, 0) 100%)',
            }}
          />

          {/* Scrolling Brands */}
          <motion.div
            className="flex items-center gap-20 pl-20"
            animate={{
              x: [0, -(brands.length * 200)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: brands.length * 5,
                ease: 'linear',
              },
            }}
          >
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex h-10 w-28 flex-shrink-0 items-center justify-center opacity-40 transition-opacity hover:opacity-70"
              >
                {brand.logo}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
