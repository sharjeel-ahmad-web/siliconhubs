import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// PUT - Update a redirect
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { source, destination, type, enabled } = body;

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const updateData: any = { updatedAt: new Date() };
    if (source !== undefined) updateData.source = source;
    if (destination !== undefined) updateData.destination = destination;
    if (type !== undefined) updateData.type = type;
    if (enabled !== undefined) updateData.enabled = enabled;

    const result = await db
      .collection('seoRedirects')
      .findOneAndUpdate(
        { _id: new ObjectId(params.id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

    if (!result) {
      return NextResponse.json(
        { error: 'Redirect not found' },
        { status: 404 }
      );
    }

    // Update config
    await updateRedirectsConfig(db);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating redirect:', error);
    return NextResponse.json(
      { error: 'Failed to update redirect' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a redirect
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const result = await db.collection('seoRedirects').deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Redirect not found' },
        { status: 404 }
      );
    }

    // Update config
    await updateRedirectsConfig(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting redirect:', error);
    return NextResponse.json(
      { error: 'Failed to delete redirect' },
      { status: 500 }
    );
  }
}

// Helper to update redirects config
async function updateRedirectsConfig(db: any) {
  try {
    const redirects = await db
      .collection('seoRedirects')
      .find({ enabled: true })
      .toArray();

    await db
      .collection('seoConfig')
      .updateOne(
        { type: 'redirects' },
        { $set: { data: redirects, updatedAt: new Date() } },
        { upsert: true }
      );
  } catch (error) {
    console.error('Error updating redirects config:', error);
  }
}
