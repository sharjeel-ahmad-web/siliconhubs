'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface ServiceEditorProps {
  serviceId?: string;
}

export default function ServiceEditor({ serviceId }: ServiceEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    description: '',
    icon_url: '',
    hero_animation: '',
    color_scheme: {},
  });

  useEffect(() => {
    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/services/${serviceId}`);
      if (!response.ok) throw new Error('Failed to fetch service');
      const data = await response.json();
      setFormData(data.service);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to fetch service');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = serviceId
        ? `/api/admin/services/${serviceId}`
        : '/api/admin/services';
      const method = serviceId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save service');

      router.push('/admin/services');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setSaving(false);
    }
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
          {saving ? 'Saving...' : 'Save Service'}
        </button>
      </div>

      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
            placeholder="Service name"
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
            placeholder="service-slug"
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
            placeholder="Enter service description..."
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Icon URL
          </label>
          <input
            type="url"
            value={formData.icon_url}
            onChange={(e) =>
              setFormData({ ...formData, icon_url: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
            placeholder="https://example.com/icon.svg"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Hero Animation
          </label>
          <select
            value={formData.hero_animation}
            onChange={(e) =>
              setFormData({ ...formData, hero_animation: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-[#2563EB]"
          >
            <option value="">Select animation</option>
            <option value="particles">Particles</option>
            <option value="neural-network">Neural Network</option>
            <option value="workflow">Workflow</option>
            <option value="wireframe">Wireframe</option>
            <option value="modular-grid">Modular Grid</option>
            <option value="conversion-funnel">Conversion Funnel</option>
            <option value="serp-ranking">SERP Ranking</option>
          </select>
        </div>
      </div>
    </form>
  );
}
