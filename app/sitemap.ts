import { MetadataRoute } from 'next';
import clientPromise from '@/lib/db/mongodb';

// Static pages configuration
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
  { path: '/services/digital-marketing', priority: 0.8, changefreq: 'weekly' },
  { path: '/services/saas', priority: 0.8, changefreq: 'weekly' },
  { path: '/portfolio', priority: 0.7, changefreq: 'weekly' },
  { path: '/blog', priority: 0.7, changefreq: 'daily' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';
  const now = new Date();

  // Start with static pages
  const urls: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: now,
    changeFrequency: page.changefreq as
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never',
    priority: page.priority,
  }));

  // Try to fetch dynamic content from MongoDB
  try {
    const client = await clientPromise;
    const db = client.db('siliconhubs');

    // Add blog posts
    try {
      const blogs = await db
        .collection('blogs')
        .find({ published: true })
        .toArray();
      for (const blog of blogs) {
        urls.push({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: blog.updatedAt || blog.createdAt || now,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    } catch (error) {
      console.warn('Could not fetch blogs for sitemap:', error);
    }

    // Add portfolio projects
    try {
      const projects = await db
        .collection('projects')
        .find({ published: true })
        .toArray();
      for (const project of projects) {
        urls.push({
          url: `${baseUrl}/portfolio/${project.slug}`,
          lastModified: project.updatedAt || project.createdAt || now,
          changeFrequency: 'monthly',
          priority: 0.5,
        });
      }
    } catch (error) {
      console.warn('Could not fetch projects for sitemap:', error);
    }
  } catch (error) {
    // If MongoDB is not available, just return static pages
    console.warn(
      'MongoDB not available for sitemap generation, using static pages only'
    );
  }

  return urls;
}
