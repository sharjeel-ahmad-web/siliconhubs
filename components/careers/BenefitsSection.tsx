'use client';

/**
 * Career benefits — reusable cards showing only CMS-configured benefits.
 */
import { motion } from 'framer-motion';
import { CareerSettings } from '@/types/careers';
import { CareerIcon } from '@/components/careers/CareerIcon';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';

interface BenefitsSectionProps {
  content: CareerSettings['benefits'];
}

export function BenefitsSection({ content }: BenefitsSectionProps) {
  const items = Array.isArray(content.items) ? content.items : [];
  if (items.length === 0) return null;

  return (
    <section id="benefits" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <CareersSectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        titleHighlight={content.titleHighlight}
        subtitle={content.subtitle}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.5) }}
            className="flex items-start gap-4 rounded-2xl border border-[#E8D8C5] bg-white/55 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FC4C00]/40 hover:shadow-lg hover:shadow-[#FC4C00]/10"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFEDD7] text-[#FC4C00] transition-colors duration-300 group-hover:bg-[#FC4C00]">
              <CareerIcon name={item.icon} className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold text-[#14213D]">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#5F6368]">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection;
