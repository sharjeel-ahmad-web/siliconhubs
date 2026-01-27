import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'rising-dot';

// GET - Fetch all code snippets
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const snippets = await db
      .collection('code_snippets')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(snippets);
  } catch (error) {
    console.error('Error fetching code snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch code snippets' },
      { status: 500 }
    );
  }
}

// POST - Create new code snippet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const snippet = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('code_snippets').insertOne(snippet);

    return NextResponse.json({ ...snippet, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating code snippet:', error);
    return NextResponse.json(
      { error: 'Failed to create code snippet' },
      { status: 500 }
    );
  }
}
