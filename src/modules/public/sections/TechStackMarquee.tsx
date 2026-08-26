'use client';

import { motion } from 'framer-motion';
import { Sparkles as SparklesIcon } from 'lucide-react';
import { Sparkles } from '@/modules/public/components/sparkles';
// Temporarily removed InfiniteSlider to fix webpack issue
import { SectionHeading } from '@/modules/public/components/section-heading';
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
    <section className="relative overflow-hidden bg-black px-4 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-20 lg:px-8">
      {/* Blue ambient glow - subtle at 0.3 opacity */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(55, 175, 225, 0.3) 0%, transparent 70%)',
          opacity: 0.3,
        }}
      />

      {/* Additional blue tint overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#06b6d4]/5 to-transparent" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto w-full max-w-3xl">
          {/* Standard Badge - matches all other sections */}
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
                <SparklesIcon className="h-3 w-3 text-[#fc4c00] sm:h-4 sm:w-4" />
              </motion.div>
              <span className="font-medium text-white/80">✨ Tech Stack</span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            </motion.div>
          </motion.div>

          <SectionHeading title={title} titleHighlight={titleHighlight} />

          {/* Sliding logos - CSS animation version */}
          <div className="mt-14 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]">
            <div className="flex gap-12 tech-stack-scroll">
              {logos.map((logo) => (
                <img
                  key={logo.name}
                  src={logo.src}
                  alt={logo.name}
                  className="pointer-events-none h-8 select-none opacity-70 brightness-0 invert transition-opacity hover:opacity-100 md:h-10 flex-shrink-0"
                  loading="lazy"
                />
              ))}
              {/* Duplicate for seamless loop */}
              {logos.map((logo) => (
                <img
                  key={`${logo.name}-duplicate`}
                  src={logo.src}
                  alt={logo.name}
                  className="pointer-events-none h-8 select-none opacity-70 brightness-0 invert transition-opacity hover:opacity-100 md:h-10 flex-shrink-0"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>

        <div 
          className="relative -mt-32 h-96 w-full overflow-hidden" 
          style={{ maskImage: 'radial-gradient(50% 50%, white, transparent)' }}
        >
          <div 
            className="absolute inset-0 opacity-40" 
            style={{ background: 'radial-gradient(circle at bottom center, #06b6d4, transparent 70%)' }} 
          />
          <div className="absolute -left-1/2 top-1/2 z-10 aspect-[1/0.7] w-[200%] rounded-[100%] border-t border-[#06b6d4]/20 bg-transparent" />

          <Sparkles
            density={1200}
            className="absolute inset-x-0 bottom-0 h-full w-full"
            style={{ maskImage: 'radial-gradient(50% 50%, white, transparent 85%)' }}
            color="#06b6d4"
          />
        </div>
      </div>
    </section>
  );
}
