import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import BreadcrumbSchema from '@/modules/core/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import ShopifyPageClient from './shopifyPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/shopify');
}

// Server Component - SEO optimized
export default function ShopifyPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  // Generate Service schema
  const serviceSchema = generateServiceSchema({
    name: 'Shopify Development Services',
    description:
      'Professional Shopify store development and optimization. Create high-converting e-commerce stores with custom themes, apps, and integrations.',
    serviceType: 'Shopify Development',
  });

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'Shopify', url: `${baseUrl}/services/shopify` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ShopifyPageClient />
    </>
  );
}
