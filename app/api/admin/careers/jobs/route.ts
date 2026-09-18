import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db/mongodb';
import { authOptions } from '@/lib/auth/authOptions';
import { sanitizeText } from '@/lib/security/sanitization';
import { slugify } from '@/lib/careers/helpers';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';

    const filter: Record<string, any> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) filter.department = department;
    if (status) filter.status = status;

    const jobs = await db
      .collection('jobs')
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      jobs.map((j) => ({ ...j, _id: j._id.toString() }))
    );
  } catch (error) {
    console.error('[api/admin/careers/jobs GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const db = await connectDB();
    const now = new Date();

    const slug = slugify(body.title || body.slug || 'untitled-job');
    const existing = await db.collection('jobs').findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: 'A job with this slug already exists' },
        { status: 409 }
      );
    }

    const job: Record<string, any> = {
      title: sanitizeText(body.title),
      slug,
      department: sanitizeText(body.department),
      employmentType: sanitizeText(body.employmentType),
      experienceLevel: sanitizeText(body.experienceLevel),
      location: sanitizeText(body.location),
      city: sanitizeText(body.city),
      country: sanitizeText(body.country),
      remoteStatus: sanitizeText(body.remoteStatus),
      shortDescription: sanitizeText(body.shortDescription),
      description: sanitizeText(body.description),
      responsibilities: sanitizeText(body.responsibilities),
      requirements: sanitizeText(body.requirements),
      niceToHave: sanitizeText(body.niceToHave),
      benefits: sanitizeText(body.benefits),
      skills: Array.isArray(body.skills)
        ? body.skills.map((s: string) => sanitizeText(s))
        : [],
      salary: sanitizeText(body.salary),
      featured: !!body.featured,
      status: body.status || 'open',
      published: !!body.published,
      archived: false,
      publishedAt: body.published ? now : undefined,
      closingDate: body.closingDate ? new Date(body.closingDate) : undefined,
      previewKey:
        body.previewKey ||
        Math.random().toString(36).slice(2) +
          Math.random().toString(36).slice(2),
      seoTitle: sanitizeText(body.seoTitle),
      seoDescription: sanitizeText(body.seoDescription),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('jobs').insertOne(job);

    return NextResponse.json(
      { ...job, _id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/admin/careers/jobs POST]', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
