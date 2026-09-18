'use client';

/**
 * Employee testimonials — cards with photo, name, role and quote.
 */
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { CareerSettings } from '@/types/careers';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';

interface TestimonialsSectionProps {
  content: CareerSettings['testimonials'];
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const items = Array.isArray(content.items) ? content.items : [];
  if (items.length === 0) return null;

  return (
    <section
      id="team-testimonials"
      className="mx-auto max-w-7xl px-6 py-16 md:py-24"
    >
      <CareersSectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        titleHighlight={content.titleHighlight}
        subtitle={content.subtitle}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.figure
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.4) }}
            className="group relative flex flex-col rounded-2xl border border-[#E8D8C5] bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FC4C00]/40 hover:shadow-xl hover:shadow-[#FC4C00]/10"
          >
            <Quote className="mb-4 h-8 w-8 text-[#FC4C00]/70" />
            <blockquote className="mb-6 flex-1 text-sm leading-relaxed text-[#5F6368]">
              “{item.text}”
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-[#E8D8C5] pt-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#FFEDD7]">
                {item.photo ? (
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-[#FC4C00] text-sm font-bold text-white">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-[#14213D]">{item.name}</p>
                <p className="text-xs text-[#8A7E72]">
                  {item.position}
                  {item.department ? ` · ${item.department}` : ''}
                </p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

export default TestimonialsSection;
