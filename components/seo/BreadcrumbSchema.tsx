/**
 * Breadcrumb Schema Component
 * Generates breadcrumb navigation schema for SEO
 */

import StructuredData from './StructuredData';
import { generateBreadcrumbListSchema, BreadcrumbItem } from '@/lib/seo/structuredData';

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  // Always include homepage as first item
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl },
    ...items,
  ];

  const schema = generateBreadcrumbListSchema(breadcrumbItems);

  return <StructuredData schema={schema} />;
}

