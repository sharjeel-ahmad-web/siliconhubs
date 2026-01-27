import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// PUT - Mark broken link as fixed
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fixed } = body;

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const result = await db
      .collection('seoBrokenLinks')
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: { fixed, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json(
        { error: 'Broken link not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating broken link:', error);
    return NextResponse.json(
      { error: 'Failed to update broken link' },
      { status: 500 }
    );
  }
}
