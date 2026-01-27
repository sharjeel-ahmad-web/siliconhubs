import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch all UTM links
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const utmLinks = await db
      .collection('seoUTM')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(utmLinks);
  } catch (error) {
    console.error('Error fetching UTM links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch UTM links' },
      { status: 500 }
    );
  }
}

// POST - Create UTM link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, source, medium, campaign, term, content, fullUrl } =
      body;

    if (!name || !source || !medium || !campaign) {
      return NextResponse.json(
        { error: 'Name, source, medium, and campaign are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const utmLink = {
      name,
      url,
      source,
      medium,
      campaign,
      term: term || '',
      content: content || '',
      fullUrl,
      clicks: 0,
      createdAt: now,
    };

    const result = await db.collection('seoUTM').insertOne(utmLink);
    return NextResponse.json(
      { _id: result.insertedId, ...utmLink },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating UTM link:', error);
    return NextResponse.json(
      { error: 'Failed to create UTM link' },
      { status: 500 }
    );
  }
}
