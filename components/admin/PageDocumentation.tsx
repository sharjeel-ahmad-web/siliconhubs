'use client';

import { PageDocumentation as PageDoc } from '@/lib/documentation/types';
import DocumentationCard from './DocumentationCard';
import { FileText, Filter } from 'lucide-react';
import { useState } from 'react';

interface PageDocumentationProps {
  page: PageDoc;
}

export default function PageDocumentation({ page }: PageDocumentationProps) {
  const [filter, setFilter] = useState<'all' | 'cms' | 'local' | 'database'>('all');

  const filteredSections = page.sections.filter((section) => {
    if (filter === 'all') return true;
    if (filter === 'cms') return section.status === 'CMS Enabled';
    if (filter === 'local') return section.status === 'Local Files Only';
    if (filter === 'database') return section.status === 'Database-Driven';
    return true;
  });

  const stats = {
    total: page.sections.length,
    cms: page.sections.filter((s) => s.status === 'CMS Enabled').length,
    local: page.sections.filter((s) => s.status === 'Local Files Only').length,
    database: page.sections.filter((s) => s.status === 'Database-Driven').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#37AFE1] to-[#2563EB]">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{page.name}</h1>
            <p className="text-slate-400">{page.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-700/50 bg-[#1E293B] p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-slate-400">Total Sections</div>
          </div>
          <div className="rounded-lg border border-green-700/50 bg-green-900/10 p-4">
            <div className="text-2xl font-bold text-green-400">{stats.cms}</div>
            <div className="text-sm text-slate-400">CMS Enabled</div>
          </div>
          <div className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-2xl font-bold text-slate-400">{stats.local}</div>
            <div className="text-sm text-slate-400">Local Files</div>
          </div>
          <div className="rounded-lg border border-blue-700/50 bg-blue-900/10 p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.database}</div>
            <div className="text-sm text-slate-400">Database</div>
          </div>
        </div>

        {/* Filter */}
        <div className="mt-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-400">Filter:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[#37AFE1] text-white'
                  : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('cms')}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                filter === 'cms'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              CMS ({stats.cms})
            </button>
            <button
              onClick={() => setFilter('local')}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                filter === 'local'
                  ? 'bg-slate-500 text-white'
                  : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              Local ({stats.local})
            </button>
            <button
              onClick={() => setFilter('database')}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                filter === 'database'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              Database ({stats.database})
            </button>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <DocumentationCard key={section.id} section={section} />
        ))}
      </div>

      {filteredSections.length === 0 && (
        <div className="rounded-lg border border-slate-700/50 bg-[#1E293B] p-12 text-center">
          <p className="text-slate-400">No sections match the selected filter.</p>
        </div>
      )}
    </div>
  );
}
