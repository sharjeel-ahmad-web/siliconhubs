import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/components/seo/StructuredData';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import N8NAutomationsPageClient from './n8n-automationsPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/n8n-automations');
}

// Server Component - SEO optimized
export default function N8NAutomationsPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';

  // Generate Service schema
  const serviceSchema = generateServiceSchema({
    name: 'N8N Automation Services',
    description:
      'Professional N8N workflow automation services. Automate business processes, integrate systems, and streamline operations with powerful no-code automations.',
    serviceType: 'N8N Automations',
  });

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'N8N Automations', url: `${baseUrl}/services/n8n-automations` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <N8NAutomationsPageClient />
    </>
  );
}
