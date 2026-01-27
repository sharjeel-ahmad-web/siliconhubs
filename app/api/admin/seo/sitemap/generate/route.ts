import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

// Static pages to include
const staticPages = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/about', priority: 0.8, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'weekly' },
  {
    path: '/services/chatbot-development',
    priority: 0.8,
    changefreq: 'weekly',
  },
  { path: '/services/n8n-automations', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/web-design', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/wordpress', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/shopify', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/seo', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/saas', priority: 0.8, changefreq: 'weekly' },
  { path: '/portfolio', priority: 0.7, changefreq: 'weekly' },
  { path: '/blog', priority: 0.7, changefreq: 'daily' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
];

// POST - Generate sitemap
export async function POST(request: NextRequest) {
  try {
    const config = await request.json();
    const { excludePatterns = [], customUrls = [] } = config;

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://risingdot.agency';
    const now = new Date().toISOString();

    // Collect all URLs
    const urls: Array<{
      loc: string;
      lastmod: string;
      changefreq: string;
      priority: number;
    }> = [];

    // Add static pages
    for (const page of staticPages) {
      const isExcluded = excludePatterns.some((pattern: string) => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(page.path);
      });

      if (!isExcluded) {
        urls.push({
          loc: `${baseUrl}${page.path}`,
          lastmod: now,
          changefreq: page.changefreq,
          priority: page.priority,
        });
      }
    }

    // Add blog posts
    const blogs = await db
      .collection('blogs')
      .find({ published: true })
      .toArray();
    for (const blog of blogs) {
      urls.push({
        loc: `${baseUrl}/blog/${blog.slug}`,
        lastmod: blog.updatedAt?.toISOString() || now,
        changefreq: 'weekly',
        priority: 0.6,
      });
    }

    // Add portfolio projects
    const projects = await db
      .collection('projects')
      .find({ published: true })
      .toArray();
    for (const project of projects) {
      urls.push({
        loc: `${baseUrl}/portfolio/${project.slug}`,
        lastmod: project.updatedAt?.toISOString() || now,
        changefreq: 'monthly',
        priority: 0.5,
      });
    }

    // Add custom URLs
    for (const custom of customUrls) {
      urls.push({
        loc: custom.url.startsWith('http')
          ? custom.url
          : `${baseUrl}${custom.url}`,
        lastmod: now,
        changefreq: custom.changefreq,
        priority: custom.priority,
      });
    }

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    // Save to public folder
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    await writeFile(sitemapPath, xml, 'utf-8');

    // Save URLs to database for display
    await db
      .collection('seoSitemap')
      .updateOne(
        { type: 'urls' },
        { $set: { urls, updatedAt: new Date() } },
        { upsert: true }
      );

    // Update config with last generated time
    await db
      .collection('seoConfig')
      .updateOne(
        { type: 'sitemap' },
        { $set: { 'data.lastGenerated': now } },
        { upsert: true }
      );

    return NextResponse.json({ success: true, urlCount: urls.length });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
}
