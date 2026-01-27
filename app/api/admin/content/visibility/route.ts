import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// POST - Toggle section visibility
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, section, visible } = body;

    if (!page || !section) {
      return NextResponse.json(
        { error: 'Page and section are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Find existing content for this page/section
    const existing = await db
      .collection('siteContent')
      .findOne({ page, section });

    if (existing) {
      // Update existing content visibility
      const result = await db
        .collection('siteContent')
        .findOneAndUpdate(
          { _id: existing._id },
          { $set: { visible, updatedAt: new Date() } },
          { returnDocument: 'after' }
        );
      return NextResponse.json(result);
    } else {
      // Create new content entry with visibility setting
      const now = new Date();
      const newContent = {
        page,
        section,
        content: {},
        visible,
        createdAt: now,
        updatedAt: now,
      };
      const result = await db.collection('siteContent').insertOne(newContent);
      return NextResponse.json(
        { _id: result.insertedId, ...newContent },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error toggling visibility:', error);
    return NextResponse.json(
      { error: 'Failed to toggle visibility' },
      { status: 500 }
    );
  }
}
