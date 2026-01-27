'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { StarButton } from '@/components/ui/star-button';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import { useAnalytics } from '@/components/analytics/AnalyticsTracker';

interface SpaceHeroProps {
  typewriterSpeed?: number;
}

export default function SpaceHero({ typewriterSpeed = 80 }: SpaceHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);
  const hasTrackedInteraction = useRef(false);
  const { trackEvent } = useAnalytics();

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const planetY = useTransform(scrollY, [0, 500], [0, -150]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  const starsY = useTransform(scrollY, [0, 500], [0, -25]);

  // Fetch CMS content
  const { content: heroContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    scrollText?: string;
  }>('home', 'hero');

  // Default values
  const eyebrow = heroContent?.eyebrow || 'Digital Excellence Delivered';
  const title = heroContent?.title || 'Rising Dot Agency';
  const subtitle =
    heroContent?.subtitle ||
    'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.';
  const ctaText = heroContent?.ctaText || 'Get Started';
  const scrollText = heroContent?.scrollText || 'Scroll to explore';

  // Track hero interaction on first user engagement
  const trackHeroInteraction = useCallback(() => {
    if (!hasTrackedInteraction.current) {
      hasTrackedInteraction.current = true;
      trackEvent('hero_interaction', { type: 'engagement', section: 'hero' });
    }
  }, [trackEvent]);

  // Starfield particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      twinkleSpeed: number;
      twinkleOffset: number;
    }

    const stars: Star[] = [];
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }

    // Animation loop
    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Draw stars
      stars.forEach((star) => {
        const twinkle =
          Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A0F1E 0%, #050810 100%)',
      }}
      onMouseMove={trackHeroInteraction}
      onTouchStart={trackHeroInteraction}
    >
      {/* Starfield Canvas - z-0 */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ y: starsY }}
      />

      {/* Large Glowing Planet/Orb - Rising Dot Colors - z-5 */}
      <motion.div
        className="absolute right-1/4 top-20 h-[600px] w-[600px] md:h-[800px] md:w-[800px]"
        style={{ y: planetY }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* Main planet sphere - Cyan to Orange gradient */}
        <div
          className="absolute inset-0 rounded-full opacity-60"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, #37AFE1 0%, #31A4DB 30%, #F58122 70%, transparent 100%)',
          }}
        />

        {/* Outer glow layer - Cyan */}
        <motion.div
          className="absolute inset-[-20%] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #37AFE1 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Secondary glow layer - Orange */}
        <motion.div
          className="absolute inset-[-30%] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #F58122 0%, transparent 60%)',
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />

        {/* Subtle atmosphere ring */}
        <motion.div
          className="absolute inset-[-10%] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, transparent 40%, #37AFE1 50%, transparent 60%)',
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </motion.div>

      {/* Content Container - z-10 */}
      <motion.div
        className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8"
        style={{ y: contentY }}
      >
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="group inline-block"
          >
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm uppercase tracking-wide text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-[#37AFE1]/30 hover:bg-[#37AFE1]/10 md:text-base">
              {eyebrow}
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </motion.div>

          {/* Main Heading - Sequential Word Reveal */}
          <motion.h1
            className="font-montserrat text-4xl font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            {title.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                    filter: 'blur(8px)',
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: {
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    },
                  },
                }}
              >
                {word}
                {i < title.split(' ').length - 1 && '\u00A0'}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            className="max-w-2xl text-lg text-white/70 md:text-xl"
          >
            {subtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1, ease: 'easeOut' }}
            className="mt-6"
          >
            <StarButton
              className="h-14 px-10 text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(55,175,225,0.5)]"
              duration={2.5}
              style={{
                background:
                  'linear-gradient(135deg, #37AFE1 0%, #31A4DB 50%, #37AFE1 100%)',
                backgroundSize: '200% 100%',
              }}
            >
              {ctaText}
            </StarButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-sm text-white/50">{scrollText}</span>
          <svg
            className="h-6 w-6 text-white/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
