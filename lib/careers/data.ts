/**
 * Careers server-side data access.
 * All functions gracefully handle an unavailable database so public pages
 * never crash during build or when MongoDB is unreachable.
 */
import { connectDB } from '@/lib/db/mongodb';
import { CareerSettings } from '@/types/careers';
import { DEFAULT_CAREER_SETTINGS } from '@/lib/careers/constants';
import {
  isJobOpen,
  mergeCareerSettings,
  serializeId,
  toPublicJob,
} from '@/lib/careers/helpers';

const CAREER_SETTINGS_KEY = 'careers';

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

/** All jobs for admin (including drafts / archived). */
export async function getJobsForAdmin() {
  try {
    const db = await connectDB();
    const jobs = await db
      .collection('jobs')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return jobs.map((j) => serializeId(j));
  } catch {
    return [];
  }
}

/** Published, open jobs only (public listing). */
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
    return jobs.map(toPublicJob);
  } catch {
    return [];
  }
}

/** Single published job by slug (public). */
export async function getPublishedJobBySlug(slug: string) {
  try {
    const db = await connectDB();
    const job = await db.collection('jobs').findOne({ slug });
    if (!job || !isJobOpen(job)) return null;
    return toPublicJob(job);
  } catch {
    return null;
  }
}

/** Single job by slug for admin editing. */
export async function getJobBySlugForAdmin(slug: string) {
  try {
    const db = await connectDB();
    const job = await db.collection('jobs').findOne({ slug });
    return job ? serializeId(job) : null;
  } catch {
    return null;
  }
}

/** Statistics used by the admin careers overview + dashboard widget. */
export async function getCareerStats() {
  try {
    const db = await connectDB();
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      openJobs,
      applications,
      applicationsThisMonth,
      interviews,
      offers,
      hires,
      newApplications,
    ] = await Promise.all([
      db.collection('jobs').countDocuments({
        published: true,
        archived: { $ne: true },
        status: { $ne: 'closed' },
      }),
      db.collection('applications').countDocuments(),
      db
        .collection('applications')
        .countDocuments({ createdAt: { $gte: monthStart } }),
      db
        .collection('interviews')
        .countDocuments({ status: { $nin: ['Cancelled'] } }),
      db.collection('applications').countDocuments({ stage: 'Offer' }),
      db.collection('applications').countDocuments({ stage: 'Hired' }),
      db.collection('applications').countDocuments({ stage: 'New' }),
    ]);

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
