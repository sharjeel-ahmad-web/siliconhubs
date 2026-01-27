import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch all lead magnets
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const magnets = await db
      .collection('seoLeadMagnets')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(magnets);
  } catch (error) {
    console.error('Error fetching lead magnets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead magnets' },
      { status: 500 }
    );
  }
}

// POST - Create lead magnet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      fileUrl,
      thumbnailUrl,
      landingPage,
      enabled,
    } = body;

    if (!title || !fileUrl) {
      return NextResponse.json(
        { error: 'Title and file URL are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const magnet = {
      title,
      description: description || '',
      type: type || 'other',
      fileUrl,
      thumbnailUrl: thumbnailUrl || '',
      landingPage: landingPage || '',
      downloads: 0,
      conversions: 0,
      enabled: enabled !== false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('seoLeadMagnets').insertOne(magnet);
    return NextResponse.json(
      { _id: result.insertedId, ...magnet },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead magnet:', error);
    return NextResponse.json(
      { error: 'Failed to create lead magnet' },
      { status: 500 }
    );
  }
}
