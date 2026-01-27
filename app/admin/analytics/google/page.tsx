'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Clock,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Settings,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GAData {
  connected: boolean;
  propertyId?: string;
  overview?: {
    users: number;
    newUsers: number;
    sessions: number;
    pageviews: number;
    avgSessionDuration: number;
    bounceRate: number;
    usersChange: number;
    sessionsChange: number;
    pageviewsChange: number;
  };
  realtime?: {
    activeUsers: number;
    pageviews: number;
  };
  topPages?: { page: string; views: number; avgTime: number }[];
  topSources?: { source: string; users: number; sessions: number }[];
  deviceBreakdown?: { device: string; users: number; percentage: number }[];
  countryData?: { country: string; users: number; sessions: number }[];
  dailyData?: {
    date: string;
    users: number;
    sessions: number;
    pageviews: number;
  }[];
}

export default function GoogleAnalyticsPage() {
  const [data, setData] = useState<GAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [showSetup, setShowSetup] = useState(false);
  const [propertyId, setPropertyId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/analytics/google?range=${timeRange}`
      );
      const result = await response.json();
      setData(result);
      if (result.propertyId) {
        setPropertyId(result.propertyId);
      }
    } catch (error) {
      console.error('Failed to fetch GA data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/analytics/google/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });
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
            <BarChart3 className="h-8 w-8 text-[#F58122]" />
            Google Analytics
          </h1>
          <p className="mt-1 text-slate-400">
            {data?.connected
              ? `Connected to property: ${data.propertyId}`
              : 'Connect your Google Analytics 4 property to view detailed insights'}
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
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#F58122] text-white'
                  : 'border border-slate-700 bg-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              {range === '7d'
                ? '7 Days'
                : range === '30d'
                  ? '30 Days'
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
              Google Analytics Setup
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  GA4 Property ID (Measurement ID)
                </label>
                <input
                  type="text"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#F58122] focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Find this in GA4 → Admin → Data Streams → Your Stream
                </p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-[#0F172A] p-4">
                <h3 className="mb-2 text-sm font-medium text-white">
                  Setup Instructions:
                </h3>
                <ol className="list-inside list-decimal space-y-1 text-xs text-slate-400">
                  <li>Go to Google Analytics 4</li>
                  <li>Navigate to Admin → Data Streams</li>
                  <li>Copy your Measurement ID (starts with G-)</li>
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
                  disabled={saving || !propertyId}
                  className="rounded-lg bg-[#F58122] px-4 py-2 font-medium text-white disabled:opacity-50"
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
          <BarChart3 className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h3 className="mb-2 text-xl font-semibold text-white">
            Connect Google Analytics
          </h3>
          <p className="mx-auto mb-6 max-w-md text-slate-400">
            Enter your GA4 Measurement ID to view detailed analytics data
            including traffic sources, user behavior, and conversion metrics.
          </p>
          <button
            onClick={() => setShowSetup(true)}
            className="rounded-lg bg-[#F58122] px-6 py-3 font-medium text-white transition-colors hover:bg-[#F58122]/90"
          >
            Connect Google Analytics
          </button>
        </div>
      )}

      {/* Connected State - Show Data */}
      {data?.connected && (
        <>
          {/* Connection Status */}
          <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-400">
              Connected to Google Analytics 4
            </span>
            <a
              href={`https://analytics.google.com/analytics/web/#/p${data.propertyId?.replace('G-', '')}/reports/intelligenthome`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-sm text-green-400 hover:text-green-300"
            >
              Open in GA4 <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Real-Time Metrics */}
          {data.realtime && (
            <div className="rounded-xl bg-gradient-to-r from-[#F58122] to-[#F97316] p-6 text-white">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                <h2 className="text-xl font-semibold">Real-Time</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-4xl font-bold">
                    {data.realtime.activeUsers}
                  </div>
                  <div className="text-orange-100">Active Users Now</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">
                    {data.realtime.pageviews}
                  </div>
                  <div className="text-orange-100">Pageviews (30 min)</div>
                </div>
              </div>
            </div>
          )}

          {/* Overview Stats */}
          {data.overview && (
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="Users"
                value={data.overview.users.toLocaleString()}
                change={data.overview.usersChange}
              />
              <StatCard
                icon={<Users className="h-5 w-5" />}
                label="New Users"
                value={data.overview.newUsers.toLocaleString()}
              />
              <StatCard
                icon={<MousePointer className="h-5 w-5" />}
                label="Sessions"
                value={data.overview.sessions.toLocaleString()}
                change={data.overview.sessionsChange}
              />
              <StatCard
                icon={<BarChart3 className="h-5 w-5" />}
                label="Pageviews"
                value={data.overview.pageviews.toLocaleString()}
                change={data.overview.pageviewsChange}
              />
              <StatCard
                icon={<Clock className="h-5 w-5" />}
                label="Avg. Duration"
                value={formatDuration(data.overview.avgSessionDuration)}
              />
              <StatCard
                icon={<TrendingDown className="h-5 w-5" />}
                label="Bounce Rate"
                value={`${data.overview.bounceRate.toFixed(1)}%`}
              />
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Traffic Over Time */}
            {data.dailyData && (
              <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Traffic Over Time
                </h3>
                <div className="flex h-64 items-end gap-1">
                  {data.dailyData.map((day, index) => {
                    const maxUsers = Math.max(
                      ...data.dailyData!.map((d) => d.users),
                      1
                    );
                    const height = (day.users / maxUsers) * 100;
                    return (
                      <div
                        key={index}
                        className="group flex flex-1 flex-col items-center"
                      >
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: index * 0.02 }}
                          className="w-full cursor-pointer rounded-t bg-gradient-to-t from-[#F58122] to-[#F97316] hover:from-[#F97316] hover:to-[#FB923C]"
                        />
                        <div className="absolute -top-8 rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100">
                          {day.users} users
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>{data.dailyData[0]?.date}</span>
                  <span>{data.dailyData[data.dailyData.length - 1]?.date}</span>
                </div>
              </div>
            )}

            {/* Device Breakdown */}
            {data.deviceBreakdown && (
              <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Device Breakdown
                </h3>
                <div className="space-y-4">
                  {data.deviceBreakdown.map((device) => (
                    <div key={device.device}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-300">
                          {device.device === 'desktop' && (
                            <Monitor className="h-5 w-5" />
                          )}
                          {device.device === 'mobile' && (
                            <Smartphone className="h-5 w-5" />
                          )}
                          {device.device === 'tablet' && (
                            <Tablet className="h-5 w-5" />
                          )}
                          <span className="capitalize">{device.device}</span>
                        </div>
                        <span className="font-semibold text-white">
                          {device.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-700">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${device.percentage}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-2 rounded-full bg-[#F58122]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Pages */}
            {data.topPages && (
              <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Top Pages
                </h3>
                <div className="space-y-3">
                  {data.topPages.map((page, index) => (
                    <div
                      key={page.page}
                      className="flex items-center justify-between border-b border-slate-700/50 py-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-sm text-slate-500">
                          {index + 1}.
                        </span>
                        <span className="max-w-[200px] truncate text-sm text-slate-300">
                          {page.page}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white">
                          {page.views.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          ({formatDuration(page.avgTime)})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Traffic Sources */}
            {data.topSources && (
              <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Traffic Sources
                </h3>
                <div className="space-y-3">
                  {data.topSources.map((source, index) => (
                    <div
                      key={source.source}
                      className="flex items-center justify-between border-b border-slate-700/50 py-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-300">
                          {source.source}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-white">
                          {source.users.toLocaleString()}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          users
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Countries */}
          {data.countryData && (
            <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Top Countries
              </h3>
              <div className="grid grid-cols-5 gap-4">
                {data.countryData.slice(0, 10).map((country) => (
                  <div
                    key={country.country}
                    className="rounded-lg bg-[#0F172A] p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-white">
                      {country.users.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">
                      {country.country}
                    </div>
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
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

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}
