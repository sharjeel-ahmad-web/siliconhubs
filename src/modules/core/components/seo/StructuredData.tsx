/**
 * Structured Data Component
 * Renders JSON-LD script tags for SEO
 */

import { schemaToJsonLd } from '@/lib/seo/structuredData';

interface StructuredDataProps {
  schema: object | object[];
}

export default function StructuredData({ schema }: StructuredDataProps) {
  const schemas = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {schemas.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: schemaToJsonLd(schemaItem),
          }}
        />
      ))}
    </>
  );
}

