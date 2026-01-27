import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/components/seo/StructuredData';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import SEOPageClient from './SEOPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/seo');
}

// Server Component - SEO optimized
export default function SEOPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';

  // Generate Service schema
  const serviceSchema = generateServiceSchema({
    name: 'SEO Services',
    description:
      'Comprehensive SEO services to improve search rankings, increase organic traffic, and boost online visibility. Technical SEO, content optimization, and analytics.',
    serviceType: 'SEO',
  });

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'SEO', url: `${baseUrl}/services/seo` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <SEOPageClient />
    </>
  );
}
