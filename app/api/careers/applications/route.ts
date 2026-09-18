import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import {
  sanitizeEmail,
  sanitizePhone,
  sanitizeText,
  sanitizeURL,
} from '@/lib/security/sanitization';
import { rateLimitByKey, getClientIp } from '@/lib/security/rateLimit';
import { generateReferenceId } from '@/lib/careers/helpers';
import { sendApplicationReceivedEmail } from '@/lib/email/resend';
import type { JobApplication } from '@/types/careers';

/**
 * POST /api/careers/applications
 * Submit an application for a specific (published) job.
 * Resume/CV must be uploaded first via the resume endpoint — the returned
 * upload reference is passed here as `resume`.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = sanitizeEmail(body.email || '');
    const ip = getClientIp(request);

    // Rate limit per IP+email to prevent spam.
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

    // Validation
    const errors: Record<string, string> = {};
    if (!body.firstName || !sanitizeText(body.firstName).trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!body.lastName || !sanitizeText(body.lastName).trim()) {
      errors.lastName = 'Last name is required.';
    }
    if (!email) errors.email = 'A valid email address is required.';
    if (!body.jobId || !body.jobSlug) {
      errors.job = 'A valid job is required.';
    }
    if (!body.coverLetter || sanitizeText(body.coverLetter).length < 20) {
      errors.coverLetter =
        'Please write a short cover letter (at least 20 characters).';
    }
    if (!body.consent) {
      errors.consent = 'You must agree to the privacy consent to submit.';
    }

    // Resume reference is optional but validated if provided.
    let resume: JobApplication['resume'] = null;
    if (body.resume) {
      if (
        !body.resume.cloudinaryPublicId ||
        !body.resume.fileName ||
        !body.resume.fileSize
      ) {
        errors.resume = 'The uploaded resume reference is invalid.';
      } else {
        resume = {
          cloudinaryPublicId: sanitizeText(body.resume.cloudinaryPublicId),
          fileName: sanitizeText(body.resume.fileName).slice(0, 160),
          fileType: sanitizeText(body.resume.fileType || ''),
          fileSize: Number(body.resume.fileSize) || 0,
          format: sanitizeText(body.resume.format || 'pdf'),
        };
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const db = await connectDB();

    // Verify the referenced job exists and is open.
    const job = await db.collection('jobs').findOne({
      _id: objectIdSafe(body.jobId) || undefined,
      slug: body.jobSlug,
    });
    if (
      !job ||
      job.published !== true ||
      job.archived === true ||
      job.status === 'closed'
    ) {
      return NextResponse.json(
        { error: 'This position is no longer accepting applications.' },
        { status: 410 }
      );
      return;
    }

    const firstName = sanitizeText(body.firstName).trim().slice(0, 80);
    const lastName = sanitizeText(body.lastName).trim().slice(0, 80);
    const candidateName = `${firstName} ${lastName}`;
    const referenceId = generateReferenceId();

    // Upsert candidate record (one candidate per email address).
    const now = new Date();
    let candidateId: ObjectId;
    const existing = await db.collection('candidates').findOne({ email });
    if (existing) {
      candidateId = existing._id;
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
        summary: sanitizeText(body.coverLetter).slice(0, 400),
        firstAppliedAt: now,
        lastAppliedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      const result = await db.collection('candidates').insertOne(candidate);
      candidateId = result.insertedId;
    }

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
      coverLetter: sanitizeText(body.coverLetter),
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

    // Notify the candidate (non-blocking; best-effort).
    try {
      await sendApplicationReceivedEmail({
        email,
        candidateName,
        jobTitle: job.title,
        referenceId,
      });
    } catch (err) {
      console.error('Failed to send application received email:', err);
    }

    // Do NOT expose the resume reference back to the client.
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
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}

function objectIdSafe(id: unknown): ObjectId | null {
  if (typeof id !== 'string' || !ObjectId.isValid(id)) return null;
  return new ObjectId(id);
}
