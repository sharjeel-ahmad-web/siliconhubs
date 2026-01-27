'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  MoreVertical,
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

interface UsersListProps {
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onManage2FA: (user: User) => void;
  refreshTrigger?: number;
}

export default function UsersList({
  onEditUser,
  onDeleteUser,
  onManage2FA,
  refreshTrigger = 0,
}: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, page, refreshTrigger]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400';
      case 'editor':
        return 'bg-[#37AFE1]/20 text-[#37AFE1]';
      case 'viewer':
        return 'bg-slate-600/50 text-slate-400';
      default:
        return 'bg-slate-600/50 text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-700 bg-[#1E293B] py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:border-[#37AFE1] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-700 bg-[#1E293B] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#37AFE1]/30 border-t-[#37AFE1]"></div>
            <p className="mt-4 text-slate-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-slate-600" />
            <h3 className="mb-2 text-xl font-semibold text-white">
              No users found
            </h3>
            <p className="text-slate-400">
              {search || roleFilter
                ? 'Try adjusting your filters'
                : 'Get started by creating your first user'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-700 bg-[#0F172A]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      2FA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.two_factor_enabled ? (
                          <ShieldCheck className="h-5 w-5 text-green-400" />
                        ) : (
                          <Shield className="h-5 w-5 text-slate-600" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === user.id ? null : user.id
                              )
                            }
                            className="rounded-lg p-2 transition-colors hover:bg-slate-700"
                          >
                            <MoreVertical className="h-5 w-5 text-slate-400" />
                          </button>
                          {activeMenu === user.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setActiveMenu(null)}
                              />
                              <div className="absolute right-0 z-20 mt-2 w-48 rounded-lg border border-slate-700 bg-[#0F172A] py-1 shadow-lg">
                                <button
                                  onClick={() => {
                                    onEditUser(user);
                                    setActiveMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit User
                                </button>
                                <button
                                  onClick={() => {
                                    onManage2FA(user);
                                    setActiveMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700"
                                >
                                  <Shield className="h-4 w-4" />
                                  Manage 2FA
                                </button>
                                <button
                                  onClick={() => {
                                    onDeleteUser(user);
                                    setActiveMenu(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete User
                                </button>
                              </div>
                            </>
                          )}
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
                  className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
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
