import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import BreadcrumbSchema from '@/modules/core/components/seo/BreadcrumbSchema';
import AboutPageClient from './AboutPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/about');
}

// Server Component - SEO optimized
export default function AboutPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'About', url: `${baseUrl}/about` }]}
      />
      <AboutPageClient />
    </>
  );
}
