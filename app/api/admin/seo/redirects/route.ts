import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch all redirects
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const redirects = await db
      .collection('seoRedirects')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(redirects);
  } catch (error) {
    console.error('Error fetching redirects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch redirects' },
      { status: 500 }
    );
  }
}

// POST - Create a new redirect
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, destination, type, enabled } = body;

    if (!source || !destination) {
      return NextResponse.json(
        { error: 'Source and destination are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Check for duplicate source
    const existing = await db.collection('seoRedirects').findOne({ source });
    if (existing) {
      return NextResponse.json(
        { error: 'A redirect with this source already exists' },
        { status: 409 }
      );
    }

    const now = new Date();
    const redirect = {
      source,
      destination,
      type: type || 301,
      enabled: enabled !== false,
      hits: 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('seoRedirects').insertOne(redirect);

    // Update Next.js redirects config (would need to regenerate)
    await updateRedirectsConfig(db);

    return NextResponse.json(
      { _id: result.insertedId, ...redirect },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating redirect:', error);
    return NextResponse.json(
      { error: 'Failed to create redirect' },
      { status: 500 }
    );
  }
}

// Helper to update redirects config file
async function updateRedirectsConfig(db: any) {
  try {
    const redirects = await db
      .collection('seoRedirects')
      .find({ enabled: true })
      .toArray();

    // Store in a config collection for middleware to use
    await db
      .collection('seoConfig')
      .updateOne(
        { type: 'redirects' },
        { $set: { data: redirects, updatedAt: new Date() } },
        { upsert: true }
      );
  } catch (error) {
    console.error('Error updating redirects config:', error);
  }
}
