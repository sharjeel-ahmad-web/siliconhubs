'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  BriefcaseBusiness,
} from 'lucide-react';

import { ImageModal } from '@/components/ui/react-tailwind-image-gallery';

interface PortfolioItem {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  result: string;
  span: string;
}

const galleryData: PortfolioItem[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1470&auto=format&fit=crop',
    alt: 'Modern E-commerce Platform',
    category: 'E-COMMERCE',
    title: 'High-Converting Online Store',
    description:
      'A modern shopping experience designed to build trust, simplify purchasing, and turn more visitors into customers.',
    result: 'Conversion-Focused Experience',
    span: 'col-span-1',
  },
  {
    id: 2,
    src: 'https://ix-marketing.imgix.net/focalpoint.png?q=80&w=1470&auto=format&fit=crop',
    alt: 'SaaS Dashboard Design',
    category: 'WEB APPLICATION',
    title: 'Scalable SaaS Platform',
    description:
      'A powerful and intuitive dashboard experience built to make complex data and workflows easier to manage.',
    result: 'Simplified User Experience',
    span: 'sm:col-span-2',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1470&auto=format&fit=crop',
    alt: 'Mobile Application Design',
    category: 'MOBILE APP',
    title: 'Customer-First Mobile Experience',
    description:
      'A responsive digital experience focused on usability, accessibility, and seamless customer interaction.',
    result: 'Built for Everyday Engagement',
    span: 'col-span-1',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1364&auto=format&fit=crop',
    alt: 'Brand Identity Project',
    category: 'BRAND EXPERIENCE',
    title: 'Digital Brand Transformation',
    description:
      'A refined visual direction designed to help a growing business create a stronger and more memorable presence.',
    result: 'Stronger Brand Perception',
    span: 'col-span-1',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1470&auto=format&fit=crop',
    alt: 'Digital Marketing Campaign',
    category: 'DIGITAL MARKETING',
    title: 'Growth-Focused Marketing Campaign',
    description:
      'A strategic campaign built around reaching the right audience and creating meaningful business opportunities.',
    result: 'Audience & Lead Growth Strategy',
    span: 'sm:col-span-2',
  },
  {
    id: 6,
    src: 'https://ix-marketing.imgix.net/bg-remove_after.png?q=80&w=1470&auto=format&fit=crop',
    alt: 'Corporate Website Development',
    category: 'WEB DEVELOPMENT',
    title: 'Professional Corporate Website',
    description:
      'A modern website built to communicate expertise, establish trust, and create a strong first impression.',
    result: 'Professional Digital Presence',
    span: 'col-span-1',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1488866022504-f2584929ca5f?q=80&w=1470&auto=format&fit=crop',
    alt: 'Digital Strategy Project',
    category: 'DIGITAL STRATEGY',
    title: 'Connected Digital Ecosystem',
    description:
      'A strategic approach that connects technology, marketing, and customer experience into one clear system.',
    result: 'Smarter Digital Operations',
    span: 'col-span-1',
  },
  {
    id: 8,
    src: 'https://ix-marketing.imgix.net/autocompress.png?q=80&w=1287&auto=format&fit=crop',
    alt: 'Content Management Platform',
    category: 'CUSTOM SOLUTION',
    title: 'Streamlined Content Platform',
    description:
      'A flexible solution designed to make content management faster, easier, and more efficient for growing teams.',
    result: 'Improved Workflow Efficiency',
    span: 'col-span-1',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1470&auto=format&fit=crop',
    alt: 'Business Analytics Platform',
    category: 'DATA & ANALYTICS',
    title: 'Actionable Business Insights',
    description:
      'A data-focused solution that helps businesses better understand performance and make more informed decisions.',
    result: 'Data-Driven Decision Making',
    span: 'sm:col-span-2',
  },
];

