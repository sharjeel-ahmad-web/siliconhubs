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
      <div className="flex h-96 items-center justify-center bg-[#FFF4E6]">
        <div
          className="
            h-10
            w-10
            animate-spin
            rounded-full
            border-4
            border-[#F7E3C6]
            border-t-[#F4511E]
          "
        />
      </div>
    );
  }

  const hasData = data.overview.totalVisits > 0;

  return (
    <div className="min-h-full space-y-6 bg-[#FFF4E6]">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#FFEDD7]
              "
            >
              <BarChart3 className="h-5 w-5 text-[#F4511E]" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#14213D]">
              Analytics Dashboard
            </h1>
          </div>

          <p className="mt-2 text-[#515161]">
            {hasData
              ? 'Track your website performance and user engagement'
              : 'Real analytics tracking is now active. Data will appear as visitors browse your site.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Refresh */}
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#E8D8C5]
              bg-white
              px-4
              py-2.5
              font-semibold
              text-[#515161]
              shadow-sm
              transition-all
              duration-200
              hover:border-[#F4511E]/30
              hover:bg-[#FFEDD7]
              hover:text-[#F4511E]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />

            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>

          {/* Time Range */}
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`
                rounded-xl
                px-4
                py-2.5
                font-semibold
                transition-all
                duration-200
                ${
                  timeRange === range
                    ? `
                      bg-[#F4511E]
                      text-white
                      shadow-lg
                      shadow-[#F4511E]/20
                    `
                    : `
                      border
                      border-[#E8D8C5]
                      bg-white
                      text-[#515161]
                      hover:border-[#F4511E]/30
                      hover:bg-[#FFEDD7]
                      hover:text-[#F4511E]
                    `
                }
              `}
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

      {/* ========================================================= */}
      {/* NO DATA MESSAGE */}
      {/* ========================================================= */}

      {!hasData && (
        <div
          className="
            rounded-2xl
            border
            border-[#E8D8C5]
            bg-white
            p-10
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[#FFEDD7]
            "
          >
            <BarChart3 className="h-8 w-8 text-[#F4511E]" />
          </div>

          <h3 className="mb-2 text-xl font-bold text-[#14213D]">
            No Analytics Data Yet
          </h3>

          <p className="mx-auto max-w-md text-[#515161]">
            Analytics tracking is now active. Visit your website pages to start
            collecting real visitor data. Data will appear here automatically.
          </p>
        </div>
      )}

      {/* ========================================================= */}
      {/* REAL TIME METRICS */}
      {/* ========================================================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          bg-[#14213D]
          p-6
          text-white
          shadow-xl
          shadow-[#14213D]/10
        "
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[#F4511E]
            "
          >
            <Activity className="h-5 w-5 text-white" />
          </div>

          <h2 className="text-xl font-bold">Real-Time Metrics</h2>

          <span
            className="
              ml-auto
              flex
              items-center
              gap-2
              rounded-full
              bg-white/10
              px-3
              py-1
              text-sm
              font-semibold
            "
          >
            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-[#F4511E]
              "
            />
            Live
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <div className="text-3xl font-bold">
              {data.realTimeMetrics.activeUsers}
            </div>

            <div className="mt-1 text-sm text-[#E8D8C5]">Active Users</div>
          </div>

          <div>
            <div className="text-3xl font-bold">
              {data.realTimeMetrics.pageViews}
            </div>

            <div className="mt-1 text-sm text-[#E8D8C5]">Page Views</div>
          </div>

          <div>
            <div className="text-3xl font-bold">
              {data.realTimeMetrics.avgLoadTime}ms
            </div>

            <div className="mt-1 text-sm text-[#E8D8C5]">Avg Load Time</div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* OVERVIEW STATS */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
          value={`${Math.floor(
            data.overview.avgSessionDuration / 60
          )}m ${data.overview.avgSessionDuration % 60}s`}
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

      {/* ========================================================= */}
      {/* DEVICE + ENGAGEMENT */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Device Breakdown */}
        <div
          className="
            rounded-2xl
            border
            border-[#E8D8C5]
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#FFEDD7]
              "
            >
              <Monitor className="h-5 w-5 text-[#F4511E]" />
            </div>

            <h3 className="text-lg font-bold text-[#14213D]">
              Device Breakdown
            </h3>
          </div>

          <div className="space-y-5">
            <DeviceBar
              icon={<Monitor className="h-5 w-5" />}
              label="Desktop"
              percentage={data.deviceBreakdown.desktop}
              color="bg-[#F4511E]"
            />

            <DeviceBar
              icon={<Tablet className="h-5 w-5" />}
              label="Tablet"
              percentage={data.deviceBreakdown.tablet}
              color="bg-[#14213D]"
            />

            <DeviceBar
              icon={<Smartphone className="h-5 w-5" />}
              label="Mobile"
              percentage={data.deviceBreakdown.mobile}
              color="bg-[#D97706]"
            />
          </div>
        </div>

        {/* Animation Engagement */}
        <div
          className="
            rounded-2xl
            border
            border-[#E8D8C5]
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#FFEDD7]
              "
            >
              <Zap className="h-5 w-5 text-[#F4511E]" />
            </div>

            <h3 className="text-lg font-bold text-[#14213D]">
              Animation Engagement
            </h3>
          </div>

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

      {/* ========================================================= */}
      {/* SCROLL DEPTH */}
      {/* ========================================================= */}

      <div
        className="
          rounded-2xl
          border
          border-[#E8D8C5]
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[#FFEDD7]
            "
          >
            <TrendingUp className="h-5 w-5 text-[#F4511E]" />
          </div>

          <h3 className="text-lg font-bold text-[#14213D]">
            Scroll Depth Analysis
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(data.scrollDepth).map(([range, percentage]) => (
            <ScrollDepthCard
              key={range}
              range={range}
              percentage={percentage}
            />
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* CONVERSION FUNNEL */}
      {/* ========================================================= */}

      <div
        className="
          rounded-2xl
          border
          border-[#E8D8C5]
          bg-white
          p-6
          shadow-sm
        "
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[#FFEDD7]
            "
          >
            <MousePointer className="h-5 w-5 text-[#F4511E]" />
          </div>

          <h3 className="text-lg font-bold text-[#14213D]">
            Conversion Funnel
          </h3>
        </div>

        <div className="space-y-4">
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

      {/* ========================================================= */}
      {/* TOP PAGES + PERFORMANCE */}
      {/* ========================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div
          className="
            rounded-2xl
            border
            border-[#E8D8C5]
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#FFEDD7]
              "
            >
              <BarChart3 className="h-5 w-5 text-[#F4511E]" />
            </div>

            <h3 className="text-lg font-bold text-[#14213D]">Top Pages</h3>
          </div>

          <div className="space-y-1">
            {data.topPages && data.topPages.length > 0 ? (
              data.topPages.slice(0, 8).map((page, index) => (
                <div
                  key={page.page}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    border-b
                    border-[#E8D8C5]
                    px-2
                    py-3
                    last:border-0
                    hover:bg-[#FFF4E6]
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        w-5
                        text-sm
                        font-semibold
                        text-[#A39B92]
                      "
                    >
                      {index + 1}.
                    </span>

                    <span
                      className="
                        max-w-[200px]
                        truncate
                        text-sm
                        font-medium
                        text-[#515161]
                      "
                    >
                      {page.page}
                    </span>
                  </div>

                  <span className="font-bold text-[#14213D]">{page.views}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#8A8580]">No page data yet</p>
            )}
          </div>
        </div>

        {/* Performance Correlation */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#E8D8C5]
            bg-white
            p-6
            shadow-sm
          "
        >
          <div className="mb-5 flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#FFEDD7]
              "
            >
              <Zap className="h-5 w-5 text-[#F4511E]" />
            </div>

            <h3 className="text-lg font-bold text-[#14213D]">
              Performance vs Conversion
            </h3>
          </div>

          <div className="relative flex h-48 items-end justify-between gap-2">
            {data.performanceCorrelation.map((point, index) => {
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
                      animate={{
                        height: `${Math.max(heightPercent, 5)}%`,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                      }}
                      className="
                          w-full
                          rounded-t-lg
                          bg-gradient-to-t
                          from-[#F4511E]
                          to-[#FFB36B]
                        "
                      style={{
                        maxHeight: '100%',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between px-1">
            {data.performanceCorrelation.map((point, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="text-xs text-[#8A8580]">{point.loadTime}ms</div>

                <div className="text-xs font-bold text-[#14213D]">
                  {point.conversionRate.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-sm font-medium text-[#515161]">
            Load Time (ms) vs Conversion Rate (%)
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================= */
/* STAT CARD */
/* ============================================================= */

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
    <div
      className="
        rounded-2xl
        border
        border-[#E8D8C5]
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:shadow-lg
        hover:shadow-[#F4511E]/10
      "
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            bg-[#FFEDD7]
            text-[#F4511E]
          "
        >
          {icon}
        </div>

        <span className="text-sm font-medium text-[#515161]">{label}</span>
      </div>

      <div className="text-2xl font-bold text-[#14213D]">{value}</div>

      <div
        className={`
          mt-2
          text-sm
          font-bold
          ${trendPositive ? 'text-[#15803D]' : 'text-[#DC2626]'}
        `}
      >
        {trend}
      </div>
    </div>
  );
}

/* ============================================================= */
/* DEVICE BAR */
/* ============================================================= */

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
        <div className="flex items-center gap-2 text-[#515161]">
          <div className="text-[#F4511E]">{icon}</div>

          <span className="font-semibold">{label}</span>
        </div>

        <span className="text-sm font-bold text-[#14213D]">{percentage}%</span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F7E3C6]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          className={`${color} h-2.5 rounded-full`}
        />
      </div>
    </div>
  );
}

/* ============================================================= */
/* ENGAGEMENT METRIC */
/* ============================================================= */

function EngagementMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-[#E8D8C5]
        py-3
        last:border-0
      "
    >
      <span className="text-sm font-medium text-[#515161]">{label}</span>

      <span className="font-bold text-[#14213D]">{value}</span>
    </div>
  );
}

/* ============================================================= */
/* SCROLL DEPTH CARD */
/* ============================================================= */

function ScrollDepthCard({
  range,
  percentage,
}: {
  range: string;
  percentage: number;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[#E8D8C5]
        bg-[#FFF4E6]
        p-5
        text-center
        transition-all
        duration-200
        hover:border-[#F4511E]/30
        hover:bg-[#FFEDD7]
      "
    >
      <div className="mb-1 text-3xl font-bold text-[#14213D]">
        {percentage}%
      </div>

      <div className="text-sm font-medium text-[#515161]">{range}</div>
    </div>
  );
}

/* ============================================================= */
/* FUNNEL STAGE */
/* ============================================================= */

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
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-[#363534]">{stage}</span>

        <span className="text-[#515161]">
          {users.toLocaleString()} users
          {!isFirst && (
            <span className="ml-2 font-semibold text-[#DC2626]">
              (-{dropoffRate.toFixed(1)}%)
            </span>
          )}
        </span>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: `${width}%`,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeOut',
        }}
        className="
          flex
          h-12
          items-center
          justify-center
          rounded-xl
          bg-gradient-to-r
          from-[#F4511E]
          to-[#FFB36B]
          font-bold
          text-white
          shadow-md
          shadow-[#F4511E]/10
        "
      >
        {width.toFixed(0)}%
      </motion.div>
    </div>
  );
}
