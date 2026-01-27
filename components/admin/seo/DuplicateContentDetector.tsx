'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Copy, AlertTriangle, CheckCircle } from 'lucide-react';

interface DuplicateGroup {
  id: string;
  pages: {
    url: string;
    title: string;
    similarity: number;
  }[];
  type: 'exact' | 'similar' | 'partial';
  contentPreview: string;
}

export default function DuplicateContentDetector() {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchDuplicates();
  }, []);

  const fetchDuplicates = async () => {
    try {
      const res = await fetch('/api/admin/seo/duplicates');
      if (res.ok) {
        const data = await res.json();
        setDuplicates(data);
      }
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const scanForDuplicates = async () => {
    setScanning(true);
    try {
      const res = await fetch('/api/admin/seo/duplicates/scan', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setDuplicates(data);
        setMessage({
          type: 'success',
          text: `Scan complete! Found ${data.length} duplicate groups.`,
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to scan for duplicates' });
    } finally {
      setScanning(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exact':
        return 'bg-red-500/20 text-red-400';
      case 'similar':
        return 'bg-amber-500/20 text-amber-400';
      case 'partial':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exact':
        return 'Exact Match';
      case 'similar':
        return 'Very Similar';
      case 'partial':
        return 'Partial Match';
      default:
        return type;
    }
  };

  const selectedGroupData = duplicates.find((d) => d.id === selectedGroup);
  const exactCount = duplicates.filter((d) => d.type === 'exact').length;
  const similarCount = duplicates.filter((d) => d.type === 'similar').length;
  const partialCount = duplicates.filter((d) => d.type === 'partial').length;

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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{duplicates.length}</p>
          <p className="text-sm text-slate-400">Duplicate Groups</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-red-400">{exactCount}</p>
          <p className="text-sm text-slate-400">Exact Matches</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-amber-400">{similarCount}</p>
          <p className="text-sm text-slate-400">Very Similar</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-blue-400">{partialCount}</p>
          <p className="text-sm text-slate-400">Partial Matches</p>
        </div>
      </div>

      {/* Scan Button */}
      <div className="flex justify-end">
        <button
          onClick={scanForDuplicates}
          disabled={scanning}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan for Duplicates'}
        </button>
      </div>

      {duplicates.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-12 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
          <h3 className="mb-2 text-xl font-semibold text-white">
            No Duplicate Content Found
          </h3>
          <p className="text-slate-400">
            Your content is unique across all pages
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Duplicate Groups */}
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
            <div className="border-b border-slate-700 p-4">
              <h3 className="font-semibold text-white">Duplicate Groups</h3>
            </div>
            <div className="max-h-[500px] divide-y divide-slate-700 overflow-y-auto">
              {duplicates.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`w-full p-4 text-left hover:bg-slate-700/30 ${selectedGroup === group.id ? 'bg-slate-700/50' : ''}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${getTypeColor(group.type)}`}
                    >
                      {getTypeLabel(group.type)}
                    </span>
                    <span className="text-sm text-slate-400">
                      {group.pages.length} pages
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-300">
                    {group.contentPreview}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Group Details */}
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B] lg:col-span-2">
            <div className="border-b border-slate-700 p-4">
              <h3 className="font-semibold text-white">
                {selectedGroupData ? 'Duplicate Details' : 'Select a group'}
              </h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto p-4">
              {selectedGroupData ? (
                <div className="space-y-6">
                  {/* Type Badge */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-lg px-3 py-1 text-sm font-medium ${getTypeColor(selectedGroupData.type)}`}
                    >
                      {getTypeLabel(selectedGroupData.type)}
                    </span>
                    <span className="text-sm text-slate-400">
                      {selectedGroupData.pages.length} pages with similar
                      content
                    </span>
                  </div>

                  {/* Affected Pages */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-slate-300">
                      Affected Pages
                    </h4>
                    <div className="space-y-2">
                      {selectedGroupData.pages.map((page, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between rounded-lg bg-[#0F172A] p-3"
                        >
                          <div>
                            <p className="font-medium text-white">{page.url}</p>
                            <p className="text-xs text-slate-400">
                              {page.title}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={`text-lg font-bold ${page.similarity >= 90 ? 'text-red-400' : page.similarity >= 70 ? 'text-amber-400' : 'text-blue-400'}`}
                            >
                              {page.similarity}%
                            </p>
                            <p className="text-xs text-slate-500">similarity</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium text-slate-300">
                      Content Preview
                    </h4>
                    <div className="rounded-lg bg-[#0F172A] p-4">
                      <p className="whitespace-pre-wrap text-sm text-slate-400">
                        {selectedGroupData.contentPreview}
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-amber-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Recommendations</span>
                    </div>
                    <ul className="space-y-1 text-sm text-amber-300">
                      <li>• Set canonical URLs to indicate the primary page</li>
                      <li>
                        • Consolidate similar content into one comprehensive
                        page
                      </li>
                      <li>• Use 301 redirects for duplicate pages</li>
                      <li>• Rewrite content to make each page unique</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Copy className="mx-auto mb-3 h-12 w-12 opacity-50" />
                  <p>Select a duplicate group to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
