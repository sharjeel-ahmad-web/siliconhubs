'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  Eye,
  Users,
  Briefcase,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';

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
                        <p className="text-sm text-slate-300">
                          {app.resume.fileName}{' '}
                          <span className="text-slate-500">
                            ({(app.resume.fileSize / 1024).toFixed(0)} KB)
                          </span>
                        </p>
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
