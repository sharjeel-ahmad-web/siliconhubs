import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import BreadcrumbSchema from '@/modules/core/components/seo/BreadcrumbSchema';
import ContactPageClient from './ContactPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/contact');
}

// Server Component - SEO optimized
export default function ContactPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Contact', url: `${baseUrl}/contact` }]}
      />
      <ContactPageClient />
    </>
  );
}
