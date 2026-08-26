import clientPromise from '@/lib/db/mongodb';
import { Metadata } from 'next';

interface PageMeta {
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
}

const defaultMeta: Record<string, Partial<PageMeta>> = {
  '/': {
    title: 'Rising Dot Agency | Digital Excellence Delivered',
    description:
      'We craft stunning websites, powerful automations, and intelligent chatbots that transform your digital presence.',
  },
  '/about': {
    title: 'About Us | Rising Dot Agency',
    description:
      'Meet the team behind Rising Dot Agency. We are passionate developers, designers, and strategists dedicated to creating exceptional digital experiences.',
  },
  '/services': {
    title: 'Our Services | Rising Dot Agency',
    description:
      'Comprehensive digital solutions including web design, chatbot development, N8N automations, WordPress, Shopify, and SEO services.',
  },
  '/portfolio': {
    title: 'Our Work | Rising Dot Agency',
    description:
      'Explore our portfolio of successful projects and see how we have helped businesses transform their digital presence.',
  },
  '/contact': {
    title: 'Contact Us | Rising Dot Agency',
    description:
      'Get in touch with Rising Dot Agency. Let us discuss your project and how we can help you achieve your digital goals.',
  },
  '/blog': {
    title: 'Blog | Rising Dot Agency',
    description:
      'Insights, tips, and news about web development, automation, AI, and digital marketing from the Rising Dot team.',
  },
  '/services/chatbot-development': {
    title: 'AI Chatbot Development Services | Rising Dot Agency',
    description:
      'Custom AI chatbot development services. Build intelligent chatbots with natural language processing, GPT integration, and automation capabilities.',
  },
  '/services/n8n-automations': {
    title: 'N8N Automation Services | Rising Dot Agency',
    description:
      'Professional N8N workflow automation services. Automate business processes, integrate systems, and streamline operations with powerful no-code automations.',
  },
  '/services/web-design': {
    title: 'Web Design Services | Rising Dot Agency',
    description:
      'Premium web design services. Create stunning, responsive websites with modern UI/UX design, custom development, and conversion optimization.',
  },
  '/services/wordpress': {
    title: 'WordPress Development Services | Rising Dot Agency',
    description:
      'Expert WordPress development and customization services. Build custom themes, plugins, and optimize WordPress sites for performance and SEO.',
  },
  '/services/shopify': {
    title: 'Shopify Development Services | Rising Dot Agency',
    description:
      'Professional Shopify store development and optimization. Create high-converting e-commerce stores with custom themes, apps, and integrations.',
  },
  '/services/seo': {
    title: 'SEO Services | Rising Dot Agency',
    description:
      'Comprehensive SEO services to improve search rankings, increase organic traffic, and boost online visibility. Technical SEO, content optimization, and analytics.',
  },
  '/services/saas': {
    title: 'SaaS Development Services | Rising Dot Agency',
    description:
      'Custom SaaS application development. Build scalable, secure, and user-friendly software-as-a-service platforms with modern technology stacks.',
  },
};

export async function getMetaTags(path: string): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';

  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const meta = (await db
      .collection('seoMeta')
      .findOne({ path })) as PageMeta | null;
    const defaults = defaultMeta[path] || {};

    const title = meta?.title || defaults.title || 'Rising Dot Agency';
    const description = meta?.description || defaults.description || '';
    const ogTitle = meta?.ogTitle || title;
    const ogDescription = meta?.ogDescription || description;
    const ogImage = meta?.ogImage || `${baseUrl}/og-image.jpg`;
    const canonicalUrl = meta?.canonicalUrl || `${baseUrl}${path}`;

    const robots: string[] = [];
    if (meta?.noIndex) robots.push('noindex');
    if (meta?.noFollow) robots.push('nofollow');

    return {
      title,
      description,
      keywords: meta?.keywords || '',
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        url: canonicalUrl,
        siteName: 'Rising Dot Agency',
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: ogTitle,
          },
        ],
        type: 'website',
      },
      twitter: {
        card: meta?.twitterCard || 'summary_large_image',
        title: ogTitle,
        description: ogDescription,
        images: [ogImage],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: robots.length > 0 ? robots.join(', ') : undefined,
    };
  } catch (error) {
    console.error('Error fetching meta tags:', error);

    // Return defaults on error
    const defaults = defaultMeta[path] || {};
    return {
      title: defaults.title || 'Rising Dot Agency',
      description: defaults.description || '',
    };
  }
}
