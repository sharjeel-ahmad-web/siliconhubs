import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

import { connectDB } from '@/lib/db/mongodb';
import {
  sanitizeEmail,
  sanitizePhone,
  sanitizeText,
  sanitizeURL,
} from '@/lib/security/sanitization';
import { rateLimitByKey, getClientIp } from '@/lib/security/rateLimit';
import { generateReferenceId, isJobOpen } from '@/lib/careers/helpers';
import { sendApplicationReceivedEmail } from '@/lib/email/resend';
import type { JobApplication } from '@/types/careers';

/**
 * POST /api/careers/applications
 *
 * Submit an application for a specific published and currently open job.
 *
 * Resume/CV must be uploaded first through the resume endpoint.
 * The returned upload reference is then passed here as `resume`.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = sanitizeEmail(body.email || '');
    const ip = getClientIp(request);

    // Rate limit per IP + email to reduce spam and abuse.
    const limit = rateLimitByKey(`career-app:${ip}:${email}`, 5, 3600);

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many applications from this address. Please try again later.',
          retryAfterSeconds: limit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    // ---------------------------------------------------------
    // Basic validation
    // ---------------------------------------------------------

    const errors: Record<string, string> = {};

    if (!body.firstName || !sanitizeText(body.firstName).trim()) {
      errors.firstName = 'First name is required.';
    }

    if (!body.lastName || !sanitizeText(body.lastName).trim()) {
      errors.lastName = 'Last name is required.';
    }

    if (!email) {
      errors.email = 'A valid email address is required.';
    }

    if (!body.jobId || !body.jobSlug) {
      errors.job = 'A valid job is required.';
    } else if (!objectIdSafe(body.jobId)) {
      errors.job = 'A valid job is required.';
    }

    if (
      !body.coverLetter ||
      sanitizeText(body.coverLetter).trim().length < 20
    ) {
      errors.coverLetter =
        'Please write a short cover letter (at least 20 characters).';
    }

    if (!body.consent) {
      errors.consent = 'You must agree to the privacy consent to submit.';
    }

    // ---------------------------------------------------------
    // Resume reference validation
    // ---------------------------------------------------------

    let resume: JobApplication['resume'] = null;

    if (body.resume) {
      if (
        !body.resume.imagekitFileId ||
        !body.resume.fileName ||
        !body.resume.fileSize
      ) {
        errors.resume = 'The uploaded resume reference is invalid.';
      } else {
        const fileSize = Number(body.resume.fileSize);

        if (!Number.isFinite(fileSize) || fileSize <= 0) {
          errors.resume = 'The uploaded resume reference is invalid.';
        } else {
          resume = {
            imagekitFileId: sanitizeText(body.resume.imagekitFileId),
            fileName: sanitizeText(body.resume.fileName).slice(0, 160),
            fileType: sanitizeText(body.resume.fileType || ''),
            fileSize,
            format: sanitizeText(body.resume.format || 'pdf'),
          };
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // ---------------------------------------------------------
    // Database
    // ---------------------------------------------------------

    const db = await connectDB();

    const jobId = objectIdSafe(body.jobId);

    /**
     * At this point jobId has already been validated.
     *
     * Both _id and slug are matched so the application cannot
     * submit against a different job by manipulating only one
     * of these values.
     */
    const job = jobId
      ? await db.collection('jobs').findOne({
          _id: jobId,
          slug: sanitizeText(body.jobSlug).trim(),
        })
      : null;

    /**
     * Use the same centralized visibility/open-state logic as
     * the public Careers listing and job detail page.
     *
     * This also checks closingDate.
     */
    if (!job || !isJobOpen(job)) {
      return NextResponse.json(
        {
          error: 'This position is no longer accepting applications.',
        },
        { status: 410 }
      );
    }

    // ---------------------------------------------------------
    // Candidate data
    // ---------------------------------------------------------

    const firstName = sanitizeText(body.firstName).trim().slice(0, 80);

    const lastName = sanitizeText(body.lastName).trim().slice(0, 80);

    const candidateName = `${firstName} ${lastName}`;

    const referenceId = generateReferenceId();
    const now = new Date();

    let candidateId: ObjectId;

    /**
     * Keep one candidate profile per email address.
     *
     * Existing candidates are updated with the latest application
     * information while their previous profile remains available.
     */
    const existing = await db.collection('candidates').findOne({ email });

    if (existing) {
      candidateId = existing._id as ObjectId;

      await db.collection('candidates').updateOne(
        { _id: existing._id },
        {
          $set: {
            name: candidateName,

            phone: body.phone ? sanitizePhone(body.phone) : existing.phone,

            location: body.location
              ? sanitizeText(body.location).slice(0, 160)
              : existing.location,

            currentRole: body.currentRole
              ? sanitizeText(body.currentRole).slice(0, 160)
              : existing.currentRole,

            linkedinUrl: body.linkedinUrl
              ? sanitizeURL(body.linkedinUrl)
              : existing.linkedinUrl,

            githubUrl: body.githubUrl
              ? sanitizeURL(body.githubUrl)
              : existing.githubUrl,

            portfolioUrl: body.portfolioUrl
              ? sanitizeURL(body.portfolioUrl)
              : existing.portfolioUrl,

            resume: resume || existing.resume,

            lastAppliedAt: now,
            updatedAt: now,
          },
        }
      );
    } else {
      const candidate = {
        email,
        name: candidateName,

        phone: body.phone ? sanitizePhone(body.phone) : undefined,

        location: body.location
          ? sanitizeText(body.location).slice(0, 160)
          : undefined,

        currentRole: body.currentRole
          ? sanitizeText(body.currentRole).slice(0, 160)
          : undefined,

        linkedinUrl: body.linkedinUrl
          ? sanitizeURL(body.linkedinUrl)
          : undefined,

        githubUrl: body.githubUrl ? sanitizeURL(body.githubUrl) : undefined,

        portfolioUrl: body.portfolioUrl
          ? sanitizeURL(body.portfolioUrl)
          : undefined,

        resume,

        summary: sanitizeText(body.coverLetter).trim().slice(0, 400),

        firstAppliedAt: now,
        lastAppliedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      const result = await db.collection('candidates').insertOne(candidate);

      candidateId = result.insertedId;
    }

    // ---------------------------------------------------------
    // Application
    // ---------------------------------------------------------

    const application: Omit<JobApplication, '_id'> = {
      referenceId,

      jobId: job._id,
      jobSlug: job.slug,
      jobTitle: job.title,

      general: false,
      candidateId,

      firstName,
      lastName,
      email,

      phone: body.phone ? sanitizePhone(body.phone) : undefined,

      location: body.location
        ? sanitizeText(body.location).slice(0, 160)
        : undefined,

      currentRole: body.currentRole
        ? sanitizeText(body.currentRole).slice(0, 160)
        : undefined,

      yearsOfExperience: body.yearsOfExperience
        ? sanitizeText(body.yearsOfExperience).slice(0, 80)
        : undefined,

      linkedinUrl: body.linkedinUrl ? sanitizeURL(body.linkedinUrl) : undefined,

      githubUrl: body.githubUrl ? sanitizeURL(body.githubUrl) : undefined,

      portfolioUrl: body.portfolioUrl
        ? sanitizeURL(body.portfolioUrl)
        : undefined,

      expectedSalary: body.expectedSalary
        ? sanitizeText(body.expectedSalary).slice(0, 160)
        : undefined,

      availability: body.availability
        ? sanitizeText(body.availability).slice(0, 160)
        : undefined,

      coverLetter: sanitizeText(body.coverLetter).trim(),

      additionalInfo: body.additionalInfo
        ? sanitizeText(body.additionalInfo).slice(0, 4000)
        : undefined,

      resume,

      consent: true,

      stage: 'New',

      internalNotes: [],

      stageHistory: [
        {
          from: '',
          to: 'New',
          changedBy: 'Candidate',
          note: 'Application submitted',
          at: now,
        },
      ],

      source: 'careers-site',

      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('applications').insertOne(application);

    // ---------------------------------------------------------
    // Candidate confirmation email
    // ---------------------------------------------------------

    /**
     * Email is best-effort.
     *
     * A successful database submission must not be converted into
     * a failed application merely because the email provider fails.
     */
    try {
      await sendApplicationReceivedEmail({
        email,
        candidateName,
        jobTitle: job.title,
        referenceId,
      });
    } catch (error) {
      console.error('Failed to send application received email:', error);
    }

    // ---------------------------------------------------------
    // Response
    // ---------------------------------------------------------

    /**
     * Never expose the resume reference to the browser.
     */
    return NextResponse.json(
      {
        success: true,
        id: result.insertedId,
        referenceId,
        jobTitle: job.title,
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/careers/applications POST]', error);

    return NextResponse.json(
      {
        error: 'Failed to submit application. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * Safely convert a string into a MongoDB ObjectId.
 *
 * Returns null for invalid or missing IDs.
 */
function objectIdSafe(id: unknown): ObjectId | null {
  if (typeof id !== 'string' || !ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}
