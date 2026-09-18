import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/mongodb';
import { authOptions } from '@/lib/auth/authOptions';
import { sanitizeText } from '@/lib/security/sanitization';
import { slugify } from '@/lib/careers/helpers';
import { CareerJob } from '@/types/careers';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const job = await db.collection('jobs').findOne({ slug: params.slug });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ ...job, _id: job._id.toString() });
  } catch (error) {
    console.error('[api/admin/careers/jobs/[slug] GET]', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await connectDB();

    const update: Record<string, any> = {
      ...(body.title && { title: sanitizeText(body.title) }),
      ...(body.shortDescription && {
        shortDescription: sanitizeText(body.shortDescription),
      }),
      ...(body.description && { description: sanitizeText(body.description) }),
      ...(body.responsibilities && {
        responsibilities: sanitizeText(body.responsibilities),
      }),
      ...(body.requirements && {
        requirements: sanitizeText(body.requirements),
      }),
      ...(body.niceToHave !== undefined && {
        niceToHave: sanitizeText(body.niceToHave),
      }),
      ...(body.benefits !== undefined && {
        benefits: sanitizeText(body.benefits),
      }),
      ...(body.salary !== undefined && { salary: sanitizeText(body.salary) }),
      ...(body.seoTitle !== undefined && {
        seoTitle: sanitizeText(body.seoTitle),
      }),
      ...(body.seoDescription !== undefined && {
        seoDescription: sanitizeText(body.seoDescription),
      }),
      ...(body.featured !== undefined && { featured: body.featured }),
      ...(body.status && { status: body.status }),
      ...(body.published !== undefined && {
        published: body.published,
        publishedAt: body.published ? new Date() : undefined,
      }),
      ...(body.archived !== undefined && { archived: body.archived }),
      ...(body.closingDate && { closingDate: new Date(body.closingDate) }),
      updatedAt: new Date(),
    };

    if (body.department) update.department = sanitizeText(body.department);
    if (body.employmentType)
      update.employmentType = sanitizeText(body.employmentType);
    if (body.experienceLevel)
      update.experienceLevel = sanitizeText(body.experienceLevel);
    if (body.location) update.location = sanitizeText(body.location);
    if (body.remoteStatus)
      update.remoteStatus = sanitizeText(body.remoteStatus);
    if (body.city) update.city = sanitizeText(body.city);
    if (body.country) update.country = sanitizeText(body.country);
    if (Array.isArray(body.skills)) {
      update.skills = body.skills.map((s: string) => sanitizeText(s));
    }

    if (body.slug && body.slug !== params.slug) {
      const existing = await db.collection('jobs').findOne({ slug: body.slug });
      if (existing) {
        return NextResponse.json(
          { error: 'A job with this slug already exists' },
          { status: 409 }
        );
      }
      update.slug = body.slug;
    }

    const result = await db
      .collection('jobs')
      .updateOne({ slug: params.slug }, { $set: update });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const updated = await db.collection('jobs').findOne({ slug: params.slug });
    if (!updated) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    return NextResponse.json({ ...updated, _id: updated._id.toString() });
  } catch (error) {
    console.error('[api/admin/careers/jobs/[slug] PUT]', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const result = await db.collection('jobs').deleteOne({ slug: params.slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/admin/careers/jobs/[slug] DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
