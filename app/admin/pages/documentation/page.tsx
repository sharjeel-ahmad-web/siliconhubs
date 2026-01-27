'use client';

import { useState } from 'react';
import PageDocumentation from '@/components/admin/PageDocumentation';
import { homepageSections } from '@/lib/documentation/homepage-sections';
import { servicePages } from '@/lib/documentation/service-pages';
import { PageDocumentation as PageDoc } from '@/lib/documentation/types';

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'services'>('homepage');

  // Create homepage documentation structure
  const homepageDoc: PageDoc = {
    id: 'homepage',
    name: 'Homepage Documentation',
    path: '/',
    sections: homepageSections,
    description: '13 sections documented with complete editing information',
  };

  return (
    <div className="min-h-screen bg-[#0F172A] p-6">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">
            📚 CMS Documentation Dashboard
          </h1>
          <p className="text-lg text-slate-400">
            Complete guide to all website sections and where to edit content
          </p>
        </div>

        {/* Documentation Tabs */}
        <div className="w-full">
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setActiveTab('homepage')}
              className={`rounded-lg border px-6 py-3 font-medium transition-colors ${
                activeTab === 'homepage'
                  ? 'border-[#37AFE1] bg-[#37AFE1]/10 text-[#37AFE1]'
                  : 'border-slate-700 bg-[#1E293B] text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              Homepage ({homepageSections.length} sections)
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`rounded-lg border px-6 py-3 font-medium transition-colors ${
                activeTab === 'services'
                  ? 'border-[#F58122] bg-[#F58122]/10 text-[#F58122]'
                  : 'border-slate-700 bg-[#1E293B] text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              Service Pages ({servicePages.length} pages)
            </button>
          </div>

          {/* Homepage Tab */}
          {activeTab === 'homepage' && (
            <div className="mt-6">
              <PageDocumentation page={homepageDoc} />
            </div>
          )}

          {/* Service Pages Tab */}
          {activeTab === 'services' && (
            <div className="mt-6 space-y-12">
              {servicePages.map((servicePage) => (
                <div key={servicePage.id}>
                  <PageDocumentation page={servicePage} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            📖 About This Documentation
          </h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              <strong className="text-slate-300">CMS Enabled:</strong> Sections that
              can be edited through the admin dashboard without code changes.
            </p>
            <p>
              <strong className="text-slate-300">Local Files Only:</strong> Content
              stored in component files. Requires code changes and deployment to
              update.
            </p>
            <p>
              <strong className="text-slate-300">Database-Driven:</strong> Fully
              dynamic content managed through database (e.g., blog posts).
            </p>
            <p className="mt-4 border-t border-slate-700 pt-4 text-slate-500">
              💡 <strong>Tip:</strong> Use the filters to quickly find sections by
              their management type. Click "View in GitHub" to see the actual code,
              or "Edit via CMS" to update content directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
