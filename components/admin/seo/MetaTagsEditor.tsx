'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface PageMeta {
  _id?: string;
  path: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  canonicalUrl: string;
  noIndex: boolean;
  noFollow: boolean;
  updatedAt?: string;
}

const defaultPages = [
  { path: '/', label: 'Homepage' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/portfolio', label: 'Portfolio' },
  { path: '/contact', label: 'Contact' },
  { path: '/blog', label: 'Blog' },
];

export default function MetaTagsEditor() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [formData, setFormData] = useState<PageMeta>({
    path: '/',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    noIndex: false,
    noFollow: false,
  });
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetchMetaTags();
  }, []);

  useEffect(() => {
    const page = pages.find((p) => p.path === selectedPage);
    if (page) {
      setFormData(page);
    } else {
      setFormData({
        path: selectedPage,
        title: '',
        description: '',
        keywords: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: 'summary_large_image',
        canonicalUrl: '',
        noIndex: false,
        noFollow: false,
      });
    }
  }, [selectedPage, pages]);

  const fetchMetaTags = async () => {
    try {
      const res = await fetch('/api/admin/seo/meta');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching meta tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/seo/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Meta tags saved successfully!' });
        fetchMetaTags();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save meta tags' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const characterCount = (text: string, max: number) => {
    const count = text.length;
    const color =
      count > max
        ? 'text-red-400'
        : count > max * 0.8
          ? 'text-amber-400'
          : 'text-slate-400';
    return (
      <span className={color}>
        {count}/{max}
      </span>
    );
  };

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Page Selector */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
            <h3 className="mb-4 font-semibold text-white">Pages</h3>
            <div className="space-y-2">
              {defaultPages.map((page) => {
                const hasMeta = pages.some((p) => p.path === page.path);
                return (
                  <button
                    key={page.path}
                    onClick={() => setSelectedPage(page.path)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
                      selectedPage === page.path
                        ? 'bg-[#37AFE1]/20 text-[#37AFE1]'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{page.label}</span>
                    {hasMeta && (
                      <span className="h-2 w-2 rounded-full bg-green-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold text-white">
                Edit Meta Tags:{' '}
                {defaultPages.find((p) => p.path === selectedPage)?.label}
              </h3>
              <button
                onClick={() => setPreviewOpen(!previewOpen)}
                className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-600"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <div className="mb-1 flex justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Page Title
                  </label>
                  {characterCount(formData.title, 60)}
                </div>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Page title for search engines"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <div className="mb-1 flex justify-between">
                  <label className="text-sm font-medium text-slate-300">
                    Meta Description
                  </label>
                  {characterCount(formData.description, 160)}
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description for search results"
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Keywords
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
              </div>

              {/* OG Title */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  OG Title (Social)
                </label>
                <input
                  type="text"
                  value={formData.ogTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, ogTitle: e.target.value })
                  }
                  placeholder="Title for social media shares (defaults to page title)"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
              </div>

              {/* OG Description */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  OG Description (Social)
                </label>
                <textarea
                  value={formData.ogDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, ogDescription: e.target.value })
                  }
                  placeholder="Description for social media shares"
                  rows={2}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
              </div>

              {/* OG Image */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  OG Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.ogImage}
                    onChange={(e) =>
                      setFormData({ ...formData, ogImage: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg (1200x630 recommended)"
                    className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  />
                </div>
              </div>

              {/* Twitter Card */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Twitter Card Type
                </label>
                <select
                  value={formData.twitterCard}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      twitterCard: e.target.value as
                        | 'summary'
                        | 'summary_large_image',
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">
                    Summary Large Image
                  </option>
                </select>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Canonical URL
                </label>
                <input
                  type="text"
                  value={formData.canonicalUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, canonicalUrl: e.target.value })
                  }
                  placeholder="https://example.com/page (leave empty for auto)"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
              </div>

              {/* Indexing Options */}
              <div className="flex gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.noIndex}
                    onChange={(e) =>
                      setFormData({ ...formData, noIndex: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1] focus:ring-[#37AFE1]"
                  />
                  <span className="text-sm text-slate-300">No Index</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.noFollow}
                    onChange={(e) =>
                      setFormData({ ...formData, noFollow: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1] focus:ring-[#37AFE1]"
                  />
                  <span className="text-sm text-slate-300">No Follow</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-700 pt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Meta Tags
              </button>
            </div>
          </div>

          {/* Preview */}
          {previewOpen && (
            <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
              <h3 className="mb-4 font-semibold text-white">
                Search Result Preview
              </h3>
              <div className="rounded-lg bg-white p-4">
                <div className="cursor-pointer text-xl text-[#1a0dab] hover:underline">
                  {formData.title || 'Page Title'}
                </div>
                <div className="mt-1 text-sm text-[#006621]">
                  {`${siteUrl}${formData.path}`}
                </div>
                <div className="mt-1 text-sm text-[#545454]">
                  {formData.description ||
                    'Meta description will appear here...'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
