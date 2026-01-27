import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch all keywords
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const keywords = await db
      .collection('seoKeywords')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(keywords);
  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

// POST - Add keyword
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, page, searchVolume, difficulty } = body;

    if (!keyword) {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const keywordData = {
      keyword,
      page: page || '/',
      currentRank: null,
      previousRank: null,
      searchVolume: searchVolume || 0,
      difficulty: difficulty || 'medium',
      lastChecked: now.toISOString(),
      history: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('seoKeywords').insertOne(keywordData);
    return NextResponse.json(
      { _id: result.insertedId, ...keywordData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding keyword:', error);
    return NextResponse.json(
      { error: 'Failed to add keyword' },
      { status: 500 }
    );
  }
}
