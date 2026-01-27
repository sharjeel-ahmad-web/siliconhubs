import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch sitemap data and config
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Get sitemap config
    const config = await db
      .collection('seoConfig')
      .findOne({ type: 'sitemap' });

    // Get cached URLs
    const urlsDoc = await db.collection('seoSitemap').findOne({ type: 'urls' });

    return NextResponse.json({
      config: config?.data || {
        autoGenerate: true,
        includeImages: true,
        excludePatterns: ['/admin/*', '/api/*'],
        customUrls: [],
        lastGenerated: null,
      },
      urls: urlsDoc?.urls || [],
    });
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sitemap data' },
      { status: 500 }
    );
  }
}
