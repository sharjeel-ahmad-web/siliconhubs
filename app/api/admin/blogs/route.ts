import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { BlogPost } from '@/lib/db/models';

// GET all blog posts
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const blogs = await db
      .collection('blogs')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate read time (approx 200 words per minute)
    const wordCount = body.content?.split(/\s+/).length || 0;
    const readTime = Math.ceil(wordCount / 200);

    const blogPost: Omit<BlogPost, '_id'> = {
      title: body.title,
      slug,
      excerpt: body.excerpt || '',
      content: body.content || '',
      thumbnail: body.thumbnail || '/media/blog/default-thumbnail.jpg',
      coverImage: body.coverImage || '',
      author: body.author || 'Rising Dot Team',
      category: body.category || 'General',
      tags: body.tags || [],
      featured: body.featured || false,
      published: body.published || false,
      publishedAt: body.published ? new Date() : undefined,
      readTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('blogs').insertOne(blogPost);

    return NextResponse.json(
      { ...blogPost, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
