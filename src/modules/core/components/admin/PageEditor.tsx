'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface Section {
  id?: number;
  type: string;
  order_index: number;
  content: any;
  animation_config?: any;
}

interface PageEditorProps {
  pageId?: string;
}

export default function PageEditor({ pageId }: PageEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    meta_description: '',
    seo_data: {},
    published_at: null as string | null,
  });

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/pages/${pageId}`);
      if (!response.ok) throw new Error('Failed to fetch page');
      const data = await response.json();
      setFormData(data.page);
      setSections(data.sections || []);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to fetch page');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = pageId ? `/api/admin/pages/${pageId}` : '/api/admin/pages';
      const method = pageId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save page');

      const data = await response.json();

      // Save sections
      for (const section of sections) {
        if (section.id) {
          await fetch(`/api/admin/sections/${section.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...section, page_id: data.page.id }),
          });
        } else {
          await fetch('/api/admin/sections', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...section, page_id: data.page.id }),
          });
        }
      }

      router.push('/admin/pages');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        type: 'content',
        order_index: sections.length,
        content: { text: '' },
      },
    ]);
  };

  const updateSection = (index: number, updates: Partial<Section>) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    setSections(newSections);
  };

  const deleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>

      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
            placeholder="Page title"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
            placeholder="page-slug"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Meta Description
          </label>
          <textarea
            value={formData.meta_description}
            onChange={(e) =>
              setFormData({ ...formData, meta_description: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
            rows={3}
            placeholder="SEO meta description"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!formData.published_at}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  published_at: e.target.checked
                    ? new Date().toISOString()
                    : null,
                })
              }
              className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
            />
            <span className="text-sm font-medium text-slate-700">
              Published
            </span>
          </label>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Sections</h2>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200"
          >
            <Plus className="h-4 w-4" />
            Add Section
          </button>
        </div>

        {sections.map((section, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <select
                value={section.type}
                onChange={(e) => updateSection(index, { type: e.target.value })}
                className="rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="hero">Hero</option>
                <option value="content">Content</option>
                <option value="cards">Cards</option>
                <option value="gallery">Gallery</option>
                <option value="cta">CTA</option>
              </select>
              <button
                type="button"
                onClick={() => deleteSection(index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Content
              </label>
              <RichTextEditor
                value={section.content.text || ''}
                onChange={(text) =>
                  updateSection(index, {
                    content: { ...section.content, text },
                  })
                }
                placeholder="Enter section content..."
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
}
