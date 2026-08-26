import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import BreadcrumbSchema from '@/modules/core/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import ChatbotDevelopmentPageClient from './ChatbotDevelopmentPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/chatbot-development');
}

// Server Component - SEO optimized
export default function ChatbotDevelopmentPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  // Generate Service schema
  const serviceSchema = generateServiceSchema({
    name: 'AI Chatbot Development Services',
    description:
      'Custom AI chatbot development services. Build intelligent chatbots with natural language processing, GPT integration, and automation capabilities.',
    serviceType: 'Chatbot Development',
  });

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'Chatbot Development', url: `${baseUrl}/services/chatbot-development` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ChatbotDevelopmentPageClient />
    </>
  );
}
