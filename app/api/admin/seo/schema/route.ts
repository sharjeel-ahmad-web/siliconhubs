import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch all schema markups
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const schemas = await db.collection('seoSchema').find({}).toArray();
    return NextResponse.json(schemas);
  } catch (error) {
    console.error('Error fetching schemas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schemas' },
      { status: 500 }
    );
  }
}

// POST - Create schema markup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, type, data, enabled } = body;

    if (!path || !type || !data) {
      return NextResponse.json(
        { error: 'Path, type, and data are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const schema = {
      path,
      type,
      data,
      enabled: enabled !== false,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('seoSchema').insertOne(schema);
    return NextResponse.json(
      { _id: result.insertedId, ...schema },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating schema:', error);
    return NextResponse.json(
      { error: 'Failed to create schema' },
      { status: 500 }
    );
  }
}
