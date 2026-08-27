'use client';

import { FileText, Image, Briefcase, User } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'page',
    action: 'updated',
    target: 'Homepage Hero Section',
    user: 'John Doe',
    time: '2 hours ago',
    icon: FileText,
  },
  {
    id: 2,
    type: 'media',
    action: 'uploaded',
    target: '5 new images',
    user: 'Jane Smith',
    time: '4 hours ago',
    icon: Image,
  },
  {
    id: 3,
    type: 'project',
    action: 'created',
    target: 'E-commerce Platform',
    user: 'John Doe',
    time: '1 day ago',
    icon: Briefcase,
  },
  {
    id: 4,
    type: 'user',
    action: 'joined',
    target: 'New editor account',
    user: 'System',
    time: '2 days ago',
    icon: User,
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-700/30"
            >
              <div className="rounded-lg bg-slate-700 p-2">
                <Icon className="h-5 w-5 text-slate-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-300">
                  <span className="font-medium text-white">
                    {activity.user}
                  </span>{' '}
                  {activity.action}{' '}
                  <span className="font-medium text-white">
                    {activity.target}
                  </span>
                </p>
                <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
