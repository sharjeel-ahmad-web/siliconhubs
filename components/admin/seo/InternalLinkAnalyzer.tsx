'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Link2,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

interface LinkData {
  page: string;
  title: string;
  internalLinks: { url: string; text: string }[];
  externalLinks: { url: string; text: string }[];
  incomingLinks: number;
  outgoingLinks: number;
}

interface OrphanPage {
  url: string;
  title: string;
}

export default function InternalLinkAnalyzer() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [orphanPages, setOrphanPages] = useState<OrphanPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchLinkData();
  }, []);

  const fetchLinkData = async () => {
    try {
      const res = await fetch('/api/admin/seo/links');
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
        setOrphanPages(data.orphanPages || []);
      }
    } catch (error) {
      console.error('Error fetching link data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeLinks = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/admin/seo/links/analyze', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links || []);
        setOrphanPages(data.orphanPages || []);
        setMessage({
          type: 'success',
          text: `Analyzed ${data.links?.length || 0} pages!`,
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to analyze links' });
    } finally {
      setAnalyzing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const totalInternalLinks = links.reduce(
    (acc, l) => acc + l.internalLinks.length,
    0
  );
  const totalExternalLinks = links.reduce(
    (acc, l) => acc + l.externalLinks.length,
    0
  );
  const avgLinksPerPage =
    links.length > 0 ? (totalInternalLinks / links.length).toFixed(1) : '0';

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
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{links.length}</p>
          <p className="text-sm text-slate-400">Pages Analyzed</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-[#37AFE1]">
            {totalInternalLinks}
          </p>
          <p className="text-sm text-slate-400">Internal Links</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-purple-400">
            {totalExternalLinks}
          </p>
          <p className="text-sm text-slate-400">External Links</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{avgLinksPerPage}</p>
          <p className="text-sm text-slate-400">Avg Links/Page</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-amber-400">
            {orphanPages.length}
          </p>
          <p className="text-sm text-slate-400">Orphan Pages</p>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          onClick={analyzeLinks}
          disabled={analyzing}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Analyze Site Links'}
        </button>
      </div>

      {/* Orphan Pages Warning */}
      {orphanPages.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="mb-3 flex items-center gap-2 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Orphan Pages Found</h3>
          </div>
          <p className="mb-3 text-sm text-amber-300">
            These pages have no internal links pointing to them:
          </p>
          <div className="flex flex-wrap gap-2">
            {orphanPages.map((page) => (
              <span
                key={page.url}
                className="rounded-lg bg-amber-500/20 px-3 py-1 text-sm text-amber-300"
              >
                {page.url}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Link Structure */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pages List */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">Page Link Structure</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {links.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Click "Analyze Site Links" to scan your pages
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {links.map((link) => (
                  <button
                    key={link.page}
                    onClick={() =>
                      setSelectedPage(
                        selectedPage === link.page ? null : link.page
                      )
                    }
                    className={`w-full p-4 text-left transition-colors hover:bg-slate-700/30 ${selectedPage === link.page ? 'bg-slate-700/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{link.page}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {link.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-[#37AFE1]">
                          <Link2 className="h-4 w-4" />
                          {link.internalLinks.length}
                        </span>
                        <span className="flex items-center gap-1 text-purple-400">
                          <ExternalLink className="h-4 w-4" />
                          {link.externalLinks.length}
                        </span>
                        <span className="flex items-center gap-1 text-green-400">
                          <ArrowRight className="h-4 w-4" />
                          {link.incomingLinks}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Link Details */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">
              {selectedPage
                ? `Links on ${selectedPage}`
                : 'Select a page to view links'}
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto p-4">
            {selectedPage ? (
              <>
                {(() => {
                  const pageData = links.find((l) => l.page === selectedPage);
                  if (!pageData) return null;

                  return (
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-[#37AFE1]">
                          Internal Links ({pageData.internalLinks.length})
                        </h4>
                        {pageData.internalLinks.length === 0 ? (
                          <p className="text-sm text-slate-400">
                            No internal links
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {pageData.internalLinks.map((link, i) => (
                              <div
                                key={i}
                                className="rounded-lg bg-[#0F172A] p-2"
                              >
                                <p className="text-sm text-white">
                                  {link.text || '(no anchor text)'}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {link.url}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="mb-2 text-sm font-medium text-purple-400">
                          External Links ({pageData.externalLinks.length})
                        </h4>
                        {pageData.externalLinks.length === 0 ? (
                          <p className="text-sm text-slate-400">
                            No external links
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {pageData.externalLinks.map((link, i) => (
                              <div
                                key={i}
                                className="rounded-lg bg-[#0F172A] p-2"
                              >
                                <p className="text-sm text-white">
                                  {link.text || '(no anchor text)'}
                                </p>
                                <p className="truncate text-xs text-slate-400">
                                  {link.url}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <Link2 className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>Select a page from the list to view its links</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
