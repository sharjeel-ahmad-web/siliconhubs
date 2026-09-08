'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

interface Service {
  id: number;
  icon: string;
  label: string;
  title: string;
  description: string;
  outcome: string;
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
    label: 'AUTOMATE & SCALE',
    title: 'AI & Workflow Automation',
    description:
      'Stop losing valuable time to repetitive tasks. We design intelligent automation systems that connect your tools, streamline operations, and keep your business moving—even when you are offline.',
    outcome:
      'Spend less time managing processes and more time growing your business.',
    image: '/media/home/featured-services/n8n-automations.png?v=2',
    features: [
      'Custom AI Workflows',
      'API & App Integrations',
      '24/7 Process Automation',
    ],
    link: '/services/automations',
    color: 'from-[#fc4c00] via-[#ff6b2c] to-[#ff9e5c]',
  },
  {
    id: 2,
    icon: '💻',
    label: 'BUILD YOUR DIGITAL HOME',
    title: 'High-Performance Websites',
    description:
      'Your website should do more than look beautiful—it should build trust and turn visitors into customers. We create fast, modern, conversion-focused websites tailored to your business goals.',
    outcome:
      'A powerful online presence built to impress visitors and generate opportunities.',
    image: '/media/home/featured-services/web-design.png?v=2',
    features: [
      'Custom Website Design',
      'Fast & Responsive Development',
      'Conversion-Focused Strategy',
    ],
    link: '/services/web-development',
    color: 'from-[#ff9e5c] via-[#ff6b2c] to-[#fc4c00]',
  },
  {
    id: 3,
    icon: '🛍️',
    label: 'SELL MORE ONLINE',
    title: 'E-Commerce Development',
    description:
      'Turn your online store into a smooth and persuasive buying experience. From Shopify stores to custom e-commerce solutions, we help you create a storefront designed to build trust and drive sales.',
    outcome:
      'Make it easier for customers to discover, trust, and buy from your brand.',
    image: '/media/home/featured-services/shopify.png?v=2',
    features: [
      'Shopify & Custom Stores',
      'Optimized Product Experience',
      'Conversion Optimization',
    ],
    link: '/services/ecommerce',
    color: 'from-[#fc4c00] via-[#ff6b2c] to-[#ff9e5c]',
  },
  {
    id: 4,
    icon: '📈',
    label: 'ATTRACT THE RIGHT AUDIENCE',
    title: 'Digital Marketing & Growth',
    description:
      'Great products need the right visibility. We create data-driven marketing strategies that help you reach the right audience, generate qualified leads, and turn attention into measurable business growth.',
    outcome:
      'Reach more potential customers with smarter, goal-focused campaigns.',
    image: '/media/home/featured-services/digital-marketing.jpg?v=2',
    features: [
      'Paid Advertising Campaigns',
      'Lead Generation Funnels',
      'Performance Analytics',
    ],
    link: '/services/digital-marketing',
    color: 'from-[#ff9e5c] via-[#ff6b2c] to-[#fc4c00]',
  },
  {
    id: 5,
    icon: '🤖',
    label: 'ENGAGE CUSTOMERS 24/7',
    title: 'AI Chatbots & AI Agents',
    description:
      'Never let a valuable customer inquiry go unanswered. We build intelligent AI agents that can engage visitors, answer questions, qualify leads, and support your customers around the clock.',
    outcome:
      'Deliver faster responses and capture more opportunities without increasing workload.',
    image: '/media/home/featured-services/chatbot-development.png?v=2',
    features: [
      'Custom AI Assistants',
      '24/7 Customer Engagement',
      'Lead Qualification',
    ],
    link: '/services/ai-chatbots',
    color: 'from-[#fc4c00] via-[#ff6b2c] to-[#ff9e5c]',
  },
  {
    id: 6,
    icon: '🔍',
    label: 'GET FOUND ORGANICALLY',
    title: 'SEO & Long-Term Growth',
    description:
      'Your ideal customers are already searching for solutions online. We help position your business where they can find you through strategic SEO, technical improvements, and content built around search intent.',
    outcome:
      'Build sustainable visibility and attract high-intent visitors over time.',
    image: '/media/home/featured-services/seo.jpg?v=2',
    features: [
      'Technical SEO Strategy',
      'Content & Keyword Planning',
      'Authority & Growth Strategy',
    ],
    link: '/services/seo',
    color: 'from-[#ff9e5c] via-[#ff6b2c] to-[#fc4c00]',
  },
];

