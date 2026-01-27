import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch broken links
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const brokenLinks = await db
      .collection('seoBrokenLinks')
      .find({})
      .sort({ lastChecked: -1 })
      .toArray();

    return NextResponse.json(brokenLinks);
  } catch (error) {
    console.error('Error fetching broken links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch broken links' },
      { status: 500 }
    );
  }
}
