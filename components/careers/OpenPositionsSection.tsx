'use client';

/**
 * Open Positions — searchable and filterable job listing.
 */
import { useState, useMemo } from 'react';
import { Search, X, Inbox, Layers, SlidersHorizontal } from 'lucide-react';
import { CareerJob } from '@/types/careers';
import { CareersSectionHeading } from '@/components/careers/CareersSectionHeading';
import JobCard from '@/components/careers/JobCard';

interface OpenPositionsSectionProps {
  jobs: CareerJob[];
}

const selectClass =
  'w-full appearance-none rounded-xl border border-[#E8D8C5] bg-white px-4 py-2.5 text-sm text-[#14213D] focus:border-[#FC4C00] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/20';

export function OpenPositionsSection({ jobs }: OpenPositionsSectionProps) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [employmentType, setEmploymentType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [location, setLocation] = useState('All');

  const departments = useMemo(
    () =>
      Array.from(
        new Set(['All', ...jobs.map((j) => j.department).filter(Boolean)])
      ) as string[],
    [jobs]
  );
  const employmentTypes = useMemo(
    () =>
      Array.from(
        new Set(['All', ...jobs.map((j) => j.employmentType).filter(Boolean)])
      ) as string[],
    [jobs]
  );
  const experienceLevels = useMemo(
    () =>
      Array.from(
        new Set(['All', ...jobs.map((j) => j.experienceLevel).filter(Boolean)])
      ) as string[],
    [jobs]
  );
  const locations = useMemo(
    () =>
      Array.from(
        new Set([
          'All',
          ...jobs.map((j) => j.location || 'Remote').filter(Boolean),
        ])
      ) as string[],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((job) => {
      if (q) {
        const haystack = [
          job.title,
          job.department,
          job.location,
          job.employmentType,
          job.experienceLevel,
          job.shortDescription,
          ...(job.skills || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (department !== 'All' && job.department !== department) return false;
      if (employmentType !== 'All' && job.employmentType !== employmentType)
        return false;
      if (experienceLevel !== 'All' && job.experienceLevel !== experienceLevel)
        return false;
      if (location !== 'All' && (job.location || 'Remote') !== location)
        return false;
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
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16 md:py-24"
    >
      <CareersSectionHeading
        eyebrow="Open Positions"
        title="Find Your Next"
        titleHighlight="Challenge"
        subtitle={
          jobs.length > 0
            ? `We currently have ${jobs.length} open position${jobs.length === 1 ? '' : 's'} across the agency. Use the filters to find your match.`
            : 'We don’t have open positions right now — but new roles are posted regularly. Check back soon or send a general application below.'
        }
      />

      {/* Filters */}
      <div className="mb-10 rounded-2xl border border-[#E8D8C5] bg-white/55 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 pb-4 text-sm font-semibold text-[#14213D]">
          <SlidersHorizontal className="h-4 w-4 text-[#FC4C00]" />
          Search & filter
          {hasFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#FFEDD7] px-3 py-1 text-xs font-medium text-[#FC4C00] transition-colors hover:bg-[#F7E3C6]"
            >
              <X className="h-3 w-3" /> Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="relative lg:col-span-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A7E72]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles or skills…"
              aria-label="Search positions"
              className="w-full rounded-xl border border-[#E8D8C5] bg-white py-2.5 pl-9 pr-4 text-sm text-[#14213D] placeholder:text-[#8A7E72] focus:border-[#FC4C00] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/20"
            />
          </div>

          <label className="sr-only" htmlFor="filter-department">
            Department
          </label>
          <select
            id="filter-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={selectClass}
          >
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-type">
            Employment type
          </label>
          <select
            id="filter-type"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className={selectClass}
          >
            {employmentTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-level">
            Experience level
          </label>
          <select
            id="filter-level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className={selectClass}
          >
            {experienceLevels.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-location">
            Location
          </label>
          <select
            id="filter-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={selectClass}
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

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
          <p className="mx-auto mb-6 max-w-md text-sm text-[#5F6368]">
            {hasFilters
              ? 'Try removing a few filters or use a broader search term.'
              : 'New roles are added regularly. Submit a general application and we will reach out when a match opens.'}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FC4C00] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#E04300]"
            >
              <X className="h-4 w-4" /> Clear all filters
            </button>
          ) : (
            <a
              href="#general-application"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FC4C00] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#E04300]"
            >
              Submit a general application
            </a>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <JobCard key={job._id as string} job={job} index={index} />
          ))}
        </div>
      )}

      {filteredJobs.length > 0 && (
        <p className="mt-6 text-sm text-[#8A7E72]">
          Showing{' '}
          <strong className="text-[#14213D]">{filteredJobs.length}</strong> of{' '}
          {jobs.length} open position{jobs.length === 1 ? '' : 's'}.
        </p>
      )}
    </section>
  );
}

export default OpenPositionsSection;
