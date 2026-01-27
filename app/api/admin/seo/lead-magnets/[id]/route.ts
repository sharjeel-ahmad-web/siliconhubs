import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// PUT - Update lead magnet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const updateData: any = { updatedAt: new Date() };
    const allowedFields = [
      'title',
      'description',
      'type',
      'fileUrl',
      'thumbnailUrl',
      'landingPage',
      'enabled',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const result = await db
      .collection('seoLeadMagnets')
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json(
        { error: 'Lead magnet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating lead magnet:', error);
    return NextResponse.json(
      { error: 'Failed to update lead magnet' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lead magnet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const result = await db.collection('seoLeadMagnets').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Lead magnet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead magnet:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead magnet' },
      { status: 500 }
    );
  }
}
