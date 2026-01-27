'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Type,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

interface HeadingData {
  page: string;
  title: string;
  headings: {
    tag: string;
    text: string;
    level: number;
  }[];
  issues: {
    type: 'error' | 'warning';
    message: string;
  }[];
  score: number;
}

export default function HeadingAnalyzer() {
  const [pages, setPages] = useState<HeadingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchHeadings();
  }, []);

  const fetchHeadings = async () => {
    try {
      const res = await fetch('/api/admin/seo/headings');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching headings:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeHeadings = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/admin/seo/headings/analyze', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
        setMessage({ type: 'success', text: 'Analysis complete!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to analyze headings' });
    } finally {
      setAnalyzing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'H1':
        return 'bg-[#37AFE1]/20 text-[#37AFE1]';
      case 'H2':
        return 'bg-purple-500/20 text-purple-400';
      case 'H3':
        return 'bg-green-500/20 text-green-400';
      case 'H4':
        return 'bg-amber-500/20 text-amber-400';
      case 'H5':
        return 'bg-pink-500/20 text-pink-400';
      case 'H6':
        return 'bg-slate-500/20 text-slate-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const selectedPageData = pages.find((p) => p.page === selectedPage);
  const avgScore =
    pages.length > 0
      ? Math.round(pages.reduce((acc, p) => acc + p.score, 0) / pages.length)
      : 0;
  const pagesWithIssues = pages.filter((p) => p.issues.length > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

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
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{pages.length}</p>
          <p className="text-sm text-slate-400">Pages Analyzed</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
            {avgScore}%
          </p>
          <p className="text-sm text-slate-400">Average Score</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-amber-400">{pagesWithIssues}</p>
          <p className="text-sm text-slate-400">Pages with Issues</p>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          onClick={analyzeHeadings}
          disabled={analyzing}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Analyze All Pages'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pages List */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">Pages</h3>
          </div>
          <div className="max-h-[500px] divide-y divide-slate-700 overflow-y-auto">
            {pages.map((page) => (
              <button
                key={page.page}
                onClick={() => setSelectedPage(page.page)}
                className={`w-full p-4 text-left hover:bg-slate-700/30 ${selectedPage === page.page ? 'bg-slate-700/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{page.page}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {page.headings.length} headings
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {page.issues.length > 0 && (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    )}
                    <span
                      className={`text-lg font-bold ${getScoreColor(page.score)}`}
                    >
                      {page.score}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Heading Structure */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B] lg:col-span-2">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">
              {selectedPageData
                ? `Heading Structure: ${selectedPageData.page}`
                : 'Select a page'}
            </h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4">
            {selectedPageData ? (
              <div className="space-y-6">
                {/* Issues */}
                {selectedPageData.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">
                      Issues
                    </h4>
                    {selectedPageData.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 rounded-lg p-3 ${
                          issue.type === 'error'
                            ? 'border border-red-500/30 bg-red-500/10'
                            : 'border border-amber-500/30 bg-amber-500/10'
                        }`}
                      >
                        {issue.type === 'error' ? (
                          <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                        ) : (
                          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-400" />
                        )}
                        <span
                          className={`text-sm ${issue.type === 'error' ? 'text-red-300' : 'text-amber-300'}`}
                        >
                          {issue.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Heading Tree */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-slate-300">
                    Heading Hierarchy
                  </h4>
                  <div className="space-y-2">
                    {selectedPageData.headings.map((heading, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                        style={{ paddingLeft: `${(heading.level - 1) * 20}px` }}
                      >
                        <span
                          className={`rounded px-2 py-0.5 text-xs font-bold ${getTagColor(heading.tag)}`}
                        >
                          {heading.tag}
                        </span>
                        <span className="text-sm text-slate-300">
                          {heading.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Practices */}
                <div className="rounded-lg bg-[#0F172A] p-4">
                  <h4 className="mb-2 text-sm font-medium text-slate-300">
                    Best Practices
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li>• Use only one H1 per page</li>
                    <li>• Follow proper hierarchy (H1 → H2 → H3)</li>
                    <li>• Don't skip heading levels</li>
                    <li>• Keep headings descriptive and concise</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <Type className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>Select a page to view its heading structure</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
