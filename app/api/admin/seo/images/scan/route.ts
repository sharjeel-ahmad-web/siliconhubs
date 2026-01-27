import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Simulated images found on site
const siteImages = [
  { src: '/images/hero-bg.jpg', page: '/', alt: 'Hero background' },
  { src: '/images/about-team.jpg', page: '/about', alt: 'Our team' },
  { src: '/images/service-chatbot.png', page: '/services', alt: '' },
  { src: '/images/service-web.png', page: '/services', alt: 'Web development' },
  { src: '/images/portfolio-1.jpg', page: '/portfolio', alt: '' },
  {
    src: '/images/portfolio-2.jpg',
    page: '/portfolio',
    alt: 'E-commerce project',
  },
  { src: '/images/portfolio-3.jpg', page: '/portfolio', alt: '' },
  {
    src: '/images/blog-thumb-1.jpg',
    page: '/blog',
    alt: 'Blog post thumbnail',
  },
  { src: '/images/blog-thumb-2.jpg', page: '/blog', alt: '' },
  {
    src: '/images/contact-map.png',
    page: '/contact',
    alt: 'Office location map',
  },
  { src: '/logo.png', page: '/', alt: 'Rising Dot Agency logo' },
  { src: '/og-image.jpg', page: '/', alt: '' },
];

// POST - Scan site for images
export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const images = siteImages.map((img) => ({
      ...img,
      hasAlt: img.alt.trim().length > 0,
      scannedAt: now,
    }));

    // Clear and insert new scan results
    await db.collection('seoImages').deleteMany({});
    await db.collection('seoImages').insertMany(images);

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error scanning images:', error);
    return NextResponse.json(
      { error: 'Failed to scan images' },
      { status: 500 }
    );
  }
}
