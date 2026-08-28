'use client';

import { motion } from 'framer-motion';
import { Sparkles as SparklesIcon } from 'lucide-react';
import { Sparkles } from '@/components/ui/sparkles';
// Temporarily removed InfiniteSlider to fix webpack issue
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

const logos = [
  { name: 'React', src: '/media/home/tech-stack-marquee/react.svg' },
  { name: 'Next.js', src: '/media/home/tech-stack-marquee/nextjs.svg' },
  { name: 'TypeScript', src: '/media/home/tech-stack-marquee/typescript.svg' },
  { name: 'Tailwind', src: '/media/home/tech-stack-marquee/tailwindcss.svg' },
  { name: 'Node.js', src: '/media/home/tech-stack-marquee/nodejs.svg' },
  { name: 'Shopify', src: '/media/home/tech-stack-marquee/shopify.svg' },
  { name: 'WordPress', src: '/media/home/tech-stack-marquee/wordpress.svg' },
  { name: 'Figma', src: '/media/home/tech-stack-marquee/figma.svg' },
  { name: 'Vercel', src: '/media/home/tech-stack-marquee/vercel.svg' },
  { name: 'OpenAI', src: '/media/home/tech-stack-marquee/openai.svg' },
];

export default function TechStackMarquee() {
  // Fetch CMS content
  const { content } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
  }>('home', 'techStack');

  // Default values
  const eyebrow = content?.eyebrow || 'Technologies';
  const title = content?.title || 'Trusted by Experts.';
  const titleHighlight = content?.titleHighlight || 'Used by Leaders.';

  return (
    /* Main Background: Warm Cream (#ffe8c1) */
    <section className="relative overflow-hidden bg-[#ffe8c1] px-4 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-20 lg:px-8">
      {/* Orange ambient glow - subtle to match cream bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(252, 76, 0, 0.15) 0%, transparent 70%)',
          opacity: 0.8,
        }}
      />

      {/* Additional warm tint overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#fc4c00]/5 to-transparent" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto w-full max-w-3xl text-center">
          {/* Standard Badge - Light Mode Updated */}
          <motion.div
            className="mb-4 flex justify-center sm:mb-6"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-[#0a192f]/10 bg-white/50 px-4 py-2 text-xs shadow-sm backdrop-blur-sm sm:gap-3 sm:px-5 sm:text-sm"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(252, 76, 0, 0.3)',
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <SparklesIcon className="h-3 w-3 text-[#fc4c00] sm:h-4 sm:w-4" />
              </motion.div>
              {/* Badge Text: Navy Blue */}
              <span className="font-semibold text-[#0a192f]">
                ✨ Tech Stack
              </span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
            </motion.div>
          </motion.div>

          {/* Note: Ensure your SectionHeading component is configured to render dark text on light backgrounds */}
          <div className="text-[#0a192f]">
            <SectionHeading title={title} titleHighlight={titleHighlight} />
          </div>

          {/* Sliding logos - CSS animation version */}
          <div className="mt-14 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <div className="tech-stack-scroll flex gap-12">
              {logos.map((logo) => (
                <img
                  key={logo.name}
                  src={logo.src}
                  alt={logo.name}
                  /* Removed 'invert' so logos stay dark, added brightness-0 to make them pure dark/black for contrast */
                  className="pointer-events-none h-8 flex-shrink-0 select-none opacity-60 brightness-0 transition-opacity hover:scale-105 hover:opacity-100 md:h-10"
                  loading="lazy"
                />
              ))}
              {/* Duplicate for seamless loop */}
              {logos.map((logo) => (
                <img
                  key={`${logo.name}-duplicate`}
                  src={logo.src}
                  alt={logo.name}
                  className="pointer-events-none h-8 flex-shrink-0 select-none opacity-60 brightness-0 transition-opacity hover:scale-105 hover:opacity-100 md:h-10"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Sparkles Section - Changed to Orange (#fc4c00) */}
        <div
          className="relative -mt-32 h-96 w-full overflow-hidden"
          style={{
            maskImage:
              'radial-gradient(closest-side at 50% 50%, white, transparent)',
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at bottom center, #fc4c00, transparent 70%)',
            }}
          />
          <div className="absolute -left-1/2 top-1/2 z-10 aspect-[1/0.7] w-[200%] rounded-[100%] border-t border-[#fc4c00]/30 bg-transparent" />

          <Sparkles
            density={800}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(closest-side_at_50%_50%,white,transparent_85%)]"
            color="#fc4c00"
          />
        </div>
      </div>
    </section>
  );
}
