import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch hreflang entries
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const entries = await db.collection('seoHreflang').find({}).toArray();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching hreflang:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hreflang' },
      { status: 500 }
    );
  }
}

// POST - Save hreflang entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, languages, xDefault } = body;

    if (!page) {
      return NextResponse.json({ error: 'Page is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const result = await db.collection('seoHreflang').findOneAndUpdate(
      { page },
      {
        $set: {
          languages: languages || [],
          xDefault: xDefault || '',
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving hreflang:', error);
    return NextResponse.json(
      { error: 'Failed to save hreflang' },
      { status: 500 }
    );
  }
}
