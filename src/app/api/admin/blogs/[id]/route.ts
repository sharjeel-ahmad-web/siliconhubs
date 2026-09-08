import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

const DB_NAME = 'silicon-hubs';
const COLLECTION = 'blogs';

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function calculateReadTime(content = '') {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getObjectId(id: string) {
  if (!ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}

/* =========================================================
   GET SINGLE BLOG
========================================================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const objectId = getObjectId(id);

    if (!objectId) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const blog = await db.collection(COLLECTION).findOne({
      _id: objectId,
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('[BLOG_GET_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

/* =========================================================
   UPDATE BLOG
========================================================= */

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const objectId = getObjectId(id);

    if (!objectId) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Blog title is required' },
        { status: 400 }
      );
    }

    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: 'Blog content is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const existingBlog = await db
      .collection(COLLECTION)
      .findOne({ _id: objectId });

    if (!existingBlog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const now = new Date();

    const updateData: Record<string, any> = {
      title: body.title.trim(),
      slug: createSlug(body.title),
      excerpt: body.excerpt?.trim() || '',
      content: body.content,
      thumbnail: body.thumbnail || '',
      coverImage: body.coverImage || '',
      author: body.author || 'Silicon Hubs',
      category: body.category || 'Technology',
      tags: Array.isArray(body.tags) ? body.tags : [],
      featured: Boolean(body.featured),
      published: Boolean(body.published),
      readTime: calculateReadTime(body.content),
      updatedAt: now,
    };

    /*
      Only create publishedAt when:
      - blog is being published
      - AND it wasn't published before
    */

    if (body.published && !existingBlog.published) {
      updateData.publishedAt = now;
    }

    /*
      If the blog is unpublished, don't destroy
      the original publishedAt date.
    */

    const result = await db
      .collection(COLLECTION)
      .updateOne({ _id: objectId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const updatedBlog = await db
      .collection(COLLECTION)
      .findOne({ _id: objectId });

    return NextResponse.json({
      success: true,
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('[BLOG_UPDATE_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE BLOG
========================================================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const objectId = getObjectId(id);

    if (!objectId) {
      return NextResponse.json({ error: 'Invalid blog ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION).deleteOne({
      _id: objectId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('[BLOG_DELETE_ERROR]', error);

    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
