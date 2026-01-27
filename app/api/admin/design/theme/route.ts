import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'rising-dot';

// GET - Fetch theme settings
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const theme = await db.collection('settings').findOne({ type: 'theme' });

    return NextResponse.json(theme?.data || null);
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    );
  }
}

// POST - Save theme settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('settings').updateOne(
      { type: 'theme' },
      {
        $set: {
          type: 'theme',
          data: body,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving theme:', error);
    return NextResponse.json(
      { error: 'Failed to save theme' },
      { status: 500 }
    );
  }
}
