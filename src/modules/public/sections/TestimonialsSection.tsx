'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechVentures Inc.',
    text: 'Silicon Hubs transformed our online presence completely. The website they built increased our leads by 300% in just 3 months. Absolutely phenomenal work!',
    rating: 5,
    avatar: 'SJ',
    color: '#fc4c00',
  },
  {
    name: 'Ahmed Al-Rashid',
    role: 'Founder, DigitalPro',
    text: 'The AI chatbot they developed for us now handles 90% of customer queries automatically. Our support team can now focus on complex issues. Game changer!',
    rating: 5,
    avatar: 'AA',
    color: '#06b6d4',
  },
  {
    name: 'Emily Chen',
    role: 'Marketing Director, GrowthCo',
    text: 'Their digital marketing campaigns delivered a 5x return on ad spend. The team is incredibly professional and results-focused. Highly recommended!',
    rating: 5,
    avatar: 'EC',
    color: '#10b981',
  },
  {
    name: 'Marcus Williams',
    role: 'CTO, ScaleUp Ltd.',
    text: 'The N8N automation workflows they built saved us 40 hours per week. Silicon Hubs is a true strategic technology partner, not just a vendor.',
    rating: 5,
    avatar: 'MW',
    color: '#fc4c00',
  },
];

function TestimonialCard({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <motion.div
        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(10, 25, 47, 0.08)' }}
        className="relative flex h-full flex-col justify-between rounded-3xl border border-[#0a192f]/5 bg-[#ffffff] p-8 transition-all duration-300 hover:border-[#fc4c00]/20"
      >
        {/* Quote icon */}
        <Quote
          className="absolute right-6 top-6 h-8 w-8 opacity-10"
          style={{ color: testimonial.color }}
        />

        {/* Stars */}
        <div className="mb-4 flex gap-1">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-[#fc4c00] text-[#fc4c00]" />
          ))}
        </div>

        {/* Text */}
        <p className="mb-6 text-sm leading-relaxed text-[#363534]">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: testimonial.color }}
          >
            {testimonial.avatar}
          </div>
          <div>
            <div
              className="font-bold text-[#000000]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {testimonial.name}
            </div>
            <div className="text-xs text-[#515161]">{testimonial.role}</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true });

  return (
    <section className="bg-[#ffedd7] py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="mb-4 inline-flex rounded-full border border-[#fc4c00]/20 bg-[#fc4c00]/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#fc4c00]"
          >
            Client Stories
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl font-extrabold text-[#000000] md:text-5xl"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            What Our Clients <span className="text-[#fc4c00]">Say</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
