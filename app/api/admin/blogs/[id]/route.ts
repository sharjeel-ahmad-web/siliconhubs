import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// GET single blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const blog = await db
      .collection('blogs')
      .findOne({ _id: new ObjectId(params.id) });

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

// PUT update blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Generate slug from title if title changed
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate read time
    const wordCount = body.content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / 200);

    const updateData = {
      title: body.title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      thumbnail: body.thumbnail,
      coverImage: body.coverImage,
      author: body.author,
      category: body.category,
      tags: body.tags || [],
      featured: body.featured,
      published: body.published,
      readTime,
      updatedAt: new Date(),
    };

    // Set publishedAt if publishing for first time
    if (body.published && !body.publishedAt) {
      (updateData as any).publishedAt = new Date();
    }

    const result = await db
      .collection('blogs')
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...updateData });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const result = await db
      .collection('blogs')
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
