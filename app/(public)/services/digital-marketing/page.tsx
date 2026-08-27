import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/components/seo/StructuredData';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import DigitalMarketingPageClient from './DigitalMarketingPageClient';

export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/digital-marketing');
}

export default function DigitalMarketingPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';
  const serviceSchema = generateServiceSchema({
    name: 'Digital Marketing Services',
    description:
      'Performance-focused digital marketing campaigns that grow visibility, qualified traffic, leads, and revenue.',
    serviceType: 'Digital Marketing',
  });
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'Digital Marketing', url: `${baseUrl}/services/digital-marketing` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <DigitalMarketingPageClient />
    </>
  );
}
