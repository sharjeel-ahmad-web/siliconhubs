'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Link2,
} from 'lucide-react';

interface BrokenLink {
  _id?: string;
  url: string;
  foundOn: string;
  anchorText: string;
  statusCode: number;
  type: 'internal' | 'external';
  lastChecked: string;
  fixed: boolean;
}

export default function BrokenLinkChecker() {
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [filter, setFilter] = useState<'all' | 'internal' | 'external'>('all');

  useEffect(() => {
    fetchBrokenLinks();
  }, []);

  const fetchBrokenLinks = async () => {
    try {
      const res = await fetch('/api/admin/seo/broken-links');
      if (res.ok) {
        const data = await res.json();
        setBrokenLinks(data);
      }
    } catch (error) {
      console.error('Error fetching broken links:', error);
    } finally {
      setLoading(false);
    }
  };

  const scanForBrokenLinks = async () => {
    setScanning(true);
    setProgress(0);

    try {
      const res = await fetch('/api/admin/seo/broken-links/scan', {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setBrokenLinks(data.brokenLinks || []);
        setMessage({
          type: 'success',
          text: `Scan complete! Found ${data.brokenLinks?.length || 0} broken links out of ${data.totalChecked} checked.`,
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to scan for broken links' });
    } finally {
      setScanning(false);
      setProgress(100);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const markAsFixed = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/seo/broken-links/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fixed: true }),
      });

      if (res.ok) {
        fetchBrokenLinks();
      }
    } catch (error) {
      console.error('Error marking as fixed:', error);
    }
  };

  const getStatusColor = (code: number) => {
    if (code === 404) return 'bg-red-500/20 text-red-400';
    if (code === 500) return 'bg-red-500/20 text-red-400';
    if (code === 403) return 'bg-amber-500/20 text-amber-400';
    if (code === 301 || code === 302) return 'bg-amber-500/20 text-amber-400';
    return 'bg-slate-500/20 text-slate-400';
  };

  const getStatusLabel = (code: number) => {
    switch (code) {
      case 404:
        return 'Not Found';
      case 500:
        return 'Server Error';
      case 403:
        return 'Forbidden';
      case 301:
        return 'Moved Permanently';
      case 302:
        return 'Temporary Redirect';
      case 0:
        return 'Connection Failed';
      default:
        return `Error ${code}`;
    }
  };

  const filteredLinks = brokenLinks.filter((link) => {
    if (filter === 'all') return !link.fixed;
    return link.type === filter && !link.fixed;
  });

  const internalCount = brokenLinks.filter(
    (l) => l.type === 'internal' && !l.fixed
  ).length;
  const externalCount = brokenLinks.filter(
    (l) => l.type === 'external' && !l.fixed
  ).length;
  const fixedCount = brokenLinks.filter((l) => l.fixed).length;

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
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400" />
            <p className="text-2xl font-bold text-red-400">
              {internalCount + externalCount}
            </p>
          </div>
          <p className="text-sm text-slate-400">Broken Links</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[#37AFE1]" />
            <p className="text-2xl font-bold text-[#37AFE1]">{internalCount}</p>
          </div>
          <p className="text-sm text-slate-400">Internal</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-purple-400" />
            <p className="text-2xl font-bold text-purple-400">
              {externalCount}
            </p>
          </div>
          <p className="text-sm text-slate-400">External</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <p className="text-2xl font-bold text-green-400">{fixedCount}</p>
          </div>
          <p className="text-sm text-slate-400">Fixed</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex gap-2">
          {(['all', 'internal', 'external'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#37AFE1] text-white'
                  : 'bg-[#1E293B] text-slate-300 hover:bg-slate-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={scanForBrokenLinks}
          disabled={scanning}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Scanning...' : 'Scan for Broken Links'}
        </button>
      </div>

      {/* Progress Bar */}
      {scanning && (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-300">Scanning pages...</span>
            <span className="text-sm text-slate-400">{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-700">
            <div
              className="h-2 rounded-full bg-[#37AFE1] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Broken Links Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        {filteredLinks.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              {brokenLinks.length === 0
                ? 'No broken links found'
                : 'All broken links fixed!'}
            </h3>
            <p className="text-slate-400">
              {brokenLinks.length === 0
                ? 'Run a scan to check for broken links'
                : 'Great job keeping your site healthy'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700 bg-[#0F172A]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Broken URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Found On
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Anchor Text
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLinks.map((link) => (
                  <tr key={link._id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <p className="max-w-xs truncate text-sm text-white">
                        {link.url}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">
                      {link.foundOn}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-400">
                      {link.anchorText || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(link.statusCode)}`}
                      >
                        {getStatusLabel(link.statusCode)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${link.type === 'internal' ? 'text-[#37AFE1]' : 'text-purple-400'}`}
                      >
                        {link.type === 'internal' ? (
                          <Link2 className="h-3 w-3" />
                        ) : (
                          <ExternalLink className="h-3 w-3" />
                        )}
                        {link.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => markAsFixed(link._id!)}
                        className="rounded bg-green-500/20 px-3 py-1 text-xs text-green-400 hover:bg-green-500/30"
                      >
                        Mark Fixed
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
