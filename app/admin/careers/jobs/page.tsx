'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  Briefcase,
} from 'lucide-react';
import {
  CAREER_DEPARTMENTS,
  CAREER_EMPLOYMENT_TYPES,
  CAREER_EXPERIENCE_LEVELS,
  REMOTE_STATUS_LABELS,
} from '@/lib/careers/constants';

interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  remoteStatus: string;
  city: string;
  country: string;
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

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#FC4C00] focus:outline-none';
const textareaClass =
  'w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#FC4C00] focus:outline-none resize-y';
const selectClass =
  'w-full rounded-lg border border-slate-700 bg-navy px-3 py-2 text-sm text-white focus:border-[#FC4C00] focus:outline-none';
const labelClass = 'mb-1 block text-sm font-medium text-slate-300';

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

  const skillsInputValue = formData.skills?.join(', ') ?? '';

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
        remoteStatus: formData.remoteStatus,
        city: formData.city,
        country: formData.country,
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
      remoteStatus: job.remoteStatus,
      city: job.city,
      country: job.country,
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
      closingDate: job.closingDate
        ? new Date(job.closingDate).toISOString().split('T')[0]
        : undefined,
      seoTitle: job.seoTitle,
      seoDescription: job.seoDescription,
    });
    setShowModal(true);
  };

  const openNew = () => {
    setEditingJob(null);
    setFormData({
      title: 'Business Development Specialist / Executive',
      department: 'Sales & Business Growth',
      employmentType: 'Full-time',
      experienceLevel: '1–3 years',
      location: 'Remote / Hybrid',
      remoteStatus: 'hybrid',
      city: '',
      country: 'Pakistan',
      shortDescription:
        'Drive client acquisition and revenue growth by identifying high-value B2B opportunities, building decision-maker relationships, and closing digital solutions projects.',
      description:
        '<p>We are seeking a results-driven Business Development Specialist / Executive to drive client acquisition and revenue growth for SiliconHubs.</p><p>You will identify high-value B2B leads, build relationships with decision-makers, conduct discovery conversations, prepare solution proposals, and help close sales for our digital solutions and technology services.</p>',
      responsibilities:
        '<ul><li><strong>Lead Generation:</strong> Prospect and qualify potential B2B clients through LinkedIn, email outreach, and cold calls.</li><li><strong>Pitching &amp; Proposals:</strong> Schedule discovery calls, prepare custom project proposals, and present solution pitches to prospects.</li><li><strong>Deal Closing:</strong> Lead negotiations, address client objections, and secure contract agreements to achieve revenue targets.</li><li><strong>Relationship Management:</strong> Maintain strategic relationships with existing clients to identify upselling and cross-selling opportunities.</li><li><strong>Pipeline Management:</strong> Track lead interactions, sales activities, and deal stages in the CRM.</li></ul>',
      requirements:
        '<ul><li><strong>Experience:</strong> 1–3 years of experience in business development, sales, or lead generation; digital agency or SaaS experience is preferred.</li><li><strong>Communication:</strong> Strong written and spoken English with excellent negotiation and presentation skills.</li><li><strong>Sales Tools:</strong> Proficiency with LinkedIn Sales Navigator, email outreach tools, and CRM software such as HubSpot, Salesforce, or similar.</li><li><strong>Technical Understanding:</strong> Basic understanding of modern web technologies, software development, and digital marketing services.</li><li><strong>Mindset:</strong> Highly self-motivated, target-oriented, proactive, and comfortable working in an agile environment.</li></ul>',
      niceToHave:
        '<ul><li>Experience selling web development, AI automation, eCommerce, SEO, or digital marketing services.</li><li>Existing B2B network or experience working with international clients.</li></ul>',
      benefits:
        '<ul><li><strong>Competitive Compensation:</strong> Base salary plus uncapped performance-based commission on closed deals.</li><li><strong>Flexible Work:</strong> Flexible working hours with remote working options.</li><li><strong>Career Growth:</strong> Clear career progression paths toward sales and business development leadership.</li></ul>',
      salary: 'Competitive base salary + uncapped performance-based commission',
      skills: [
        'Business Development',
        'B2B Sales',
        'Lead Generation',
        'LinkedIn Sales Navigator',
        'Email Outreach',
        'Negotiation',
        'Client Acquisition',
        'Proposal Writing',
        'CRM',
        'Digital Agency Sales',
      ],
      status: 'open',
      featured: true,
      published: false,
      seoTitle:
        'Business Development Specialist / Executive | SiliconHubs Careers',
      seoDescription:
        'Join SiliconHubs as a Business Development Specialist / Executive and help drive B2B client acquisition, sales growth, partnerships, and digital solutions opportunities.',
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

  const renderInput = (
    label: string,
    field: string,
    type: string = 'text',
    placeholder: string = '',
    required: boolean = false
  ) => (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-[#FC4C00]"> *</span>}
      </label>
      <input
        type={type}
        value={(formData as any)[field] || ''}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className={inputClass}
        placeholder={placeholder}
      />
    </div>
  );

  const renderTextarea = (
    label: string,
    field: string,
    rows: number,
    placeholder: string = '',
    required: boolean = false
  ) => (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-[#FC4C00]"> *</span>}
      </label>
      <textarea
        value={(formData as any)[field] || ''}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        rows={rows}
        className={textareaClass}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );

  const renderSelect = (
    label: string,
    field: string,
    options: { value: string; label: string }[],
    placeholder: string = 'Select...',
    required: boolean = false
  ) => (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="text-[#FC4C00]"> *</span>}
      </label>
      <select
        value={(formData as any)[field] || ''}
        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
        className={selectClass}
        required={required}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
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
          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-[#1A1A2E]">
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
              className="max-h-[80vh] space-y-6 overflow-y-auto p-6"
            >
              {/* Section 1: Basic Info */}
              <div>
                <h3 className="mb-3 border-b border-slate-700 pb-1 text-sm font-semibold text-slate-300">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Job Title *</label>
                    <input
                      value={formData.title || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className={inputClass}
                      required
                    />
                  </div>

                  {renderSelect(
                    'Department',
                    'department',
                    CAREER_DEPARTMENTS.map((d) => ({ value: d, label: d })),
                    'Select department...',
                    true
                  )}

                  {renderSelect(
                    'Employment Type',
                    'employmentType',
                    CAREER_EMPLOYMENT_TYPES.map((t) => ({
                      value: t,
                      label: t,
                    })),
                    'Select employment type...',
                    true
                  )}

                  {renderSelect(
                    'Experience Level',
                    'experienceLevel',
                    CAREER_EXPERIENCE_LEVELS.map((l) => ({
                      value: l,
                      label: l,
                    }))
                  )}

                  <div>
                    <label className={labelClass}>Location</label>
                    <input
                      value={formData.location || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. Remote, Lahore, Hybrid"
                    />
                  </div>

                  {renderSelect(
                    'Remote Status',
                    'remoteStatus',
                    Object.entries(REMOTE_STATUS_LABELS).map(([val, lbl]) => ({
                      value: val,
                      label: lbl,
                    }))
                  )}

                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      value={formData.city || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. Lahore"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      value={formData.country || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. Pakistan"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={formData.status || 'open'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={selectClass}
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Job Description */}
              <div>
                <h3 className="mb-3 border-b border-slate-700 pb-1 text-sm font-semibold text-slate-300">
                  Job Description
                </h3>
                <p className="mb-4 text-xs text-slate-500">
                  Add the complete job information below. These fields are used
                  by the public careers page and job detail page.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Job Summary <span className="text-[#FC4C00]"> *</span>
                    </label>
                    <textarea
                      value={formData.shortDescription || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          shortDescription: e.target.value,
                        })
                      }
                      rows={4}
                      className={textareaClass}
                      placeholder="Concise summary of the role, purpose, and what the successful candidate will do."
                      required
                    />
                  </div>

                  {renderTextarea(
                    'Full Job Description (HTML)',
                    'description',
                    5,
                    'e.g. <p>The full role description…</p><p>Use <strong>, <em>, <ul><li> tags for formatting.</p>',
                    true
                  )}

                  {renderTextarea(
                    'Key Responsibilities (HTML)',
                    'responsibilities',
                    6,
                    'e.g. <ul><li>Drive new business development strategies</li><li>Build and maintain client relationships</li></ul>',
                    true
                  )}

                  {renderTextarea(
                    'Requirements & Skills (HTML)',
                    'requirements',
                    6,
                    "e.g. <ul><li>Bachelor's degree in Business or related field</li><li>3+ years in business development</li></ul>",
                    true
                  )}

                  {renderTextarea(
                    'Nice to Have (HTML)',
                    'niceToHave',
                    4,
                    'e.g. <ul><li>Experience in the semiconductor industry</li></ul>'
                  )}

                  {renderTextarea(
                    'Benefits & Compensation (HTML)',
                    'benefits',
                    6,
                    'e.g. <div class="benefits-grid"><div class="benefit-item">🏠<h4>Flexible Work</h4><p>Work from anywhere...</p></div></div>',
                    true
                  )}
                </div>
              </div>

              {/* Section 3: Compensation & Metadata */}
              <div>
                <h3 className="mb-3 border-b border-slate-700 pb-1 text-sm font-semibold text-slate-300">
                  Compensation & Metadata
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Salary</label>
                    <input
                      value={formData.salary || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      className={inputClass}
                      placeholder="e.g. $60k – $80k / year"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Skills</label>
                    <input
                      value={skillsInputValue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          skills: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className={inputClass}
                      placeholder="Comma-separated, e.g. Sales, Partnership, Negotiation"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Enter skills separated by commas.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass}>Closing Date</label>
                    <input
                      type="date"
                      value={formData.closingDate || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          closingDate: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Publishing & SEO */}
              <div>
                <h3 className="mb-3 border-b border-slate-700 pb-1 text-sm font-semibold text-slate-300">
                  Publishing & SEO
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Published</label>
                    <select
                      value={formData.published ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          published: e.target.value === 'true',
                        })
                      }
                      className={selectClass}
                    >
                      <option value="false">Draft</option>
                      <option value="true">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Featured</label>
                    <select
                      value={formData.featured ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          featured: e.target.value === 'true',
                        })
                      }
                      className={selectClass}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>SEO Title</label>
                    <input
                      value={formData.seoTitle || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seoTitle: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="Overrides the job title for search engines"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>SEO Description</label>
                    <textarea
                      value={formData.seoDescription || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seoDescription: e.target.value,
                        })
                      }
                      rows={2}
                      className={textareaClass}
                      placeholder="Meta description for search engines"
                    />
                  </div>
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
