import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

// GET published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');

    const query: Record<string, unknown> = { published: true };
    if (featured === 'true') {
      query.featured = true;
    }
    if (category) {
      query.category = category;
    }

    let cursor = db.collection('blogs').find(query).sort({ publishedAt: -1 });
    const limitNum = limit ? parseInt(limit, 10) : 0;
    if (Number.isFinite(limitNum) && limitNum > 0) {
      cursor = cursor.limit(limitNum);
    }

    const blogs = await cursor.toArray();
    return NextResponse.json(Array.isArray(blogs) ? blogs : []);
  } catch (error) {
    console.error('[api/blogs GET]', error);
    return NextResponse.json([]);
  }
}
