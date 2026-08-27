'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Globe, Bot, Zap, Search, ShoppingBag, Code, TrendingUp, ArrowRight
} from 'lucide-react';

const SERVICES = [
  {
    icon: Globe,
    title: 'Web Design',
    description: 'Premium, responsive websites that captivate visitors and drive conversions with stunning visual design.',
    href: '/services/web-design',
    color: '#fc4c00',
    bgColor: '#ffedd7',
  },
  {
    icon: Bot,
    title: 'Chatbot Development',
    description: 'AI-powered chatbots that engage your customers 24/7 and automate support effortlessly.',
    href: '/services/chatbot-development',
    color: '#06b6d4',
    bgColor: '#ecfeff',
  },
  {
    icon: Zap,
    title: 'N8N Automations',
    description: 'Intelligent workflow automation that eliminates repetitive tasks and multiplies your team\'s output.',
    href: '/services/n8n-automations',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
  {
    icon: TrendingUp,
    title: 'Digital Marketing',
    description: 'Data-driven marketing strategies including SEO, social media, and paid ads to maximize your online reach.',
    href: '/services/digital-marketing',
    color: '#fc4c00',
    bgColor: '#ffedd7',
  },
  {
    icon: Search,
    title: 'SEO Optimization',
    description: 'Rank higher on Google and drive organic traffic that converts into paying customers.',
    href: '/services/seo',
    color: '#0a192f',
    bgColor: '#e8edf5',
  },
  {
    icon: ShoppingBag,
    title: 'Shopify Development',
    description: 'High-converting e-commerce stores built on Shopify that turn browsers into buyers.',
    href: '/services/shopify',
    color: '#06b6d4',
    bgColor: '#ecfeff',
  },
  {
    icon: Code,
    title: 'WordPress Development',
    description: 'Custom WordPress themes and plugins for powerful, scalable websites that are easy to manage.',
    href: '/services/wordpress',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
];

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <motion.div
        whileHover={{ y: -8, boxShadow: `0 20px 40px ${service.color}15` }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="group relative h-full overflow-hidden rounded-3xl border border-[#0a192f]/5 bg-[#ffedd7] p-8 transition-all duration-300 hover:border-[#fc4c00]/20"
      >
        {/* Icon */}
        <div
          className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: service.bgColor }}
        >
          <Icon className="h-6 w-6" style={{ color: service.color }} />
        </div>

        <h3
          className="mb-3 text-xl font-bold text-[#000000]"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {service.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-[#363534]">
          {service.description}
        </p>

        <Link
          href={service.href}
          className="inline-flex items-center gap-1 text-sm font-bold text-[#fc4c00] transition-all duration-200 hover:gap-2"
        >
          Explore Service <ArrowRight className="h-4 w-4" />
        </Link>

        {/* Hover bg glow */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
          style={{ background: service.color }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true });

  return (
    <section className="bg-black py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#fc4c00]/20 bg-[#fc4c00]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#fc4c00]"
          >
            What We Build
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-extrabold text-[#000000] md:text-5xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Services That Drive <span className="text-[#fc4c00]">Results</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-[#515161]"
          >
            From design to deployment, we deliver end-to-end digital solutions tailored to your business goals.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#0a192f] px-8 py-4 font-bold text-[#0a192f] transition-all duration-300 hover:bg-[#0a192f] hover:text-white"
          >
            View All Services <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
