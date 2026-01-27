import { NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { siteUrl } = body;

    if (!siteUrl) {
      return NextResponse.json(
        { error: 'Site URL is required' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Upsert the settings
    await db.collection(COLLECTIONS.SETTINGS).updateOne(
      { key: 'search_console' },
      {
        $set: {
          key: 'search_console',
          value: { siteUrl },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, siteUrl });
  } catch (error) {
    console.error('Failed to save Search Console settings:', error);
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
      .findOne({ key: 'search_console' });

    return NextResponse.json({
      siteUrl: settings?.value?.siteUrl || null,
    });
  } catch (error) {
    console.error('Failed to get Search Console settings:', error);
    return NextResponse.json(
      { error: 'Failed to get settings' },
      { status: 500 }
    );
  }
}
