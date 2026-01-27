import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch all images
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const images = await db.collection('seoImages').find({}).toArray();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// PUT - Update alt tags
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'Updates array is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    for (const update of updates) {
      await db.collection('seoImages').updateOne(
        { src: update.src },
        {
          $set: {
            alt: update.alt,
            hasAlt: update.alt.trim().length > 0,
            updatedAt: now,
          },
        }
      );
    }

    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error) {
    console.error('Error updating alt tags:', error);
    return NextResponse.json(
      { error: 'Failed to update alt tags' },
      { status: 500 }
    );
  }
}
