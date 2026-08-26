'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

const PROJECTS = [
  {
    title: 'E-Commerce Revolution',
    category: 'Shopify Development',
    description: 'A premium Shopify store with custom animations and AI-powered product recommendations.',
    result: '320% increase in conversions',
    image: '/projects/project-1.jpg',
    color: '#fc4c00',
    slug: 'ecommerce-revolution',
  },
  {
    title: 'AI Customer Hub',
    category: 'Chatbot Development',
    description: 'An enterprise-grade AI chatbot that handles 90% of support queries autonomously.',
    result: '90% support automation',
    image: '/projects/project-2.jpg',
    color: '#06b6d4',
    slug: 'ai-customer-hub',
  },
  {
    title: 'Digital Growth Campaign',
    category: 'Digital Marketing',
    description: 'Multi-channel marketing campaign that drove massive organic and paid traffic growth.',
    result: '5x ROAS achieved',
    image: '/projects/project-3.jpg',
    color: '#10b981',
    slug: 'digital-growth-campaign',
  },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <motion.div
        whileHover={{ y: -6 }}
        className="group overflow-hidden rounded-3xl border border-[#0a192f]/5 bg-[#ffedd7] transition-all duration-300 hover:border-[#fc4c00]/20 hover:shadow-2xl"
        style={{ '--hover-color': project.color } as any}
      >
        {/* Image placeholder with gradient */}
        <div
          className="relative h-56 overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${project.color}20, ${project.color}05)` }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center text-8xl font-black opacity-10"
            style={{ color: project.color, fontFamily: 'Poppins, sans-serif' }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>
          <div
            className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ background: project.color }}
          >
            {project.category}
          </div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
          >
            <div
              className="rounded-full p-4"
              style={{ background: `${project.color}20`, backdropFilter: 'blur(10px)' }}
            >
              <ExternalLink className="h-6 w-6" style={{ color: project.color }} />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-7">
          <h3
            className="mb-2 text-xl font-bold text-[#000000]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            {project.title}
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-[#363534]">
            {project.description}
          </p>
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: `${project.color}15`, color: project.color }}
          >
            ✦ {project.result}
          </div>
          <Link
            href={`/portfolio/${project.slug}`}
            className="flex items-center gap-1 text-sm font-bold text-[#fc4c00] transition-all duration-200 hover:gap-2"
          >
            View Case Study <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true });

  return (
    <section className="bg-black py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="mb-4 inline-flex rounded-full border border-[#0a192f]/10 bg-[#0a192f]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0a192f]"
          >
            Our Work
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-[#000000] md:text-5xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Projects That <span className="text-[#fc4c00]">Deliver</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-[#515161]"
          >
            Real results for real businesses. Explore our featured projects and the measurable outcomes we achieved.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full bg-[#0a192f] px-8 py-4 font-bold text-white transition-all duration-300 hover:bg-[#fc4c00]"
          >
            View All Projects <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
