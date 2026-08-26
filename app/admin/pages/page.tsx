'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Home,
  Info,
  FolderOpen,
  Bot,
  Search as SearchIcon,
  ShoppingBag,
  Code,
  Palette,
  Workflow,
  RefreshCw,
  Save,
} from 'lucide-react';

interface PageSection {
  _id: string;
  page: string;
  section: string;
  content: Record<string, any>;
  updatedAt: string;
}

// Page structure for display
const pages = [
  {
    id: 'home',
    label: 'Homepage',
    icon: Home,
    description: 'Main landing page with hero, services, testimonials',
    sections: 13,
  },
  {
    id: 'about',
    label: 'About Page',
    icon: Info,
    description: 'Company info, team, timeline, skills',
    sections: 7,
  },
  {
    id: 'portfolio',
    label: 'Portfolio Page',
    icon: FolderOpen,
    description: 'Projects, case studies, featured work',
    sections: 6,
  },
  {
    id: 'contact',
    label: 'Contact Page',
    icon: FileText,
    description: 'Contact form, info, map, social links',
    sections: 5,
  },
  {
    id: 'blog',
    label: 'Blog Page',
    icon: FileText,
    description: 'Blog listing page settings',
    sections: 2,
  },
];

const servicePages = [
  {
    id: 'services-chatbot',
    label: 'Chatbot Development',
    icon: Bot,
    description: 'AI chatbot service page',
    sections: 7,
  },
  {
    id: 'services-seo',
    label: 'SEO Services',
    icon: SearchIcon,
    description: 'Search engine optimization page',
    sections: 8,
  },
  {
    id: 'services-shopify',
    label: 'Shopify Services',
    icon: ShoppingBag,
    description: 'E-commerce development page',
    sections: 8,
  },
  {
    id: 'services-wordpress',
    label: 'WordPress Services',
    icon: Code,
    description: 'WordPress development page',
    sections: 7,
  },
  {
    id: 'services-webdesign',
    label: 'Web Design',
    icon: Palette,
    description: 'Web design service page',
    sections: 8,
  },
  {
    id: 'services-n8n',
    label: 'N8N Automations',
    icon: Workflow,
    description: 'Workflow automation page',
    sections: 8,
  },
];

export default function PagesAdminPage() {
  const [content, setContent] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setContent(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const seedContent = async () => {
    setLoading(true);
    try {
      await fetch('/api/seed/all');
      setMessage({ type: 'success', text: 'All content seeded successfully!' });
      await fetchContent();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to seed content' });
    } finally {
      setLoading(false);
    }
  };

  const getConfiguredSections = (pageId: string) => {
    return content.filter((c) => c.page === pageId).length;
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan/30 border-t-[#06b6d4]" />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Page Content</h1>
          <p className="mt-1 text-slate-400">
            Manage content for all website pages
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-slate-300 transition-colors hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          {content.length === 0 && (
            <button
              onClick={seedContent}
              className="flex items-center gap-2 rounded-lg bg-cyan px-4 py-2 text-white transition-colors hover:bg-cyan/80"
            >
              <Save className="h-4 w-4" />
              Seed All Content
            </button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 flex items-center justify-between rounded-lg p-4 ${
            message.type === 'success'
              ? 'border border-green-500/30 bg-green-500/20 text-green-400'
              : 'border border-red-500/30 bg-red-500/20 text-red-400'
          }`}
        >
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="text-xl leading-none"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Pages */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-white">Main Pages</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {
            const Icon = page.icon;
            const configured = getConfiguredSections(page.id);

            return (
              <Link
                key={page.id}
                href={page.id ? `/admin/pages/${page.id}` : '#'}
                className="group rounded-xl border border-slate-700/50 bg-navy p-5 transition-all hover:border-cyan/50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-700 p-3 transition-colors group-hover:bg-cyan/20">
                    <Icon className="h-6 w-6 text-cyan" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-cyan">
                      {page.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {page.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded bg-cyan/20 px-2 py-1 text-xs text-cyan">
                        {page.sections} sections
                      </span>
                      {configured > 0 && (
                        <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">
                          {configured} configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Service Pages */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-white">Service Pages</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicePages.map((page) => {
            const Icon = page.icon;
            const configured = getConfiguredSections(page.id);

            return (
              <Link
                key={page.id}
                href={page.id ? `/admin/pages/${page.id}` : '#'}
                className="group rounded-xl border border-slate-700/50 bg-navy p-5 transition-all hover:border-cyan/50 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-700 p-3 transition-colors group-hover:bg-cyan/20">
                    <Icon className="h-6 w-6 text-cyan" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white transition-colors group-hover:text-cyan">
                      {page.label}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {page.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded bg-cyan/20 px-2 py-1 text-xs text-cyan">
                        {page.sections} sections
                      </span>
                      {configured > 0 && (
                        <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400">
                          {configured} configured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
