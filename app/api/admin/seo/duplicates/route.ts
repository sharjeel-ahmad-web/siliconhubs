import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch duplicate content
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const duplicates = await db.collection('seoDuplicates').find({}).toArray();
    return NextResponse.json(duplicates);
  } catch (error) {
    console.error('Error fetching duplicates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch duplicates' },
      { status: 500 }
    );
  }
}
