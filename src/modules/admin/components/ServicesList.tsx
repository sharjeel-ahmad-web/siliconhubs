'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Service {
  id: number;
  slug: string;
  name: string;
  description: string;
  hero_animation: string;
  updated_at: string;
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data.services);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      fetchServices();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete service');
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
      {services.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Briefcase className="mx-auto mb-4 h-16 w-16 text-slate-300" />
          <h3 className="mb-2 text-xl font-semibold text-slate-900">
            No services yet
          </h3>
          <p className="mb-4 text-slate-600">
            Create your first service to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {service.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Link
                    href={service.id ? `/admin/services/${service.id}` : '#'}
                    className="p-1 text-[#2563EB] hover:text-[#1d4ed8]"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <code className="mb-3 block rounded bg-slate-100 px-2 py-1 text-sm text-slate-600">
                /{service.slug}
              </code>

              {service.description && (
                <p className="mb-3 line-clamp-3 text-sm text-slate-600">
                  {service.description}
                </p>
              )}

              {service.hero_animation && (
                <div className="text-xs text-slate-500">
                  Animation: {service.hero_animation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
