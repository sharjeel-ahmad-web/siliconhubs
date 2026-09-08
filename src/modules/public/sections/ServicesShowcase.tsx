'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { StarButton } from '@/modules/public/components/star-button';
import { ParticleWrapper } from '@/modules/public/components/particle-button';

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  link: string;
  color: string;
}

// Cache-busting version — bump ?v= when you replace images in this folder
const services: Service[] = [
  {
    id: 1,
    icon: '⚡',
    title: 'N8N Automations',
    description:
      'Streamline workflows with powerful automation solutions. Connect apps, automate tasks, and save countless hours.',
    image: '/media/home/featured-services/n8n-automations.png?v=2',
    features: ['Custom workflows', 'API integrations', 'Real-time monitoring'],
    link: '/services/n8n-automations',
    color: 'from-[#06b6d4] to-[#06b6d4]',
  },
  {
    id: 2,
    icon: '🤖',
    title: 'Chatbot Development',
    description:
      'AI-powered conversational interfaces that engage users and provide instant support 24/7.',
    image: '/media/home/featured-services/chatbot-development.png?v=2',
    features: [
      'Natural language processing',
      'Multi-platform support',
      'Custom training',
    ],
    link: '/services/chatbot-development',
    color: 'from-[#fc4c00] to-[#FF9E5C]',
  },
  {
    id: 3,
    icon: '🎨',
    title: 'Web Design',
    description:
      'Beautiful, responsive websites that captivate visitors and drive conversions.',
    image: '/media/home/featured-services/web-design.png?v=2',
    features: ['Responsive design', 'UI/UX optimization', 'Brand identity'],
    link: '/services/web-design',
    color: 'from-[#06b6d4] to-[#fc4c00]',
  },
  {
    id: 4,
    icon: '🔍',
    title: 'SEO Services',
    description:
      'Boost your visibility and rank higher in search results with data-driven SEO strategies.',
    image: '/media/home/featured-services/seo.jpg?v=2',
    features: ['Keyword research', 'On-page optimization', 'Link building'],
    link: '/services/seo',
    color: 'from-[#06b6d4] to-[#06b6d4]',
  },
  {
    id: 5,
    icon: '🛍️',
    title: 'Shopify Development',
    description:
      'Powerful e-commerce solutions that turn visitors into customers and boost sales.',
    image: '/media/home/featured-services/shopify.png?v=2',
    features: ['Custom themes', 'App integration', 'Conversion optimization'],
    link: '/services/shopify',
    color: 'from-[#fc4c00] to-[#06b6d4]',
  },
  {
    id: 6,
    icon: '📝',
    title: 'WordPress Development',
    description:
      'Enterprise-grade WordPress solutions with custom themes, plugins, and optimization.',
    image: '/media/home/featured-services/wordpress.jpg?v=2',
    features: [
      'Custom plugins',
      'Performance optimization',
      'Security hardening',
    ],
    link: '/services/wordpress',
    color: 'from-[#06b6d4] to-[#fc4c00]',
  },
];

export default function ServicesShowcase() {
  return (
    <section className="relative overflow-hidden bg-black px-4 pb-16 pt-8 sm:px-6 md:pb-20 md:pt-12 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Animated Badge - Matches testimonials/case studies pattern */}
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
              <Sparkles className="h-3 w-3 text-[#fc4c00] sm:h-4 sm:w-4" />
            </motion.div>
            <span className="font-medium text-white/80">What We Offer</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          </motion.div>
        </motion.div>

        {/* Section Heading with Gradient Animation */}
        <motion.div
          className="mb-8 text-center sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-3 text-3xl font-bold sm:mb-4 sm:text-4xl md:text-5xl">
            <span className="text-white">Premium </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #06b6d4, #fc4c00, #06b6d4, #fc4c00)',
                backgroundSize: '300% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              Digital Services
            </span>
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-center text-base text-slate-400 sm:mb-12 sm:text-lg md:text-xl">
            Comprehensive solutions tailored to elevate your digital presence
            and drive measurable results
          </p>
        </motion.div>

        {/* Bento Grid Layout - 2 columns on desktop, 1 on mobile */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Gradient Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${service.color} rounded-2xl opacity-20 blur transition duration-500 group-hover:opacity-60`}
              />

              {/* Card Content */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-sm">
                {/* Image Container with Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Icon Badge on Image */}
                  <div className="absolute left-4 top-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-black/50 text-2xl backdrop-blur-md">
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title with Gradient Animation */}
                  <h3
                    className="mb-3 bg-clip-text text-2xl font-bold text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #06b6d4, #fc4c00, #06b6d4, #fc4c00)',
                      backgroundSize: '200% 100%',
                      animation: 'gradient-shift 3s ease-in-out infinite',
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 line-clamp-2 text-gray-400">
                    {service.description}
                  </p>

                  {/* Features Pills */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA with StarButton */}
                  <Link href={service.link ?? '#'}>
                    <ParticleWrapper>
                      <StarButton
                        className="group h-11 w-full text-sm font-semibold"
                        duration={2.5}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </StarButton>
                    </ParticleWrapper>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
