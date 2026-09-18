import { NextRequest, NextResponse } from 'next/server';
import { getPublishedJobs } from '@/lib/careers/data';
import { isJobOpen } from '@/lib/careers/helpers';
import type { CareerJob } from '@/types/careers';

/**
 * GET /api/careers/jobs
 * Public listing of published, open jobs with optional search + filters.
 * Query params: search, department, employmentType, experienceLevel, location
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const department = searchParams.get('department') || '';
    const employmentType = searchParams.get('employmentType') || '';
    const experienceLevel = searchParams.get('experienceLevel') || '';
    const location = searchParams.get('location') || '';

    const jobs = (await getPublishedJobs()).filter((job) =>
      isJobOpen(job as CareerJob)
    );

    const filtered = jobs.filter((job) => {
      if (search) {
        const haystack = [
          job.title,
          job.department,
          job.description,
          job.requirements,
          job.shortDescription,
          ...(job.skills || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (department && job.department !== department) return false;
      if (employmentType && job.employmentType !== employmentType) return false;
      if (experienceLevel && job.experienceLevel !== experienceLevel)
        return false;
      if (location) {
        const loc = (job.location || '').toLowerCase();
        const remoteStatus = (job.remoteStatus || '').toLowerCase();
        const city = (job.city || '').toLowerCase();
        const country = (job.country || '').toLowerCase();
        const needle = location.toLowerCase();
        const haystack = [loc, remoteStatus, city, country].join(' ');
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const allJobs = await getPublishedJobs();
    const departments = Array.from(
      new Set(allJobs.map((j) => j.department).filter(Boolean))
    ).sort();
    const employmentTypes = Array.from(
      new Set(allJobs.map((j) => j.employmentType).filter(Boolean))
    ).sort();
    const experienceLevels = Array.from(
      new Set(allJobs.map((j) => j.experienceLevel).filter(Boolean))
    ).sort();
    const locations = Array.from(
      new Set(allJobs.map((j) => (j.location || '').trim()).filter(Boolean))
    ).sort();

    return NextResponse.json({
      jobs: filtered,
      filters: { departments, employmentTypes, experienceLevels, locations },
    });
  } catch (error) {
    console.error('[api/careers/jobs GET]', error);
    return NextResponse.json({
      jobs: [],
      filters: {
        departments: [],
        employmentTypes: [],
        experienceLevels: [],
        locations: [],
      },
    });
  }
}
