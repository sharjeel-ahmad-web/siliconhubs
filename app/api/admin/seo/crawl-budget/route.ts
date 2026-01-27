import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch crawl budget data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const data = await db
      .collection('seoCrawlBudget')
      .findOne({ type: 'data' });

    return NextResponse.json({
      pages: data?.pages || [],
      stats: data?.stats || null,
    });
  } catch (error) {
    console.error('Error fetching crawl budget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crawl budget' },
      { status: 500 }
    );
  }
}
