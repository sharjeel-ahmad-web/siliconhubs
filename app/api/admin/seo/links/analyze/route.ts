import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Static pages to analyze
const pagesToAnalyze = [
  { path: '/', title: 'Homepage' },
  { path: '/about', title: 'About' },
  { path: '/services', title: 'Services' },
  { path: '/portfolio', title: 'Portfolio' },
  { path: '/contact', title: 'Contact' },
  { path: '/blog', title: 'Blog' },
  { path: '/services/chatbot-development', title: 'Chatbot Development' },
  { path: '/services/n8n-automations', title: 'N8N Automations' },
  { path: '/services/web-design', title: 'Web Design' },
  { path: '/services/wordpress', title: 'WordPress' },
  { path: '/services/shopify', title: 'Shopify' },
  { path: '/services/seo', title: 'SEO Services' },
  { path: '/services/saas', title: 'SaaS Solutions' },
];

// Simulated link structure (in production, you'd crawl the actual pages)
const simulatedLinks: Record<
  string,
  { internal: string[]; external: string[] }
> = {
  '/': {
    internal: ['/about', '/services', '/portfolio', '/contact', '/blog'],
    external: [
      'https://facebook.com',
      'https://twitter.com',
      'https://linkedin.com',
    ],
  },
  '/about': {
    internal: ['/', '/services', '/contact', '/portfolio'],
    external: [],
  },
  '/services': {
    internal: [
      '/',
      '/services/chatbot-development',
      '/services/web-design',
      '/services/wordpress',
      '/services/shopify',
      '/services/seo',
      '/services/saas',
      '/services/n8n-automations',
      '/contact',
    ],
    external: [],
  },
  '/portfolio': {
    internal: ['/', '/services', '/contact'],
    external: [],
  },
  '/contact': {
    internal: ['/', '/services', '/about'],
    external: ['https://maps.google.com'],
  },
  '/blog': {
    internal: ['/', '/services', '/about'],
    external: [],
  },
  '/services/chatbot-development': {
    internal: ['/', '/services', '/contact'],
    external: ['https://openai.com'],
  },
  '/services/n8n-automations': {
    internal: ['/', '/services', '/contact'],
    external: ['https://n8n.io'],
  },
  '/services/web-design': {
    internal: ['/', '/services', '/portfolio', '/contact'],
    external: [],
  },
  '/services/wordpress': {
    internal: ['/', '/services', '/contact'],
    external: ['https://wordpress.org'],
  },
  '/services/shopify': {
    internal: ['/', '/services', '/contact'],
    external: ['https://shopify.com'],
  },
  '/services/seo': {
    internal: ['/', '/services', '/contact', '/blog'],
    external: ['https://search.google.com/search-console'],
  },
  '/services/saas': {
    internal: ['/', '/services', '/contact'],
    external: [],
  },
};

// POST - Analyze site links
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Build link structure
    const links = pagesToAnalyze.map((page) => {
      const pageLinks = simulatedLinks[page.path] || {
        internal: [],
        external: [],
      };

      // Count incoming links
      let incomingLinks = 0;
      Object.entries(simulatedLinks).forEach(([, links]) => {
        if (links.internal.includes(page.path)) {
          incomingLinks++;
        }
      });

      return {
        page: page.path,
        title: page.title,
        internalLinks: pageLinks.internal.map((url) => ({ url, text: 'Link' })),
        externalLinks: pageLinks.external.map((url) => ({
          url,
          text: 'External Link',
        })),
        incomingLinks,
        outgoingLinks: pageLinks.internal.length + pageLinks.external.length,
      };
    });

    // Find orphan pages (pages with no incoming links except homepage)
    const orphanPages = links
      .filter((l) => l.page !== '/' && l.incomingLinks === 0)
      .map((l) => ({ url: l.page, title: l.title }));

    // Save to database
    await db.collection('seoLinks').updateOne(
      { type: 'analysis' },
      {
        $set: {
          links,
          orphanPages,
          analyzedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ links, orphanPages });
  } catch (error) {
    console.error('Error analyzing links:', error);
    return NextResponse.json(
      { error: 'Failed to analyze links' },
      { status: 500 }
    );
  }
}
