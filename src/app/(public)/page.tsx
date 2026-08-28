import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import { generateWebSiteSchema } from '@/lib/seo/structuredData';
import { BatchSectionProvider } from '@/modules/public/sections/BatchSectionProvider';
import HomeSections from './home-sections';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/');
}

// ISR with 30-second revalidation - CMS changes appear within 30 seconds
export const revalidate = 30;

// All sections on homepage
const HOME_SECTIONS = [
  'hero',
  'servicesShowcase',
  'portfolioGallery',
  'about',
  'bentoGrid',
  'techStack',
  'caseStudies',
  'testimonials',
  'blog',
  'connect',
  'team',
  'contact',
  'cta',
];

// Server Component - SEO optimized
export default function Home() {
  return (
    <>
      {/* WebSite Schema for homepage */}
      <StructuredData schema={generateWebSiteSchema()} />
      <BatchSectionProvider page="home" sections={HOME_SECTIONS}>
        <HomeSections />
      </BatchSectionProvider>
    </>
  );
}
