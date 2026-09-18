import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/mongodb';
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const stage = searchParams.get('stage') || '';
    const jobId = searchParams.get('jobId') || '';

    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { referenceId: { $regex: search, $options: 'i' } },
      ];
    }
    if (stage) filter.stage = stage;
    if (jobId) filter.jobId = jobId;

    const apps = await db
      .collection('applications')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      apps.map((a) => ({ ...a, _id: a._id.toString() }))
    );
  } catch (error) {
    console.error('[api/admin/careers/applications GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await connectDB();

    const { id, stage, notes, internalNote } = body;

    const update: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (stage) {
      update.stage = stage;
      update.stageHistory = [
        ...(body.existingStageHistory || []),
        {
          from: body.existingStage || '',
          to: stage,
          changedBy: 'Admin',
          note: notes || internalNote || `Stage changed to ${stage}`,
          at: new Date(),
        },
      ];
    }

    if (internalNote) {
      update.internalNotes = [
        ...(body.existingNotes || []),
        {
          text: internalNote,
          author: 'Admin',
          createdAt: new Date(),
        },
      ];
    }

    const result = await db
      .collection('applications')
      .updateOne(
        { _id: new (require('mongodb').ObjectId)(id) },
        { $set: update }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/admin/careers/applications PUT]', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
