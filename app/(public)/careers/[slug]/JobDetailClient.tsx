'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Clock,
  Briefcase,
  Award,
  CheckCircle2,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { REMOTE_STATUS_LABELS } from '@/lib/careers/constants';
import RichContent from '@/components/careers/RichContent';
import ApplicationForm from '@/components/careers/ApplicationForm';
import { CareerJob } from '@/types/careers';

interface JobDetailClientProps {
  job: CareerJob;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xl font-bold text-[#14213D] md:text-2xl">
      {children}
    </h2>
  );
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const searchParams = useSearchParams();
  const preview = searchParams.get('preview') || '';
  const isPreview = Boolean(
    preview && job.previewKey && preview === job.previewKey
  );
  const [submitted, setSubmitted] = useState(false);

  const remoteStatusLabel = job.remoteStatus
    ? REMOTE_STATUS_LABELS[job.remoteStatus] || job.remoteStatus
    : '';

  const formattedClosingDate = job.closingDate
    ? new Date(job.closingDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const formattedPublishedDate = job.publishedAt
    ? new Date(job.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-[#F5F1E9] text-[#14213D]">
      {/* Careers Hero */}
      <section className="bg-[#FFE8C1]">
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-2xl font-bold text-[#14213D] md:text-3xl">
            Careers at SiliconHubs
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#5F6368] md:text-base">
            Shaping the future of technology through innovation and
            collaboration.
          </p>
        </div>
      </section>

      {/* Job Header */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {job.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FC4C00] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                <Award className="h-3.5 w-3.5" />
                Featured
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FC4C00]/20 bg-[#FFEDD7] px-3.5 py-1.5 text-xs font-medium text-[#FC4C00]">
              {job.department || 'General'}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D8C5] bg-[#FFF4E6] px-3.5 py-1.5 text-xs font-medium text-[#14213D]">
              {job.employmentType || '—'}
            </span>
          </div>

          <h1 className="mb-3 max-w-5xl text-3xl font-extrabold tracking-tight text-[#14213D] md:text-4xl lg:text-5xl">
            {job.title}
          </h1>

          {job.shortDescription && (
            <p className="mb-6 max-w-3xl text-base leading-relaxed text-[#5F6368] md:text-lg">
              {job.shortDescription}
            </p>
          )}

          <div
            className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#5F6368]"
            aria-label="Job details"
          >
            {job.location && (
              <span className="flex items-center gap-2">
                <MapPin
                  className="h-4 w-4 shrink-0 text-[#FC4C00]"
                  aria-hidden="true"
                />
                <span>{job.location}</span>
              </span>
            )}

            {job.experienceLevel && (
              <span className="flex items-center gap-2">
                <Briefcase
                  className="h-4 w-4 shrink-0 text-[#FC4C00]"
                  aria-hidden="true"
                />
                <span>{job.experienceLevel}</span>
              </span>
            )}

            {remoteStatusLabel && (
              <span className="flex items-center gap-2">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-green-400"
                  aria-hidden="true"
                />
                <span>{remoteStatusLabel}</span>
              </span>
            )}

            {job.salary && (
              <span className="flex items-center gap-2">
                <DollarSign
                  className="h-4 w-4 shrink-0 text-[#FC4C00]"
                  aria-hidden="true"
                />
                <span>{job.salary}</span>
              </span>
            )}

            {formattedClosingDate && (
              <span className="flex items-center gap-2">
                <Calendar
                  className="h-4 w-4 shrink-0 text-[#FC4C00]"
                  aria-hidden="true"
                />
                <span>Apply by {formattedClosingDate}</span>
              </span>
            )}
          </div>

          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2" aria-label="Job skills">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[#E8D8C5] bg-[#FFF4E6] px-3 py-1 text-xs font-medium text-[#14213D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {formattedPublishedDate && (
            <div className="flex items-center gap-2 text-xs text-[#8A7E72]">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Posted {formattedPublishedDate}</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Job Information */}
            <main className="main-content min-w-0">
              <div className="job-card grid gap-8 rounded-2xl bg-white p-6 shadow-sm md:p-8 md:shadow-md lg:grid-cols-[2fr_1fr]">
                {/* Primary Content */}
                <div className="left-col min-w-0 space-y-8">
                  {job.description && (
                    <motion.section
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="content-block"
                    >
                      <SectionHeading>Job Summary</SectionHeading>

                      {job.shortDescription && (
                        <p className="mb-4 text-base leading-relaxed text-[#5F6368]">
                          {job.shortDescription}
                        </p>
                      )}

                      <RichContent html={job.description} />
                    </motion.section>
                  )}

                  {job.responsibilities && (
                    <motion.section
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="content-block"
                    >
                      <SectionHeading>Key Responsibilities</SectionHeading>
                      <RichContent html={job.responsibilities} />
                    </motion.section>
                  )}

                  {job.benefits && (
                    <motion.section
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="content-block"
                    >
                      <SectionHeading>Benefits & Compensation</SectionHeading>
                      <RichContent html={job.benefits} />
                    </motion.section>
                  )}
                </div>

                {/* Supporting Content */}
                <div className="right-col min-w-0 space-y-8">
                  {job.requirements && (
                    <motion.section
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="content-block"
                    >
                      <SectionHeading>Requirements & Skills</SectionHeading>
                      <RichContent html={job.requirements} />
                    </motion.section>
                  )}

                  {job.niceToHave && (
                    <motion.section
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="content-block"
                    >
                      <SectionHeading>Nice to Have</SectionHeading>
                      <RichContent html={job.niceToHave} />
                    </motion.section>
                  )}

                  {/* Grow With Us */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grow-box rounded-2xl bg-[#14213D] p-6 text-white"
                  >
                    <h3 className="mb-3 text-lg font-bold text-white">
                      Grow With Us
                    </h3>
                    <p className="text-sm leading-relaxed text-white/80">
                      At SiliconHubs, we invest in people as much as we invest
                      in products. You will get dedicated mentorship, clear
                      progression paths, and access to learning budgets that
                      keep your career moving forward.
                    </p>
                  </motion.div>
                </div>
              </div>
            </main>

            {/* Application Sidebar */}
            <aside className="apply-card min-w-0">
              <div className="apply-content sticky top-24 rounded-2xl bg-white p-6 shadow-sm md:p-8">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="flex h-2 w-2 items-center justify-center rounded-full bg-green-400"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium text-green-600">
                    Applications Open
                  </span>
                </div>

                <h3 className="mb-1 text-lg font-bold text-[#14213D]">
                  Apply for this position
                </h3>

                <p className="mb-5 text-sm leading-relaxed text-[#5F6368]">
                  Join our team — submit your application in minutes.
                </p>

                {submitted ? (
                  <div
                    className="rounded-xl border border-green-200 bg-green-50 p-6 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-500" />
                    <h4 className="text-lg font-bold text-[#14213D]">
                      Application Submitted!
                    </h4>
                    <p className="mt-2 text-sm text-[#5F6368]">
                      Thank you for applying. We will review your profile and
                      get back to you.
                    </p>
                  </div>
                ) : (
                  <ApplicationForm
                    job={job}
                    onSuccess={() => setSubmitted(true)}
                  />
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Draft Preview Notice */}
      {isPreview && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-10 max-w-7xl rounded-lg bg-[#FFEDD7] px-4 py-3 text-sm text-[#8A7E72]"
          role="status"
        >
          This is a preview of a draft job posting.
        </motion.div>
      )}
    </div>
  );
}
