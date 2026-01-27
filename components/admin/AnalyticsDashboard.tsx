'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  Clock,
  Zap,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  realTimeMetrics: {
    activeUsers: number;
    pageViews: number;
    avgLoadTime: number;
  };
  deviceBreakdown: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  animationEngagement: {
    heroInteractions: number;
    particleInteractions: number;
    magneticCursorUsage: number;
    avgEngagementTime: number;
  };
  scrollDepth: {
    '0-25%': number;
    '25-50%': number;
    '50-75%': number;
    '75-100%': number;
  };
  conversionFunnel: {
    stage: string;
    users: number;
    dropoffRate: number;
  }[];
  performanceCorrelation: {
    loadTime: number;
    conversionRate: number;
  }[];
  topPages?: { page: string; views: number }[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  const hasData = data.overview.totalVisits > 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-slate-400">
            {hasData
              ? 'Track your website performance and user engagement'
              : 'Real analytics tracking is now active. Data will appear as visitors browse your site.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2 font-medium text-slate-400 transition-colors hover:text-white"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#37AFE1] text-white'
                  : 'border border-slate-700 bg-[#1E293B] text-slate-400 hover:text-white'
              }`}
            >
              {range === '24h'
                ? 'Last 24 Hours'
                : range === '7d'
                  ? 'Last 7 Days'
                  : 'Last 30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* No Data Message */}
      {!hasData && (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-8 text-center">
          <BarChart3 className="mx-auto mb-4 h-16 w-16 text-slate-600" />
          <h3 className="mb-2 text-xl font-semibold text-white">
            No Analytics Data Yet
          </h3>
          <p className="mx-auto max-w-md text-slate-400">
            Analytics tracking is now active. Visit your website pages to start
            collecting real visitor data. Data will appear here automatically.
          </p>
        </div>
      )}

      {/* Real-Time Metrics */}
      <div className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#37AFE1] p-6 text-white">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Real-Time Metrics</h2>
          <span className="ml-auto flex items-center gap-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
            Live
          </span>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold">
              {data.realTimeMetrics.activeUsers}
            </div>
            <div className="text-sm text-blue-100">Active Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {data.realTimeMetrics.pageViews}
            </div>
            <div className="text-sm text-blue-100">Page Views</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {data.realTimeMetrics.avgLoadTime}ms
            </div>
            <div className="text-sm text-blue-100">Avg Load Time</div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Visits"
          value={data.overview.totalVisits.toLocaleString()}
          trend="+12.5%"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Unique Visitors"
          value={data.overview.uniqueVisitors.toLocaleString()}
          trend="+8.3%"
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Avg Session"
          value={`${Math.floor(data.overview.avgSessionDuration / 60)}m ${data.overview.avgSessionDuration % 60}s`}
          trend="+5.2%"
        />
        <StatCard
          icon={<MousePointer className="h-5 w-5" />}
          label="Bounce Rate"
          value={`${data.overview.bounceRate}%`}
          trend="-3.1%"
          trendPositive={false}
        />
        <StatCard
          icon={<Zap className="h-5 w-5" />}
          label="Conversion Rate"
          value={`${data.overview.conversionRate}%`}
          trend="+15.7%"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Device Breakdown
          </h3>
          <div className="space-y-4">
            <DeviceBar
              icon={<Monitor className="h-5 w-5" />}
              label="Desktop"
              percentage={data.deviceBreakdown.desktop}
              color="bg-blue-600"
            />
            <DeviceBar
              icon={<Tablet className="h-5 w-5" />}
              label="Tablet"
              percentage={data.deviceBreakdown.tablet}
              color="bg-[#F97316]"
            />
            <DeviceBar
              icon={<Smartphone className="h-5 w-5" />}
              label="Mobile"
              percentage={data.deviceBreakdown.mobile}
              color="bg-[#31A4DB]"
            />
          </div>
        </div>

        {/* Animation Engagement */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Animation Engagement
          </h3>
          <div className="space-y-3">
            <EngagementMetric
              label="Hero Interactions"
              value={data.animationEngagement.heroInteractions}
            />
            <EngagementMetric
              label="Particle Interactions"
              value={data.animationEngagement.particleInteractions}
            />
            <EngagementMetric
              label="Magnetic Cursor Usage"
              value={data.animationEngagement.magneticCursorUsage}
            />
            <EngagementMetric
              label="Avg Engagement Time"
              value={`${data.animationEngagement.avgEngagementTime}s`}
            />
          </div>
        </div>
      </div>

      {/* Scroll Depth Analysis */}
      <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Scroll Depth Analysis
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(data.scrollDepth).map(([range, percentage]) => (
            <ScrollDepthCard
              key={range}
              range={range}
              percentage={percentage}
            />
          ))}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Conversion Funnel
        </h3>
        <div className="space-y-2">
          {data.conversionFunnel.map((stage, index) => (
            <FunnelStage
              key={stage.stage}
              stage={stage.stage}
              users={stage.users}
              dropoffRate={stage.dropoffRate}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Top Pages</h3>
          <div className="space-y-3">
            {data.topPages && data.topPages.length > 0 ? (
              data.topPages.slice(0, 8).map((page, index) => (
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
                  <span className="font-semibold text-white">{page.views}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No page data yet</p>
            )}
          </div>
        </div>

        {/* Performance Correlation */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Performance vs Conversion
          </h3>
          <div className="relative flex h-48 items-end justify-between gap-2">
            {data.performanceCorrelation.map((point, index) => {
              // Calculate height as percentage of max conversion rate
              const maxRate = Math.max(
                ...data.performanceCorrelation.map((p) => p.conversionRate),
                1
              );
              const heightPercent = Math.min(
                (point.conversionRate / maxRate) * 100,
                100
              );
              return (
                <div
                  key={index}
                  className="flex h-full flex-1 flex-col items-center"
                >
                  <div className="flex w-full flex-1 items-end px-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPercent, 5)}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="w-full rounded-t bg-gradient-to-t from-[#37AFE1] to-[#F58122]"
                      style={{ maxHeight: '100%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between px-1">
            {data.performanceCorrelation.map((point, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="text-xs text-slate-400">{point.loadTime}ms</div>
                <div className="text-xs font-medium text-white">
                  {point.conversionRate.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-sm text-slate-400">
            Load Time (ms) vs Conversion Rate (%)
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  trendPositive = true,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div
        className={`mt-1 text-sm font-medium ${
          trendPositive ? 'text-green-400' : 'text-red-400'
        }`}
      >
        {trend}
      </div>
    </div>
  );
}

function DeviceBar({
  icon,
  label,
  percentage,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          {icon}
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-sm font-semibold text-white">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-700">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`${color} h-2 rounded-full`}
        />
      </div>
    </div>
  );
}

function EngagementMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-700/50 py-2 last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function ScrollDepthCard({
  range,
  percentage,
}: {
  range: string;
  percentage: number;
}) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-[#0F172A] p-4 text-center">
      <div className="mb-1 text-3xl font-bold text-white">{percentage}%</div>
      <div className="text-sm text-slate-400">{range}</div>
    </div>
  );
}

function FunnelStage({
  stage,
  users,
  dropoffRate,
  isFirst,
}: {
  stage: string;
  users: number;
  dropoffRate: number;
  isFirst: boolean;
}) {
  const maxWidth = 100;
  const width = isFirst ? maxWidth : maxWidth - dropoffRate;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{stage}</span>
        <span className="text-slate-400">
          {users.toLocaleString()} users
          {!isFirst && (
            <span className="ml-2 text-red-400">
              (-{dropoffRate.toFixed(1)}%)
            </span>
          )}
        </span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex h-12 items-center justify-center rounded bg-gradient-to-r from-[#37AFE1] to-[#F58122] font-semibold text-white"
      >
        {width.toFixed(0)}%
      </motion.div>
    </div>
  );
}
