/**
 * Careers server-side data access.
 * All functions gracefully handle an unavailable database so public pages
 * never crash during build or when MongoDB is unreachable.
 */

import { connectDB } from '@/lib/db/mongodb';
import type { CareerSettings } from '@/types/careers';
import { DEFAULT_CAREER_SETTINGS } from '@/lib/careers/constants';
import {
  isJobOpen,
  mergeCareerSettings,
  serializeId,
  toPublicJob,
} from '@/lib/careers/helpers';

const CAREER_SETTINGS_KEY = 'careers';

/**
 * Get the public Careers page settings.
 *
 * Falls back to the default settings if the database is unavailable
 * or the stored content is missing/invalid.
 */
export async function getCareerSettings(): Promise<CareerSettings> {
  try {
    const db = await connectDB();

    const doc = await db
      .collection('careerSettings')
      .findOne({ key: CAREER_SETTINGS_KEY });

    return mergeCareerSettings(doc?.content);
  } catch {
    return mergeCareerSettings(null);
  }
}

/**
 * Get all jobs for the admin CMS.
 *
 * Includes:
 * - Draft jobs
 * - Published jobs
 * - Closed jobs
 * - Archived jobs
 *
 * Jobs are returned with MongoDB ObjectIds serialized to strings
 * so they can safely be consumed by server/client components.
 */
export async function getJobsForAdmin() {
  try {
    const db = await connectDB();

    const jobs = await db
      .collection('jobs')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return jobs.map((job) => serializeId(job));
  } catch {
    return [];
  }
}

/**
 * Get all currently open published jobs for the public Careers listing.
 *
 * A job is considered open only when:
 * - published === true
 * - archived !== true
 * - status !== "closed"
 * - closingDate has not passed
 *
 * The final isJobOpen() check is intentionally performed in application
 * code so the public listing follows the same visibility rules as the
 * single-job detail page.
 */
export async function getPublishedJobs() {
  try {
    const db = await connectDB();

    const jobs = await db
      .collection('jobs')
      .find({
        published: true,
        archived: { $ne: true },
        status: { $ne: 'closed' },
      })
      .sort({ featured: -1, publishedAt: -1 })
      .toArray();

    return jobs.filter(isJobOpen).map(toPublicJob);
  } catch {
    return [];
  }
}

/**
 * Get a single currently open published job by slug.
 *
 * Used by the public job detail page.
 *
 * Closed, unpublished, archived, or expired jobs return null.
 */
export async function getPublishedJobBySlug(slug: string) {
  try {
    if (!slug || typeof slug !== 'string') {
      return null;
    }

    const db = await connectDB();

    const job = await db.collection('jobs').findOne({
      slug,
    });

    if (!job || !isJobOpen(job)) {
      return null;
    }

    return toPublicJob(job);
  } catch {
    return null;
  }
}

/**
 * Get a job by slug for the admin CMS.
 *
 * Unlike the public functions, this intentionally returns jobs regardless
 * of publication, archive, or closing status so administrators can edit
 * drafts and closed/archived jobs.
 */
export async function getJobBySlugForAdmin(slug: string) {
  try {
    if (!slug || typeof slug !== 'string') {
      return null;
    }

    const db = await connectDB();

    const job = await db.collection('jobs').findOne({
      slug,
    });

    return job ? serializeId(job) : null;
  } catch {
    return null;
  }
}

/**
 * Statistics used by the admin Careers overview and dashboard widget.
 *
 * openJobs uses the same isJobOpen() rules as the public Careers listing,
 * including closingDate validation.
 */
export async function getCareerStats() {
  try {
    const db = await connectDB();

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      openJobDocuments,
      applications,
      applicationsThisMonth,
      interviews,
      offers,
      hires,
      newApplications,
    ] = await Promise.all([
      db
        .collection('jobs')
        .find({
          published: true,
          archived: { $ne: true },
          status: { $ne: 'closed' },
        })
        .toArray(),

      db.collection('applications').countDocuments(),

      db.collection('applications').countDocuments({
        createdAt: { $gte: monthStart },
      }),

      db.collection('interviews').countDocuments({
        status: { $nin: ['Cancelled'] },
      }),

      db.collection('applications').countDocuments({
        stage: 'Offer',
      }),

      db.collection('applications').countDocuments({
        stage: 'Hired',
      }),

      db.collection('applications').countDocuments({
        stage: 'New',
      }),
    ]);

    const openJobs = openJobDocuments.filter(isJobOpen).length;

    return {
      openJobs,
      applications,
      applicationsThisMonth,
      interviews,
      offers,
      hires,
      newApplications,
    };
  } catch {
    return {
      openJobs: 0,
      applications: 0,
      applicationsThisMonth: 0,
      interviews: 0,
      offers: 0,
      hires: 0,
      newApplications: 0,
    };
  }
}

export { DEFAULT_CAREER_SETTINGS };
