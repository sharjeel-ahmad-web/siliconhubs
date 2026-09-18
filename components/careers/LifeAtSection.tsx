'use client';

/**
 * Life at SiliconHubs — gallery section wrapping CareersGallery.
 */
import { CareerSettings } from '@/types/careers';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';
import CareersGallery from '@/components/careers/CareersGallery';

interface LifeAtSectionProps {
  content: CareerSettings['life'];
}

export function LifeAtSection({ content }: LifeAtSectionProps) {
  const images = Array.isArray(content.images) ? content.images : [];
  if (images.length === 0) return null;

  return (
    <section
      id="life-at-siliconhubs"
      className="mx-auto max-w-7xl px-6 py-16 md:py-24"
    >
      <CareersSectionHeading
        eyebrow={content.eyebrow}
        title={content.title}
        titleHighlight={content.titleHighlight}
        subtitle={content.subtitle}
      />
      <CareersGallery images={images} />
    </section>
  );
}

export default LifeAtSection;
