import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'rising-dot';

// GET - Fetch navigation settings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const navigation = await db
      .collection('settings')
      .findOne({ type: 'navigation' });

    return NextResponse.json(navigation?.data || null);
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}

// POST - Save navigation settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('settings').updateOne(
      { type: 'navigation' },
      {
        $set: {
          type: 'navigation',
          data: body,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving navigation:', error);
    return NextResponse.json(
      { error: 'Failed to save navigation' },
      { status: 500 }
    );
  }
}
