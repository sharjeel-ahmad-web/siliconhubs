import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// PUT - Update keyword rank
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { currentRank } = body;

    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Get current keyword to save history
    const existing = await db.collection('seoKeywords').findOne({
      _id: new ObjectId(params.id),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Keyword not found' }, { status: 404 });
    }

    const now = new Date();
    const history = existing.history || [];

    // Add current rank to history if it changed
    if (existing.currentRank !== null && existing.currentRank !== currentRank) {
      history.push({
        date: now.toISOString(),
        rank: existing.currentRank,
      });
    }

    const result = await db.collection('seoKeywords').findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          previousRank: existing.currentRank,
          currentRank,
          lastChecked: now.toISOString(),
          history: history.slice(-30), // Keep last 30 entries
          updatedAt: now,
        },
      },
      { returnDocument: 'after' }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating keyword:', error);
    return NextResponse.json(
      { error: 'Failed to update keyword' },
      { status: 500 }
    );
  }
}

// DELETE - Delete keyword
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const result = await db.collection('seoKeywords').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Keyword not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}
