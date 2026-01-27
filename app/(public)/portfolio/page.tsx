import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import PortfolioPageClient from './PortfolioPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/portfolio');
}

// Server Component - SEO optimized
export default function PortfolioPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Portfolio', url: `${baseUrl}/portfolio` }]}
      />
      <PortfolioPageClient />
    </>
  );
}
