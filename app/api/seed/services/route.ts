import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const initialServices = [
  {
    name: 'N8N Automations',
    slug: 'n8n-automations',
    icon: '⚡',
    shortDescription: 'Workflow automation',
    description:
      'Streamline your business workflows with powerful N8N automation solutions. We build custom integrations that connect your apps, automate repetitive tasks, and save you countless hours every week.',
    features: [
      'Workflow Design',
      'API Integration',
      'Process Automation',
      'Custom Triggers',
    ],
    order: 1,
  },
  {
    name: 'Chatbot Development',
    slug: 'chatbot-development',
    icon: '🤖',
    shortDescription: 'AI-powered conversations',
    description:
      'Engage your customers 24/7 with intelligent AI-powered chatbots. From customer support to lead generation, our chatbots deliver personalized experiences that convert visitors into customers.',
    features: [
      'Natural Language Processing',
      'AI Training',
      'Multi-Platform',
      '24/7 Support',
    ],
    order: 2,
  },
  {
    name: 'Web Design',
    slug: 'web-design',
    icon: '🎨',
    shortDescription: 'Beautiful interfaces',
    description:
      'Create stunning, high-performance websites that captivate your audience. We specialize in modern web technologies to deliver fast, responsive, and SEO-optimized digital experiences.',
    features: [
      'UI/UX Design',
      'Responsive Design',
      'Brand Identity',
      'Performance Optimization',
    ],
    order: 3,
  },
  {
    name: 'WordPress Development',
    slug: 'wordpress',
    icon: '📝',
    shortDescription: 'Content management',
    description:
      'Build powerful, flexible websites with WordPress. Whether you need a blog, business site, or custom web application, we create WordPress solutions tailored to your unique needs.',
    features: [
      'Custom Themes',
      'Plugin Development',
      'Performance',
      'Security',
    ],
    order: 4,
  },
  {
    name: 'Shopify Solutions',
    slug: 'shopify',
    icon: '🛒',
    shortDescription: 'E-commerce solutions',
    description:
      'Launch and scale your e-commerce business with custom Shopify stores. From theme customization to app integrations, we build online stores that drive sales and delight customers.',
    features: [
      'Store Setup',
      'Custom Apps',
      'Conversion Optimization',
      'Payment Integration',
    ],
    order: 5,
  },
  {
    name: 'SEO Optimization',
    slug: 'seo',
    icon: '📈',
    shortDescription: 'Search optimization',
    description:
      'Dominate search rankings and drive organic traffic to your website. Our data-driven SEO strategies help you reach your target audience and grow your online presence sustainably.',
    features: [
      'Keyword Research',
      'Technical SEO',
      'Content Strategy',
      'Analytics',
    ],
    order: 6,
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');
    const collection = db.collection('services');

    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Services already seeded',
        count: existingCount,
      });
    }

    const now = new Date();
    const servicesWithTimestamps = initialServices.map((service) => ({
      ...service,
      published: true,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await collection.insertMany(servicesWithTimestamps);

    return NextResponse.json({
      message: 'Services seeded successfully',
      count: result.insertedCount,
    });
  } catch (error) {
    console.error('Error seeding services:', error);
    return NextResponse.json(
      { error: 'Failed to seed services' },
      { status: 500 }
    );
  }
}
