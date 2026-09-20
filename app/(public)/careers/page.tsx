import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import StructuredData from '@/components/seo/StructuredData';
import { generateFAQPageSchema } from '@/lib/seo/structuredData';
import { getCareerSettings, getPublishedJobs } from '@/lib/careers/data';
import { toPublicJob } from '@/lib/careers/helpers';
import CareersPageClient from './CareersPageClient';

// Careers content is managed in MongoDB and must be read on each request.
export const dynamic = 'force-dynamic';

// Unique metadata for the Careers page
export async function generateMetadata(): Promise<Metadata> {
  const base = await getMetaTags('/careers');
  return {
    ...base,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency'}/careers`,
    },
  };
}

export default async function CareersPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  // Server-side data fetching — safe even when MongoDB is unavailable.
  const [settings, jobs] = await Promise.all([
    getCareerSettings().catch(() => null),
    getPublishedJobs().catch(() => []),
  ]);

  // FAQPage structured data — only when FAQ content actually renders.
  const faqItems = settings?.faqs?.items?.filter(
    (f) => f && f.question && f.answer
  );
  const faqSchema =
    faqItems && faqItems.length > 0 ? generateFAQPageSchema(faqItems) : null;

  return (
    <>
      {faqSchema && <StructuredData schema={faqSchema} />}
      <BreadcrumbSchema
        items={[{ name: 'Careers', url: `${baseUrl}/careers` }]}
      />
      <CareersPageClient
        initialJobs={jobs.map(toPublicJob)}
        initialContent={settings}
      />
    </>
  );
}
