'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute -z-10 size-[520px] rounded-full bg-[#FBFFE1] blur-[300px]"></div>

      <div className="container mx-auto max-w-6xl">
        {/* Animated Badge - responsive */}
        <motion.div
          className="mb-4 flex justify-center sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-4 py-2 text-xs backdrop-blur-sm sm:gap-3 sm:px-5 sm:text-sm"
            whileHover={{
              scale: 1.05,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-3 w-3 text-[#F58122] sm:h-4 sm:w-4" />
            </motion.div>
            <span className="font-medium text-white/80">✨ Who We Are</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </motion.div>

        {/* Heading - responsive */}
        <h1 className="mb-3 text-center text-3xl font-bold sm:mb-4 sm:text-4xl md:mb-6 md:text-5xl">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            About
          </span>{' '}
          <span className="text-white">Us</span>
        </h1>

        {/* Description - responsive */}
        <p className="mx-auto mb-8 max-w-3xl text-center text-base text-slate-400 sm:text-lg md:text-xl">
          Ship Beautiful Frontends Without the Overhead — Customizable, Scalable
          and Developer-Friendly Solutions.
        </p>

        {/* Two Column Layout: Image + Features - stacks on mobile */}
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 px-4 md:flex-row md:gap-8 md:px-0">
          {/* Left: Image - Centered and properly sized - responsive */}
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              className="mx-auto w-full max-w-full rounded-2xl border border-white/10 object-cover shadow-2xl"
              style={{ maxHeight: '500px', height: '400px' }}
              src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=500&auto=format&fit=crop"
              alt="Rising Dot Agency workspace"
            />
          </motion.div>

          {/* Right: Features - responsive */}
          <div className="w-full md:w-1/2">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Our Core Values
            </h2>
            <p className="mb-8 text-sm text-slate-400 sm:text-base">
              We deliver cutting-edge digital solutions that transform
              businesses through innovation, quality, and excellence.
            </p>

            <div className="flex flex-col gap-8">
              {/* Feature 1 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#37AFE1]/30 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 p-2.5">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/flashEmoji.png"
                    alt="Lightning fast"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Lightning-Fast Performance
                  </h3>
                  <p className="text-sm text-slate-400">
                    Built with speed — minimal load times and optimized for
                    maximum performance.
                  </p>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#F58122]/30 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 p-2.5">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/colorsEmoji.png"
                    alt="Beautiful design"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Beautifully Designed Solutions
                  </h3>
                  <p className="text-sm text-slate-400">
                    Modern, pixel-perfect UI components crafted for exceptional
                    user experiences.
                  </p>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#37AFE1]/30 bg-gradient-to-br from-[#37AFE1]/20 to-[#37AFE1]/5 p-2.5">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/puzzelEmoji.png"
                    alt="Integration"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Seamless Integration
                  </h3>
                  <p className="text-sm text-slate-400">
                    Simple setup with support for React, Next.js and modern tech
                    stacks.
                  </p>
                </div>
              </motion.div>

              {/* Feature 4 */}
              <motion.div
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#F58122]/30 bg-gradient-to-br from-[#F58122]/20 to-[#F58122]/5 p-2.5">
                  <img
                    src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/aboutSection/brainEmoji.png"
                    alt="Accessibility"
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Innovation Driven
                  </h3>
                  <p className="text-sm text-slate-400">
                    Cutting-edge solutions powered by AI and modern
                    technologies.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* CTA Button - responsive */}
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <ParticleWrapper>
                <Link href="/about">
                  <StarButton
                    className="h-10 px-6 text-sm font-semibold sm:h-12 sm:px-8 sm:text-base"
                    duration={2.5}
                  >
                    Learn More About Us
                  </StarButton>
                </Link>
              </ParticleWrapper>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add gradient-shift animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  );
}
