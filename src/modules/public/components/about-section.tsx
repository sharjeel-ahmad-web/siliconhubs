'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Palette,
  Puzzle,
  BrainCircuit,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

const values = [
  {
    icon: Zap,
    title: 'Built for Real Business Growth',
    description:
      'We do not build digital products just to look impressive. Every solution is designed around your goals, your customers, and the results that matter to your business.',
    accent: 'orange',
  },
  {
    icon: Palette,
    title: 'Design That Builds Trust',
    description:
      'First impressions matter. We create modern, intuitive digital experiences that make your brand look credible, professional, and ready to compete.',
    accent: 'orange',
  },
  {
    icon: Puzzle,
    title: 'Solutions That Work Together',
    description:
      'From websites and e-commerce to AI automation and marketing, we connect the right technologies into a digital ecosystem that supports your growth.',
    accent: 'orange',
  },
  {
    icon: BrainCircuit,
    title: 'Innovation With a Purpose',
    description:
      'We use modern technology and AI where it creates genuine value—helping you work smarter, serve customers better, and unlock new opportunities.',
    accent: 'orange',
  },
];

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a192f] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Orange Glow */}
        <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-[#fc4c00]/10 blur-[140px]" />

        {/* Warm Glow */}
        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#ff9e5c]/10 blur-[160px]" />

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />

        {/* Top Gradient Line */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#fc4c00]/60 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Badge */}
        <motion.div
          className="mb-5 flex justify-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 text-xs shadow-lg backdrop-blur-xl sm:text-sm"
            whileHover={{
              scale: 1.04,
              borderColor: 'rgba(252, 76, 0, 0.4)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Sparkles className="h-4 w-4 text-[#fc4c00]" />
            </motion.div>

            <span className="font-bold tracking-[0.14em] text-white/90">
              WHO WE ARE
            </span>

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
          </motion.div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          className="mx-auto mb-12 max-w-4xl text-center sm:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-white">
              We Build More Than Digital Products.
            </span>

            <br />

            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              We Build Opportunities for Growth.
            </span>
          </h2>

          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#fc4c00] to-[#ff9e5c]" />

          <p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-white/60 sm:text-lg md:text-xl">
            SiliconHubs is a digital solutions partner for ambitious businesses
            that want to build a stronger online presence, work smarter with
            technology, and create better experiences for their customers.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Side - Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Image Glow */}
            <div className="absolute -inset-4 rounded-[30px] bg-gradient-to-br from-[#fc4c00]/30 via-transparent to-[#ff9e5c]/20 blur-2xl" />

            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-2 shadow-2xl shadow-black/30">
              <div className="relative overflow-hidden rounded-[18px]">
                <img
                  className="h-[350px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px] lg:h-[520px]"
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop"
                  alt="SiliconHubs digital solutions team"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/15 to-transparent" />

                {/* Image Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <div className="max-w-md">
                    <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-[#ff9e5c]" />
                      YOUR DIGITAL GROWTH PARTNER
                    </span>

                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                      Strategy. Technology. Growth.
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      We bring the right ideas, technology, and execution
                      together to help businesses move forward with confidence.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-[#fc4c00]/90 shadow-lg backdrop-blur-md">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Small Label */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-[#fc4c00]" />

              <span className="text-xs font-bold tracking-[0.18em] text-[#ff9e5c]">
                WHY SILICONHUBS
              </span>
            </div>

            <h3 className="mb-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Technology Should Make Your Business{' '}
              <span className="text-[#ff9e5c]">Easier to Grow.</span>
            </h3>

            <p className="mb-8 text-base leading-relaxed text-white/60">
              The digital world is full of tools, platforms, and complicated
              choices. Our job is to simplify the process and help you choose,
              build, and implement solutions that actually support your
              business—not create more work for your team.
            </p>

            {/* Values */}
            <div className="space-y-4">
              {values.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.title}
                    className="group/value rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-all duration-300 hover:border-[#fc4c00]/30 hover:bg-white/[0.06]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#fc4c00]/20 bg-[#fc4c00]/10 transition-all duration-300 group-hover/value:scale-105 group-hover/value:bg-[#fc4c00]/20">
                        <Icon className="h-5 w-5 text-[#ff9e5c]" />
                      </div>

                      {/* Text */}
                      <div>
                        <h4 className="mb-1.5 text-base font-bold text-white">
                          {value.title}
                        </h4>

                        <p className="text-sm leading-relaxed text-white/55">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <ParticleWrapper>
                <Link href="/about">
                  <StarButton
                    className="group/btn h-12 px-7 text-sm font-bold sm:px-8 sm:text-base"
                    duration={2.5}
                  >
                    Discover Our Approach
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </StarButton>
                </Link>
              </ParticleWrapper>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Trust Statement */}
        <motion.div
          className="mx-auto mt-16 max-w-5xl sm:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-[#fc4c00]/[0.05] px-6 py-7 text-center backdrop-blur-xl sm:px-10 sm:py-8">
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-1/2 -translate-x-1/2 rounded-full bg-[#fc4c00]/10 blur-3xl" />

            <p className="relative text-base font-medium leading-relaxed text-white/75 sm:text-lg">
              Whether you are launching something new, improving an existing
              digital presence, or looking to automate the way your business
              works, we focus on one thing:
            </p>

            <p className="relative mt-3 text-xl font-bold text-white sm:text-2xl">
              Building digital solutions that create{' '}
              <span className="text-[#ff9e5c]">real business value.</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Gradient Animation */}
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
