'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  RefreshCw,
} from 'lucide-react';

interface Keyword {
  _id?: string;
  keyword: string;
  page: string;
  currentRank: number | null;
  previousRank: number | null;
  searchVolume: number;
  difficulty: 'easy' | 'medium' | 'hard';
  lastChecked: string;
  history: { date: string; rank: number }[];
}

export default function KeywordTracker() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyword, setNewKeyword] = useState({
    keyword: '',
    page: '/',
    searchVolume: 0,
    difficulty: 'medium',
  });
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const res = await fetch('/api/admin/seo/keywords');
      if (res.ok) {
        const data = await res.json();
        setKeywords(data);
      }
    } catch (error) {
      console.error('Error fetching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newKeyword.keyword.trim()) return;

    try {
      const res = await fetch('/api/admin/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKeyword),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Keyword added!' });
        setShowAddForm(false);
        setNewKeyword({
          keyword: '',
          page: '/',
          searchVolume: 0,
          difficulty: 'medium',
        });
        fetchKeywords();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add keyword' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this keyword?')) return;

    try {
      const res = await fetch(`/api/admin/seo/keywords/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Keyword deleted!' });
        fetchKeywords();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const updateRank = async (id: string, newRank: number) => {
    try {
      const res = await fetch(`/api/admin/seo/keywords/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRank: newRank }),
      });

      if (res.ok) {
        fetchKeywords();
      }
    } catch (error) {
      console.error('Error updating rank:', error);
    }
  };

  const getRankChange = (current: number | null, previous: number | null) => {
    if (current === null || previous === null) return null;
    return previous - current; // Positive = improved (lower rank is better)
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-400';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400';
      case 'hard':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const filteredKeywords = keywords.filter(
    (k) =>
      k.keyword.toLowerCase().includes(filter.toLowerCase()) ||
      k.page.toLowerCase().includes(filter.toLowerCase())
  );

  // Stats
  const avgRank =
    keywords
      .filter((k) => k.currentRank)
      .reduce((acc, k) => acc + (k.currentRank || 0), 0) /
    (keywords.filter((k) => k.currentRank).length || 1);
  const improved = keywords.filter((k) => {
    const change = getRankChange(k.currentRank, k.previousRank);
    return change !== null && change > 0;
  }).length;
  const declined = keywords.filter((k) => {
    const change = getRankChange(k.currentRank, k.previousRank);
    return change !== null && change < 0;
  }).length;

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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{keywords.length}</p>
          <p className="text-sm text-slate-400">Total Keywords</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{avgRank.toFixed(1)}</p>
          <p className="text-sm text-slate-400">Avg. Position</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <p className="text-2xl font-bold text-green-400">{improved}</p>
          </div>
          <p className="text-sm text-slate-400">Improved</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-400" />
            <p className="text-2xl font-bold text-red-400">{declined}</p>
          </div>
          <p className="text-sm text-slate-400">Declined</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search keywords..."
            className="w-full rounded-lg border border-slate-700 bg-[#1E293B] py-2 pl-10 pr-4 text-white focus:border-[#37AFE1] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80"
        >
          <Plus className="h-5 w-5" />
          Add Keyword
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-6">
          <h3 className="mb-4 font-semibold text-white">Add New Keyword</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <input
              type="text"
              value={newKeyword.keyword}
              onChange={(e) =>
                setNewKeyword({ ...newKeyword, keyword: e.target.value })
              }
              placeholder="Keyword phrase"
              className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
            />
            <select
              value={newKeyword.page}
              onChange={(e) =>
                setNewKeyword({ ...newKeyword, page: e.target.value })
              }
              className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
            >
              <option value="/">Homepage</option>
              <option value="/about">About</option>
              <option value="/services">Services</option>
              <option value="/portfolio">Portfolio</option>
              <option value="/contact">Contact</option>
              <option value="/blog">Blog</option>
            </select>
            <input
              type="number"
              value={newKeyword.searchVolume}
              onChange={(e) =>
                setNewKeyword({
                  ...newKeyword,
                  searchVolume: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Search volume"
              className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
            />
            <select
              value={newKeyword.difficulty}
              onChange={(e) =>
                setNewKeyword({
                  ...newKeyword,
                  difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                })
              }
              className="rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-[#37AFE1] px-6 py-2 text-white hover:bg-[#37AFE1]/80"
            >
              Add Keyword
            </button>
          </div>
        </div>
      )}

      {/* Keywords Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        {filteredKeywords.length === 0 ? (
          <div className="p-12 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              No keywords tracked
            </h3>
            <p className="text-slate-400">
              Add keywords to start tracking rankings
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700 bg-[#0F172A]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Keyword
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Page
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Change
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Volume
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-400">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredKeywords.map((kw) => {
                  const change = getRankChange(kw.currentRank, kw.previousRank);
                  return (
                    <tr key={kw._id} className="hover:bg-slate-700/30">
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {kw.keyword}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">
                        {kw.page}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={kw.currentRank || ''}
                          onChange={(e) =>
                            updateRank(kw._id!, parseInt(e.target.value) || 0)
                          }
                          placeholder="-"
                          className="w-16 rounded border border-slate-700 bg-[#0F172A] px-2 py-1 text-center text-sm text-white"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {change !== null && (
                          <span
                            className={`flex items-center gap-1 text-sm ${change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-slate-400'}`}
                          >
                            {change > 0 ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : change < 0 ? (
                              <TrendingDown className="h-4 w-4" />
                            ) : (
                              <Minus className="h-4 w-4" />
                            )}
                            {change > 0 ? `+${change}` : change}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-400">
                        {kw.searchVolume.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${getDifficultyColor(kw.difficulty)}`}
                        >
                          {kw.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(kw._id!)}
                          className="rounded p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
