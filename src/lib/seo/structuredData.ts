/**
 * Structured Data (JSON-LD) Schema Generator
 * Generates Schema.org compliant JSON-LD for SEO
 */

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    '@type': string;
    telephone?: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
  publisher?: {
    '@type': string;
    name: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbListSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description?: string;
  image?: string | string[];
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': string;
    name: string;
    url?: string;
  };
  publisher: {
    '@type': string;
    name: string;
    logo?: {
      '@type': string;
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': string;
    '@id': string;
  };
  articleSection?: string;
  keywords?: string | string[];
}

export interface ServiceSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
    url: string;
  };
  areaServed?: string;
  serviceType?: string;
}

/**
 * Generate Organization Schema
 */
export function generateOrganizationSchema(
  options?: Partial<OrganizationSchema>
): OrganizationSchema {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Silicon Hubs',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'Premium digital solutions provider specializing in N8N Automations, Chatbot Development, Web Design, WordPress, Shopify, and SEO services.',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@siliconhubs.com',
      ...options?.contactPoint,
    },
    sameAs: [
      // Add your social media URLs here
      // 'https://facebook.com/siliconhubs',
      // 'https://twitter.com/siliconhubs',
      // 'https://linkedin.com/company/siliconhubs',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      ...options?.address,
    },
    ...options,
  };
}

/**
 * Generate WebSite Schema
 */
export function generateWebSiteSchema(
  options?: Partial<WebSiteSchema>
): WebSiteSchema {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Silicon Hubs',
    url: baseUrl,
    description:
      'Premium digital solutions provider specializing in N8N Automations, Chatbot Development, Web Design, WordPress, Shopify, and SEO services.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Silicon Hubs',
    },
    ...options,
  };
}

/**
 * Generate BreadcrumbList Schema
 */
export function generateBreadcrumbListSchema(
  items: BreadcrumbItem[]
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article Schema for blog posts
 */
export function generateArticleSchema(article: {
  title: string;
  description?: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorUrl?: string;
  url: string;
  category?: string;
  tags?: string[];
}): ArticleSchema {
  const baseUrl = getBaseUrl();
  const images = article.image
    ? Array.isArray(article.image)
      ? article.image
      : [article.image]
    : [`${baseUrl}/og-image.jpg`];

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || article.title,
    image: images,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
      url: article.authorUrl || baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Silicon Hubs',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    articleSection: article.category,
    keywords: article.tags?.join(', ') || article.category,
  };
}

/**
 * Generate Service Schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  serviceType?: string;
  areaServed?: string;
}): ServiceSchema {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Silicon Hubs',
      url: baseUrl,
    },
    areaServed: service.areaServed || 'Worldwide',
    serviceType: service.serviceType || service.name,
  };
}

/**
 * Generate LocalBusiness Schema (if applicable)
 */
export interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  image?: string;
  address: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  telephone?: string;
  openingHours?: string;
  priceRange?: string;
}

export function generateLocalBusinessSchema(
  options?: Partial<LocalBusinessSchema>
): LocalBusinessSchema {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Silicon Hubs',
    image: `${baseUrl}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      ...options?.address,
    },
    telephone: options?.telephone,
    openingHours: options?.openingHours || 'Mo-Fr 09:00-18:00',
    priceRange: options?.priceRange,
    ...options,
  };
}

/**
 * Convert schema object to JSON-LD script tag
 */
export function schemaToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2);
}
