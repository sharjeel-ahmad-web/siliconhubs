'use client';

import { useState } from 'react';
import {
  RefreshCw,
  Gauge,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
} from 'lucide-react';

interface PageSpeedResult {
  url: string;
  device: 'mobile' | 'desktop';
  score: number;
  metrics: {
    fcp: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    lcp: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    fid: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    ttfb: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
    si: { value: number; score: 'good' | 'needs-improvement' | 'poor' };
  };
  opportunities: { title: string; savings: string }[];
  diagnostics: { title: string; description: string }[];
}

export default function PageSpeedInsights() {
  const [results, setResults] = useState<PageSpeedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [urlType, setUrlType] = useState<'preset' | 'custom'>('preset');
  const [selectedUrl, setSelectedUrl] = useState(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
  );
  const [customUrl, setCustomUrl] = useState('');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

  const presetPages = [
    { url: siteUrl, label: 'Homepage' },
    { url: `${siteUrl}/about`, label: 'About' },
    { url: `${siteUrl}/services`, label: 'Services' },
    { url: `${siteUrl}/portfolio`, label: 'Portfolio' },
    { url: `${siteUrl}/contact`, label: 'Contact' },
    { url: `${siteUrl}/blog`, label: 'Blog' },
  ];

  const getTestUrl = () => {
    if (urlType === 'custom') {
      return customUrl;
    }
    return selectedUrl;
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const runTest = async () => {
    const testUrl = getTestUrl();

    if (!testUrl) {
      setMessage({ type: 'error', text: 'Please enter a URL' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!validateUrl(testUrl)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid URL (include https://)',
      });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/seo/pagespeed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl, device }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults((prev) => {
          const filtered = prev.filter(
            (r) => !(r.url === data.url && r.device === data.device)
          );
          return [...filtered, data];
        });
        setMessage({ type: 'success', text: 'Analysis complete!' });
      } else {
        throw new Error(data.error || 'Failed to analyze');
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to run PageSpeed test',
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const currentUrl = getTestUrl();
  const currentResult = results.find(
    (r) => r.url === currentUrl && r.device === device
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/50';
    if (score >= 50) return 'bg-amber-500/20 border-amber-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getMetricColor = (score: string) => {
    if (score === 'good') return 'text-green-400';
    if (score === 'needs-improvement') return 'text-amber-400';
    return 'text-red-400';
  };

  const getMetricIcon = (score: string) => {
    if (score === 'good')
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (score === 'needs-improvement')
      return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  const formatMetricValue = (key: string, value: number) => {
    if (key === 'cls') return value.toFixed(3);
    if (
      key === 'fcp' ||
      key === 'lcp' ||
      key === 'fid' ||
      key === 'ttfb' ||
      key === 'si'
    ) {
      return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value}ms`;
    }
    return value;
  };

  const metricLabels: Record<string, string> = {
    fcp: 'First Contentful Paint',
    lcp: 'Largest Contentful Paint',
    cls: 'Cumulative Layout Shift',
    fid: 'First Input Delay',
    ttfb: 'Time to First Byte',
    si: 'Speed Index',
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 ${message.type === 'success' ? 'border border-green-500/30 bg-green-500/20 text-green-400' : 'border border-red-500/30 bg-red-500/20 text-red-400'}`}
        >
          {message.text}
        </div>
      )}

      {/* Controls */}
      <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
        <h3 className="mb-4 font-semibold text-white">Page Speed Analysis</h3>

        {/* URL Type Toggle */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setUrlType('preset')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              urlType === 'preset'
                ? 'bg-[#37AFE1] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Your Pages
          </button>
          <button
            onClick={() => setUrlType('custom')}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              urlType === 'custom'
                ? 'bg-[#37AFE1] text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Custom URL
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-300">
              {urlType === 'preset' ? 'Select Page' : 'Enter URL'}
            </label>
            {urlType === 'preset' ? (
              <select
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
              >
                {presetPages.map((p) => (
                  <option key={p.url} value={p.url}>
                    {p.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] py-2 pl-10 pr-3 text-white placeholder-slate-500"
                />
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Device
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setDevice('mobile')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${device === 'mobile' ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                <Smartphone className="h-4 w-4" />
                Mobile
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 ${device === 'desktop' ? 'bg-[#37AFE1] text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                <Monitor className="h-4 w-4" />
                Desktop
              </button>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={runTest}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`}
              />
              {loading ? 'Analyzing...' : 'Run Test'}
            </button>
          </div>
        </div>

        {/* Current URL Display */}
        {currentUrl && (
          <div className="mt-4 rounded-lg bg-[#0F172A] p-3">
            <p className="text-xs text-slate-400">Testing URL:</p>
            <p className="truncate font-mono text-sm text-white">
              {currentUrl}
            </p>
          </div>
        )}
      </div>

      {currentResult ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Score */}
          <div
            className={`flex flex-col items-center justify-center rounded-xl border-2 p-6 ${getScoreBg(currentResult.score)}`}
          >
            <Gauge
              className={`mb-2 h-12 w-12 ${getScoreColor(currentResult.score)}`}
            />
            <p
              className={`text-5xl font-bold ${getScoreColor(currentResult.score)}`}
            >
              {currentResult.score}
            </p>
            <p className="mt-2 text-slate-400">Performance Score</p>
            <p className="mt-1 text-xs capitalize text-slate-500">{device}</p>
          </div>

          {/* Core Web Vitals */}
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 lg:col-span-2">
            <h3 className="mb-4 font-semibold text-white">Core Web Vitals</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Object.entries(currentResult.metrics).map(([key, metric]) => (
                <div key={key} className="rounded-lg bg-[#0F172A] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase text-slate-400">
                      {key}
                    </span>
                    {getMetricIcon(metric.score)}
                  </div>
                  <p
                    className={`text-xl font-bold ${getMetricColor(metric.score)}`}
                  >
                    {formatMetricValue(key, metric.value)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {metricLabels[key]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 lg:col-span-2">
            <h3 className="mb-4 font-semibold text-white">Opportunities</h3>
            {currentResult.opportunities.length === 0 ? (
              <p className="text-slate-400">
                No opportunities found - great job!
              </p>
            ) : (
              <div className="space-y-3">
                {currentResult.opportunities.map((opp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg bg-[#0F172A] p-3"
                  >
                    <span className="text-slate-300">{opp.title}</span>
                    <span className="text-sm text-amber-400">
                      {opp.savings}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostics */}
          <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
            <h3 className="mb-4 font-semibold text-white">Diagnostics</h3>
            {currentResult.diagnostics.length === 0 ? (
              <p className="text-slate-400">No issues found</p>
            ) : (
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {currentResult.diagnostics.map((diag, i) => (
                  <div key={i} className="rounded-lg bg-[#0F172A] p-3">
                    <p className="text-sm font-medium text-slate-300">
                      {diag.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {diag.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-12 text-center">
          <Gauge className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h3 className="mb-2 text-xl font-semibold text-white">
            No Results Yet
          </h3>
          <p className="text-slate-400">
            Select a page or enter a custom URL and click "Run Test" to analyze
            performance
          </p>
        </div>
      )}
    </div>
  );
}
