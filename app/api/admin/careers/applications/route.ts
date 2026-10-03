import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { authOptions } from '@/lib/auth/authOptions';
import {
  createAdminResumeResponse,
  loadAdminResume,
} from '../../../../../lib/careers/admin-resume';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');
    if (resumeId) {
      if (!ObjectId.isValid(resumeId)) {
        return NextResponse.json(
          { error: 'Invalid application ID' },
          { status: 400 }
        );
      }
      const application = await db
        .collection('applications')
        .findOne({ _id: new ObjectId(resumeId) });
      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      if (!application.resume?.imagekitFileId) {
        return NextResponse.json(
          { error: 'Resume not found' },
          { status: 404 }
        );
      }

      const { buffer, contentType } = await loadAdminResume(application.resume);
      return createAdminResumeResponse(
        buffer,
        contentType,
        application.resume.fileName,
        searchParams.get('download') === '1'
      );
    }

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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applicationId = new URL(request.url).searchParams.get('atsId');
  if (!applicationId || !ObjectId.isValid(applicationId)) {
    return NextResponse.json(
      { error: 'Invalid application ID' },
      { status: 400 }
    );
  }

  try {
    const db = await connectDB();
    const { createATSReview, extractResumeText } =
      await import('@/lib/careers/ats');
    const application = await db
      .collection('applications')
      .findOne({ _id: new ObjectId(applicationId) });
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    if (!application.resume?.imagekitFileId) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const { buffer, extension } = await loadAdminResume(application.resume);
    const resumeText = await extractResumeText(buffer, extension);
    if (resumeText.trim().split(/\s+/).length < 10) {
      return NextResponse.json(
        {
          error:
            'Could not extract enough text. This resume may be scanned or image-only.',
        },
        { status: 422 }
      );
    }

    let job = null;
    if (application.jobId && ObjectId.isValid(String(application.jobId))) {
      const jobDocument = await db
        .collection('jobs')
        .findOne({ _id: new ObjectId(String(application.jobId)) });
      if (jobDocument) {
        job = {
          title: jobDocument.title,
          description: jobDocument.description,
          responsibilities: jobDocument.responsibilities,
          requirements: jobDocument.requirements,
          skills: jobDocument.skills,
        };
      }
    }

    const review = createATSReview(resumeText, job);
    await db
      .collection('applications')
      .updateOne(
        { _id: new ObjectId(applicationId) },
        { $set: { atsReview: review, updatedAt: new Date() } }
      );

    return NextResponse.json({ review });
  } catch (error) {
    console.error('[api/admin/careers/applications ATS POST]', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume' },
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
