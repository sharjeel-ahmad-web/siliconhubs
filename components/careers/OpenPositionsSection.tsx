'use client';

/**
 * Open Positions — searchable and filterable job listing.
 *
 * This component is intentionally data-driven:
 * the Business Development Specialist / Executive and other jobs
 * are supplied through the `jobs` prop from the careers data source.
 */

import { useMemo, useState } from 'react';
import {
  Search,
  X,
  Inbox,
  Layers,
  SlidersHorizontal,
  MapPin,
  BriefcaseBusiness,
} from 'lucide-react';
import { CareerJob } from '@/types/careers';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';
import JobCard from '@/components/careers/JobCard';

interface OpenPositionsSectionProps {
  jobs: CareerJob[];
}

const selectClass =
  'w-full appearance-none rounded-xl border border-[#E8D8C5] bg-white px-4 py-2.5 text-sm text-[#14213D] transition-colors focus:border-[#FC4C00] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/20';

const normalize = (value?: string | null) => (value || '').trim().toLowerCase();

const getJobLocation = (job: CareerJob) =>
  (job.location || 'Remote').trim() || 'Remote';

export function OpenPositionsSection({ jobs }: OpenPositionsSectionProps) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [employmentType, setEmploymentType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [location, setLocation] = useState('All');

  const departments = useMemo(
    () =>
      Array.from(
        new Set([
          'All',
          ...jobs.map((job) => job.department).filter(Boolean),
        ] as string[])
      ),
    [jobs]
  );

  const employmentTypes = useMemo(
    () =>
      Array.from(
        new Set([
          'All',
          ...jobs.map((job) => job.employmentType).filter(Boolean),
        ] as string[])
      ),
    [jobs]
  );

  const experienceLevels = useMemo(
    () =>
      Array.from(
        new Set([
          'All',
          ...jobs.map((job) => job.experienceLevel).filter(Boolean),
        ] as string[])
      ),
    [jobs]
  );

  const locations = useMemo(
    () => Array.from(new Set(['All', ...jobs.map(getJobLocation)] as string[])),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = normalize(search);

    return jobs.filter((job) => {
      if (query) {
        const haystack = [
          job.title,
          job.department,
          getJobLocation(job),
          job.employmentType,
          job.experienceLevel,
          job.shortDescription,
          ...(job.skills || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(query)) return false;
      }

      if (
        department !== 'All' &&
        normalize(job.department) !== normalize(department)
      ) {
        return false;
      }

      if (
        employmentType !== 'All' &&
        normalize(job.employmentType) !== normalize(employmentType)
      ) {
        return false;
      }

      if (
        experienceLevel !== 'All' &&
        normalize(job.experienceLevel) !== normalize(experienceLevel)
      ) {
        return false;
      }

      if (
        location !== 'All' &&
        normalize(getJobLocation(job)) !== normalize(location)
      ) {
        return false;
      }

      return true;
    });
  }, [jobs, search, department, employmentType, experienceLevel, location]);

  const hasFilters =
    search.trim() !== '' ||
    department !== 'All' ||
    employmentType !== 'All' ||
    experienceLevel !== 'All' ||
    location !== 'All';

  const resetFilters = () => {
    setSearch('');
    setDepartment('All');
    setEmploymentType('All');
    setExperienceLevel('All');
    setLocation('All');
  };

  return (
    <section
      id="open-positions"
      aria-labelledby="open-positions-heading"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 md:py-24"
    >
      <div id="open-positions-heading">
        <CareersSectionHeading
          eyebrow="Open Positions"
          title="Find Your Next"
          titleHighlight="Challenge"
          subtitle={
            jobs.length > 0
              ? `Explore ${jobs.length} open position${
                  jobs.length === 1 ? '' : 's'
                } across SiliconHubs. Search by role, department, experience, employment type, or location.`
              : 'We don’t have open positions right now — but new roles are posted regularly. Check back soon or send a general application below.'
          }
        />
      </div>

      {/* Search & Filters */}
      <div className="mb-10 rounded-2xl border border-[#E8D8C5] bg-white/55 p-5 shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2 pb-4 text-sm font-semibold text-[#14213D]">
          <SlidersHorizontal className="h-4 w-4 text-[#FC4C00]" />
          Search & filter
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#FFEDD7] px-3 py-1 text-xs font-medium text-[#FC4C00] transition-colors hover:bg-[#F7E3C6]"
              aria-label="Clear all job filters"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7E72]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search roles or skills…"
              aria-label="Search positions by title, department, skills or experience"
              className="w-full rounded-xl border border-[#E8D8C5] bg-white py-2.5 pl-9 pr-4 text-sm text-[#14213D] placeholder:text-[#8A7E72] focus:border-[#FC4C00] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/20"
            />
          </div>

          {/* Department */}
          <div>
            <label className="sr-only" htmlFor="filter-department">
              Department
            </label>
            <select
              id="filter-department"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className={selectClass}
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All Departments' : item}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="sr-only" htmlFor="filter-type">
              Employment type
            </label>
            <select
              id="filter-type"
              value={employmentType}
              onChange={(event) => setEmploymentType(event.target.value)}
              className={selectClass}
            >
              {employmentTypes.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All Employment Types' : item}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="sr-only" htmlFor="filter-level">
              Experience level
            </label>
            <select
              id="filter-level"
              value={experienceLevel}
              onChange={(event) => setExperienceLevel(event.target.value)}
              className={selectClass}
            >
              {experienceLevels.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All Experience Levels' : item}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="sr-only" htmlFor="filter-location">
              Location
            </label>
            <select
              id="filter-location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className={selectClass}
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All Locations' : item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active result summary */}
      {filteredJobs.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[#5F6368]">
          <span className="inline-flex items-center gap-2">
            <BriefcaseBusiness className="h-4 w-4 text-[#FC4C00]" />
            <strong className="text-[#14213D]">{filteredJobs.length}</strong>
            matching position{filteredJobs.length === 1 ? '' : 's'}
          </span>

          {location !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFEDD7] px-3 py-1 text-xs font-medium text-[#14213D]">
              <MapPin className="h-3.5 w-3.5 text-[#FC4C00]" />
              {location}
            </span>
          )}

          {department !== 'All' && (
            <span className="rounded-full bg-[#F5F0E9] px-3 py-1 text-xs font-medium text-[#14213D]">
              {department}
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E8D8C5] bg-white/40 px-6 py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFEDD7]">
            {hasFilters ? (
              <Layers className="h-8 w-8 text-[#FC4C00]" />
            ) : (
              <Inbox className="h-8 w-8 text-[#FC4C00]" />
            )}
          </div>

          <h3 className="mb-2 text-xl font-bold text-[#14213D]">
            {hasFilters
              ? 'No positions match your filters'
              : 'No open positions right now'}
          </h3>

          <p className="mx-auto mb-6 max-w-md text-sm leading-6 text-[#5F6368]">
            {hasFilters
              ? 'Try removing a few filters or use a broader search term.'
              : 'New roles are added regularly. Submit a general application and we will reach out when a match opens.'}
          </p>

          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FC4C00] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#E04300] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/30"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          ) : (
            <a
              href="#general-application"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FC4C00] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#E04300] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/30"
            >
              Submit a general application
            </a>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <JobCard key={String(job._id)} job={job} index={index} />
          ))}
        </div>
      )}

      {/* Results footer */}
      {filteredJobs.length > 0 && (
        <p className="mt-6 text-sm text-[#8A7E72]">
          Showing{' '}
          <strong className="text-[#14213D]">{filteredJobs.length}</strong> of{' '}
          <strong className="text-[#14213D]">{jobs.length}</strong> open
          position{jobs.length === 1 ? '' : 's'}.
        </p>
      )}
    </section>
  );
}

export default OpenPositionsSection;
