'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, TrendingUp, Bot } from 'lucide-react';
import gsap from 'gsap';

// Floating particle dot
function FloatingDot({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[#fc4c00]/20"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.3, 1],
      }}
      transition={{
        duration: 3 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}

// Animated badge
function LiveBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: 'spring' }}
      className="inline-flex items-center gap-2 rounded-full border border-[#fc4c00]/20 bg-[#fc4c00]/5 px-4 py-1.5"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest text-[#0a192f]">
        Now Accepting Clients
      </span>
    </motion.div>
  );
}

// Stat card
function StatCard({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(252, 76, 0, 0.12)' }}
      className="flex flex-col items-center gap-1 rounded-2xl border border-[#0a192f]/5 bg-[#ffedd7] px-6 py-5 transition-all duration-300"
    >
      <Icon className="mb-1 h-5 w-5 text-[#fc4c00]" />
      <span className="text-2xl font-extrabold text-[#0a192f]" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {value}
      </span>
      <span className="text-center text-xs text-[#515161]">{label}</span>
    </motion.div>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // GSAP entrance animation
  useEffect(() => {
    if (!titleRef.current) return;
    const chars = titleRef.current.querySelectorAll('.char');
    gsap.fromTo(
      chars,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power3.out',
        delay: 0.5,
      }
    );
  }, []);

  const titleWords = ['Digital', 'Growth,', 'Amplified'];

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      {/* Floating decorative dots */}
      <FloatingDot delay={0} x="5%" y="20%" size={10} />
      <FloatingDot delay={0.5} x="90%" y="15%" size={6} />
      <FloatingDot delay={1} x="15%" y="75%" size={8} />
      <FloatingDot delay={1.5} x="85%" y="70%" size={12} />
      <FloatingDot delay={0.8} x="50%" y="10%" size={5} />

      {/* Large background navy circle for depth */}
      <div
        className="pointer-events-none absolute -right-64 -top-64 h-[700px] w-[700px] rounded-full opacity-5"
        style={{ background: '#0a192f' }}
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full opacity-5"
        style={{ background: '#fc4c00' }}
      />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto max-w-7xl px-6 py-32 text-center"
      >
        {/* Live Badge */}
        <div className="mb-8 flex justify-center">
          <LiveBadge />
        </div>

        {/* Main Heading with GSAP char animation */}
        <h1
          ref={titleRef}
          className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-[#000000] md:text-7xl"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {titleWords.map((word, wi) => (
            <span key={wi} className="inline-block">
              {word.split('').map((char, ci) => (
                <span
                  key={ci}
                  className={`char inline-block ${char === ',' ? '' : wi === titleWords.length - 1 ? 'text-[#fc4c00]' : ''}`}
                >
                  {char}
                </span>
              ))}
              {wi < titleWords.length - 1 && <span className="char inline-block">&nbsp;</span>}
            </span>
          ))}
        </h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#515161]"
        >
          Silicon Hubs builds cutting-edge websites, AI chatbots, digital marketing campaigns, and automation systems that accelerate your business growth.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#fc4c00] px-8 py-4 text-base font-bold text-white shadow-xl shadow-[#fc4c00]/30 transition-all duration-300 hover:bg-[#0a192f] hover:shadow-[#0a192f]/20"
            >
              Start Your Project
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0a192f]/20 bg-white/50 px-8 py-4 text-base font-bold text-[#0a192f] backdrop-blur-sm transition-all duration-300 hover:border-[#fc4c00] hover:text-[#fc4c00]"
            >
              View Our Work
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:mx-auto md:max-w-2xl"
        >
          <StatCard value="150+" label="Projects Delivered" icon={Zap} />
          <StatCard value="98%" label="Client Satisfaction" icon={TrendingUp} />
          <StatCard value="24/7" label="AI Support Active" icon={Bot} />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-[#0a192f]/20 p-1">
          <div className="h-2 w-1 rounded-full bg-[#fc4c00]" />
        </div>
      </motion.div>
    </section>
  );
}
