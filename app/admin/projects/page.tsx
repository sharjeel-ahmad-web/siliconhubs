'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
} from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  slug: string;
  client: string;
  description: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  metrics: { name: string; value: string }[];
  featured: boolean;
  published: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    description: '',
    thumbnail: '',
    images: '',
    tags: '',
    metrics: '',
    featured: false,
    published: true,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProject
        ? `/api/admin/projects/${editingProject._id}`
        : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      // Parse metrics from string format "Label:Value, Label2:Value2"
      const metricsArray = formData.metrics
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean)
        .map((m) => {
          const [name, value] = m.split(':').map((s) => s.trim());
          return { name: name || '', value: value || '' };
        });

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: formData.images
            .split(',')
            .map((i) => i.trim())
            .filter(Boolean),
          tags: formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          metrics: metricsArray,
        }),
      });

      if (res.ok) {
        fetchProjects();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !project.published }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${project._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      client: project.client || '',
      description: project.description,
      thumbnail: project.thumbnail,
      images: project.images?.join(', ') || '',
      tags: project.tags?.join(', ') || '',
      metrics:
        project.metrics?.map((m) => `${m.name}:${m.value}`).join(', ') || '',
      featured: project.featured,
      published: project.published,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      client: '',
      description: '',
      thumbnail: '',
      images: '',
      tags: '',
      metrics: '',
      featured: false,
      published: true,
    });
  };

  return (
    <div className="min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="mt-1 text-slate-400">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
        >
          <Plus className="h-5 w-5" />
          Add Project
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-lg border border-[#37AFE1]/30 bg-[#37AFE1]/10 p-4">
        <p className="text-sm text-[#37AFE1]">
          <strong>Note:</strong> Portfolio projects are now managed via the CMS.
          Edit them in{' '}
          <code className="rounded bg-[#37AFE1]/20 px-1">/admin/pages</code>{' '}
          under the Portfolio Page section. Images should be placed in{' '}
          <code className="rounded bg-[#37AFE1]/20 px-1">
            public/media/portfolio/
          </code>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] py-12 text-center">
          <p className="text-slate-400">
            No projects in database. Projects are currently loaded from code.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-[#1E293B] p-4"
            >
              <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700">
                {project.thumbnail && (
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Star className="h-4 w-4 fill-[#F58122] text-[#F58122]" />
                  )}
                </div>
                <p className="text-sm text-slate-400">{project.client}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {project.tags?.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="rounded bg-[#37AFE1]/20 px-2 py-0.5 text-xs text-[#37AFE1]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(project)}
                  className={`rounded-lg p-2 transition-colors ${
                    project.featured
                      ? 'bg-[#F58122]/20 text-[#F58122]'
                      : 'bg-slate-700 text-slate-400 hover:text-[#F58122]'
                  }`}
                >
                  <Star className="h-5 w-5" />
                </button>
                <button
                  onClick={() => togglePublish(project)}
                  className={`rounded-lg p-2 transition-colors ${
                    project.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {project.published ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(project)}
                  className="rounded-lg bg-slate-700 p-2 text-slate-300 transition-colors hover:bg-[#37AFE1] hover:text-white"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="rounded-lg bg-slate-700 p-2 text-slate-300 transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#1E293B]">
            <div className="border-b border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add Project'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Client
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="/media/portfolio/project-name/thumbnail.jpg"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Additional Images (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="/media/portfolio/project/img1.jpg, /media/portfolio/project/img2.jpg"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="Web Design, Shopify, SEO"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Metrics (format: Label:Value, Label2:Value2)
                </label>
                <input
                  type="text"
                  value={formData.metrics}
                  onChange={(e) =>
                    setFormData({ ...formData, metrics: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="Conversion Rate:+45%, Page Speed:95/100"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-600 text-[#F58122] focus:ring-[#F58122]"
                  />
                  <span className="text-slate-300">Featured</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-600 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-slate-300">Published</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-slate-400 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#37AFE1] px-6 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
                >
                  {editingProject ? 'Update' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
