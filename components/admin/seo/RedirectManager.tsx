'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, ArrowRight, Search } from 'lucide-react';

interface Redirect {
  _id?: string;
  source: string;
  destination: string;
  type: 301 | 302 | 307 | 308;
  enabled: boolean;
  hits: number;
  createdAt?: string;
}

export default function RedirectManager() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Redirect>({
    source: '',
    destination: '',
    type: 301,
    enabled: true,
    hits: 0,
  });
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchRedirects();
  }, []);

  const fetchRedirects = async () => {
    try {
      const res = await fetch('/api/admin/seo/redirects');
      if (res.ok) {
        const data = await res.json();
        setRedirects(data);
      }
    } catch (error) {
      console.error('Error fetching redirects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/admin/seo/redirects/${editingId}`
        : '/api/admin/seo/redirects';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Redirect ${editingId ? 'updated' : 'created'} successfully!`,
        });
        fetchRedirects();
        resetForm();
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this redirect?')) return;

    try {
      const res = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Redirect deleted!' });
        fetchRedirects();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete redirect' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggle = async (redirect: Redirect) => {
    try {
      const res = await fetch(`/api/admin/seo/redirects/${redirect._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...redirect, enabled: !redirect.enabled }),
      });

      if (res.ok) {
        fetchRedirects();
      }
    } catch (error) {
      console.error('Error toggling redirect:', error);
    }
  };

  const startEdit = (redirect: Redirect) => {
    setEditingId(redirect._id || null);
    setFormData(redirect);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      source: '',
      destination: '',
      type: 301,
      enabled: true,
      hits: 0,
    });
  };

  const filteredRedirects = redirects.filter(
    (r) =>
      r.source.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase())
  );

  const getTypeLabel = (type: number) => {
    switch (type) {
      case 301:
        return {
          label: '301',
          desc: 'Permanent',
          color: 'bg-green-500/20 text-green-400',
        };
      case 302:
        return {
          label: '302',
          desc: 'Temporary',
          color: 'bg-amber-500/20 text-amber-400',
        };
      case 307:
        return {
          label: '307',
          desc: 'Temp (Preserve)',
          color: 'bg-blue-500/20 text-blue-400',
        };
      case 308:
        return {
          label: '308',
          desc: 'Perm (Preserve)',
          color: 'bg-purple-500/20 text-purple-400',
        };
      default:
        return {
          label: String(type),
          desc: '',
          color: 'bg-slate-500/20 text-slate-400',
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 ${message.type === 'success' ? 'border border-green-500/30 bg-green-500/20 text-green-400' : 'border border-red-500/30 bg-red-500/20 text-red-400'}`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search redirects..."
            className="w-full rounded-lg border border-slate-700 bg-[#1E293B] py-2 pl-10 pr-4 text-white focus:border-[#37AFE1] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80"
        >
          <Plus className="h-5 w-5" />
          Add Redirect
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              {editingId ? 'Edit Redirect' : 'Add New Redirect'}
            </h3>
            <button
              onClick={resetForm}
              className="rounded p-1 hover:bg-slate-700"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Source Path
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                placeholder="/old-page"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                Supports wildcards: /blog/* matches all blog pages
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Destination URL
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="/new-page or https://example.com"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Redirect Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: parseInt(e.target.value) as 301 | 302 | 307 | 308,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
              >
                <option value={301}>
                  301 - Permanent Redirect (SEO friendly)
                </option>
                <option value={302}>302 - Temporary Redirect</option>
                <option value={307}>307 - Temporary (Preserve method)</option>
                <option value={308}>308 - Permanent (Preserve method)</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) =>
                    setFormData({ ...formData, enabled: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
                />
                <span className="text-slate-300">Enabled</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-700 pt-4">
            <button
              onClick={resetForm}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80"
            >
              <Save className="h-4 w-4" />
              {editingId ? 'Update' : 'Create'} Redirect
            </button>
          </div>
        </div>
      )}

      {/* Redirects List */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        {filteredRedirects.length === 0 ? (
          <div className="p-12 text-center">
            <ArrowRight className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              No redirects found
            </h3>
            <p className="text-slate-400">
              {search
                ? 'Try a different search term'
                : 'Create your first redirect to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700 bg-[#0F172A]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Hits
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredRedirects.map((redirect) => {
                  const typeInfo = getTypeLabel(redirect.type);
                  return (
                    <tr
                      key={redirect._id}
                      className={`hover:bg-slate-700/30 ${!redirect.enabled ? 'opacity-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(redirect)}
                          className={`h-5 w-10 rounded-full transition-colors ${
                            redirect.enabled ? 'bg-green-500' : 'bg-slate-600'
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full bg-white transition-transform ${
                              redirect.enabled
                                ? 'translate-x-5'
                                : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-white">
                        {redirect.source}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-slate-300">
                        {redirect.destination}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${typeInfo.color}`}
                        >
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {redirect.hits.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(redirect)}
                            className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(redirect._id!)}
                            className="rounded p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
