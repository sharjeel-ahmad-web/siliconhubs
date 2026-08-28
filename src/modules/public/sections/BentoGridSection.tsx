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
      'We do not build digital products just to look impressive. Every solution is designed around your goals, your customers, and meaningful business results.',
  },
  {
    icon: Palette,
    title: 'Design That Builds Trust',
    description:
      'We create modern and intuitive digital experiences that make your brand look professional, credible, and ready to compete.',
  },
  {
    icon: Puzzle,
    title: 'Solutions That Work Together',
    description:
      'From websites and e-commerce to AI automation and marketing, we connect the right technologies into one powerful digital ecosystem.',
  },
  {
    icon: BrainCircuit,
    title: 'Innovation With a Purpose',
    description:
      'We use modern technology and AI where it creates genuine value—helping your business work smarter and grow faster.',
  },
];

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-[#fff3e8] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      {/* Creamy Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft Orange Glow */}
        <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#fc4c00]/10 blur-[140px]" />

        {/* Peach Glow */}
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#ff9e5c]/20 blur-[160px]" />

        {/* Center Cream Glow */}
        <div className="absolute left-1/2 top-1/3 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-white/70 blur-[130px]" />

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#0a192f 1px, transparent 1px), linear-gradient(90deg, #0a192f 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
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
            className="inline-flex items-center gap-3 rounded-full border border-[#fc4c00]/15 bg-white/75 px-5 py-2.5 text-xs shadow-lg shadow-[#fc4c00]/5 backdrop-blur-xl sm:text-sm"
            whileHover={{
              scale: 1.04,
              borderColor: 'rgba(252, 76, 0, 0.35)',
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

            <span className="font-bold tracking-[0.14em] text-[#0a192f]">
              WHO WE ARE
            </span>

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="mx-auto mb-12 max-w-4xl text-center sm:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-[#0a192f]">
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

          <p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-[#0a192f]/70 sm:text-lg md:text-xl">
            SiliconHubs is a digital solutions partner for ambitious businesses
            that want to build a stronger online presence, work smarter with
            technology, and create better experiences for their customers.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Image Glow */}
            <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-br from-[#fc4c00]/15 via-transparent to-[#ff9e5c]/20 blur-2xl" />

            {/* Image Card */}
            <div className="group relative overflow-hidden rounded-[26px] border border-white bg-white/80 p-2 shadow-[0_20px_60px_rgba(10,25,47,0.12)] backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[20px]">
                <img
                  className="h-[350px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[420px] lg:h-[520px]"
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop"
                  alt="SiliconHubs digital solutions team"
                />

                {/* Warm Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/85 via-[#0a192f]/10 to-transparent" />

                {/* Orange Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#fc4c00]/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-white backdrop-blur-md">
                    <Sparkles className="h-3 w-3 text-[#ff9e5c]" />
                    YOUR DIGITAL GROWTH PARTNER
                  </span>

                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    Strategy. Technology. Growth.
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    We bring the right ideas, technology, and execution together
                    to help businesses move forward with confidence.
                  </p>
                </div>
              </div>

              {/* Floating Icon */}
              <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/50 bg-white/90 shadow-lg backdrop-blur-md">
                <CheckCircle2 className="h-6 w-6 text-[#fc4c00]" />
              </div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Label */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-[#fc4c00]" />

              <span className="text-xs font-bold tracking-[0.18em] text-[#fc4c00]">
                WHY SILICONHUBS
              </span>
            </div>

            <h3 className="mb-5 text-3xl font-bold leading-tight text-[#0a192f] sm:text-4xl">
              Technology Should Make Your Business{' '}
              <span className="text-[#fc4c00]">Easier to Grow.</span>
            </h3>

            <p className="mb-8 text-base leading-relaxed text-[#0a192f]/70">
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
                    className="group/value rounded-2xl border border-[#0a192f]/5 bg-gradient-to-r from-white via-[#fffaf6] to-[#ffe9da]/50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#fc4c00]/20 hover:shadow-[0_15px_35px_rgba(252,76,0,0.10)]"
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
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#fc4c00]/15 bg-[#fc4c00]/[0.06] transition-all duration-300 group-hover/value:scale-105 group-hover/value:bg-[#fc4c00]/10">
                        <Icon className="h-5 w-5 text-[#fc4c00]" />
                      </div>

                      {/* Text */}
                      <div>
                        <h4 className="mb-1.5 text-base font-bold text-[#0a192f]">
                          {value.title}
                        </h4>

                        <p className="text-sm leading-relaxed text-[#0a192f]/60">
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
                    className="group/btn h-12 !bg-[#0a192f] px-7 text-sm font-bold text-white shadow-lg shadow-[#0a192f]/20 transition-all duration-300 hover:!bg-[#fc4c00] sm:px-8 sm:text-base"
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

        {/* Bottom Statement */}
        <motion.div
          className="mx-auto mt-16 max-w-5xl sm:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#fc4c00]/10 bg-white/75 px-6 py-8 text-center shadow-[0_15px_45px_rgba(10,25,47,0.06)] backdrop-blur-xl sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-1/2 -translate-x-1/2 rounded-full bg-[#fc4c00]/10 blur-3xl" />

            <p className="relative text-base font-medium leading-relaxed text-[#0a192f]/70 sm:text-lg">
              Whether you are launching something new, improving an existing
              digital presence, or looking to automate the way your business
              works, we focus on one thing:
            </p>

            <p className="relative mt-3 text-xl font-bold text-[#0a192f] sm:text-2xl">
              Building digital solutions that create{' '}
              <span className="text-[#fc4c00]">real business value.</span>
            </p>
          </div>
        </motion.div>
      </div>

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
