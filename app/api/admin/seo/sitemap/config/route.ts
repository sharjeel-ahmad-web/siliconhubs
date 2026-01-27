import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// POST - Save sitemap config
export async function POST(request: NextRequest) {
  try {
    const config = await request.json();

    const client = await clientPromise;
    const db = client.db('rising-dot');

    await db
      .collection('seoConfig')
      .updateOne(
        { type: 'sitemap' },
        { $set: { data: config, updatedAt: new Date() } },
        { upsert: true }
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving sitemap config:', error);
    return NextResponse.json(
      { error: 'Failed to save config' },
      { status: 500 }
    );
  }
}
