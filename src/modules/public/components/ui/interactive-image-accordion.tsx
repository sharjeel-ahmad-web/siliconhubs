'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ParticleWrapper } from '@/modules/public/components/particle-button';
import { StarButton } from '@/modules/public/components/star-button';

// --- Data Interface ---
interface AccordionItem {
  id: number;
  title: string;
  imageUrl: string;
}

interface ImageAccordionHeroProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  ctaButton?: {
    label: string;
    href: string;
  };
  items?: AccordionItem[];
}

// --- Default Portfolio Items ---
const defaultItems: AccordionItem[] = [
  {
    id: 1,
    title: 'E-Commerce',
    imageUrl: '/media/portfolio/hero/ecommerce.jpg',
  },
  {
    id: 2,
    title: 'Web Design',
    imageUrl: '/media/portfolio/hero/web-design.jpg',
  },
  {
    id: 3,
    title: 'AI Chatbots',
    imageUrl: '/media/portfolio/hero/ai-chatbots.jpg',
  },
  {
    id: 4,
    title: 'Automation',
    imageUrl: '/media/portfolio/hero/automation.jpg',
  },
  {
    id: 5,
    title: 'SEO & Marketing',
    imageUrl: '/media/portfolio/hero/seo.jpg',
  },
];

// --- Accordion Item Component ---
const AccordionItemCard = ({
  item,
  isActive,
  onMouseEnter,
}: {
  item: AccordionItem;
  isActive: boolean;
  onMouseEnter: () => void;
}) => {
  return (
    <motion.div
      className="relative h-[400px] cursor-pointer overflow-hidden rounded-2xl md:h-[450px]"
      animate={{
        width: isActive ? 320 : 60,
      }}
      transition={{
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      }}
      onMouseEnter={onMouseEnter}
    >
      {/* Background Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src =
            'https://placehold.co/400x450/1a1a1a/37AFE1?text=Project';
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Cyan glow on active */}
      {isActive && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 60px rgba(55, 175, 225, 0.3)',
          }}
        />
      )}

      {/* Caption Text */}
      <span
        className={`absolute whitespace-nowrap text-base font-semibold text-white transition-all duration-500 ease-out md:text-lg ${
          isActive
            ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
            : 'bottom-24 left-1/2 origin-center -translate-x-1/2 -rotate-90'
        }`}
      >
        {item.title}
      </span>

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#06b6d4] to-[#fc4c00]"
        />
      )}
    </motion.div>
  );
};

// --- Main Hero Component ---
export function ImageAccordionHero({
  title,
  titleHighlight,
  subtitle,
  ctaButton,
  items = defaultItems,
}: ImageAccordionHeroProps) {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-black">
      <div className="mx-auto w-full max-w-7xl px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:gap-16">
          {/* Left Side: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full text-center lg:w-1/2 lg:text-left"
          >
            <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              <span className="text-white">{title}</span>
              {titleHighlight && (
                <span
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #06b6d4, #fc4c00, #06b6d4, #fc4c00)',
                    backgroundSize: '300% 100%',
                    animation: 'gradient-shift 4s ease-in-out infinite',
                  }}
                >
                  {titleHighlight}
                </span>
              )}
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg text-gray-400 md:text-xl lg:mx-0">
              {subtitle}
            </p>
            {ctaButton && (
              <ParticleWrapper>
                <Link href={ctaButton?.href != null && ctaButton.href !== '' ? ctaButton.href : '/'}>
                  <StarButton
                    className="px-8 py-4 text-base font-semibold shadow-[0_0_30px_rgba(245,129,34,0.4)] transition-transform hover:scale-105"
                    duration={2.5}
                  >
                    {ctaButton.label}
                  </StarButton>
                </Link>
              </ParticleWrapper>
            )}
          </motion.div>

          {/* Right Side: Image Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <div className="flex flex-row items-center justify-center gap-2 overflow-x-auto p-4 md:gap-3">
              {items.map((item, index) => (
                <AccordionItemCard
                  key={item.id}
                  item={item}
                  isActive={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
