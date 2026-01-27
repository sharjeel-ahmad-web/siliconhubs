import { Metadata } from 'next';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import StructuredData from '@/components/seo/StructuredData';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateServiceSchema } from '@/lib/seo/structuredData';
import SaasPageClient from './saasPageClient';

/**
 * Single source of truth for the SaaS hero <video src>.
 * Defined only in this Server Component so server HTML and client hydration receive the same value.
 * Do not derive hero video src in client components (no hooks, no effects).
 */
const SAAS_HERO_VIDEO_SRC = '/media/services/saas/video/hero-video.mp4';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return await getMetaTags('/services/saas');
}

// Server Component - SEO optimized
export default function SaasPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';

  // Generate Service schema
  const serviceSchema = generateServiceSchema({
    name: 'SaaS Development Services',
    description:
      'Custom SaaS application development. Build scalable, secure, and user-friendly software-as-a-service platforms with modern technology stacks.',
    serviceType: 'SaaS Development',
  });

  // Generate breadcrumb schema
  const breadcrumbItems = [
    { name: 'Services', url: `${baseUrl}/services` },
    { name: 'SaaS', url: `${baseUrl}/services/saas` },
  ];

  return (
    <>
      <StructuredData schema={serviceSchema} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <SaasPageClient heroVideoSrc={SAAS_HERO_VIDEO_SRC} />
    </>
  );
}
