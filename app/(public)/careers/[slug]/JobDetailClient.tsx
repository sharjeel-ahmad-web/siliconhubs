'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Metadata } from 'next';
import {
  MapPin,
  Clock,
  Briefcase,
  Layers,
  Award,
  Calendar,
  DollarSign,
  Building2,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { REMOTE_STATUS_LABELS } from '@/lib/careers/constants';
import RichContent from '@/components/careers/RichContent';
import ApplicationForm from '@/components/careers/ApplicationForm';
import { CareerJob, ResumeFile } from '@/types/careers';

interface JobDetailClientProps {
  job: CareerJob;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-[#14213D] md:text-2xl">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FC4C00] text-white">
        <ChevronRight className="h-5 w-5" />
      </span>
      {children}
    </h2>
  );
}

function DetailPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E8D8C5] bg-white/70 px-4 py-3 backdrop-blur-sm">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF4E6] text-[#FC4C00]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-medium text-[#8A7E72]">{label}</p>
        <p className="text-sm font-semibold text-[#14213D]">{value}</p>
      </div>
    </div>
  );
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const searchParams = useSearchParams();
  const preview = searchParams.get('preview') || '';
  const isPreview = preview && job.previewKey && preview === job.previewKey;
  const remoteLabel = job.remoteStatus
    ? REMOTE_STATUS_LABELS[job.remoteStatus]
    : null;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#14213D] via-[#1e2d50] to-[#2a3d65] px-6 py-12 md:px-12 md:py-16"
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FC4C00]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#FC4C00]/5 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {job.featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FC4C00] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#FC4C00]/30">
                <Award className="h-3.5 w-3.5" /> Featured
              </span>
            )}
            <span className="bg-white/8 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
              <Clock className="h-3.5 w-3.5" />
              {job.publishedAt
                ? `Posted ${new Date(job.publishedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'Open role'}
            </span>
            {job.status === 'open' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-400/30 bg-green-500/15 px-3.5 py-1.5 text-xs font-medium text-green-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> Applications Open
              </span>
            )}
          </div>

          <h1 className="mb-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            {job.title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {job.shortDescription}
          </p>

          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Meta pills row */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <DetailPill
          icon={Building2}
          label="Department"
          value={job.department || '—'}
        />
        <DetailPill
          icon={MapPin}
          label="Location"
          value={job.location || 'Remote'}
        />
        <DetailPill
          icon={Briefcase}
          label="Type"
          value={job.employmentType || '—'}
        />
        <DetailPill
          icon={Layers}
          label="Level"
          value={job.experienceLevel || '—'}
        />
      </motion.section>

      {job.salary && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 flex items-center gap-3 rounded-xl border border-[#E8D8C5] bg-white/70 px-5 py-3 backdrop-blur-sm"
        >
          <DollarSign className="h-5 w-5 text-[#FC4C00]" />
          <div>
            <span className="text-xs font-medium text-[#8A7E72]">Salary</span>
            <p className="text-sm font-semibold text-[#14213D]">{job.salary}</p>
          </div>
        </motion.div>
      )}

      {/* Two-column Layout */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main Content */}
        <div className="space-y-10">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[#E8D8C5] bg-white/60 p-6 backdrop-blur-sm md:p-8"
          >
            <SectionHeading>About the Role</SectionHeading>
            <RichContent html={job.description} />
          </motion.article>

          {job.requirements && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#E8D8C5] bg-white/60 p-6 backdrop-blur-sm md:p-8"
            >
              <SectionHeading>Requirements</SectionHeading>
              <RichContent html={job.requirements} />
            </motion.article>
          )}

          {job.responsibilities && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#E8D8C5] bg-white/60 p-6 backdrop-blur-sm md:p-8"
            >
              <SectionHeading>Responsibilities</SectionHeading>
              <RichContent html={job.responsibilities} />
            </motion.article>
          )}

          {job.niceToHave && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#E8D8C5] bg-white/60 p-6 backdrop-blur-sm md:p-8"
            >
              <SectionHeading>Nice to Have</SectionHeading>
              <RichContent html={job.niceToHave} />
            </motion.article>
          )}

          {job.benefits && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[#E8D8C5] bg-white/60 p-6 backdrop-blur-sm md:p-8"
            >
              <SectionHeading>Benefits</SectionHeading>
              <RichContent html={job.benefits} />
            </motion.article>
          )}

          {job.closingDate && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 rounded-xl border border-[#E8D8C5] bg-[#FFF4E6]/60 px-5 py-4"
            >
              <Calendar className="h-5 w-5 shrink-0 text-[#FC4C00]" />
              <div>
                <p className="text-xs font-medium text-[#8A7E72]">
                  Application Deadline
                </p>
                <p className="text-sm font-semibold text-[#14213D]">
                  {new Date(job.closingDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sticky top-24 rounded-2xl border border-[#E8D8C5] bg-white/80 p-6 shadow-xl shadow-[#14213D]/5 backdrop-blur-md"
          >
            <h3 className="mb-1 text-lg font-bold text-[#14213D]">
              Apply for this position
            </h3>
            <p className="mb-5 text-sm text-[#5F6368]">
              Join our team — submit your application in minutes.
            </p>
            {submitted ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-500" />
                <h4 className="text-lg font-bold text-[#14213D]">
                  Application Submitted!
                </h4>
                <p className="mt-2 text-sm text-[#5F6368]">
                  Thank you for applying. We will review your profile and get
                  back to you.
                </p>
              </div>
            ) : (
              <ApplicationForm job={job} onSuccess={() => setSubmitted(true)} />
            )}
          </motion.div>

          {job.closingDate && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-[#E8D8C5] bg-white/60 p-6 backdrop-blur-sm"
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#8A7E72]">
                <Calendar className="h-4 w-4" />
                Application Deadline
              </h3>
              <p className="text-lg font-bold text-[#14213D]">
                {new Date(job.closingDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </motion.div>
          )}
        </aside>
      </div>

      {isPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 rounded-lg bg-[#FFEDD7] px-4 py-3 text-sm text-[#8A7E72]"
        >
          This is a preview of a draft job posting.
        </motion.div>
      )}
    </div>
  );
}
