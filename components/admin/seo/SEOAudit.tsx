'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Image,
  Link2,
  Type,
} from 'lucide-react';

interface AuditResult {
  page: string;
  score: number;
  issues: {
    type: 'error' | 'warning' | 'success';
    category: string;
    message: string;
    details?: string;
  }[];
  checks: {
    title: {
      status: 'pass' | 'fail' | 'warning';
      value: string;
      length: number;
    };
    description: {
      status: 'pass' | 'fail' | 'warning';
      value: string;
      length: number;
    };
    h1: {
      status: 'pass' | 'fail' | 'warning';
      count: number;
      values: string[];
    };
    images: { total: number; withAlt: number; withoutAlt: string[] };
    internalLinks: number;
    externalLinks: number;
    wordCount: number;
  };
}

export default function SEOAudit() {
  const [audits, setAudits] = useState<AuditResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const pages = ['/', '/about', '/services', '/portfolio', '/contact', '/blog'];

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      const res = await fetch('/api/admin/seo/audit');
      if (res.ok) {
        const data = await res.json();
        setAudits(data);
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async (page?: string) => {
    setAuditing(true);
    try {
      const res = await fetch('/api/admin/seo/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page }),
      });

      if (res.ok) {
        const data = await res.json();
        setAudits(data);
        setMessage({ type: 'success', text: 'Audit complete!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to run audit' });
    } finally {
      setAuditing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-amber-500/20 border-amber-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const avgScore =
    audits.length > 0
      ? Math.round(audits.reduce((acc, a) => acc + a.score, 0) / audits.length)
      : 0;

  const totalIssues = audits.reduce(
    (acc, a) => acc + a.issues.filter((i) => i.type !== 'success').length,
    0
  );
  const errorCount = audits.reduce(
    (acc, a) => acc + a.issues.filter((i) => i.type === 'error').length,
    0
  );
  const warningCount = audits.reduce(
    (acc, a) => acc + a.issues.filter((i) => i.type === 'warning').length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  const selectedAudit = audits.find((a) => a.page === selectedPage);

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 ${message.type === 'success' ? 'border border-green-500/30 bg-green-500/20 text-green-400' : 'border border-red-500/30 bg-red-500/20 text-red-400'}`}
        >
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className={`rounded-xl border p-4 ${getScoreBg(avgScore)}`}>
          <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>
            {avgScore}
          </p>
          <p className="text-sm text-slate-400">Average Score</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{totalIssues}</p>
          <p className="text-sm text-slate-400">Total Issues</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400" />
            <p className="text-2xl font-bold text-red-400">{errorCount}</p>
          </div>
          <p className="text-sm text-slate-400">Errors</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <p className="text-2xl font-bold text-amber-400">{warningCount}</p>
          </div>
          <p className="text-sm text-slate-400">Warnings</p>
        </div>
      </div>

      {/* Audit Button */}
      <div className="flex justify-end">
        <button
          onClick={() => runAudit()}
          disabled={auditing}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${auditing ? 'animate-spin' : ''}`} />
          {auditing ? 'Auditing...' : 'Run Full Audit'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pages List */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">Page Scores</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {pages.map((page) => {
              const audit = audits.find((a) => a.page === page);
              return (
                <button
                  key={page}
                  onClick={() => setSelectedPage(page)}
                  className={`w-full p-4 text-left transition-colors hover:bg-slate-700/30 ${selectedPage === page ? 'bg-slate-700/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white">
                      {page === '/' ? 'Homepage' : page}
                    </span>
                    {audit ? (
                      <span
                        className={`text-lg font-bold ${getScoreColor(audit.score)}`}
                      >
                        {audit.score}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-500">
                        Not audited
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audit Details */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B] lg:col-span-2">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">
              {selectedPage ? `Audit: ${selectedPage}` : 'Select a page'}
            </h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4">
            {selectedAudit ? (
              <div className="space-y-6">
                {/* Score Circle */}
                <div className="flex items-center gap-6">
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${getScoreBg(selectedAudit.score)}`}
                  >
                    <span
                      className={`text-3xl font-bold ${getScoreColor(selectedAudit.score)}`}
                    >
                      {selectedAudit.score}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">SEO Score</p>
                    <p className="text-sm text-slate-400">
                      {selectedAudit.score >= 80
                        ? 'Good'
                        : selectedAudit.score >= 60
                          ? 'Needs Improvement'
                          : 'Poor'}
                    </p>
                  </div>
                </div>

                {/* Checks */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Type className="h-4 w-4 text-[#37AFE1]" />
                      <span className="text-sm text-slate-300">Title</span>
                    </div>
                    <p className="truncate text-sm text-white">
                      {selectedAudit.checks.title.value || 'Missing'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedAudit.checks.title.length} characters
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#37AFE1]" />
                      <span className="text-sm text-slate-300">
                        Description
                      </span>
                    </div>
                    <p className="truncate text-sm text-white">
                      {selectedAudit.checks.description.value || 'Missing'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedAudit.checks.description.length} characters
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Image
                        className="h-4 w-4 text-[#37AFE1]"
                        aria-label="Images icon"
                      />
                      <span className="text-sm text-slate-300">Images</span>
                    </div>
                    <p className="text-white">
                      {selectedAudit.checks.images.withAlt}/
                      {selectedAudit.checks.images.total} with alt
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-[#37AFE1]" />
                      <span className="text-sm text-slate-300">Links</span>
                    </div>
                    <p className="text-white">
                      {selectedAudit.checks.internalLinks} internal,{' '}
                      {selectedAudit.checks.externalLinks} external
                    </p>
                  </div>
                </div>

                {/* Issues */}
                <div>
                  <h4 className="mb-3 font-medium text-white">
                    Issues & Recommendations
                  </h4>
                  <div className="space-y-2">
                    {selectedAudit.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-lg p-3 ${
                          issue.type === 'error'
                            ? 'border border-red-500/30 bg-red-500/10'
                            : issue.type === 'warning'
                              ? 'border border-amber-500/30 bg-amber-500/10'
                              : 'border border-green-500/30 bg-green-500/10'
                        }`}
                      >
                        {issue.type === 'error' ? (
                          <XCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                        ) : issue.type === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400" />
                        ) : (
                          <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-400" />
                        )}
                        <div>
                          <p
                            className={`text-sm ${
                              issue.type === 'error'
                                ? 'text-red-300'
                                : issue.type === 'warning'
                                  ? 'text-amber-300'
                                  : 'text-green-300'
                            }`}
                          >
                            {issue.message}
                          </p>
                          {issue.details && (
                            <p className="mt-1 text-xs text-slate-400">
                              {issue.details}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <FileText className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>Select a page to view its SEO audit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
