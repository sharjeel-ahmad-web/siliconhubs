'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Trash2,
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Send,
  X,
  Check,
} from 'lucide-react';

interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  source: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  tags: string[];
  subscribedAt: string;
  lastEmailAt?: string;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  thisMonth: number;
  growth: number;
}

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    thisMonth: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '',
    name: '',
    tags: '',
  });

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [search, statusFilter, page]);

  const fetchSubscribers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`/api/admin/seo/subscribers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/seo/subscribers/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddSubscriber = async () => {
    try {
      const res = await fetch('/api/admin/seo/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSubscriber,
          tags: newSubscriber.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Subscriber added successfully!' });
        setShowAddForm(false);
        setNewSubscriber({ email: '', name: '', tags: '' });
        fetchSubscribers();
        fetchStats();
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (ids: string[]) => {
    if (!confirm(`Delete ${ids.length} subscriber(s)?`)) return;

    try {
      const res = await fetch('/api/admin/seo/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });

      if (res.ok) {
        setMessage({
          type: 'success',
          text: `${ids.length} subscriber(s) deleted`,
        });
        setSelectedIds([]);
        fetchSubscribers();
        fetchStats();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete subscribers' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/admin/seo/subscribers/export');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export subscribers' });
    }
  };

  const handleStatusChange = async (
    id: string,
    status: 'active' | 'unsubscribed'
  ) => {
    try {
      const res = await fetch(`/api/admin/seo/subscribers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchSubscribers();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === subscribers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(subscribers.map((s) => s._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'unsubscribed':
        return 'bg-slate-500/20 text-slate-400';
      case 'bounced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#37AFE1]/20 p-2">
              <Users className="h-5 w-5 text-[#37AFE1]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-slate-400">Total Subscribers</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/20 p-2">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-sm text-slate-400">Active</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/20 p-2">
              <Calendar className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
              <p className="text-sm text-slate-400">This Month</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/20 p-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats.growth > 0 ? '+' : ''}
                {stats.growth}%
              </p>
              <p className="text-sm text-slate-400">Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex flex-1 gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by email or name..."
              className="w-full rounded-lg border border-slate-700 bg-[#1E293B] py-2 pl-10 pr-4 text-white focus:border-[#37AFE1] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => handleDelete(selectedIds)}
              className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-red-400 hover:bg-red-500/30"
            >
              <Trash2 className="h-4 w-4" />
              Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-600"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80"
          >
            <Mail className="h-4 w-4" />
            Add Subscriber
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-white">Add New Subscriber</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded p-1 hover:bg-slate-700"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <input
              type="email"
              value={newSubscriber.email}
              onChange={(e) =>
                setNewSubscriber({ ...newSubscriber, email: e.target.value })
              }
              placeholder="Email address *"
              className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
            />
            <input
              type="text"
              value={newSubscriber.name}
              onChange={(e) =>
                setNewSubscriber({ ...newSubscriber, name: e.target.value })
              }
              placeholder="Name (optional)"
              className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
            />
            <input
              type="text"
              value={newSubscriber.tags}
              onChange={(e) =>
                setNewSubscriber({ ...newSubscriber, tags: e.target.value })
              }
              placeholder="Tags (comma separated)"
              className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddSubscriber}
              className="rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80"
            >
              Add Subscriber
            </button>
          </div>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              No subscribers found
            </h3>
            <p className="text-slate-400">Start building your email list</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-[#0F172A]">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === subscribers.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                      Subscribed
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(sub._id)}
                          onChange={() => toggleSelect(sub._id)}
                          className="h-4 w-4 rounded border-slate-600 bg-[#0F172A] text-[#37AFE1]"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {sub.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {sub.name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${getStatusBadge(sub.status)}`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {sub.source}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status === 'active' ? (
                            <button
                              onClick={() =>
                                handleStatusChange(sub._id, 'unsubscribed')
                              }
                              className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-600"
                            >
                              Unsubscribe
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStatusChange(sub._id, 'active')
                              }
                              className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-400 hover:bg-green-500/30"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete([sub._id])}
                            className="rounded p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-700 px-6 py-4">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
