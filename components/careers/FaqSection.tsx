'use client';

/**
 * Careers FAQ — CMS-managed accordion.
 */
import { CareerSettings } from '@/types/careers';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';
import CareersFAQ from '@/components/careers/CareersFAQ';

interface FaqSectionProps {
  content: CareerSettings['faqs'];
}

export function FaqSection({ content }: FaqSectionProps) {
  const items = Array.isArray(content.items) ? content.items : [];
  if (items.length === 0) return null;

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <CareersSectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        titleHighlight={content.titleHighlight}
        subtitle={content.subtitle}
      />
      <CareersFAQ items={items} />
    </section>
  );
}

export default FaqSection;