export default function ServicesShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#fff3e8] px-4 pb-20 pt-12 sm:px-6 md:pb-24 md:pt-16 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#fc4c00]/5 blur-3xl" />

        <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#ff9e5c]/10 blur-3xl" />

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
        {/* Top Badge */}
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
              WHAT WE DO BEST
            </span>

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-70" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
          </motion.div>
        </motion.div>

        {/* Section Heading */}
        <motion.div
          className="mx-auto mb-12 max-w-4xl text-center sm:mb-16"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <span className="text-[#0a192f]">Digital Solutions Built to </span>

            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #fc4c00, #ff9e5c, #fc4c00)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              Move Your Business Forward
            </span>
          </h2>

          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#fc4c00] to-[#ff9e5c]" />

          <p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-[#0a192f]/70 sm:text-lg md:text-xl">
            You do not need more complicated tools. You need the right digital
            systems working together to attract customers, simplify operations,
            and create sustainable growth.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-7 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
              }}
              className="group relative h-full"
            >
              {/* Animated Gradient Glow */}
              <div
                className={`absolute -inset-[2px] rounded-[24px] bg-gradient-to-r ${service.color} opacity-0 blur-md transition-all duration-500 group-hover:opacity-50`}
              />

              {/* Main Card */}
              <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/90 bg-gradient-to-br from-white via-[#fffaf6] to-[#ffe9da] shadow-[0_10px_35px_rgba(10,25,47,0.08)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#fc4c00]/20 group-hover:shadow-[0_25px_60px_rgba(252,76,0,0.18)]">
                {/* Background Glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-[#fc4c00]/10 blur-3xl transition-all duration-500 group-hover:bg-[#fc4c00]/20" />

                <div className="pointer-events-none absolute -bottom-24 -left-20 h-44 w-44 rounded-full bg-[#ff9e5c]/10 blur-3xl transition-all duration-500 group-hover:bg-[#ff9e5c]/20" />

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/50 via-[#0a192f]/10 to-transparent" />

                  {/* Hover Orange Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fc4c00]/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Icon */}
                  <div className="absolute left-5 top-5 z-20">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/60 bg-white/90 text-2xl shadow-xl backdrop-blur-xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-110">
                      {service.icon}
                    </div>
                  </div>

                  {/* Image Label */}
                  <div className="absolute bottom-5 left-5 z-20">
                    <span className="rounded-full border border-white/20 bg-[#0a192f]/60 px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] text-white backdrop-blur-md">
                      {service.label}
                    </span>
                  </div>

                  {/* Bottom Accent */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r ${service.color} transition-transform duration-500 group-hover:scale-x-100`}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-1 flex-col p-6">
                  {/* Service Number */}
                  <div className="mb-4 flex items-center">
                    <span className="text-xs font-bold tracking-[0.2em] text-[#fc4c00]">
                      SERVICE 0{service.id}
                    </span>

                    <div className="ml-4 h-px flex-1 bg-[#0a192f]/10 transition-colors duration-500 group-hover:bg-[#fc4c00]/30" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-3 text-xl font-bold leading-tight text-[#0a192f] transition-colors duration-300 group-hover:text-[#fc4c00] sm:text-2xl">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-5 text-sm font-medium leading-relaxed text-[#0a192f]/70">
                    {service.description}
                  </p>

                  {/* Business Outcome */}
                  <div className="mb-6 rounded-xl border border-[#fc4c00]/10 bg-[#fc4c00]/[0.045] p-4 transition-all duration-300 group-hover:bg-[#fc4c00]/[0.07]">
                    <div className="mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#fc4c00]" />

                      <span className="text-[10px] font-extrabold tracking-[0.15em] text-[#fc4c00]">
                        THE BUSINESS IMPACT
                      </span>
                    </div>

                    <p className="text-xs font-semibold leading-relaxed text-[#0a192f]/75">
                      {service.outcome}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-6 space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 text-xs font-semibold text-[#0a192f]/75"
                      >
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#fc4c00]" />

                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-[#0a192f]/10 to-transparent" />

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link href={service.link ?? '#'} className="block">
                      <ParticleWrapper>
                        <StarButton
                          className="group/btn h-12 w-full rounded-xl !bg-[#0a192f] text-sm font-bold tracking-wide text-white shadow-lg shadow-[#0a192f]/20 transition-all duration-300 hover:!bg-[#fc4c00] hover:shadow-xl hover:shadow-[#fc4c00]/25"
                          duration={2.5}
                        >
                          <span>Discover the Solution</span>

                          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </StarButton>
                      </ParticleWrapper>
                    </Link>
                  </div>
                </div>

                {/* Bottom Shine */}
                <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Message */}
        <motion.div
          className="mx-auto mt-12 max-w-3xl text-center sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="rounded-2xl border border-[#0a192f]/5 bg-white/60 px-6 py-6 shadow-sm backdrop-blur-sm sm:px-10">
            <p className="text-base font-semibold leading-relaxed text-[#0a192f]/80 sm:text-lg">
              Not sure which solution is right for your business?
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#0a192f]/60">
              Let's understand your goals, identify the opportunities, and build
              a digital strategy that makes sense for where you are today and
              where you want to go next.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
