'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  features: string[];
  published: boolean;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    icon: '🔧',
    features: '',
    published: true,
    order: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingService
        ? `/api/admin/services/${editingService._id}`
        : '/api/admin/services';
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: formData.features
            .split(',')
            .map((f) => f.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        fetchServices();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const togglePublish = async (service: Service) => {
    try {
      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !service.published }),
      });
      if (res.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description,
      shortDescription: service.shortDescription,
      icon: service.icon,
      features: service.features?.join(', ') || '',
      published: service.published,
      order: service.order,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      icon: '🔧',
      features: '',
      published: true,
      order: services.length,
    });
  };

  return (
    <div className="min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="mt-1 text-slate-400">Manage your service offerings</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] py-12 text-center">
          <p className="mb-4 text-slate-400">
            No services yet. Add your first service!
          </p>
          <p className="text-sm text-slate-500">
            Services will appear on your services page and homepage sections.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-[#1E293B] p-4"
            >
              <GripVertical className="h-5 w-5 cursor-grab text-slate-500" />

              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-700 text-2xl">
                {service.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">{service.name}</h3>
                <p className="truncate text-sm text-slate-400">
                  {service.shortDescription || service.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {service.features?.slice(0, 3).map((feature, i) => (
                    <span
                      key={i}
                      className="rounded bg-[#37AFE1]/20 px-2 py-0.5 text-xs text-[#37AFE1]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    service.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-600/50 text-slate-400'
                  }`}
                >
                  {service.published ? 'Published' : 'Draft'}
                </span>

                <button
                  onClick={() => togglePublish(service)}
                  className={`rounded-lg p-2 transition-colors ${
                    service.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400 hover:text-green-400'
                  }`}
                >
                  {service.published ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(service)}
                  className="rounded-lg bg-slate-700 p-2 text-slate-300 transition-colors hover:bg-[#37AFE1] hover:text-white"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
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
                {editingService ? 'Edit Service' : 'Add Service'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Icon (emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                    placeholder="⚡"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="web-development (auto-generated if empty)"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="Brief tagline for cards"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Full Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="Custom Design, SEO Optimization, Fast Loading"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-2 pb-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          published: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                    />
                    <span className="text-slate-300">Published</span>
                  </label>
                </div>
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
                  {editingService ? 'Update' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
