'use client';

import { useState, useEffect } from 'react';
import { Layers, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  _id: string;
  title: string;
  client: string;
  description: string;
  thumbnail: string;
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete project');
      fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Layers className="mx-auto mb-4 h-16 w-16 text-slate-300" />
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            No projects yet
          </h3>
          <p className="mb-4 text-slate-600">
            Create your first project to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {project.thumbnail && (
                <div className="relative h-48 bg-slate-100">
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-slate-900">
                      {project.title}
                    </h3>
                    {project.client && (
                      <p className="text-sm text-slate-600">
                        Client: {project.client}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={project._id ? `/admin/projects/${project._id}` : '#'}
                      className="p-1 text-[#2563EB] hover:text-[#1d4ed8]"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {project.description && (
                  <p className="mb-3 line-clamp-3 text-sm text-slate-600">
                    {project.description.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {project.published ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </span>
                  <span>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
