'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface ProjectEditorProps {
  projectId?: string;
}

export default function ProjectEditor({ projectId }: ProjectEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    description: '',
    thumbnail_url: '',
    published_at: null as string | null,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      const data = await response.json();
      setFormData(data.project);
      setTags(data.tags.map((t: any) => t.tag));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to fetch project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = projectId
        ? `/api/admin/projects/${projectId}`
        : '/api/admin/projects';
      const method = projectId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save project');

      router.push('/admin/projects');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
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
          {saving ? 'Saving...' : 'Save Project'}
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
            placeholder="Project title"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Client
          </label>
          <input
            type="text"
            value={formData.client}
            onChange={(e) =>
              setFormData({ ...formData, client: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
            placeholder="Client name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(description) =>
              setFormData({ ...formData, description })
            }
            placeholder="Enter project description..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Thumbnail URL
          </label>
          <input
            type="url"
            value={formData.thumbnail_url}
            onChange={(e) =>
              setFormData({ ...formData, thumbnail_url: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Tags
          </label>
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), addTag())
              }
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-slate-100 px-4 py-2 text-slate-700 transition-colors hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] px-3 py-1 text-sm text-white"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full p-0.5 hover:bg-[#1d4ed8]"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
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
    </form>
  );
}
