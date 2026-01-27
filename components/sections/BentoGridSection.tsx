'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MessageSquare,
  Workflow,
  Palette,
  TrendingUp,
  ShoppingCart,
} from 'lucide-react';

export default function BentoGridSection() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="container mx-auto max-w-7xl">
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
            <span className="font-medium text-white/80">✨ Featured Work</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </motion.div>

        {/* Gradient Animated Heading - responsive */}
        <h2 className="mb-3 text-center text-3xl font-bold sm:mb-4 sm:text-4xl md:mb-6 md:text-5xl">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #37AFE1, #F58122, #37AFE1, #F58122)',
              backgroundSize: '300% 100%',
              animation: 'gradient-shift 4s ease-in-out infinite',
            }}
          >
            Innovation
          </span>{' '}
          <span className="text-white">Showcase</span>
        </h2>

        <p className="mx-auto mb-8 mt-2 max-w-3xl text-center text-base text-slate-400 sm:mb-10 sm:text-lg md:mb-12 md:text-xl">
          Explore our cutting-edge solutions that combine powerful technology
          with exceptional user experiences
        </p>

        <BentoGrid className="mx-auto max-w-6xl md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={cn('[&>p:text-lg]', item.className)}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
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

// Service-specific animated skeletons
const ChatbotSkeleton = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2 rounded-lg bg-gradient-to-br from-[#37AFE1]/10 to-transparent p-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-[#37AFE1]/20 bg-[#1E293B] p-2"
      >
        <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#F58122]" />
        <div className="h-4 w-full rounded-full bg-slate-700" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="ml-auto flex w-3/4 flex-row items-center space-x-2 rounded-full border border-[#F58122]/20 bg-[#1E293B] p-2"
      >
        <div className="h-4 w-full rounded-full bg-slate-700" />
        <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-r from-[#F58122] to-[#37AFE1]" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row items-center space-x-2 rounded-full border border-[#37AFE1]/20 bg-[#1E293B] p-2"
      >
        <div className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-r from-[#37AFE1] to-[#F58122]" />
        <div className="h-4 w-full rounded-full bg-slate-700" />
      </motion.div>
    </motion.div>
  );
};

const AutomationSkeleton = () => {
  const variants = {
    initial: { width: 0 },
    animate: { width: '100%', transition: { duration: 0.2 } },
    hover: { width: ['0%', '100%'], transition: { duration: 2 } },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2 rounded-lg bg-gradient-to-br from-[#F58122]/10 to-transparent p-2"
    >
      {arr.map((_, i) => (
        <motion.div
          key={'automation' + i}
          variants={variants}
          style={{ maxWidth: Math.random() * (100 - 40) + 40 + '%' }}
          className="flex h-4 w-full flex-row items-center space-x-2 rounded-full border border-[#F58122]/20 bg-[#1E293B] p-2"
        ></motion.div>
      ))}
    </motion.div>
  );
};

const WebDesignSkeleton = () => {
  return (
    <motion.div
      initial={{ backgroundPosition: '0 50%' }}
      animate={{ backgroundPosition: ['0, 50%', '100% 50%', '0 50%'] }}
      transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col space-y-2 rounded-lg"
      style={{
        background:
          'linear-gradient(-45deg, #37AFE1, #F58122, #37AFE1, #F58122)',
        backgroundSize: '400% 400%',
      }}
    >
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};

const WordPressSEOSkeleton = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center space-y-4 rounded-lg bg-gradient-to-br from-[#37AFE1]/10 to-[#F58122]/10 p-6"
    >
      {/* Top row: 3 icons */}
      <div className="flex items-center justify-center gap-6">
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-5xl">🌐</span>
        </motion.div>
        <motion.div
          animate={{ y: [8, -8, 8] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        >
          <span className="text-5xl">📈</span>
        </motion.div>
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.6,
          }}
        >
          <span className="text-5xl">🔍</span>
        </motion.div>
      </div>

      {/* Bottom row: 2 icons */}
      <div className="flex items-center justify-center gap-6">
        <motion.span
          className="text-4xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          💼
        </motion.span>
        <motion.span
          className="text-4xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        >
          ⚡
        </motion.span>
      </div>

      {/* Gradient Progress Bar */}
      <div className="mt-4 w-full max-w-xs space-y-2">
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#37AFE1] via-[#37AFE1] to-[#F58122]">
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="mx-auto h-2 w-3/4 rounded-full bg-slate-700/50"></div>
      </div>
    </motion.div>
  );
};

const ShopifySkeleton = () => {
  return (
    <motion.div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-lg bg-gradient-to-br from-[#F58122]/10 to-transparent p-4">
      <motion.div
        animate={{ rotateY: [0, 180, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="flex h-32 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-[#37AFE1] to-[#F58122] shadow-2xl"
      >
        <span className="text-4xl">🛍️</span>
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: 'Conversational AI',
    description:
      'Deploy intelligent chatbots that understand context, learn from interactions, and provide human-like responses',
    header: <ChatbotSkeleton />,
    className: 'md:col-span-1',
    icon: <MessageSquare className="h-4 w-4 text-[#37AFE1]" />,
  },
  {
    title: 'Business Automation',
    description:
      'Transform repetitive tasks into automated workflows that save time and reduce errors',
    header: <AutomationSkeleton />,
    className: 'md:col-span-1',
    icon: <Workflow className="h-4 w-4 text-[#F58122]" />,
  },
  {
    title: 'Creative Design',
    description:
      'Pixel-perfect interfaces that captivate users and convert visitors into loyal customers',
    header: <WebDesignSkeleton />,
    className: 'md:col-span-1',
    icon: <Palette className="h-4 w-4 text-[#37AFE1]" />,
  },
  {
    title: 'WordPress & SEO',
    description:
      'Powerful CMS solutions combined with search engine optimization to boost your online visibility',
    header: <WordPressSEOSkeleton />,
    className: 'md:col-span-2',
    icon: <TrendingUp className="h-4 w-4 text-[#F58122]" />,
  },
  {
    title: 'Online Stores',
    description:
      'Beautiful e-commerce experiences that drive sales and provide seamless shopping journeys',
    header: <ShopifySkeleton />,
    className: 'md:col-span-1',
    icon: <ShoppingCart className="h-4 w-4 text-[#37AFE1]" />,
  },
];
