'use client';

/**
 * Careers page composition. Content and jobs are fetched server-side and
 * passed in so the page remains SEO-friendly; sections fall back to CMS
 * defaults when nothing has been configured.
 */
import { CareerSettings, CareerJob } from '@/types/careers';
import { DEFAULT_CAREER_SETTINGS } from '@/lib/careers/constants';
import CareersHero from '@/components/careers/CareersHero';
import WhyJoinSection from '@/components/careers/WhyJoinSection';
import LifeAtSection from '@/components/careers/LifeAtSection';
import OpenPositionsSection from '@/components/careers/OpenPositionsSection';
import ProcessSection from '@/components/careers/ProcessSection';
import TestimonialsSection from '@/components/careers/TestimonialsSection';
import BenefitsSection from '@/components/careers/BenefitsSection';
import FaqSection from '@/components/careers/FaqSection';
import GeneralApplicationSection from '@/components/careers/GeneralApplicationSection';

interface CareersPageClientProps {
  initialJobs: CareerJob[];
  initialContent: CareerSettings | null;
}

export default function CareersPageClient({
  initialJobs,
  initialContent,
}: CareersPageClientProps) {
  const content =
    initialContent || (DEFAULT_CAREER_SETTINGS as unknown as CareerSettings);
  const jobs = Array.isArray(initialJobs) ? initialJobs : [];

  return (
    <div className="overflow-x-clip">
      <CareersHero content={content.hero} openJobsCount={jobs.length} />
      <WhyJoinSection content={content.whyJoin} />
      <LifeAtSection content={content.life} />
      <OpenPositionsSection jobs={jobs} />
      <ProcessSection content={content.process} />
      <TestimonialsSection content={content.testimonials} />
      <BenefitsSection content={content.benefits} />
      <FaqSection content={content.faqs} />
      <GeneralApplicationSection content={content.general} />
    </div>
  );
}
