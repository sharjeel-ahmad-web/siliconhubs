import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { SiteContent } from '@/lib/db/models';

// POST - Update content in MongoDB
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, section, content } = body;

    if (!page || !section) {
      return NextResponse.json(
        { error: 'Page and section are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();

    // Upsert content in MongoDB
    const result = await db.collection<SiteContent>('siteContent').updateOne(
      { page, section },
      {
        $set: {
          content,
          updatedAt: now,
        },
        $setOnInsert: {
          page,
          section,
          visible: true,
          createdAt: now,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully',
      modified: result.modifiedCount > 0,
      upserted: result.upsertedCount > 0,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}
