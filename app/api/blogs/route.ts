import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

// GET published blog posts (public)
export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');
    const category = searchParams.get('category');

    const query: Record<string, unknown> = {
      published: { $in: [true, 'true'] },
    };
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
    const serializedBlogs = blogs.map((blog: any) => ({
      ...blog,
      _id: blog._id?.toString?.() || String(blog._id),
      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt).toISOString()
        : undefined,
      createdAt: blog.createdAt
        ? new Date(blog.createdAt).toISOString()
        : undefined,
      updatedAt: blog.updatedAt
        ? new Date(blog.updatedAt).toISOString()
        : undefined,
    }));

    return NextResponse.json(serializedBlogs, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[api/blogs GET]', error);
    return NextResponse.json([]);
  }
}
