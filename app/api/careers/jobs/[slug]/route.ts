import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { isJobOpen, serializeId, toPublicJob } from '@/lib/careers/helpers';

/**
 * GET /api/careers/jobs/[slug]
 * Public single job. Also enables secure draft previews via ?preview=<previewKey>.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const previewKey = searchParams.get('preview') || '';
    const db = await connectDB();

    const job = await db.collection('jobs').findOne({ slug: params.slug });
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const isPreview =
      previewKey && job.previewKey && previewKey === job.previewKey;

    if (!isPreview && !isJobOpen(job)) {
      return NextResponse.json(
        { error: 'This position is no longer open' },
        { status: 404 }
      );
    }

    return NextResponse.json({ job: toPublicJob(serializeId(job)!) });
  } catch (error) {
    console.error('[api/careers/jobs/[slug] GET]', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
