import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch enabled redirects for middleware
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const redirects = await db
      .collection('seoRedirects')
      .find({ enabled: true })
      .project({ source: 1, destination: 1, type: 1, _id: 0 })
      .toArray();

    // Also increment hit counter would be done here in production

    // Cache for 5 minutes to reduce database load
    return NextResponse.json(redirects, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return NextResponse.json([]);
  }
}
