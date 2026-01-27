import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch all meta tags
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const metaTags = await db.collection('seoMeta').find({}).toArray();
    return NextResponse.json(metaTags);
  } catch (error) {
    console.error('Error fetching meta tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meta tags' },
      { status: 500 }
    );
  }
}

// POST - Create or update meta tags for a page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      path,
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      canonicalUrl,
      noIndex,
      noFollow,
    } = body;

    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const metaData = {
      path,
      title: title || '',
      description: description || '',
      keywords: keywords || '',
      ogTitle: ogTitle || '',
      ogDescription: ogDescription || '',
      ogImage: ogImage || '',
      twitterCard: twitterCard || 'summary_large_image',
      canonicalUrl: canonicalUrl || '',
      noIndex: noIndex || false,
      noFollow: noFollow || false,
      updatedAt: now,
    };

    const result = await db
      .collection('seoMeta')
      .findOneAndUpdate(
        { path },
        { $set: metaData, $setOnInsert: { createdAt: now } },
        { upsert: true, returnDocument: 'after' }
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving meta tags:', error);
    return NextResponse.json(
      { error: 'Failed to save meta tags' },
      { status: 500 }
    );
  }
}
