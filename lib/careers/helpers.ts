/**
 * Careers helpers — slug generation, date formatting, job visibility logic
 * and safe merging of CMS career settings with defaults.
 */
import {
  DEFAULT_CAREER_SETTINGS,
  APPLICATION_STAGES,
} from '@/lib/careers/constants';
import { CareerJob, CareerSettings } from '@/types/careers';

/** Generate a URL-safe slug from a title. */
export function slugify(title: string): string {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';
}

/** A job is open when it is published, not archived and not past its closing date. */
export function isJobOpen(job: Record<string, any>): boolean {
  if (!job.published || job.archived) return false;
  if (job.status === 'closed') return false;
  if (job.closingDate) {
    const closing = new Date(job.closingDate);
    if (!Number.isNaN(closing.getTime()) && closing.getTime() < Date.now()) {
      return false;
    }
  }
  return true;
}

/** Format a date as "12 Mar 2025". */
export function formatDate(
  value: Date | string | number | undefined | null
): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Format a date/time as "12 Mar 2025, 14:30". */
export function formatDateTime(
  value: Date | string | number | undefined | null
): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Convert Mongo _id to string for JSON serialization. */
export function serializeId(
  doc: Record<string, any> | null | undefined
): Record<string, any> | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  const rawId = _id ?? null;
  let serializedId: string | null = null;
  if (rawId && typeof (rawId as any).toHexString === 'function') {
    serializedId = (rawId as any).toHexString();
  } else if (
    rawId &&
    typeof rawId === 'object' &&
    typeof (rawId as any).toString === 'function'
  ) {
    serializedId = (rawId as any).toString();
  } else {
    serializedId = rawId?.toString?.() ?? rawId;
  }
  return {
    ...rest,
    _id: serializedId,
  };
}

/** Map a job document to a shape safe for public consumption. */
export function toPublicJob(job: Record<string, any>): CareerJob {
  const serialized = serializeId(job) as CareerJob;
  return {
    ...serialized,
    publishedAt: serialized.publishedAt
      ? new Date(serialized.publishedAt).toISOString()
      : undefined,
    closingDate: serialized.closingDate
      ? new Date(serialized.closingDate).toISOString()
      : undefined,
    createdAt: new Date(serialized.createdAt || 0).toISOString(),
    updatedAt: new Date(serialized.updatedAt || 0).toISOString(),
  };
}

/** Deep-ish merge CMS career settings over the defaults (arrays replaced wholesale). */
export function mergeCareerSettings(
  content?: Partial<CareerSettings> | null
): CareerSettings {
  if (!content || typeof content !== 'object')
    return DEFAULT_CAREER_SETTINGS as unknown as CareerSettings;
  const out: Record<string, any> = { ...DEFAULT_CAREER_SETTINGS };
  for (const key of Object.keys(content as object)) {
    const v = (content as Record<string, any>)[key];
    if (
      v != null &&
      typeof v === 'object' &&
      !Array.isArray(v) &&
      out[key] &&
      typeof out[key] === 'object'
    ) {
      out[key] = { ...out[key], ...v };
    } else if (v !== undefined) {
      out[key] = v;
    }
  }
  return out as CareerSettings;
}

/** Pipeline stage rank — earlier stages have lower rank. Rejected terminal. */
export function stageRank(stage: string): number {
  const idx = APPLICATION_STAGES.indexOf(
    stage as (typeof APPLICATION_STAGES)[number]
  );
  return idx === -1 ? APPLICATION_STAGES.length : idx;
}

/** Human friendly "time ago" for posted dates. */
export function timeAgo(
  value: Date | string | number | undefined | null
): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

/** Generate a unique public application reference id. */
export function generateReferenceId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 8; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SH-APP-${suffix}`;
}

/** Generate a random preview token for draft job previews. */
export function generatePreviewKey(): string {
  return (
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
  );
}
