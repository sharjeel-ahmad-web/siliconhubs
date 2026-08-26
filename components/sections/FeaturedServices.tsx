'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ParticleWrapper } from '@/components/ui/particle-button';
import { StarButton } from '@/components/ui/star-button';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

// Default service data (fallback)
const defaultServices = [
  {
    title: 'N8N Automations',
    description:
      'Streamline your business workflows with powerful N8N automation solutions. We build custom integrations that connect your apps, automate repetitive tasks, and save you countless hours every week.',
    imageUrl: '/media/home/featured-services/n8n-automations.jpg',
    href: '/services/n8n-automations',
    ctaText: 'Explore Automations',
  },
  {
    title: 'Chatbot Development',
    description:
      'Engage your customers 24/7 with intelligent AI-powered chatbots. From customer support to lead generation, our chatbots deliver personalized experiences that convert visitors into customers.',
    imageUrl: '/media/home/featured-services/chatbot-development.jpg',
    href: '/services/chatbot-development',
    ctaText: 'Build Your Chatbot',
  },
  {
    title: 'Web Development',
    description:
      'Create stunning, high-performance websites that captivate your audience. We specialize in modern web technologies to deliver fast, responsive, and SEO-optimized digital experiences.',
    imageUrl: '/media/home/featured-services/web-development.jpg',
    href: '/services/web-design',
    ctaText: 'Start Your Project',
  },
  {
    title: 'Shopify Solutions',
    description:
      'Launch and scale your e-commerce business with custom Shopify stores. From theme customization to app integrations, we build online stores that drive sales and delight customers.',
    imageUrl: '/media/home/featured-services/shopify.jpg',
    href: '/services/shopify',
    ctaText: 'Launch Your Store',
  },
  {
    title: 'WordPress Development',
    description:
      'Build powerful, flexible websites with WordPress. Whether you need a blog, business site, or custom web application, we create WordPress solutions tailored to your unique needs.',
    imageUrl: '/media/home/featured-services/wordpress.jpg',
    href: '/services/wordpress',
    ctaText: 'Get WordPress Site',
  },
  {
    title: 'SEO Optimization',
    description:
      'Dominate search rankings and drive organic traffic to your website. Our data-driven SEO strategies help you reach your target audience and grow your online presence sustainably.',
    imageUrl: '/media/home/featured-services/seo.jpg',
    href: '/services/seo',
    ctaText: 'Boost Your Rankings',
  },
];

export default function FeaturedServices() {
  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
    services?: typeof defaultServices;
  }>('home', 'featuredServices');

  // Use CMS data or fallback to defaults
  const eyebrow = sectionContent?.eyebrow || 'What We Offer';
  const title = sectionContent?.title || 'Featured';
  const titleHighlight = sectionContent?.titleHighlight || 'Services';
  const subtitle =
    sectionContent?.subtitle ||
    'Discover how we help businesses transform their digital presence';
  const services = sectionContent?.services || defaultServices;

  return (
    <section className="bg-transparent">
      <div className="px-[5%]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center py-24 md:py-32">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              titleHighlight={titleHighlight}
              subtitle={subtitle}
            />

            {/* Sticky scroll cards container */}
            <div className="w-full">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="sticky mb-8 grid grid-cols-1 items-center gap-6 rounded-3xl border border-white/10 p-8 md:grid-cols-2 md:gap-12 md:p-12"
                  style={{
                    top: `${120 + index * 20}px`,
                    background: 'rgba(15, 23, 42, 0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {/* Card Content */}
                  <div
                    className={`flex flex-col justify-center ${
                      index % 2 === 1 ? 'md:order-2' : ''
                    }`}
                  >
                    <motion.h3
                      className="mb-4 bg-gradient-to-r from-orange via-cyan to-orange bg-clip-text font-montserrat text-2xl font-bold text-transparent md:text-3xl"
                      animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{
                        backgroundSize: '200% 200%',
                      }}
                    >
                      {service.title}
                    </motion.h3>
                    <p className="mb-6 font-inter leading-relaxed text-gray-400">
                      {service.description}
                    </p>
                    <ParticleWrapper>
                      <Link href={service.href ?? '#'}>
                        <StarButton
                          className="h-12 px-6 text-sm font-semibold transition-transform hover:scale-105"
                          duration={2.5}
                        >
                          {service.ctaText}
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </StarButton>
                      </Link>
                    </ParticleWrapper>
                  </div>

                  {/* Card Image */}
                  <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        loading="lazy"
                        className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-80"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
