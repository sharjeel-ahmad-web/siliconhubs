'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Code,
  FileCode,
  Globe,
  AlertTriangle,
} from 'lucide-react';

interface CodeSnippet {
  _id?: string;
  name: string;
  type: 'css' | 'js';
  code: string;
  location: 'head' | 'body-start' | 'body-end';
  pages: string[]; // empty = all pages, or specific paths
  enabled: boolean;
  createdAt?: string;
}

const defaultPages = [
  { value: '', label: 'All Pages' },
  { value: '/', label: 'Homepage' },
  { value: '/about', label: 'About' },
  { value: '/services', label: 'Services' },
  { value: '/services/chatbot', label: 'Chatbot Service' },
  { value: '/services/seo', label: 'SEO Service' },
  { value: '/services/shopify', label: 'Shopify Service' },
  { value: '/services/wordpress', label: 'WordPress Service' },
  { value: '/services/webdesign', label: 'Web Design Service' },
  { value: '/services/n8n', label: 'N8N Service' },
  { value: '/services/saas', label: 'SaaS Service' },
  { value: '/portfolio', label: 'Portfolio' },
  { value: '/blog', label: 'Blog' },
  { value: '/contact', label: 'Contact' },
];

export default function CustomCodeInjection() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CodeSnippet>({
    name: '',
    type: 'css',
    code: '',
    location: 'head',
    pages: [],
    enabled: true,
  });
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await fetch('/api/admin/design/code');
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (error) {
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      setMessage({ type: 'error', text: 'Name and code are required' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId
        ? `/api/admin/design/code/${editingId}`
        : '/api/admin/design/code';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Code snippet ${editingId ? 'updated' : 'created'}!`,
        });
        fetchSnippets();
        resetForm();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save code snippet' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this code snippet?')) return;

    try {
      const res = await fetch(`/api/admin/design/code/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Code snippet deleted!' });
        fetchSnippets();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleToggle = async (snippet: CodeSnippet) => {
    try {
      const res = await fetch(`/api/admin/design/code/${snippet._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...snippet, enabled: !snippet.enabled }),
      });
      if (res.ok) fetchSnippets();
    } catch (error) {
      console.error('Error toggling:', error);
    }
  };

  const startEdit = (snippet: CodeSnippet) => {
    setEditingId(snippet._id || null);
    setFormData(snippet);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      name: '',
      type: 'css',
      code: '',
      location: 'head',
      pages: [],
      enabled: true,
    });
  };

  const togglePage = (page: string) => {
    if (page === '') {
      setFormData((prev) => ({ ...prev, pages: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        pages: prev.pages.includes(page)
          ? prev.pages.filter((p) => p !== page)
          : [...prev.pages, page],
      }));
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

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
        <div>
          <p className="font-medium text-amber-400">Use with caution</p>
          <p className="text-sm text-amber-400/70">
            Custom code can affect site performance and functionality. Test
            thoroughly before enabling on all pages.
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80"
        >
          <Plus className="h-5 w-5" />
          Add Code Snippet
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">
              {editingId ? 'Edit Code Snippet' : 'Add New Code Snippet'}
            </h3>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-300">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Google Analytics, Custom Styles"
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'css' | 'js',
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                >
                  <option value="css">CSS</option>
                  <option value="js">JavaScript</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: e.target.value as any,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
                >
                  <option value="head">Head (recommended for CSS)</option>
                  <option value="body-start">Body Start</option>
                  <option value="body-end">
                    Body End (recommended for JS)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Code *
            </label>
            <textarea
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              placeholder={
                formData.type === 'css'
                  ? '/* Your CSS code here */\n.custom-class {\n  color: #fff;\n}'
                  : '// Your JavaScript code here\nconsole.log("Hello!");'
              }
              rows={10}
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 font-mono text-sm text-white"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Apply to Pages
            </label>
            <div className="flex flex-wrap gap-2">
              {defaultPages.map((page) => (
                <button
                  key={page.value}
                  onClick={() => togglePage(page.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    (page.value === '' && formData.pages.length === 0) ||
                    formData.pages.includes(page.value)
                      ? 'bg-[#37AFE1] text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-700 pt-4">
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
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
              >
                <Save className={`h-4 w-4 ${saving ? 'animate-spin' : ''}`} />
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snippets List */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        {snippets.length === 0 ? (
          <div className="p-12 text-center">
            <Code className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              No Code Snippets
            </h3>
            <p className="text-slate-400">
              Add custom CSS or JavaScript to your pages
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {snippets.map((snippet) => (
              <div
                key={snippet._id}
                className={`p-4 hover:bg-slate-700/30 ${!snippet.enabled ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg p-2 ${snippet.type === 'css' ? 'bg-purple-500/20' : 'bg-amber-500/20'}`}
                  >
                    {snippet.type === 'css' ? (
                      <FileCode className="h-5 w-5 text-purple-400" />
                    ) : (
                      <Code className="h-5 w-5 text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{snippet.name}</h4>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${snippet.type === 'css' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}`}
                      >
                        {snippet.type.toUpperCase()}
                      </span>
                      <span className="rounded bg-slate-700 px-2 py-0.5 text-xs text-slate-300">
                        {snippet.location}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Globe className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-400">
                        {snippet.pages.length === 0
                          ? 'All pages'
                          : snippet.pages.join(', ')}
                      </span>
                    </div>
                    <pre className="mt-2 max-h-20 overflow-x-auto rounded bg-[#0F172A] p-2 font-mono text-xs text-slate-400">
                      {snippet.code.substring(0, 200)}
                      {snippet.code.length > 200 ? '...' : ''}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(snippet)}
                      className={`h-5 w-10 rounded-full transition-colors ${snippet.enabled ? 'bg-green-500' : 'bg-slate-600'}`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform ${snippet.enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                      />
                    </button>
                    <button
                      onClick={() => startEdit(snippet)}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(snippet._id!)}
                      className="rounded p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
