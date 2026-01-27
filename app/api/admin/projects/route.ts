import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { Project } from '@/lib/db/models';

// GET - List all projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.PROJECTS);

    const total = await collection.countDocuments();
    const projects = await collection
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      projects,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      client,
      description,
      thumbnail,
      images,
      tags,
      metrics,
      featured,
      published,
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const db = await getDatabase();

    const project: Omit<Project, '_id'> = {
      title,
      slug,
      client: client || '',
      description: description || '',
      thumbnail: thumbnail || '',
      images: images || [],
      tags: tags || [],
      metrics: metrics || [],
      featured: featured || false,
      published: published || false,
      publishedAt: published ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTIONS.PROJECTS).insertOne(project);

    return NextResponse.json(
      { project: { ...project, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
