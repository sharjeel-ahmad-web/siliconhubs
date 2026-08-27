import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Upsert the settings
    await db.collection(COLLECTIONS.SETTINGS).updateOne(
      { key: 'google_analytics' },
      {
        $set: {
          key: 'google_analytics',
          value: { propertyId },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, propertyId });
  } catch (error) {
    console.error('Failed to save GA settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db
      .collection(COLLECTIONS.SETTINGS)
      .findOne({ key: 'google_analytics' });

    return NextResponse.json({
      propertyId: settings?.value?.propertyId || null,
    });
  } catch (error) {
    console.error('Failed to get GA settings:', error);
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}
