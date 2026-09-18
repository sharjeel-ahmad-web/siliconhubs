'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
} from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  status: string;
  published: boolean;
  archived: boolean;
  featured: boolean;
  shortDescription: string;
  description: string;
  responsibilities: string;
  requirements: string;
  niceToHave: string;
  benefits: string;
  salary: string;
  skills: string[];
  createdAt: string;
  seoTitle?: string;
  seoDescription?: string;
  closingDate?: string;
}

export default function AdminCareersJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<Partial<Job>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/admin/careers/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editingJob
        ? `/api/admin/careers/jobs/${editingJob.slug}`
        : '/api/admin/careers/jobs';
      const method = editingJob ? 'PUT' : 'POST';

      const payload = {
        title: formData.title,
        slug: formData.slug || undefined,
        department: formData.department,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        shortDescription: formData.shortDescription,
        description: formData.description,
        responsibilities: formData.responsibilities,
        requirements: formData.requirements,
        niceToHave: formData.niceToHave,
        benefits: formData.benefits,
        salary: formData.salary,
        skills: formData.skills,
        featured: formData.featured,
        status: formData.status || 'open',
        published: formData.published,
        closingDate: formData.closingDate,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Job saved successfully!' });
        setShowModal(false);
        fetchJobs();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save job' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`/api/admin/careers/jobs/${slug}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Job deleted' });
        fetchJobs();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete job' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      slug: job.slug,
      department: job.department,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      location: job.location,
      shortDescription: job.shortDescription,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      niceToHave: job.niceToHave,
      benefits: job.benefits,
      salary: job.salary,
      skills: job.skills,
      featured: job.featured,
      status: job.status,
      published: job.published,
    });
    setShowModal(true);
  };

  const openNew = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      employmentType: 'Full-time',
      experienceLevel: 'Mid Level',
      location: 'Remote',
      shortDescription: '',
      description: '',
      responsibilities: '',
      requirements: '',
      status: 'open',
      featured: false,
      published: false,
    });
    setShowModal(true);
  };

  const filtered = jobs.filter(
    (j) =>
      !search ||
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase()) ||
      j.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg px-4 py-3 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Job Management</h1>
          <p className="mt-1 text-slate-400">
            Create and manage career opportunities
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-[#FC4C00] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E04300]"
        >
          <Plus className="h-4 w-4" /> Add Job
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs by title, department, or slug..."
          className="w-full rounded-lg border border-slate-700 bg-navy py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-[#FC4C00] focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#FC4C00]" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-navy">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50 text-left text-slate-400">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Department</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Published</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-slate-700/30 hover:bg-slate-800/30"
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-white">{job.title}</div>
                    <div className="text-xs text-slate-500">{job.slug}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-300">
                    {job.department || '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-300">
                    {job.employmentType || '—'}
                  </td>
                  <td className="px-5 py-3 text-slate-300">
                    {job.location || '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        job.status === 'open'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {job.published ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-slate-500" />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(job)}
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.slug)}
                        className="rounded p-1.5 text-red-400 hover:bg-red-500/20"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    {search
                      ? 'No matching jobs'
                      : 'No jobs yet. Click "Add Job" to create one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-[#1A1A2E]">
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                {editingJob ? 'Edit Job' : 'New Job'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="max-h-[70vh] space-y-4 overflow-y-auto p-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Title *
                  </label>
                  <input
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Department
                  </label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                  >
                    <option value="">Select...</option>
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Project Management</option>
                    <option>Sales</option>
                    <option>Operations</option>
                    <option>Internships</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType || 'Full-time'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employmentType: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Freelance</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel || 'Mid Level'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        experienceLevel: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                  >
                    <option>Entry Level</option>
                    <option>Junior</option>
                    <option>Mid Level</option>
                    <option>Senior</option>
                    <option>Lead</option>
                    <option>Manager</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Location
                  </label>
                  <input
                    value={formData.location || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                    placeholder="e.g. Remote, Lahore, Hybrid"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Status
                  </label>
                  <select
                    value={formData.status || 'open'}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Short Description
                </label>
                <textarea
                  value={formData.shortDescription || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Published
                  </label>
                  <select
                    value={formData.published ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        published: e.target.value === 'true',
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                  >
                    <option value="false">Draft</option>
                    <option value="true">Published</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Featured
                  </label>
                  <select
                    value={formData.featured ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        featured: e.target.value === 'true',
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.title}
                  className="flex items-center gap-2 rounded-lg bg-[#FC4C00] px-6 py-2 text-sm font-semibold text-white hover:bg-[#E04300] disabled:opacity-50"
                >
                  {submitting ? (
                    <Briefcase className="h-4 w-4 animate-spin" />
                  ) : null}
                  {editingJob ? 'Update' : 'Create'} Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
