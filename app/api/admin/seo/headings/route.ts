import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch heading analysis
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const headings = await db.collection('seoHeadings').find({}).toArray();
    return NextResponse.json(headings);
  } catch (error) {
    console.error('Error fetching headings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch headings' },
      { status: 500 }
    );
  }
}
