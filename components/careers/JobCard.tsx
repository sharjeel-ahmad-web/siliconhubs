'use client';

/**
 * Job listing card — displays key position info with the existing
 * SiliconHubs hover / reveal patterns.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  Clock,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import { CareerJob } from '@/types/careers';
import { REMOTE_STATUS_LABELS } from '@/lib/careers/constants';
import { timeAgo } from '@/lib/careers/helpers';

interface JobCardProps {
  job: CareerJob;
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  const remoteLabel = job.remoteStatus
    ? REMOTE_STATUS_LABELS[job.remoteStatus]
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      className="group"
    >
      <Link
        href={`/careers/${job.slug}`}
        className="block h-full rounded-2xl border border-[#E8D8C5] bg-white/[0.55] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FC4C00]/40 hover:shadow-xl hover:shadow-[#FC4C00]/10"
      >
        {/* Top row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {job.featured ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FC4C00] px-3 py-1 text-xs font-semibold text-white">
              <Award className="h-3.5 w-3.5" /> Featured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFEDD7] px-3 py-1 text-xs font-medium text-[#14213D]">
              <Layers className="h-3.5 w-3.5 text-[#FC4C00]" />
              {job.department || 'General'}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 text-xs text-[#8A7E72]">
            <Clock className="h-3.5 w-3.5" />
            {job.publishedAt
              ? `Posted ${timeAgo(job.publishedAt)}`
              : 'Open role'}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold leading-snug text-[#14213D] transition-colors duration-300 group-hover:text-[#FC4C00]">
          {job.title}
        </h3>

        {/* Short description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#5F6368]">
          {job.shortDescription ||
            job.description?.replace(/<[^>]*>/g, '').slice(0, 160) ||
            'Join our team.'}
        </p>

        {/* Meta */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#5F6368]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#FC4C00]" />
            {job.location || 'Remote'}
          </span>
          {remoteLabel && (
            <span className="inline-flex items-center rounded-full border border-[#E8D8C5] px-2.5 py-0.5 text-xs">
              {remoteLabel}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs">
            <Briefcase className="h-3.5 w-3.5" />
            {job.employmentType}
          </span>
          {job.experienceLevel && (
            <span className="text-xs">{job.experienceLevel}</span>
          )}
        </div>

        {/* Skills preview */}
        {Array.isArray(job.skills) && job.skills.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#FFF4E6] px-2.5 py-1 text-xs font-medium text-[#14213D]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-semibold text-[#FC4C00]">
          View Position
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.article>
  );
}
