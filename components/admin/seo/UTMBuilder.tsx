'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Plus, Trash2, Link2, ExternalLink } from 'lucide-react';

interface SavedUTM {
  _id?: string;
  name: string;
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  fullUrl: string;
  clicks: number;
  createdAt: string;
}

export default function UTMBuilder() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const [savedLinks, setSavedLinks] = useState<SavedUTM[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    url: siteUrl,
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });

  const commonSources = [
    'google',
    'facebook',
    'twitter',
    'linkedin',
    'instagram',
    'email',
    'newsletter',
  ];
  const commonMediums = [
    'cpc',
    'social',
    'email',
    'banner',
    'affiliate',
    'organic',
  ];

  useEffect(() => {
    fetchSavedLinks();
  }, []);

  const fetchSavedLinks = async () => {
    try {
      const res = await fetch('/api/admin/seo/utm');
      if (res.ok) {
        const data = await res.json();
        setSavedLinks(data);
      }
    } catch (error) {
      console.error('Error fetching UTM links:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUrl = () => {
    const params = new URLSearchParams();
    if (formData.source) params.append('utm_source', formData.source);
    if (formData.medium) params.append('utm_medium', formData.medium);
    if (formData.campaign) params.append('utm_campaign', formData.campaign);
    if (formData.term) params.append('utm_term', formData.term);
    if (formData.content) params.append('utm_content', formData.content);

    const queryString = params.toString();
    return queryString ? `${formData.url}?${queryString}` : formData.url;
  };

  const fullUrl = generateUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.source ||
      !formData.medium ||
      !formData.campaign
    ) {
      setMessage({
        type: 'error',
        text: 'Please fill in name, source, medium, and campaign',
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/admin/seo/utm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, fullUrl }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'UTM link saved!' });
        fetchSavedLinks();
        setFormData({
          name: '',
          url: siteUrl,
          source: '',
          medium: '',
          campaign: '',
          term: '',
          content: '',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this UTM link?')) return;

    try {
      const res = await fetch(`/api/admin/seo/utm/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSavedLinks();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Builder */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 font-semibold text-white">Build UTM Link</h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Link Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Facebook Holiday Campaign"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Website URL *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://yourdomain.com"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Campaign Source * (utm_source)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  placeholder="e.g., google, facebook, newsletter"
                  className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                />
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                >
                  <option value="">Quick</option>
                  {commonSources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Campaign Medium * (utm_medium)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.medium}
                  onChange={(e) =>
                    setFormData({ ...formData, medium: e.target.value })
                  }
                  placeholder="e.g., cpc, social, email"
                  className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                />
                <select
                  onChange={(e) =>
                    setFormData({ ...formData, medium: e.target.value })
                  }
                  className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                >
                  <option value="">Quick</option>
                  {commonMediums.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Campaign Name * (utm_campaign)
              </label>
              <input
                type="text"
                value={formData.campaign}
                onChange={(e) =>
                  setFormData({ ...formData, campaign: e.target.value })
                }
                placeholder="e.g., spring_sale, product_launch"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Campaign Term (utm_term)
              </label>
              <input
                type="text"
                value={formData.term}
                onChange={(e) =>
                  setFormData({ ...formData, term: e.target.value })
                }
                placeholder="e.g., running+shoes (for paid search)"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Campaign Content (utm_content)
              </label>
              <input
                type="text"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="e.g., logolink, textlink (for A/B testing)"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Generated URL */}
          <div className="mt-6 rounded-lg bg-[#0F172A] p-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Generated URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fullUrl}
                readOnly
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-white"
              />
              <button
                onClick={copyToClipboard}
                className="rounded-lg bg-slate-700 px-3 py-2 text-white hover:bg-slate-600"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80"
          >
            <Plus className="h-5 w-5" />
            Save UTM Link
          </button>
        </div>

        {/* Saved Links */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">Saved UTM Links</h3>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {savedLinks.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Link2 className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>No saved UTM links yet</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {savedLinks.map((link) => (
                  <div key={link._id} className="p-4 hover:bg-slate-700/30">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-white">{link.name}</p>
                        <p className="mt-1 truncate font-mono text-xs text-slate-400">
                          {link.fullUrl}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <span className="rounded bg-[#37AFE1]/20 px-2 py-0.5 text-xs text-[#37AFE1]">
                            {link.source}
                          </span>
                          <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
                            {link.medium}
                          </span>
                          <span className="rounded bg-green-500/20 px-2 py-0.5 text-xs text-green-400">
                            {link.campaign}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(link.fullUrl);
                            setMessage({ type: 'success', text: 'Copied!' });
                            setTimeout(() => setMessage(null), 2000);
                          }}
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <a
                          href={link.fullUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(link._id!)}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
