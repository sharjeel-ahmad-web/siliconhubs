import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

const DEFAULT_PORTFOLIO_CONTENT: Record<string, unknown> = {
  hero: {
    eyebrow: 'Our Work',
    title: 'Our Creative',
    titleHighlight: 'Portfolio',
    subtitle:
      'Explore our work across web design, e-commerce, automation, chatbots, and SEO. Each project showcases our commitment to excellence and innovation.',
    ctaLabel: 'Start Your Project',
    ctaHref: '/contact',
    heroItems: [
      {
        id: 1,
        title: 'E-Commerce',
        imageUrl: '/media/portfolio/hero/ecommerce.jpg',
      },
      {
        id: 2,
        title: 'Web Design',
        imageUrl: '/media/portfolio/hero/web-design.png',
      },
      {
        id: 3,
        title: 'AI Chatbots',
        imageUrl: '/media/portfolio/hero/ai-chatbots.jpg',
      },
      {
        id: 4,
        title: 'Automation',
        imageUrl: '/media/portfolio/hero/automation.jpg',
      },
      { id: 5, title: 'SEO', imageUrl: '/media/portfolio/hero/seo.jpg' },
    ],
  },
  filters: {
    eyebrow: 'Our Expertise',
    title: 'Skills &',
    titleHighlight: 'Technologies',
    subtitle:
      'Drag and explore the technologies we master to bring your vision to life',
    tags: [
      'All',
      'Web Design',
      'Shopify',
      'WordPress',
      'SEO',
      'Chatbot Development',
      'N8N Automations',
      'React',
      'Next.js',
      'Tailwind',
      'TypeScript',
      'Figma',
      'Stripe',
      'OpenAI',
      'Analytics',
      'SaaS',
      'AI/ML',
    ],
  },
  grid: {
    eyebrow: 'Our Work',
    title: 'All',
    titleHighlight: 'Projects',
    subtitle: 'Explore our complete collection of successful client projects',
  },
  caseStudies: {
    eyebrow: 'Case Studies',
    title: 'Success',
    titleHighlight: 'Stories',
    subtitle:
      'Deep dives into our most impactful projects and the results we achieved',
    studies: [
      {
        img: '/media/portfolio/case-studies/enterprise-platform.jpg',
        title: 'Enterprise Platform',
        desc: 'Built a scalable enterprise platform handling 1M+ daily transactions.',
        sliderName: 'enterprise',
      },
      {
        img: '/media/portfolio/case-studies/mobile-app.jpg',
        title: 'Mobile App Launch',
        desc: 'Launched a mobile app achieving 100K+ downloads in the first month.',
        sliderName: 'mobile',
      },
      {
        img: '/media/portfolio/case-studies/ai-integration.jpg',
        title: 'AI Integration',
        desc: 'Integrated AI-powered features reducing manual processing time by 85%.',
        sliderName: 'ai',
      },
      {
        img: '/media/portfolio/case-studies/digital-transformation.jpg',
        title: 'Digital Transformation',
        desc: 'Led complete digital transformation with 200% increase in engagement.',
        sliderName: 'digital',
      },
    ],
  },
  cta: {
    eyebrow: 'Ready to Start?',
    title: "Let's Work",
    titleHighlight: 'Together',
    subtitle: 'Have a project in mind? We would love to hear from you.',
    ctaText: 'Get in Touch',
    ctaLink: '/contact',
  },
};

/**
 * GET /api/content/portfolio
 * Returns all portfolio page content from MongoDB (siteContent, page: 'portfolio')
 * or default fallback. Compatible with useSiteContent('portfolio', section).
 */
export async function GET() {
  try {
    const db = await connectDB();
    const content = await db
      .collection('siteContent')
      .find({ page: 'portfolio' })
      .toArray();

    const payload: Record<string, unknown> = { ...DEFAULT_PORTFOLIO_CONTENT };

    for (const doc of content ?? []) {
      const section = doc?.section;
      if (
        section &&
        typeof section === 'string' &&
        doc?.content &&
        typeof doc.content === 'object'
      ) {
        payload[section] = {
          ...((payload[section] as object) || {}),
          ...doc.content,
        };
      }
    }

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('[api/content/portfolio GET]', error);
    return NextResponse.json(DEFAULT_PORTFOLIO_CONTENT);
  }
}
