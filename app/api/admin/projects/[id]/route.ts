import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';

// GET - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const project = await db.collection(COLLECTIONS.PROJECTS).findOne({
      _id: new ObjectId(params.id),
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const db = await getDatabase();

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (client !== undefined) updateData.client = client;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (images !== undefined) updateData.images = images;
    if (tags !== undefined) updateData.tags = tags;
    if (metrics !== undefined) updateData.metrics = metrics;
    if (featured !== undefined) updateData.featured = featured;
    if (published !== undefined) {
      updateData.published = published;
      if (published) updateData.publishedAt = new Date();
    }

    await db
      .collection(COLLECTIONS.PROJECTS)
      .updateOne({ _id: new ObjectId(params.id) }, { $set: updateData });

    const project = await db.collection(COLLECTIONS.PROJECTS).findOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    await db.collection(COLLECTIONS.PROJECTS).deleteOne({
      _id: new ObjectId(params.id),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
