import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import BlogPageClient from './BlogPageClient';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/blog');
}

// Server Component - SEO optimized
export default function BlogPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

  return (
    <>
      <BreadcrumbSchema
        items={[{ name: 'Blog', url: `${baseUrl}/blog` }]}
      />
      <BlogPageClient />
    </>
  );
}
