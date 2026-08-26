'use client';

import Link from 'next/link';
import {
  FileText,
  MessageCircle,
  Globe,
  Navigation,
  Palette,
  Image,
} from 'lucide-react';

const actions = [
  {
    name: 'New Blog Post',
    href: '/admin/blogs/new',
    icon: FileText,
    color: 'bg-[#2563EB] hover:bg-blue-600',
  },
  {
    name: 'Live Chat',
    href: '/admin/live-chat',
    icon: MessageCircle,
    color: 'bg-[#fc4c00] hover:bg-[#e0741d]',
  },
  {
    name: 'SEO & Marketing',
    href: '/admin/seo',
    icon: Globe,
    color: 'bg-[#06b6d4] hover:bg-[#2d9bc7]',
  },
  {
    name: 'Navigation',
    href: '/admin/navigation',
    icon: Navigation,
    color: 'bg-teal-500 hover:bg-teal-600',
  },
  {
    name: 'Design Settings',
    href: '/admin/design',
    icon: Palette,
    color: 'bg-pink-500 hover:bg-pink-600',
  },
  {
    name: 'Media Library',
    href: '/admin/media',
    icon: Image,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
      <h2 className="mb-4 text-xl font-bold text-white">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.href ?? '#'}
              className={`
                flex items-center space-x-3 rounded-lg p-4
                ${action.color} transform
                text-white transition-all
                duration-200 hover:scale-105 hover:shadow-lg
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{action.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
