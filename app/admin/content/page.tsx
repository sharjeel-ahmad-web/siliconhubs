'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Edit,
  Eye,
  FileJson,
  FolderOpen,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface ContentSection {
  page: string;
  section: string;
  content: any;
  lastUpdated: string;
  contentPath: string;
  mediaPath?: string;
}

export default function ContentManagerPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(
    null
  );
  const [editContent, setEditContent] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content/static');
      const data = await res.json();

      if (res.ok) {
        setSections(data);
      } else {
        showMessage('error', data.error || 'Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      showMessage('error', 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (section: ContentSection) => {
    setEditingSection(section);
    // Remove internal fields before editing
    const { _visible, _updatedAt, ...editableContent } = section.content;
    setEditContent(JSON.stringify(editableContent, null, 2));
    setPreviewMode(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editingSection) return;

    try {
      setSaving(true);

      // Validate JSON
      const parsedContent = JSON.parse(editContent);

      // Update MongoDB
      const updateRes = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: editingSection.page,
          section: editingSection.section,
          content: parsedContent,
        }),
      });

      if (!updateRes.ok) {
        throw new Error('Failed to update content in database');
      }

      // Regenerate static files
      const regenRes = await fetch('/api/admin/content/regenerate', {
        method: 'POST',
      });

      if (!regenRes.ok) {
        throw new Error('Failed to regenerate static files');
      }

      showMessage('success', 'Content updated and regenerated successfully!');
      setShowModal(false);
      fetchContent();
    } catch (error) {
      console.error('Error saving content:', error);
      if (error instanceof SyntaxError) {
        showMessage('error', 'Invalid JSON format. Please check your syntax.');
      } else {
        showMessage('error', 'Failed to save content');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateAll = async () => {
    if (!confirm('Regenerate all static content files from MongoDB?')) return;

    try {
      setRegenerating(true);
      const res = await fetch('/api/admin/content/regenerate', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(
          'success',
          `Regenerated ${data.totalPages} page files (${data.totalSections} sections)`
        );
        fetchContent();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error regenerating content:', error);
      showMessage('error', 'Failed to regenerate content');
    } finally {
      setRegenerating(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const validateJSON = () => {
    try {
      JSON.parse(editContent);
      return true;
    } catch {
      return false;
    }
  };

  const filteredSections = sections.filter(
    (section) =>
      section.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Manager</h1>
          <p className="mt-1 text-slate-400">
            Manage static content sections and regenerate files
          </p>
        </div>
        <button
          onClick={handleRegenerateAll}
          disabled={regenerating}
          className="flex items-center gap-2 rounded-lg bg-[#F58122] px-4 py-2 text-white transition-colors hover:bg-[#F58122]/80 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-5 w-5 ${regenerating ? 'animate-spin' : ''}`}
          />
          {regenerating ? 'Regenerating...' : 'Regenerate All'}
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-lg p-4 ${
            message.type === 'success'
              ? 'border border-green-500/30 bg-green-500/20 text-green-400'
              : 'border border-red-500/30 bg-red-500/20 text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by page or section..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-[#1E293B] py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-[#37AFE1] focus:outline-none"
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
        </div>
      ) : filteredSections.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p>
            No content sections found. Run{' '}
            <code className="rounded bg-[#1E293B] px-2 py-1">
              npm run generate:content
            </code>{' '}
            first.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSections.map((section, index) => (
            <div
              key={`${section.page}-${section.section}`}
              className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-5 transition-all hover:border-[#37AFE1]/50"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-white">
                    {section.page}
                  </h3>
                  <p className="truncate text-sm text-slate-400">
                    {section.section}
                  </p>
                </div>
              </div>

              {/* Paths */}
              <div className="mb-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <FileJson className="h-3 w-3 text-[#37AFE1]" />
                  <span className="truncate">/content/{section.page}.json</span>
                </div>
                {section.mediaPath && (
                  <div className="flex items-center gap-2 text-slate-500">
                    <FolderOpen className="h-3 w-3 text-[#F58122]" />
                    <span className="truncate">{section.mediaPath}</span>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="mb-4 rounded-lg bg-[#0F172A] p-3">
                <p className="line-clamp-3 font-mono text-xs text-slate-400">
                  {JSON.stringify(section.content).substring(0, 150)}...
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-700/50 pt-3">
                <span className="text-xs text-slate-500">
                  {formatDate(section.lastUpdated)}
                </span>
                <button
                  onClick={() => openEditModal(section)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#37AFE1] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#37AFE1]/80"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[#1E293B]">
            {/* Modal Header */}
            <div className="border-b border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white">
                Edit Content: {editingSection.page} / {editingSection.section}
              </h2>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-slate-400">
                  <FileJson className="h-4 w-4" />
                  /content/{editingSection.page}.json
                </span>
                {editingSection.mediaPath && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <FolderOpen className="h-4 w-4" />
                    {editingSection.mediaPath}
                  </span>
                )}
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 border-b border-slate-700 bg-[#0F172A] p-4">
              <button
                onClick={() => setPreviewMode(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  !previewMode
                    ? 'bg-[#37AFE1] text-white'
                    : 'bg-[#1E293B] text-slate-400 hover:text-white'
                }`}
              >
                <Edit className="mr-1.5 inline h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setPreviewMode(true)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  previewMode
                    ? 'bg-[#37AFE1] text-white'
                    : 'bg-[#1E293B] text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="mr-1.5 inline h-4 w-4" />
                Preview
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {previewMode ? (
                <div className="rounded-lg bg-[#0F172A] p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-slate-300">
                    {editContent}
                  </pre>
                </div>
              ) : (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={18}
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-3 font-mono text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                    placeholder="Enter JSON content..."
                  />
                  <div className="mt-3 rounded-lg bg-[#0F172A] p-3 text-xs text-slate-400">
                    <p className="mb-2 font-semibold">💡 Editing Tips:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>
                        Images should be in{' '}
                        <code className="rounded bg-[#1E293B] px-1 py-0.5">
                          {editingSection.mediaPath}
                        </code>
                      </li>
                      <li>
                        Reference images as:{' '}
                        <code className="rounded bg-[#1E293B] px-1 py-0.5">
                          /media/...
                        </code>
                      </li>
                      <li>Ensure valid JSON syntax (use quotes for strings)</li>
                      <li>
                        Current validation:{' '}
                        {validateJSON() ? (
                          <span className="text-green-400">✓ Valid</span>
                        ) : (
                          <span className="text-red-400">✗ Invalid</span>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-700 p-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-4 py-2 text-slate-300 transition-colors hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !validateJSON()}
                className="rounded-lg bg-[#37AFE1] px-6 py-2 text-white transition-colors hover:bg-[#37AFE1]/80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save & Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
