'use client';

import { useEffect, useState } from 'react';
import { Layers, MessageSquare, Briefcase, Eye, RefreshCw } from 'lucide-react';

interface Stats {
  projects: number;
  contacts: number;
  newContacts: number;
  services: number;
  pageViews?: number;
  activeUsers?: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);

    try {
      // Fetch both stats and analytics in parallel
      const [statsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/analytics?range=7d'),
      ]);

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      setStats({
        ...statsData.stats,
        pageViews: analyticsData.overview?.totalVisits || 0,
        activeUsers: analyticsData.realTimeMetrics?.activeUsers || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statItems = [
    {
      name: 'Total Projects',
      value: stats?.projects || 0,
      change: 'Portfolio items',
      icon: Layers,

      // Cream + Orange theme
      iconBg: 'bg-[#FC4C00]',
      iconShadow: 'shadow-orange-500/20',
    },
    {
      name: 'Contact Messages',
      value: stats?.contacts || 0,
      change: `${stats?.newContacts || 0} new`,
      icon: MessageSquare,

      iconBg: 'bg-[#24201C]',
      iconShadow: 'shadow-black/10',
    },
    {
      name: 'Services',
      value: stats?.services || 0,
      change: 'Active services',
      icon: Briefcase,

      iconBg: 'bg-[#FC4C00]',
      iconShadow: 'shadow-orange-500/20',
    },
    {
      name: 'Page Views',
      value: stats?.pageViews?.toLocaleString() || 0,
      change: `${stats?.activeUsers || 0} active now`,
      icon: Eye,

      iconBg: 'bg-[#24201C]',
      iconShadow: 'shadow-black/10',
    },
  ];

  /*
   * Loading State
   */
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="
              animate-pulse
              rounded-2xl
              border border-[#E8D8C4]
              bg-[#FFF4E3]
              p-6
              shadow-sm
            "
          >
            {/* Icon skeleton */}
            <div className="mb-5 flex justify-between">
              <div className="h-4 w-28 rounded-md bg-[#E8D8C4]" />

              <div className="h-12 w-12 rounded-xl bg-[#E8D8C4]" />
            </div>

            {/* Number skeleton */}
            <div className="mb-3 h-9 w-20 rounded-md bg-[#E8D8C4]" />

            {/* Text skeleton */}
            <div className="h-3 w-28 rounded-md bg-[#E8D8C4]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header / Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#24201C]">Overview</h2>

          <p className="mt-0.5 text-sm text-[#6B625A]">
            Monitor your agency performance
          </p>
        </div>

        <button
          onClick={() => fetchStats(true)}
          disabled={refreshing}
          className="
            hover:shadow-orange-500/20
            group
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[#E8D8C4]
            bg-[#FFF4E3]
            px-4
            py-2
            text-sm
            font-semibold
            text-[#36322E]
            shadow-sm
            transition-all
            duration-200
            hover:border-[#FC4C00]
            hover:bg-[#FC4C00]
            hover:text-white
            hover:shadow-lg
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw
            className={`
              h-4 w-4
              transition-transform
              ${refreshing ? 'animate-spin' : 'group-hover:rotate-180'}
            `}
          />

          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.name}
              className="
                hover:shadow-orange-900/10
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#E8D8C4]
                bg-[#FFF4E3]
                p-6
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#FC4C00]/40
                hover:shadow-xl
              "
            >
              {/* Decorative background */}
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-32
                  w-32
                  rounded-full
                  bg-[#FC4C00]/5
                  transition-transform
                  duration-500
                  group-hover:scale-150
                "
              />

              <div className="relative flex items-center justify-between">
                {/* Text */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#6B625A]">
                    {stat.name}
                  </p>

                  <p
                    className="
                      mt-2
                      text-3xl
                      font-extrabold
                      tracking-tight
                      text-[#24201C]
                    "
                  >
                    {stat.value}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FC4C00]" />

                    <p className="text-sm font-medium text-[#8A7E72]">
                      {stat.change}
                    </p>
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`
                    ${stat.iconBg}
                    ${stat.iconShadow}
                    flex
                    h-12
                    w-12
                    flex-shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    shadow-lg
                    transition-all
                    duration-300
                    group-hover:rotate-3
                    group-hover:scale-110
                  `}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Bottom Accent */}
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-1
                  w-0
                  bg-[#FC4C00]
                  transition-all
                  duration-300
                  group-hover:w-full
                "
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
