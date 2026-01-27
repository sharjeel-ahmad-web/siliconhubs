'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Download,
  Globe,
  Check,
  X,
  ExternalLink,
  Clock,
} from 'lucide-react';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: number;
  included: boolean;
}

interface SitemapConfig {
  autoGenerate: boolean;
  includeImages: boolean;
  excludePatterns: string[];
  customUrls: { url: string; priority: number; changefreq: string }[];
  lastGenerated: string | null;
}

export default function SitemapGenerator() {
  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [config, setConfig] = useState<SitemapConfig>({
    autoGenerate: true,
    includeImages: true,
    excludePatterns: ['/admin/*', '/api/*'],
    customUrls: [],
    lastGenerated: null,
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [newExclude, setNewExclude] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState({
    url: '',
    priority: 0.5,
    changefreq: 'weekly',
  });

  useEffect(() => {
    fetchSitemapData();
  }, []);

  const fetchSitemapData = async () => {
    try {
      const res = await fetch('/api/admin/seo/sitemap');
      if (res.ok) {
        const data = await res.json();
        setUrls(data.urls || []);
        setConfig(data.config || config);
      }
    } catch (error) {
      console.error('Error fetching sitemap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSitemap = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/seo/sitemap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({
          type: 'success',
          text: `Sitemap generated with ${data.urlCount} URLs!`,
        });
        fetchSitemapData();
      } else {
        throw new Error('Failed to generate');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate sitemap' });
    } finally {
      setGenerating(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const saveConfig = async () => {
    try {
      const res = await fetch('/api/admin/seo/sitemap/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Configuration saved!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save configuration' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const addExcludePattern = () => {
    if (newExclude && !config.excludePatterns.includes(newExclude)) {
      setConfig({
        ...config,
        excludePatterns: [...config.excludePatterns, newExclude],
      });
      setNewExclude('');
    }
  };

  const removeExcludePattern = (pattern: string) => {
    setConfig({
      ...config,
      excludePatterns: config.excludePatterns.filter((p) => p !== pattern),
    });
  };

  const addCustomUrl = () => {
    if (newCustomUrl.url) {
      setConfig({
        ...config,
        customUrls: [...config.customUrls, newCustomUrl],
      });
      setNewCustomUrl({ url: '', priority: 0.5, changefreq: 'weekly' });
    }
  };

  const removeCustomUrl = (url: string) => {
    setConfig({
      ...config,
      customUrls: config.customUrls.filter((u) => u.url !== url),
    });
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

      {/* Status Card */}
      <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Sitemap Status</h3>
            <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {urls.length} URLs indexed
              </span>
              {config.lastGenerated && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last generated:{' '}
                  {new Date(config.lastGenerated).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-600"
            >
              <ExternalLink className="h-4 w-4" />
              View Sitemap
            </a>
            <button
              onClick={generateSitemap}
              disabled={generating}
              className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Generate Sitemap
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Configuration */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 font-semibold text-white">Configuration</h3>

          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={config.autoGenerate}
                onChange={(e) =>
                  setConfig({ ...config, autoGenerate: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
              />
              <div>
                <span className="text-white">
                  Auto-generate on content changes
                </span>
                <p className="text-xs text-slate-400">
                  Automatically update sitemap when pages are added/modified
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={config.includeImages}
                onChange={(e) =>
                  setConfig({ ...config, includeImages: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
              />
              <div>
                <span className="text-white">Include image sitemap</span>
                <p className="text-xs text-slate-400">
                  Add image URLs for Google Image search
                </p>
              </div>
            </label>

            <div className="border-t border-slate-700 pt-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Exclude Patterns
              </label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={newExclude}
                  onChange={(e) => setNewExclude(e.target.value)}
                  placeholder="/admin/*, /api/*"
                  className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white"
                />
                <button
                  onClick={addExcludePattern}
                  className="rounded-lg bg-slate-700 px-3 py-2 text-white hover:bg-slate-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {config.excludePatterns.map((pattern) => (
                  <span
                    key={pattern}
                    className="inline-flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-sm text-red-400"
                  >
                    {pattern}
                    <button onClick={() => removeExcludePattern(pattern)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={saveConfig}
              className="mt-4 w-full rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* Custom URLs */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 font-semibold text-white">Custom URLs</h3>
          <p className="mb-4 text-sm text-slate-400">
            Add external or special URLs to your sitemap
          </p>

          <div className="mb-4 space-y-3">
            <input
              type="text"
              value={newCustomUrl.url}
              onChange={(e) =>
                setNewCustomUrl({ ...newCustomUrl, url: e.target.value })
              }
              placeholder="https://example.com/page"
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white"
            />
            <div className="flex gap-2">
              <select
                value={newCustomUrl.priority}
                onChange={(e) =>
                  setNewCustomUrl({
                    ...newCustomUrl,
                    priority: parseFloat(e.target.value),
                  })
                }
                className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white"
              >
                <option value={1.0}>Priority: 1.0 (Highest)</option>
                <option value={0.8}>Priority: 0.8</option>
                <option value={0.5}>Priority: 0.5 (Default)</option>
                <option value={0.3}>Priority: 0.3</option>
                <option value={0.1}>Priority: 0.1 (Lowest)</option>
              </select>
              <select
                value={newCustomUrl.changefreq}
                onChange={(e) =>
                  setNewCustomUrl({
                    ...newCustomUrl,
                    changefreq: e.target.value,
                  })
                }
                className="flex-1 rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-sm text-white"
              >
                <option value="always">Always</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="never">Never</option>
              </select>
            </div>
            <button
              onClick={addCustomUrl}
              className="w-full rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80"
            >
              Add Custom URL
            </button>
          </div>

          <div className="max-h-48 space-y-2 overflow-y-auto">
            {config.customUrls.map((item) => (
              <div
                key={item.url}
                className="flex items-center justify-between rounded-lg bg-[#0F172A] p-2"
              >
                <div className="text-sm">
                  <div className="max-w-[200px] truncate text-white">
                    {item.url}
                  </div>
                  <div className="text-xs text-slate-400">
                    Priority: {item.priority} | {item.changefreq}
                  </div>
                </div>
                <button
                  onClick={() => removeCustomUrl(item.url)}
                  className="rounded p-1 text-red-400 hover:bg-red-500/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* URL List */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        <div className="border-b border-slate-700 p-4">
          <h3 className="font-semibold text-white">Indexed URLs</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#0F172A]">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                  URL
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                  Priority
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                  Frequency
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                  Last Modified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {urls.map((url, index) => (
                <tr key={index} className="hover:bg-slate-700/30">
                  <td className="px-4 py-2 text-sm text-slate-300">
                    {url.loc}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-400">
                    {url.priority}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-400">
                    {url.changefreq}
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-400">
                    {url.lastmod
                      ? new Date(url.lastmod).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
