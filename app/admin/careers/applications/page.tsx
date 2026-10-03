'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  Eye,
  Download,
  FileText,
  ClipboardCheck,
  Users,
  Briefcase,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import type { ATSReview } from '@/lib/careers/ats';

interface Application {
  _id: string;
  referenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  currentRole?: string;
  yearsOfExperience?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: string;
  availability?: string;
  coverLetter?: string;
  resume?: any;
  atsReview?: ATSReview;
  stage: string;
  jobTitle?: string;
  createdAt: string;
}

const STAGES = [
  'New',
  'Screening',
  'Shortlisted',
  'Interview',
  'Technical / Role Interview',
  'Final Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export default function AdminCareersApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [atsRunningId, setAtsRunningId] = useState<string | null>(null);
  const [atsError, setAtsError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/careers/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (
    appId: string,
    newStage: string,
    currentStage: string,
    existingNotes: any[]
  ) => {
    try {
      const res = await fetch('/api/admin/careers/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: appId,
          stage: newStage,
          existingStage: currentStage,
          existingNotes: existingNotes,
          notes: `Stage changed from ${currentStage} to ${newStage}`,
        }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating stage:', error);
    }
  };

  const handleAtsTest = async (appId: string) => {
    setAtsRunningId(appId);
    setAtsError('');
    try {
      const res = await fetch(
        `/api/admin/careers/applications?atsId=${appId}`,
        { method: 'POST' }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ATS test failed.');
      setApplications((current) =>
        current.map((app) =>
          app._id === appId ? { ...app, atsReview: data.review } : app
        )
      );
    } catch (error) {
      setAtsError(error instanceof Error ? error.message : 'ATS test failed.');
    } finally {
      setAtsRunningId(null);
    }
  };

  const filtered = applications.filter((app) => {
    const matchSearch =
      !search ||
      app.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      app.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      app.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.referenceId?.toLowerCase().includes(search.toLowerCase());
    const matchStage = !stageFilter || app.stage === stageFilter;
    return matchSearch && matchStage;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Application Management
        </h1>
        <p className="mt-1 text-slate-400">
          Review and manage candidate applications
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or reference ID..."
            className="w-full rounded-lg border border-slate-700 bg-navy py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#FC4C00] focus:outline-none"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-lg border border-slate-700 bg-navy px-4 py-2.5 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
        >
          <option value="">All Stages</option>
          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>
        <span className="flex items-center gap-2 text-sm text-slate-400">
          <Filter className="h-4 w-4" />
          {filtered.length} of {applications.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#FC4C00]" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const isExpanded = expandedId === app._id;
            return (
              <div
                key={app._id}
                className="overflow-hidden rounded-xl border border-slate-700/50 bg-navy"
              >
                <div
                  className="flex cursor-pointer items-center justify-between p-5 hover:bg-slate-800/30"
                  onClick={() => setExpandedId(isExpanded ? null : app._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFEDD7]">
                      <Users className="h-5 w-5 text-[#FC4C00]" />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {app.firstName} {app.lastName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {app.email} · {app.referenceId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#FFEDD7] px-2.5 py-0.5 text-xs font-medium text-[#FC4C00]">
                      {app.stage}
                    </span>
                    {app.jobTitle && (
                      <span className="text-xs text-slate-400">
                        <Briefcase className="mr-1 inline h-3 w-3" />
                        {app.jobTitle}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      <Clock className="mr-1 inline h-3 w-3" />
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-700/50 p-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-white">
                          Contact Info
                        </h4>
                        <div className="space-y-1 text-sm text-slate-300">
                          <p>Email: {app.email}</p>
                          {app.phone && <p>Phone: {app.phone}</p>}
                          {app.location && <p>Location: {app.location}</p>}
                          {app.currentRole && (
                            <p>Current Role: {app.currentRole}</p>
                          )}
                          {app.yearsOfExperience && (
                            <p>Experience: {app.yearsOfExperience}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 text-sm font-semibold text-white">
                          Links
                        </h4>
                        <div className="space-y-1 text-sm text-slate-300">
                          {app.linkedinUrl && (
                            <p>
                              LinkedIn:{' '}
                              <a
                                href={app.linkedinUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#FC4C00] underline"
                              >
                                {app.linkedinUrl}
                              </a>
                            </p>
                          )}
                          {app.githubUrl && (
                            <p>
                              GitHub:{' '}
                              <a
                                href={app.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#FC4C00] underline"
                              >
                                {app.githubUrl}
                              </a>
                            </p>
                          )}
                          {app.portfolioUrl && (
                            <p>
                              Portfolio:{' '}
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#FC4C00] underline"
                              >
                                {app.portfolioUrl}
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Resume */}
                    {app.resume && (
                      <div className="mt-4">
                        <h4 className="mb-2 text-sm font-semibold text-white">
                          Resume
                        </h4>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm text-slate-300">
                            {app.resume.fileName}{' '}
                            <span className="text-slate-500">
                              ({(app.resume.fileSize / 1024).toFixed(0)} KB)
                            </span>
                          </p>
                          <a
                            href={`/api/admin/careers/applications?resumeId=${app._id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-[#FC4C00] hover:underline"
                          >
                            <Eye className="h-4 w-4" /> View
                          </a>
                          <a
                            href={`/api/admin/careers/applications?resumeId=${app._id}&download=1`}
                            className="inline-flex items-center gap-1.5 text-sm text-[#FC4C00] hover:underline"
                          >
                            <Download className="h-4 w-4" /> Download
                          </a>
                          <button
                            type="button"
                            onClick={() => handleAtsTest(app._id)}
                            disabled={atsRunningId === app._id}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-600 px-3 py-1.5 text-sm text-white hover:border-[#FC4C00] disabled:cursor-wait disabled:opacity-60"
                          >
                            {atsRunningId === app._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ClipboardCheck className="h-4 w-4" />
                            )}
                            {atsRunningId === app._id
                              ? 'Analyzing'
                              : 'Run ATS test'}
                          </button>
                        </div>
                        {atsError && atsRunningId === null && (
                          <p role="alert" className="mt-2 text-sm text-red-400">
                            {atsError}
                          </p>
                        )}
                        {app.atsReview && (
                          <div className="mt-4 border-t border-slate-700/50 pt-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <h5 className="flex items-center gap-2 text-sm font-semibold text-white">
                                <FileText className="h-4 w-4 text-[#FC4C00]" />
                                ATS readiness estimate: {app.atsReview.score}
                                /100
                              </h5>
                              <span className="text-xs text-slate-500">
                                {app.atsReview.wordCount} words · checked{' '}
                                {new Date(
                                  app.atsReview.reviewedAt
                                ).toLocaleString()}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">
                              Screening aid only; this heuristic is not a hiring
                              decision.
                            </p>
                            <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                              {app.atsReview.checks.map((check) => (
                                <li
                                  key={check.label}
                                  className="text-slate-300"
                                >
                                  <span
                                    className={
                                      check.status === 'good'
                                        ? 'text-green-400'
                                        : 'text-amber-400'
                                    }
                                  >
                                    {check.status === 'good' ? 'OK' : 'Review'}
                                  </span>{' '}
                                  {check.label}: {check.detail}
                                </li>
                              ))}
                            </ul>
                            {(app.atsReview.matchedKeywords.length > 0 ||
                              app.atsReview.missingKeywords.length > 0) && (
                              <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                                <p className="text-slate-300">
                                  Matched:{' '}
                                  {app.atsReview.matchedKeywords.join(', ') ||
                                    'None'}
                                </p>
                                <p className="text-slate-300">
                                  Not found:{' '}
                                  {app.atsReview.missingKeywords.join(', ') ||
                                    'None'}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stage Change */}
                    <div className="mt-5">
                      <h4 className="mb-2 text-sm font-semibold text-white">
                        Change Stage
                      </h4>
                      <select
                        value={app.stage}
                        onChange={(e) =>
                          handleStageChange(
                            app._id,
                            e.target.value,
                            app.stage,
                            []
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                      >
                        {STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500">
              No applications found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
