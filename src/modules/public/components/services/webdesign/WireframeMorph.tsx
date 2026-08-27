'use client';

import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export interface WireframeMorphProps {
  logoText?: string;
  navItems?: string[];
  heroTitle?: string;
  heroSubtitle?: string;
}

export const WireframeMorph: React.FC<WireframeMorphProps> = ({
  logoText = 'Logo',
  navItems = ['Home', 'About', 'Services', 'Contact'],
  heroTitle = 'Beautiful Design',
  heroSubtitle = 'Crafted with precision',
}) => {
  const [phase, setPhase] = useState<'wireframe' | 'morphing' | 'final'>(
    'wireframe'
  );
  const controls = useAnimation();

  useEffect(() => {
    let cancelled = false;

    const runSequence = async () => {
      if (cancelled) return;

      // Phase 1: Draw wireframe
      await controls.start({
        pathLength: 1,
        transition: { duration: 2, ease: 'easeInOut' },
      });
      if (cancelled) return;

      // Wait 0.5s
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (cancelled) return;

      // Phase 2: Morph to final design
      setPhase('morphing');
      await controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 2, ease: 'easeInOut' },
      });
      if (cancelled) return;

      // Final phase
      setPhase('final');
    };

    // Run after component has mounted
    const id = requestAnimationFrame(() => {
      if (!cancelled) runSequence();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [controls]);

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-lg bg-[#0F172A]">
      {/* Wireframe Layer */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 800 600"
        style={{ opacity: phase === 'final' ? 0 : 1 }}
      >
        {/* Header wireframe */}
        <motion.rect
          x="50"
          y="50"
          width="700"
          height="80"
          fill="none"
          stroke="#64748B"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={controls}
        />

        {/* Navigation items */}
        {navItems.map((_, i) => (
          <motion.rect
            key={`nav-${i}`}
            x={100 + i * 150}
            y="70"
            width="100"
            height="40"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={controls}
          />
        ))}

        {/* Hero section wireframe */}
        <motion.rect
          x="50"
          y="150"
          width="700"
          height="300"
          fill="none"
          stroke="#64748B"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={controls}
        />

        {/* Content boxes */}
        {[0, 1, 2].map((i) => (
          <motion.rect
            key={`box-${i}`}
            x={70 + i * 240}
            y="480"
            width="200"
            height="80"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={controls}
          />
        ))}
      </svg>

      {/* Final Design Layer */}
      <motion.div
        className="absolute inset-0 h-full w-full p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: phase === 'morphing' || phase === 'final' ? 1 : 0,
          scale: phase === 'morphing' || phase === 'final' ? 1 : 0.95,
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="mb-6 flex h-20 w-full items-center justify-between rounded-lg bg-gradient-to-r from-[#2563EB] to-[#06b6d4] px-8">
          <div className="text-xl font-bold text-white">{logoText}</div>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <div key={item} className="font-medium text-white">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Hero section */}
        <div className="mb-6 flex h-[300px] w-full items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] via-[#06b6d4] to-[#06b6d4]">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">{heroTitle}</h2>
            <p className="text-xl text-white/80">{heroSubtitle}</p>
          </div>
        </div>

        {/* Content cards */}
        <div className="grid grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={`card-${i}`}
              className="h-20 rounded-lg border border-[#2563EB]/30 bg-gradient-to-br from-[#2563EB]/20 to-[#06b6d4]/20"
            />
          ))}
        </div>
      </motion.div>

      {/* Phase indicator */}
      {phase !== 'final' && (
        <div className="absolute bottom-4 left-4 rounded bg-[#0F172A]/80 px-3 py-1 text-sm text-[#94A3B8]">
          {phase === 'wireframe' ? 'Drawing Wireframe...' : 'Morphing to Design...'}
        </div>
      )}
    </div>
  );
};
