import { NextRequest, NextResponse } from 'next/server';

import { rateLimitByKey, getClientIp } from '@/lib/security/rateLimit';
import { uploadResume, validateResumeFile } from '@/lib/careers/resume';

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

/**
 * POST /api/careers/applications/resume
 *
 * Upload a resume/CV to ImageKit as an authenticated/non-public raw file.
 *
 * Expects:
 *   multipart/form-data
 *   field: "file"
 *
 * Returns only the storage reference required by the application API.
 * No public resume URL is exposed to the browser.
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const limit = rateLimitByKey(`career-resume:${ip}`, 10, 3600);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        error: 'Too many uploads. Please try again later.',
        retryAfterSeconds: limit.retryAfterSeconds,
      },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'Please attach a resume/CV file.',
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // File size validation
    // ---------------------------------------------------------

    if (file.size <= 0) {
      return NextResponse.json(
        {
          error: 'The uploaded file is empty. Please try another file.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_RESUME_SIZE) {
      return NextResponse.json(
        {
          error: 'Resume must be smaller than 5MB.',
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // File metadata validation
    // ---------------------------------------------------------

    const validation = validateResumeFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.ok) {
      return NextResponse.json(
        {
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // Read file
    // ---------------------------------------------------------

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length === 0) {
      return NextResponse.json(
        {
          error: 'The uploaded file is empty. Please try another file.',
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // Upload to private/non-public storage
    // ---------------------------------------------------------

    const upload = await uploadResume(
      buffer,
      file.name,
      file.type || 'application/octet-stream'
    );

    // Only return the storage reference needed by the
    // application submission endpoint.
    return NextResponse.json(
      {
        resume: upload,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/careers/applications/resume POST]', error);

    return NextResponse.json(
      {
        error: 'Failed to upload resume. Please try again.',
      },
      { status: 500 }
    );
  }
}
