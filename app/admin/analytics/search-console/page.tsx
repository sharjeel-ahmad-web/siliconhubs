'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  TrendingDown,
  MousePointer,
  Eye,
  BarChart3,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  ExternalLink,
  Link as LinkIcon,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchConsoleData {
  connected: boolean;
  siteUrl?: string;
  overview?: {
    totalClicks: number;
    totalImpressions: number;
    avgCtr: number;
    avgPosition: number;
    clicksChange: number;
    impressionsChange: number;
  };
  topQueries?: {
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  topPages?: {
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  devicePerformance?: {
    device: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  countryPerformance?: {
    country: string;
    clicks: number;
    impressions: number;
    ctr: number;
  }[];
  dailyData?: {
    date: string;
    clicks: number;
    impressions: number;
  }[];
  indexingStatus?: {
    indexed: number;
    notIndexed: number;
    errors: number;
  };
  crawlErrors?: {
    type: string;
    count: number;
    severity: 'error' | 'warning';
  }[];
}

export default function SearchConsolePage() {
  const [data, setData] = useState<SearchConsoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '28d' | '90d'>('28d');
  const [showSetup, setShowSetup] = useState(false);
  const [siteUrl, setSiteUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'queries' | 'pages'>('queries');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/analytics/search-console?range=${timeRange}`
      );
      const result = await response.json();
      setData(result);
      if (result.siteUrl) {
        setSiteUrl(result.siteUrl);
      }
    } catch (error) {
      console.error('Failed to fetch Search Console data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        '/api/admin/analytics/search-console/settings',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ siteUrl }),
        }
      );
      if (response.ok) {
        setShowSetup(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
            <Search className="h-8 w-8 text-[#37AFE1]" />
            Google Search Console
          </h1>
          <p className="mt-1 text-slate-400">
            {data?.connected
              ? `Monitoring: ${data.siteUrl}`
              : 'Connect your Search Console property to monitor search performance'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSetup(true)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2 font-medium text-slate-400 transition-colors hover:text-white"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2 font-medium text-slate-400 transition-colors hover:text-white"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>
          {(['7d', '28d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#37AFE1] text-white'
                  : 'border border-slate-700 bg-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              {range === '7d'
                ? '7 Days'
                : range === '28d'
                  ? '28 Days'
                  : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Setup Modal */}
      {showSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#1E293B] p-6">
            <h2 className="mb-4 text-xl font-bold text-white">
              Search Console Setup
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Site URL
                </label>
                <input
                  type="text"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://yourdomain.com"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Enter your verified Search Console property URL
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-[#0F172A] p-4">
                <h3 className="mb-2 text-sm font-medium text-white">
                  Setup Instructions:
                </h3>
                <ol className="list-inside list-decimal space-y-1 text-xs text-slate-400">
                  <li>Go to Google Search Console</li>
                  <li>Add and verify your property</li>
                  <li>Copy your property URL</li>
                  <li>Paste it above and save</li>
                </ol>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowSetup(false)}
                  className="rounded-lg px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving || !siteUrl}
                  className="rounded-lg bg-[#37AFE1] px-4 py-2 font-medium text-white disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Connected State */}
      {!data?.connected && (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-12 text-center">
          <Search className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h3 className="mb-2 text-xl font-semibold text-white">
            Connect Search Console
          </h3>
          <p className="mx-auto mb-6 max-w-md text-slate-400">
            Enter your Search Console property URL to monitor your search
            performance, keywords, and indexing status.
          </p>
          <button
            onClick={() => setShowSetup(true)}
            className="rounded-lg bg-[#37AFE1] px-6 py-3 font-medium text-white transition-colors hover:bg-[#37AFE1]/90"
          >
            Connect Search Console
          </button>
        </div>
      )}

      {/* Connected State - Show Data */}
      {data?.connected && (
        <>
          {/* Connection Status */}
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-400">Connected to Search Console</span>
            <a
              href={`https://search.google.com/search-console?resource_id=${encodeURIComponent(data.siteUrl || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
            >
              Open in Search Console <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Overview Stats */}
          {data.overview && (
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                icon={<MousePointer className="h-5 w-5" />}
                label="Total Clicks"
                value={data.overview.totalClicks.toLocaleString()}
                change={data.overview.clicksChange}
                color="text-[#37AFE1]"
              />
              <StatCard
                icon={<Eye className="h-5 w-5" />}
                label="Total Impressions"
                value={data.overview.totalImpressions.toLocaleString()}
                change={data.overview.impressionsChange}
                color="text-[#F58122]"
              />
              <StatCard
                icon={<TrendingUp className="h-5 w-5" />}
                label="Average CTR"
                value={`${data.overview.avgCtr.toFixed(2)}%`}
                color="text-green-400"
              />
              <StatCard
                icon={<BarChart3 className="h-5 w-5" />}
                label="Average Position"
                value={data.overview.avgPosition.toFixed(1)}
                color="text-purple-400"
              />
            </div>
          )}

          {/* Performance Chart */}
          {data.dailyData && (
            <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Search Performance
              </h3>
              <div className="flex h-64 items-end gap-1">
                {data.dailyData.map((day, index) => {
                  const maxClicks = Math.max(
                    ...data.dailyData!.map((d) => d.clicks),
                    1
                  );
                  const maxImpressions = Math.max(
                    ...data.dailyData!.map((d) => d.impressions),
                    1
                  );
                  const clicksHeight = (day.clicks / maxClicks) * 100;
                  const impressionsHeight =
                    (day.impressions / maxImpressions) * 50;
                  return (
                    <div
                      key={index}
                      className="group relative flex flex-1 flex-col items-center gap-1"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${impressionsHeight}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        className="w-full rounded-t bg-[#F58122]/30"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${clicksHeight}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        className="w-full rounded-t bg-[#37AFE1]"
                      />
                      <div className="absolute -top-16 z-10 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                        <div>{day.clicks} clicks</div>
                        <div>{day.impressions} impressions</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>{data.dailyData[0]?.date}</span>
                <span>{data.dailyData[data.dailyData.length - 1]?.date}</span>
              </div>
              <div className="mt-4 flex justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#37AFE1]" />
                  <span className="text-sm text-slate-400">Clicks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[#F58122]/30" />
                  <span className="text-sm text-slate-400">Impressions</span>
                </div>
              </div>
            </div>
          )}

          {/* Tabs for Queries/Pages */}
          <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab('queries')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'queries'
                    ? 'border-b-2 border-[#37AFE1] bg-[#0F172A] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="mr-2 inline h-4 w-4" />
                Top Queries
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'pages'
                    ? 'border-b-2 border-[#37AFE1] bg-[#0F172A] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="mr-2 inline h-4 w-4" />
                Top Pages
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'queries' && data.topQueries && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700 text-left text-sm text-slate-400">
                        <th className="pb-3 font-medium">Query</th>
                        <th className="pb-3 text-right font-medium">Clicks</th>
                        <th className="pb-3 text-right font-medium">
                          Impressions
                        </th>
                        <th className="pb-3 text-right font-medium">CTR</th>
                        <th className="pb-3 text-right font-medium">
                          Position
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topQueries.map((query, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-700/50 last:border-0"
                        >
                          <td className="py-3 text-white">{query.query}</td>
                          <td className="py-3 text-right font-semibold text-[#37AFE1]">
                            {query.clicks.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-slate-400">
                            {query.impressions.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-green-400">
                            {query.ctr.toFixed(2)}%
                          </td>
                          <td className="py-3 text-right text-slate-300">
                            {query.position.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'pages' && data.topPages && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700 text-left text-sm text-slate-400">
                        <th className="pb-3 font-medium">Page</th>
                        <th className="pb-3 text-right font-medium">Clicks</th>
                        <th className="pb-3 text-right font-medium">
                          Impressions
                        </th>
                        <th className="pb-3 text-right font-medium">CTR</th>
                        <th className="pb-3 text-right font-medium">
                          Position
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topPages.map((page, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-700/50 last:border-0"
                        >
                          <td className="max-w-[300px] truncate py-3 text-white">
                            {page.page}
                          </td>
                          <td className="py-3 text-right font-semibold text-[#37AFE1]">
                            {page.clicks.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-slate-400">
                            {page.impressions.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-green-400">
                            {page.ctr.toFixed(2)}%
                          </td>
                          <td className="py-3 text-right text-slate-300">
                            {page.position.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Device & Country Performance */}
          <div className="grid grid-cols-2 gap-6">
            {/* Device Performance */}
            {data.devicePerformance && (
              <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Device Performance
                </h3>
                <div className="space-y-4">
                  {data.devicePerformance.map((device) => (
                    <div
                      key={device.device}
                      className="flex items-center justify-between border-b border-slate-700/50 py-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        {device.device === 'DESKTOP' && (
                          <Monitor className="h-5 w-5 text-slate-400" />
                        )}
                        {device.device === 'MOBILE' && (
                          <Smartphone className="h-5 w-5 text-slate-400" />
                        )}
                        {device.device === 'TABLET' && (
                          <Smartphone className="h-5 w-5 text-slate-400" />
                        )}
                        <span className="capitalize text-slate-300">
                          {device.device.toLowerCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white">
                          {device.clicks.toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-slate-500">
                          clicks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Indexing Status */}
            {data.indexingStatus && (
              <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Indexing Status
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-green-500/10 p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {data.indexingStatus.indexed}
                    </div>
                    <div className="text-sm text-slate-400">Indexed</div>
                  </div>
                  <div className="rounded-lg bg-yellow-500/10 p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {data.indexingStatus.notIndexed}
                    </div>
                    <div className="text-sm text-slate-400">Not Indexed</div>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-4 text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {data.indexingStatus.errors}
                    </div>
                    <div className="text-sm text-slate-400">Errors</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Crawl Errors */}
          {data.crawlErrors && data.crawlErrors.length > 0 && (
            <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Crawl Issues
              </h3>
              <div className="space-y-3">
                {data.crawlErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg p-3 ${
                      error.severity === 'error'
                        ? 'bg-red-500/10'
                        : 'bg-yellow-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 ${error.severity === 'error' ? 'text-red-500' : 'text-yellow-500'}`}
                      />
                      <span className="text-slate-300">{error.type}</span>
                    </div>
                    <span
                      className={`font-semibold ${error.severity === 'error' ? 'text-red-400' : 'text-yellow-400'}`}
                    >
                      {error.count} issues
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  color = 'text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      {change !== undefined && (
        <div
          className={`mt-1 flex items-center gap-1 text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}
        >
          {change >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {change >= 0 ? '+' : ''}
          {change.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
