'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Star,
  FileText,
  TrendingUp,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function AdminCareersDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/careers/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#FC4C00]" />
      </div>
    );
  }

  const { stats: s, recentApplications, recentJobs } = stats;

  const statCards = [
    {
      label: 'Open Positions',
      value: s.openJobs,
      icon: Briefcase,
      color: 'text-[#FC4C00]',
      bg: 'bg-[#FFEDD7]',
    },
    {
      label: 'New Applications',
      value: s.newApplications,
      icon: Users,
      color: 'text-[#14213D]',
      bg: 'bg-[#E8D8C5]',
    },
    {
      label: 'Interviews',
      value: s.interviews,
      icon: Clock,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Offers',
      value: s.offers,
      icon: Star,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Hires',
      value: s.hires,
      icon: CheckCircle2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Careers Dashboard</h1>
        <p className="mt-1 text-slate-400">
          Recruitment overview and management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-700/50 bg-navy p-5"
          >
            <div className="flex items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <span className="text-sm text-slate-400">{stat.label}</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link
          href="/admin/careers/jobs"
          className="rounded-xl border border-slate-700/50 bg-navy p-6 transition-all hover:border-[#FC4C00]/40"
        >
          <Briefcase className="mb-3 h-8 w-8 text-[#FC4C00]" />
          <h3 className="text-lg font-semibold text-white">Manage Jobs</h3>
          <p className="mt-1 text-sm text-slate-400">
            Create, edit, and manage job postings
          </p>
          <div className="mt-3 flex items-center gap-1 text-sm text-[#FC4C00]">
            {s.openJobs} open positions
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        <Link
          href="/admin/careers/applications"
          className="rounded-xl border border-slate-700/50 bg-navy p-6 transition-all hover:border-[#FC4C00]/40"
        >
          <Users className="mb-3 h-8 w-8 text-[#14213D]" />
          <h3 className="text-lg font-semibold text-white">Applications</h3>
          <p className="mt-1 text-sm text-slate-400">
            Review, filter, and manage candidate applications
          </p>
          <div className="mt-3 flex items-center gap-1 text-sm text-[#FC4C00]">
            {s.newApplications} new applications
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        <Link
          href="/admin/navigation"
          className="rounded-xl border border-slate-700/50 bg-navy p-6 transition-all hover:border-[#FC4C00]/40"
        >
          <TrendingUp className="mb-3 h-8 w-8 text-green-600" />
          <h3 className="text-lg font-semibold text-white">
            Configure Careers Page
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Update careers page content, navigation, and footer links
          </p>
          <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
            Settings
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="rounded-xl border border-slate-700/50 bg-navy">
        <div className="border-b border-slate-700/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">
            Recent Applications
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-left text-slate-400">
                <th className="px-6 py-3 font-medium">Candidate</th>
                <th className="px-6 py-3 font-medium">Position</th>
                <th className="px-6 py-3 font-medium">Stage</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.slice(0, 5).map((app: any) => (
                <tr
                  key={app._id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="px-6 py-3">
                    <span className="font-medium text-white">
                      {app.firstName} {app.lastName}
                    </span>
                    <span className="ml-2 text-xs text-slate-500">
                      {app.email}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-300">{app.jobTitle}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-[#FFEDD7] px-2.5 py-0.5 text-xs font-medium text-[#FC4C00]">
                      {app.stage}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentApplications.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No applications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="rounded-xl border border-slate-700/50 bg-navy">
        <div className="border-b border-slate-700/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">Recent Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-left text-slate-400">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Department</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Published</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.slice(0, 5).map((job: any) => (
                <tr
                  key={job._id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="px-6 py-3 font-medium text-white">
                    {job.title}
                  </td>
                  <td className="px-6 py-3 text-slate-300">
                    {job.department || '—'}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        job.status === 'open'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    {job.published ? (
                      <span className="text-green-400">Yes</span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                </tr>
              ))}
              {recentJobs.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No jobs yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl bg-[#FFEDD7] px-6 py-4 text-sm text-[#8A7E72]">
        <FileText className="mr-2 inline h-4 w-4 text-[#FC4C00]" />
        Manage careers content from the Navigation settings page. Add Careers to
        the navbar and footer from Navigation → Header / Footer tabs.
      </div>
    </div>
  );
}
