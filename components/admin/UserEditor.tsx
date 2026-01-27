'use client';

import { useState, useEffect } from 'react';
import { X, Save, Eye, EyeOff } from 'lucide-react';

interface User {
  id?: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  password?: string;
}

interface UserEditorProps {
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}

export default function UserEditor({ user, onClose, onSave }: UserEditorProps) {
  const [formData, setFormData] = useState<User>({
    email: '',
    name: '',
    role: 'viewer',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        ...user,
        password: '',
      });
    } else {
      setFormData({
        email: '',
        name: '',
        role: 'viewer',
        password: '',
      });
    }
    setError('');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = user?.id ? `/api/admin/users/${user.id}` : '/api/admin/users';
      const method = user?.id ? 'PUT' : 'POST';

      const body: any = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };

      // Only include password if it's set
      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save user');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user && user !== null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-[#1E293B] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white">
            {user?.id ? 'Edit User' : 'Create User'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-slate-700"
          >
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

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
              required
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white placeholder-slate-400 focus:border-[#37AFE1] focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white placeholder-slate-400 focus:border-[#37AFE1] focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'admin' | 'editor' | 'viewer',
                })
              }
              required
              className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-1 text-xs text-slate-400">
              {formData.role === 'admin' &&
                'Full access to all features and settings'}
              {formData.role === 'editor' &&
                'Can create and edit content, but cannot manage users'}
              {formData.role === 'viewer' && 'Read-only access to content'}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">
              Password {user?.id && '(leave blank to keep current)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!user?.id}
                className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-3 py-2 pr-10 text-white placeholder-slate-400 focus:border-[#37AFE1] focus:outline-none"
                placeholder={
                  user?.id ? 'Leave blank to keep current' : '••••••••'
                }
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {!user?.id && (
              <p className="mt-1 text-xs text-slate-400">
                Minimum 8 characters
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-slate-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-300 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white transition-colors hover:bg-[#37AFE1]/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {user?.id ? 'Update' : 'Create'} User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
