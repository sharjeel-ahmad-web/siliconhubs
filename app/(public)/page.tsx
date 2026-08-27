import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebSiteSchema } from '@/lib/seo/structuredData';
import HomeSections from './components/HomeSections';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/');
}

// ISR with 30-second revalidation - CMS changes appear within 30 seconds
export const revalidate = 30;

// Server Component - SEO optimized
export default function Home() {
  return (
    <>
      {/* WebSite Schema for homepage */}
      <StructuredData schema={generateWebSiteSchema()} />
      <HomeSections />
    </>
  );
}
