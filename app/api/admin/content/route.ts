import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { SiteContent } from '@/lib/db/models';

// GET - Fetch all site content or filter by page
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const query: Record<string, string> = {};
    if (page) query.page = page;
    if (section) query.section = section;

    const content = await db
      .collection<SiteContent>('siteContent')
      .find(query)
      .toArray();

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Create new content section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, section, content, visible = true } = body;

    if (!page || !section) {
      return NextResponse.json(
        { error: 'Page and section are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const newContent: Omit<SiteContent, '_id'> = {
      page,
      section,
      content: content || {},
      visible,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('siteContent').insertOne(newContent);

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...newContent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}
