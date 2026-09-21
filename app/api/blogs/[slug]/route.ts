import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// GET single blog post by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('siliconhubs');

    const blog = await db
      .collection('blogs')
      .findOne({ slug: params.slug, published: { $in: [true, 'true'] } });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}
