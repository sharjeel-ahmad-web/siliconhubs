import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

// Default navigation structure with new social format
const defaultNavigation = {
  header: {
    logo: '/logo.png',
    ctaButton: {
      label: 'Get Started',
      href: '/contact',
      enabled: true,
    },
    navLinks: [
      { href: '/', label: 'Home', enabled: true, order: 0 },
      {
        href: '/services',
        label: 'Services',
        enabled: true,
        hasDropdown: true,
        order: 1,
      },
      { href: '/portfolio', label: 'Portfolio', enabled: true, order: 2 },
      { href: '/blog', label: 'Blog', enabled: true, order: 3 },
      { href: '/about', label: 'About', enabled: true, order: 4 },
      { href: '/contact', label: 'Contact', enabled: true, order: 5 },
    ],
    serviceLinks: [
      {
        href: '/services/n8n-automations',
        label: 'N8N Automations',
        enabled: true,
        order: 0,
      },
      {
        href: '/services/chatbot-development',
        label: 'Chatbot Development',
        enabled: true,
        order: 1,
      },
      {
        href: '/services/web-design',
        label: 'Web Design',
        enabled: true,
        order: 2,
      },
      {
        href: '/services/wordpress',
        label: 'WordPress',
        enabled: true,
        order: 3,
      },
      { href: '/services/shopify', label: 'Shopify', enabled: true, order: 4 },
      { href: '/services/seo', label: 'SEO', enabled: true, order: 5 },
      {
        href: '/services/saas',
        label: 'SaaS Solutions',
        enabled: true,
        order: 6,
      },
    ],
  },
  footer: {
    logo: '/logo.png',
    description:
      'Premium digital solutions that transform your business through innovative technology and stunning design.',
    copyrightText: '© {year} Silicon Hubs. All rights reserved.',
    showNewsletter: true,
    columns: [
      {
        title: 'Services',
        links: [
          {
            href: '/services/n8n-automations',
            label: 'N8N Automations',
            enabled: true,
          },
          {
            href: '/services/chatbot-development',
            label: 'Chatbot Development',
            enabled: true,
          },
          { href: '/services/web-design', label: 'Web Design', enabled: true },
          { href: '/services/wordpress', label: 'WordPress', enabled: true },
          { href: '/services/shopify', label: 'Shopify', enabled: true },
          { href: '/services/seo', label: 'SEO', enabled: true },
        ],
      },
      {
        title: 'Company',
        links: [
          { href: '/about', label: 'About Us', enabled: true },
          { href: '/portfolio', label: 'Portfolio', enabled: true },
          { href: '/contact', label: 'Contact', enabled: true },
        ],
      },
    ],
  },
  social: {
    facebook: { url: '', enabled: true },
    instagram: { url: '', enabled: true },
    twitter: { url: '', enabled: true },
    tiktok: { url: '', enabled: true },
    youtube: { url: '', enabled: true },
    linkedin: { url: '', enabled: true },
    telegram: { url: '', enabled: true },
    discord: { url: '', enabled: true },
    pinterest: { url: '', enabled: true },
    github: { url: '', enabled: true },
  },
};

// GET - Fetch navigation settings (always returns 200; uses defaults if DB unavailable)
export async function GET() {
  try {
    const db = await connectDB();
    const navigation = await db
      .collection('settings')
      .findOne({ type: 'navigation' });

    const data = navigation?.data ?? {};
    const merged = {
      ...defaultNavigation,
      ...(typeof data === 'object' && data !== null ? data : {}),
      header: { ...defaultNavigation.header, ...(data?.header ?? {}) },
      footer: { ...defaultNavigation.footer, ...(data?.footer ?? {}) },
      social: { ...defaultNavigation.social, ...(data?.social ?? {}) },
    };

    return NextResponse.json(merged);
  } catch (error) {
    console.error('[api/admin/navigation GET]', error);
    return NextResponse.json(defaultNavigation);
  }
}

// POST - Save navigation settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await connectDB();

    await db.collection('settings').updateOne(
      { type: 'navigation' },
      {
        $set: {
          type: 'navigation',
          data: body,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/admin/navigation POST]', error);
    return NextResponse.json(
      { error: 'Failed to save navigation' },
      { status: 500 }
    );
  }
}
