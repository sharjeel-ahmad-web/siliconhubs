'use client';

/**
 * Dynamic job detail page — fully CMS driven. Includes the header,
 * role content (rich text), skills and the inline application flow.
 */
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  Layers,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { CareerJob } from '@/types/careers';
import { REMOTE_STATUS_LABELS } from '@/lib/careers/constants';
import { formatDate, timeAgo } from '@/lib/careers/helpers';
import RichContent from '@/components/careers/RichContent';
import ApplicationForm, {
  SubmittedApplication,
} from '@/components/careers/ApplicationForm';
import ApplicationSuccess from '@/components/careers/ApplicationSuccess';

interface JobDetailClientProps {
  job: CareerJob;
  isPreview?: boolean;
}

function Block({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10">
      <h2 className="mb-4 text-xl font-bold text-[#14213D] md:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function JobDetailClient({
  job,
  isPreview,
}: JobDetailClientProps) {
  const [applicationResult, setApplicationResult] =
    useState<SubmittedApplication | null>(null);

  const remoteLabel = job.remoteStatus
    ? REMOTE_STATUS_LABELS[job.remoteStatus]
    : null;

  const closed =
    (job.closingDate && new Date(job.closingDate).getTime() < Date.now()) ||
    job.status === 'closed';
  const canApply = !closed && !job.archived;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <Link
        href="/careers"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#5F6368] transition-colors hover:text-[#FC4C00]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all positions
      </Link>

      {isPreview && (
        <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>Preview mode:</strong> this draft is only visible because you
          have a preview link. Applicants cannot see it until you publish it.
        </div>
      )}

      {/* Job header */}
      <header className="mb-12 overflow-hidden rounded-[2rem] border border-[#E8D8C5] bg-white/60 p-8 backdrop-blur-sm md:p-12">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {job.department && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEDD7] px-3 py-1 text-xs font-medium text-[#14213D]">
              <Layers className="h-3.5 w-3.5 text-[#FC4C00]" /> {job.department}
            </span>
          )}
          {job.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FC4C00] px-3 py-1 text-xs font-semibold text-white">
              Featured
            </span>
          )}
          {remoteLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D8C5] px-3 py-1 text-xs font-medium text-[#5F6368]">
              {remoteLabel}
            </span>
          )}
        </div>

        <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[#14213D] md:text-5xl">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#5F6368]">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#FC4C00]" />
            {job.location || 'Remote'}
            {job.city && job.city !== (job.location || '').split(',')[0]
              ? ` · ${job.city}`
              : ''}
          </span>
          <span className="inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#FC4C00]" />{' '}
            {job.employmentType}
          </span>
          {job.experienceLevel && (
            <span className="inline-flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#FC4C00]" />{' '}
              {job.experienceLevel}
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#FC4C00]" />
            {job.publishedAt
              ? `Posted ${timeAgo(job.publishedAt)}`
              : 'New role'}
          </span>
        </div>
      </header>

      {/* Success state replaces the whole application area */}
      {applicationResult ? (
        <ApplicationSuccess
          result={applicationResult}
          onReset={() => setApplicationResult(null)}
        />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Main content */}
          <div>
            {job.description?.trim() ? (
              <Block id="about-the-role" title="About the Role">
                <RichContent
                  html={job.description}
                  className="rich-content-body text-[#5F6368]"
                />
              </Block>
            ) : null}

            {job.responsibilities?.trim() ? (
              <Block id="responsibilities" title="Responsibilities">
                <RichContent
                  html={job.responsibilities}
                  className="rich-content-body text-[#5F6368]"
                />
              </Block>
            ) : null}

            {job.requirements?.trim() ? (
              <Block id="requirements" title="Requirements">
                <RichContent
                  html={job.requirements}
                  className="rich-content-body text-[#5F6368]"
                />
              </Block>
            ) : null}

            {job.niceToHave?.trim() ? (
              <Block id="nice-to-have" title="Nice to Have">
                <RichContent
                  html={job.niceToHave}
                  className="rich-content-body text-[#5F6368]"
                />
              </Block>
            ) : null}

            {job.benefits?.trim() ? (
              <Block id="benefits" title="Benefits">
                <RichContent
                  html={job.benefits}
                  className="rich-content-body text-[#5F6368]"
                />
              </Block>
            ) : null}

            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <Block id="skills" title="Skills & Technologies">
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-[#E8D8C5] bg-white px-3.5 py-1.5 text-sm font-medium text-[#14213D]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Block>
            )}
          </div>

          {/* Apply sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-[2rem] border border-[#E8D8C5] bg-white/70 p-7 shadow-lg shadow-[#14213D]/5 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-[#14213D]">
                Apply for this Position
              </h2>

              {!canApply ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-center">
                  <Calendar className="mx-auto mb-3 h-8 w-8 text-amber-600" />
                  <p className="text-sm font-semibold text-amber-800">
                    This position is no longer open
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    {closed && job.closingDate
                      ? `Applications closed on ${formatDate(job.closingDate)}.`
                      : 'The role is not currently accepting applications.'}
                  </p>
                  <Link
                    href="/careers#open-positions"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#FC4C00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#E04300]"
                  >
                    View other positions
                  </Link>
                </div>
              ) : (
                <ApplicationForm job={job} onSuccess={setApplicationResult} />
              )}
            </div>
            {/* Job details card */}
            <div className="mt-6 rounded-2xl border border-[#E8D8C5] bg-white/50 p-6 text-sm backdrop-blur-sm">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#8A7E72]">
                Position details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8A7E72]">Department</dt>
                  <dd className="text-right font-medium text-[#14213D]">
                    {job.department || '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8A7E72]">Employment type</dt>
                  <dd className="text-right font-medium text-[#14213D]">
                    {job.employmentType || '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8A7E72]">Experience</dt>
                  <dd className="text-right font-medium text-[#14213D]">
                    {job.experienceLevel || '—'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#8A7E72]">Location</dt>
                  <dd className="text-right font-medium text-[#14213D]">
                    {job.location || 'Remote'}
                  </dd>
                </div>
                {job.salary && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#8A7E72]">Salary</dt>
                    <dd className="text-right font-medium text-[#14213D]">
                      {job.salary}
                    </dd>
                  </div>
                )}
              </dl>

              {job.featuredImage && (
                <div className="mt-6">
                  <Image
                    src={job.featuredImage}
                    alt={`${job.title} at SiliconHubs`}
                    width={640}
                    height={360}
                    className="aspect-video w-full rounded-xl object-cover"
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Closing CTA */}
      <div className="mt-16 rounded-[2rem] bg-[#14213D] px-8 py-12 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Don&apos;t see the right role for you?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-white/70">
          Send us a general application and we will keep your profile in mind
          for future openings.
        </p>
        <Link
          href="/careers#general-application"
          className="inline-flex items-center gap-2 rounded-xl bg-[#FC4C00] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FC4C00]/30 transition-all hover:-translate-y-0.5 hover:bg-[#E04300]"
        >
          <ExternalLink className="h-4 w-4" /> Submit a General Application
        </Link>
      </div>
    </div>
  );
}
