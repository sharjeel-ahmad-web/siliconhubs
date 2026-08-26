import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import BreadcrumbSchema from '@/modules/core/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import WebDesignPageClient from './WebDesignPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/web-design');
}

// Server Component - SEO optimized
export default function WebDesignPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  // Generate Service schema
  const serviceSchema = generateServiceSchema({
    name: 'Web Design Services',
    description:
      'Premium web design services. Create stunning, responsive websites with modern UI/UX design, custom development, and conversion optimization.',
    serviceType: 'Web Design',
  });

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'Web Design', url: `${baseUrl}/services/web-design` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WebDesignPageClient />
    </>
  );
}
