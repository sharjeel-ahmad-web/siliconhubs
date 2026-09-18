'use client';

/**
 * Hiring process — numbered steps with a connecting line.
 */
import { motion } from 'framer-motion';
import { CareerSettings } from '@/types/careers';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';

interface ProcessSectionProps {
  content: CareerSettings['process'];
}

export function ProcessSection({ content }: ProcessSectionProps) {
  const steps = Array.isArray(content.steps) ? content.steps : [];
  if (steps.length === 0) return null;

  return (
    <section
      id="hiring-process"
      className="mx-auto max-w-7xl px-6 py-16 md:py-24"
    >
      <CareersSectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        titleHighlight={content.titleHighlight}
        subtitle={content.subtitle}
      />

      <ol className="relative grid gap-8 md:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, index) => (
          <motion.li
            key={`${step.title}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.6) }}
            className="group relative flex flex-col items-start"
          >
            {/* Step number */}
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-sm font-bold text-white shadow-lg transition-all duration-300 group-hover:bg-[#FC4C00] group-hover:shadow-[#FC4C00]/30">
                {String(index + 1).padStart(2, '0')}
              </span>
              {index < steps.length - 1 && (
                <span
                  className="hidden h-px flex-1 bg-[#E8D8C5] lg:block"
                  aria-hidden="true"
                />
              )}
            </div>
            <h3 className="mb-2 text-base font-bold text-[#14213D]">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#5F6368]">
              {step.description}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

export default ProcessSection;
