import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch readability results
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const results = await db.collection('seoReadability').find({}).toArray();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching readability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch readability' },
      { status: 500 }
    );
  }
}