export default function PortfolioGallery() {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalAlt, setModalAlt] = useState<string>('');

  const openModal = (src: string, alt: string) => {
    setModalImage(src);
    setModalAlt(alt);
  };

  const closeModal = useCallback(() => {
    setModalImage(null);
    setModalAlt('');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  return (
    <section className="relative overflow-hidden bg-[#fff3e8] px-4 py-16 sm:px-6 md:py-20 lg:px-8">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#fc4c00]/5 blur-3xl" />

        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#ff9e5c]/10 blur-3xl" />

        {/* Subtle Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(#0a192f 1px, transparent 1px), linear-gradient(90deg, #0a192f 1px, transparent 1px)',
            backgroundSize: '50px 50px',
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
            className="inline-flex items-center gap-3 rounded-full border border-[#fc4c00]/15 bg-white/80 px-5 py-2.5 text-xs shadow-lg shadow-[#fc4c00]/5 backdrop-blur-xl sm:text-sm"
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

            <span className="font-bold tracking-[0.12em] text-[#0a192f]">
              SELECTED WORK
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
            <span className="text-[#0a192f]">Ideas Turned Into </span>

            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              Digital Experiences
            </span>
          </h2>

          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#fc4c00] to-[#ff9e5c]" />

          <p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-[#0a192f]/70 sm:text-lg md:text-xl">
            Every project begins with a business challenge. Our work combines
            strategy, design, technology, and innovation to create digital
            experiences that look exceptional and work with purpose.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <div className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[280px] md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {galleryData.map((img, index) => (
            <motion.button
              key={img.id}
              type="button"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              onClick={() => openModal(img.src, img.alt)}
              className={`group relative overflow-hidden rounded-2xl border border-white/40 bg-[#0a192f] text-left shadow-[0_10px_30px_rgba(10,25,47,0.08)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(252,76,0,0.18)] ${img.span}`}
            >
              {/* Image */}
              <img
                src={img.src}
                alt={img.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Default Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/25 to-transparent" />

              {/* Orange Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#fc4c00]/45 via-[#fc4c00]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Top Category */}
              <div className="absolute left-4 top-4 z-20">
                <span className="rounded-full border border-white/20 bg-[#0a192f]/55 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-white backdrop-blur-md">
                  {img.category}
                </span>
              </div>

              {/* View Icon */}
              <div className="absolute right-4 top-4 z-20 flex h-10 w-10 translate-y-[-10px] items-center justify-center rounded-xl border border-white/30 bg-white/15 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Eye className="h-4 w-4" />
              </div>

              {/* Bottom Content */}
              <div className="absolute inset-x-0 bottom-0 z-20 p-5">
                <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="mb-2 text-lg font-bold text-white sm:text-xl">
                    {img.title}
                  </h3>

                  <p className="max-h-0 overflow-hidden text-sm leading-relaxed text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {img.description}
                  </p>

                  {/* Result */}
                  <div className="mt-3 flex translate-y-2 items-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <CheckCircle2 className="h-4 w-4 text-[#ff9e5c]" />

                    <span className="text-xs font-semibold text-white/90">
                      {img.result}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-[#fc4c00] via-[#ff9e5c] to-[#fc4c00] transition-transform duration-500 group-hover:scale-x-100" />
            </motion.button>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mx-auto mt-12 max-w-4xl sm:mt-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#0a192f]/5 bg-white/75 px-6 py-8 shadow-[0_15px_40px_rgba(10,25,47,0.06)] backdrop-blur-xl sm:px-10 sm:py-10">
            {/* CTA Background Glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#fc4c00]/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center justify-center gap-2 md:justify-start">
                  <BriefcaseBusiness className="h-5 w-5 text-[#fc4c00]" />

                  <span className="text-xs font-bold tracking-[0.15em] text-[#fc4c00]">
                    YOUR NEXT PROJECT
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#0a192f] sm:text-3xl">
                  Have an idea worth building?
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-[#0a192f]/65 sm:text-base">
                  Let's turn your vision into a high-performing digital solution
                  designed around your business goals and your customers.
                </p>
              </div>

              <a
                href="/contact"
                className="group/cta inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#0a192f] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0a192f]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#fc4c00] hover:shadow-xl hover:shadow-[#fc4c00]/25"
              >
                Start a Project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-1 group-hover/cta:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Modal */}
      <ImageModal src={modalImage} alt={modalAlt} onClose={closeModal} />
    </section>
  );
}
