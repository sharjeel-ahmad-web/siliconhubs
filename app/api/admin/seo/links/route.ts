import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch link analysis data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const linkData = await db
      .collection('seoLinks')
      .findOne({ type: 'analysis' });

    return NextResponse.json({
      links: linkData?.links || [],
      orphanPages: linkData?.orphanPages || [],
    });
  } catch (error) {
    console.error('Error fetching link data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link data' },
      { status: 500 }
    );
  }
}
