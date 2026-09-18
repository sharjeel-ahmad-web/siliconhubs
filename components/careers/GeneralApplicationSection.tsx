'use client';

/**
 * "Don't see the right role?" — general application CTA + talent pool form.
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { CareerSettings } from '@/types/careers';
import {
  GeneralApplicationForm,
  GeneralApplicationResult,
} from '@/components/careers/GeneralApplicationForm';
import ApplicationSuccess from '@/components/careers/ApplicationSuccess';

interface GeneralApplicationSectionProps {
  content: CareerSettings['general'];
}

export function GeneralApplicationSection({
  content,
}: GeneralApplicationSectionProps) {
  const [result, setResult] = useState<GeneralApplicationResult | null>(null);

  return (
    <section
      id="general-application"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 md:py-24"
    >
      {result ? (
        <ApplicationSuccess
          result={{ ...result, jobTitle: content.ctaTitle, general: true }}
          onReset={() => setResult(null)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-[#E8D8C5] bg-white/60 p-8 backdrop-blur-sm md:p-12"
        >
          {/* Decorative blob */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#FC4C00]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#14213D]/5 blur-2xl" />

          <div className="relative mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FC4C00]/20 bg-white/80 px-4 py-2">
              <Send className="h-4 w-4 text-[#FC4C00]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#FC4C00]">
                {content.eyebrow}
              </span>
            </div>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-[#14213D] md:text-4xl">
              {content.title}{' '}
              {content.titleHighlight && (
                <span className="bg-gradient-to-r from-[#FC4C00] to-[#F4511E] bg-clip-text text-transparent">
                  {content.titleHighlight}
                </span>
              )}
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-[#5F6368]">
              {content.subtitle}
            </p>

            <div className="rounded-3xl border border-[#E8D8C5] bg-white p-6 text-left shadow-lg shadow-[#14213D]/5 md:p-8">
              <h3 className="mb-1 text-lg font-bold text-[#14213D]">
                {content.ctaTitle}
              </h3>
              <p className="mb-6 text-sm text-[#5F6368]">
                {content.ctaDescription}
              </p>
              <GeneralApplicationForm onSuccess={setResult} />
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}

export default GeneralApplicationSection;
