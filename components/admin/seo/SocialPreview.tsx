'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Facebook, Twitter, Linkedin, Globe } from 'lucide-react';

interface PageMeta {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

export default function SocialPreview() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  const siteDomain = siteUrl.replace(/^https?:\/\//, '');
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [previewType, setPreviewType] = useState<
    'facebook' | 'twitter' | 'linkedin' | 'google'
  >('facebook');

  const defaultPages = [
    { path: '/', label: 'Homepage' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact' },
    { path: '/blog', label: 'Blog' },
  ];

  useEffect(() => {
    fetchMetaTags();
  }, []);

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

  const currentMeta = pages.find((p) => p.path === selectedPage) || {
    path: selectedPage,
    title: 'Your Site',
    description: 'Your site description',
    ogTitle: '',
    ogDescription: '',
    ogImage: '/og-image.jpg',
  };

  const displayTitle = currentMeta.ogTitle || currentMeta.title;
  const displayDescription =
    currentMeta.ogDescription || currentMeta.description;
  const displayImage = currentMeta.ogImage || '/og-image.jpg';
  const displayUrl = `${siteDomain}${selectedPage}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page & Platform Selector */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Select Page
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-[#1E293B] px-3 py-2 text-white"
          >
            {defaultPages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Platform
          </label>
          <div className="flex gap-2">
            {[
              { id: 'facebook', icon: Facebook, color: '#1877F2' },
              { id: 'twitter', icon: Twitter, color: '#1DA1F2' },
              { id: 'linkedin', icon: Linkedin, color: '#0A66C2' },
              { id: 'google', icon: Globe, color: '#4285F4' },
            ].map(({ id, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => setPreviewType(id as any)}
                className={`rounded-lg p-3 transition-colors ${
                  previewType === id
                    ? 'bg-slate-700 ring-2 ring-[#37AFE1]'
                    : 'bg-[#1E293B] hover:bg-slate-700'
                }`}
                style={{ color: previewType === id ? color : '#94a3b8' }}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
        <h3 className="mb-4 font-semibold capitalize text-white">
          {previewType} Preview
        </h3>

        {previewType === 'facebook' && (
          <div className="max-w-lg overflow-hidden rounded-lg bg-white shadow-lg">
            <div className="relative aspect-[1.91/1] bg-slate-200">
              {displayImage && (
                <img
                  src={displayImage}
                  alt="OG Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-og.jpg';
                  }}
                />
              )}
            </div>
            <div className="border-t p-3">
              <p className="text-xs uppercase text-gray-500">{displayUrl}</p>
              <p className="mt-1 line-clamp-2 font-semibold text-[#1d2129]">
                {displayTitle}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {displayDescription}
              </p>
            </div>
          </div>
        )}

        {previewType === 'twitter' && (
          <div className="max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="relative aspect-[2/1] bg-slate-200">
              {displayImage && (
                <img
                  src={displayImage}
                  alt="Twitter Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-og.jpg';
                  }}
                />
              )}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 font-bold text-[#0f1419]">
                {displayTitle}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-[#536471]">
                {displayDescription}
              </p>
              <p className="mt-2 flex items-center gap-1 text-sm text-[#536471]">
                <Globe className="h-4 w-4" />
                {displayUrl}
              </p>
            </div>
          </div>
        )}

        {previewType === 'linkedin' && (
          <div className="max-w-lg overflow-hidden rounded-lg border border-gray-300 bg-white">
            <div className="relative aspect-[1.91/1] bg-slate-200">
              {displayImage && (
                <img
                  src={displayImage}
                  alt="LinkedIn Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-og.jpg';
                  }}
                />
              )}
            </div>
            <div className="bg-[#f3f2ef] p-3">
              <p className="line-clamp-2 font-semibold text-[#000000e6]">
                {displayTitle}
              </p>
              <p className="mt-1 text-xs text-[#00000099]">{displayUrl}</p>
            </div>
          </div>
        )}

        {previewType === 'google' && (
          <div className="max-w-2xl rounded-lg bg-white p-4">
            <div className="mb-1 flex items-center gap-2">
              <img src="/favicon.ico" alt="" className="h-7 w-7 rounded-full" />
              <div>
                <p className="text-sm text-[#202124]">Rising Dot Agency</p>
                <p className="text-xs text-[#4d5156]">https://{displayUrl}</p>
              </div>
            </div>
            <h3 className="mb-1 cursor-pointer text-xl text-[#1a0dab] hover:underline">
              {displayTitle}
            </h3>
            <p className="line-clamp-2 text-sm text-[#4d5156]">
              {displayDescription}
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
        <h3 className="mb-4 font-semibold text-white">Optimization Tips</h3>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="rounded-lg bg-[#0F172A] p-3">
            <p className="mb-1 font-medium text-[#37AFE1]">OG Image</p>
            <p className="text-slate-400">
              Recommended size: 1200x630px for best display across platforms
            </p>
          </div>
          <div className="rounded-lg bg-[#0F172A] p-3">
            <p className="mb-1 font-medium text-[#37AFE1]">Title Length</p>
            <p className="text-slate-400">
              Keep under 60 characters for Google, 70 for social media
            </p>
          </div>
          <div className="rounded-lg bg-[#0F172A] p-3">
            <p className="mb-1 font-medium text-[#37AFE1]">Description</p>
            <p className="text-slate-400">
              150-160 characters for Google, up to 200 for social
            </p>
          </div>
          <div className="rounded-lg bg-[#0F172A] p-3">
            <p className="mb-1 font-medium text-[#37AFE1]">Test Your Links</p>
            <p className="text-slate-400">
              Use Facebook Debugger and Twitter Card Validator to test
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
