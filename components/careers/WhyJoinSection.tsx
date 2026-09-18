'use client';

/**
 * Why Join SiliconHubs — benefit/value cards with icon tiles and the standard
 * orange hover treatment.
 */
import { motion } from 'framer-motion';
import { CareerSettings } from '@/types/careers';
import { CareerIcon } from '@/components/careers/CareerIcon';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';

interface WhyJoinSectionProps {
  content: CareerSettings['whyJoin'];
}

export function WhyJoinSection({ content }: WhyJoinSectionProps) {
  const items = Array.isArray(content.items) ? content.items : [];
  if (items.length === 0) return null;

  return (
    <section id="why-join" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
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
            transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.6) }}
            className="group relative overflow-hidden rounded-2xl border border-[#E8D8C5] bg-white/55 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FC4C00]/40 hover:shadow-xl hover:shadow-[#FC4C00]/10"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FC4C00]/5 transition-transform duration-500 group-hover:scale-[2]" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FC4C00] text-white shadow-lg shadow-[#FC4C00]/20 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                <CareerIcon name={item.icon} className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[#14213D]">
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

export default WhyJoinSection;
