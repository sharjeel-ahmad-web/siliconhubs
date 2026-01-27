import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = 'rising-dot';

// PUT - Update code snippet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const { _id, createdAt, ...updateData } = body;

    await db.collection('code_snippets').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating code snippet:', error);
    return NextResponse.json(
      { error: 'Failed to update code snippet' },
      { status: 500 }
    );
  }
}

// DELETE - Delete code snippet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('code_snippets').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting code snippet:', error);
    return NextResponse.json(
      { error: 'Failed to delete code snippet' },
      { status: 500 }
    );
  }
}
