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
    name: 'SiliconHubs',
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
      'https://www.facebook.com/profile.php?id=61593591315934',
      'https://x.com/Siliconhubs',
      'https://www.instagram.com/siliconhubs/',
      'https://www.linkedin.com/in/sharjeel-ahmad-2646361b7/',
      'https://www.youtube.com/@SiliconHubsAgency',
      'https://github.com/siliconhubs',
      'https://www.tiktok.com/@siliconhubs',
      'https://pin.it/7aO5YxU8U',
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
    name: 'SiliconHubs',
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
      name: 'SiliconHubs',
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
      name: 'SiliconHubs',
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
      name: 'SiliconHubs',
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
    name: 'SiliconHubs',
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
 * Generate JobPosting Schema for job detail pages.
 * Only includes fields that are actually available — salary and location are
 * never fabricated. Synchronize with visible page content.
 */
export function generateJobPostingSchema(job: {
  title: string;
  description: string;
  url: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  experienceLevel?: string;
  location?: string;
  city?: string;
  country?: string;
  remoteStatus?: string;
  salary?: string;
  skills?: string[];
  featuredImage?: string;
}): Record<string, unknown> {
  const baseUrl = getBaseUrl();

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'SiliconHubs',
      sameAs: baseUrl,
    },
    employerOverview: {
      '@type': 'Organization',
      name: 'SiliconHubs',
      description:
        'Premium digital solutions provider specializing in N8N Automations, Chatbot Development, Web Design, WordPress, Shopify, and SEO services.',
      url: baseUrl,
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: job.country || job.remoteStatus === 'remote' ? 'Worldwide' : 'PK',
    },
    jobLocationType:
      job.remoteStatus === 'remote'
        ? 'TELECOMMUTE'
        : job.remoteStatus === 'hybrid'
          ? 'MIXED'
          : undefined,
    url: job.url,
  };

  if (job.validThrough) schema.validThrough = job.validThrough;
  if (job.employmentType) {
    const typeMap: Record<string, string> = {
      'Full-time': 'FULL_TIME',
      'Part-time': 'PART_TIME',
      Contract: 'CONTRACTOR',
      Freelance: 'CONTRACTOR',
      Internship: 'INTERN',
    };
    schema.employmentType = typeMap[job.employmentType] || job.employmentType;
  }
  if (job.experienceLevel) {
    const seniority = job.experienceLevel.toLowerCase();
    if (
      seniority.includes('entry') ||
      seniority.includes('junior') ||
      seniority.includes('intern')
    ) {
      schema.employmentType = [
        'INTERN',
        'FULL_TIME',
        'PART_TIME',
        'CONTRACTOR',
        'TEMPORARY',
      ];
    }
  }

  if (job.location) {
    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.city || job.location.split(',')[0]?.trim(),
        addressCountry: job.country || 'PK',
      },
    };
  }

  if (job.salary) {
    // Only output salary range when the agency has explicitly published one.
    const match = job.salary.match(
      /([\d,.]+)\s*[-–]\s*([\d,.]+)\s*([A-Za-z$€£]*)/
    );
    if (match) {
      const currency = match[3] || (job.salary.includes('$') ? 'USD' : 'USD');
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: parseFloat(match[1].replace(/,/g, '')),
          maxValue: parseFloat(match[2].replace(/,/g, '')),
          unitText: 'YEAR',
        },
      };
    } else {
      schema.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: {
          '@type': 'QuantitativeValue',
          value: job.salary,
        },
      };
    }
  }

  if (job.skills?.length) {
    schema.skills = job.skills.join(', ');
  }

  if (job.featuredImage) {
    schema.image = [job.featuredImage];
  }

  // Remove undefined fields so only actually available data is emitted
  for (const key of Object.keys(schema)) {
    if (schema[key] === undefined) delete schema[key];
  }

  return schema;
}

/**
 * Generate FAQPage Schema — only when questions are actually rendered on the page.
 */
export function generateFAQPageSchema(
  faqs: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Convert schema object to JSON-LD script tag
 */
export function schemaToJsonLd(schema: object): string {
  return JSON.stringify(schema, null, 2);
}
