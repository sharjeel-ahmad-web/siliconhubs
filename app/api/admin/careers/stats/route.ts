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
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [openJobs, applications, interviews, offers, hires] =
      await Promise.all([
        db.collection('jobs').countDocuments({
          published: true,
          archived: { $ne: true },
          status: { $ne: 'closed' },
        }),
        db.collection('applications').countDocuments({ stage: 'New' }),
        db
          .collection('interviews')
          .countDocuments({ status: { $nin: ['Cancelled'] } }),
        db.collection('applications').countDocuments({ stage: 'Offer' }),
        db.collection('applications').countDocuments({ stage: 'Hired' }),
      ]);

    const recentApplications = await db
      .collection('applications')
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentJobs = await db
      .collection('jobs')
      .find({ published: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      stats: {
        openJobs,
        newApplications: applications,
        interviews,
        offers,
        hires,
      },
      recentApplications: recentApplications.map((a) => ({
        ...a,
        _id: a._id.toString(),
        referenceId: a.referenceId || 'N/A',
        jobTitle: a.jobTitle || 'General',
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        stage: a.stage,
        createdAt: a.createdAt,
      })),
      recentJobs: recentJobs.map((j) => ({
        ...j,
        _id: j._id.toString(),
        title: j.title,
        department: j.department,
        status: j.status,
        published: j.published,
      })),
    });
  } catch (error) {
    console.error('[api/admin/careers/stats GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
