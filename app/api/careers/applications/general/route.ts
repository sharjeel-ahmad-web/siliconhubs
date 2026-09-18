import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
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
 * POST /api/careers/applications/general
 * Submit a talent-pool / general application without a specific job.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = sanitizeEmail(body.email || '');
    const ip = getClientIp(request);

    const limit = rateLimitByKey(`career-general:${ip}:${email}`, 3, 3600);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error:
            'Too many submissions from this address. Please try again later.',
          retryAfterSeconds: limit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const errors: Record<string, string> = {};
    const name = body.name ? sanitizeText(body.name).trim().slice(0, 160) : '';
    if (!name) errors.name = 'Your full name is required.';
    if (!email) errors.email = 'A valid email address is required.';
    if (!body.areaOfExpertise || !sanitizeText(body.areaOfExpertise).trim()) {
      errors.areaOfExpertise = 'Please tell us your area of expertise.';
    }
    if (!body.consent) {
      errors.consent = 'You must agree to the privacy consent to submit.';
    }

    let resume: JobApplication['resume'] = null;
    if (body.resume) {
      if (
        !body.resume.imagekitFileId ||
        !body.resume.fileName ||
        !body.resume.fileSize
      ) {
        errors.resume = 'The uploaded resume reference is invalid.';
      } else {
        resume = {
          imagekitFileId: sanitizeText(body.resume.imagekitFileId),
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
    const now = new Date();
    const referenceId = generateReferenceId();

    // Upsert candidate.
    const existing = await db.collection('candidates').findOne({ email });
    const candidateRef = {
      email,
      name,
      phone: body.phone ? sanitizePhone(body.phone) : undefined,
      location: body.location
        ? sanitizeText(body.location).slice(0, 160)
        : undefined,
      currentRole: body.currentRole
        ? sanitizeText(body.currentRole).slice(0, 160)
        : undefined,
      linkedinUrl: body.linkedinUrl ? sanitizeURL(body.linkedinUrl) : undefined,
      portfolioUrl: body.portfolioUrl
        ? sanitizeURL(body.portfolioUrl)
        : undefined,
      resume: resume || undefined,
      summary: sanitizeText(body.message || body.areaOfExpertise).slice(0, 400),
      lastAppliedAt: now,
      updatedAt: now,
    };

    let candidateId;
    if (existing) {
      candidateId = existing._id;
      await db
        .collection('candidates')
        .updateOne(
          { _id: existing._id },
          { $set: { ...candidateRef, resume: resume || existing.resume } }
        );
    } else {
      const result = await db.collection('candidates').insertOne({
        ...candidateRef,
        firstAppliedAt: now,
        createdAt: now,
      });
      candidateId = result.insertedId;
    }

    const application: Omit<JobApplication, '_id'> = {
      referenceId,
      general: true,
      candidateId,
      firstName: name.split(' ')[0] || '',
      lastName: name.split(' ').slice(1).join(' ') || name,
      email,
      phone: candidateRef.phone,
      location: candidateRef.location,
      currentRole: candidateRef.currentRole,
      linkedinUrl: candidateRef.linkedinUrl,
      portfolioUrl: candidateRef.portfolioUrl,
      coverLetter: sanitizeText(body.message || ''),
      additionalInfo: sanitizeText(body.areaOfExpertise).slice(0, 4000),
      resume,
      consent: true,
      stage: 'New',
      internalNotes: [],
      stageHistory: [
        {
          from: '',
          to: 'New',
          changedBy: 'Candidate',
          note: 'General / talent pool application submitted',
          at: now,
        },
      ],
      source: 'careers-general',
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('applications').insertOne(application);

    try {
      await sendApplicationReceivedEmail({
        email,
        candidateName: name,
        jobTitle: 'General Application',
        referenceId,
      });
    } catch (err) {
      console.error('Failed to send general application email:', err);
    }

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId,
        referenceId,
        jobTitle: 'General Application',
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/careers/applications/general POST]', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
