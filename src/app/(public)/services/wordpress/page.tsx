import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import BreadcrumbSchema from '@/modules/core/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import WordPressPageClient from './wordpressPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/wordpress');
}

// Server Component - SEO optimized
export default function WordPressPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  // Generate Service schema
  const serviceSchema = generateServiceSchema({
    name: 'WordPress Development Services',
    description:
      'Expert WordPress development and customization services. Build custom themes, plugins, and optimize WordPress sites for performance and SEO.',
    serviceType: 'WordPress Development',
  });

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'WordPress', url: `${baseUrl}/services/wordpress` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <WordPressPageClient />
    </>
  );
}
