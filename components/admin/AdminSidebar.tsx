'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Settings,
  Layers,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Search,
  TrendingUp,
  Globe,
  Palette,
  Navigation,
  MessageCircle,
  BookOpen,
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Documentation', href: '/admin/pages/documentation', icon: BookOpen },
  { name: 'Content Manager', href: '/admin/content', icon: FileText },
  {
    name: 'Pages',
    icon: FileText,
    children: [
      { name: 'All Pages', href: '/admin/pages', icon: FileText },
      { name: 'Home', href: '/admin/pages/home', icon: FileText },
      { name: 'About', href: '/admin/pages/about', icon: FileText },
      { name: 'Portfolio', href: '/admin/pages/portfolio', icon: FileText },
      { name: 'Contact', href: '/admin/pages/contact', icon: FileText },
      { name: 'Blog', href: '/admin/pages/blog', icon: FileText },
      {
        name: 'Services',
        icon: Briefcase,
        children: [
          {
            name: 'Chatbot Development',
            href: '/admin/pages/services-chatbot',
            icon: FileText,
          },
          {
            name: 'SEO Services',
            href: '/admin/pages/services-seo',
            icon: FileText,
          },
          {
            name: 'Shopify',
            href: '/admin/pages/services-shopify',
            icon: FileText,
          },
          {
            name: 'WordPress',
            href: '/admin/pages/services-wordpress',
            icon: FileText,
          },
          {
            name: 'Web Design',
            href: '/admin/pages/services-webdesign',
            icon: FileText,
          },
          {
            name: 'N8N Automations',
            href: '/admin/pages/services-n8n',
            icon: FileText,
          },
          {
            name: 'SaaS Solutions',
            href: '/admin/pages/services-saas',
            icon: FileText,
          },
        ],
      },
    ],
  },
  { name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
  { name: 'Services', href: '/admin/services', icon: Briefcase },
  { name: 'Team Members', href: '/admin/team', icon: Users },
  { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
  {
    name: 'Analytics',
    icon: BarChart3,
    children: [
      { name: 'Overview', href: '/admin/analytics', icon: TrendingUp },
      {
        name: 'Google Analytics',
        href: '/admin/analytics/google',
        icon: BarChart3,
      },
      {
        name: 'Search Console',
        href: '/admin/analytics/search-console',
        icon: Search,
      },
    ],
  },
  { name: 'SEO & Marketing', href: '/admin/seo', icon: Globe },
  { name: 'Design', href: '/admin/design', icon: Palette },
  { name: 'Navigation', href: '/admin/navigation', icon: Navigation },
  { name: 'Live Chat', href: '/admin/live-chat', icon: MessageCircle },
  {
    name: 'Media Library',
    icon: Layers,
    children: [
      { name: 'All Media', href: '/admin/media', icon: Layers },
      {
        name: 'Cloudinary Migration',
        href: '/admin/media/migrate',
        icon: Layers,
      },
    ],
  },
  { name: 'Users', href: '/admin/users', icon: Users, adminOnly: true },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    adminOnly: true,
  },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredNavigation = navigation.filter(
    (item) => !item.adminOnly || user.role === 'admin'
  );

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isItemActive = (item: NavItem): boolean => {
    if (item.href) {
      return pathname === item.href || pathname.startsWith(item.href + '/');
    }
    if (item.children) {
      return item.children.some((child) => isItemActive(child));
    }
    return false;
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = item.href ? pathname === item.href : false;
    const paddingLeft = depth === 0 ? 'pl-4' : depth === 1 ? 'pl-8' : 'pl-12';

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpand(item.name)}
            className={`
              flex w-full items-center justify-between ${paddingLeft} rounded-lg py-3 pr-4
              text-slate-300 transition-all
              duration-200 hover:bg-slate-700/50 hover:text-white
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href || '#'}
        className={`
          flex items-center space-x-3 ${paddingLeft} rounded-lg py-2.5 pr-4
          transition-all duration-200
          ${
            isActive
              ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          }
        `}
      >
        <Icon className="h-4 w-4" />
        <span className={`font-medium ${depth > 0 ? 'text-sm' : ''}`}>
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <aside className="flex w-64 flex-col bg-[#1E293B] text-white">
      {/* Logo */}
      <div className="flex h-[73px] items-center border-b border-slate-700 px-6 py-4">
        <div>
          <Link href="/admin" className="flex items-center">
            <img
              src="/adminlogo.png"
              alt="Rising Dot"
              className="h-10 w-auto"
            />
          </Link>
          <p className="mt-0.5 text-xs text-slate-400">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="scrollbar-hide flex-1 space-y-1 overflow-y-auto p-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredNavigation.map((item) => renderNavItem(item))}
      </nav>

      {/* User Info */}
      <div className="border-t border-slate-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#37AFE1]">
            <span className="text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="truncate text-xs capitalize text-slate-400">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
