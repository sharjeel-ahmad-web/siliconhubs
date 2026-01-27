'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  order: number;
  published: boolean;
}

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    order: 0,
    published: true,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMember
        ? `/api/admin/team/${editingMember._id}`
        : '/api/admin/team';
      const method = editingMember ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchMembers();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const togglePublish = async (member: TeamMember) => {
    try {
      const res = await fetch(`/api/admin/team/${member._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !member.published }),
      });
      if (res.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      image: member.image,
      order: member.order,
      published: member.published,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      image: '',
      order: members.length,
      published: true,
    });
  };

  return (
    <div className="min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          <p className="mt-1 text-slate-400">
            Manage your team displayed on the website
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
        >
          <Plus className="h-5 w-5" />
          Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] py-12 text-center">
          <p className="text-slate-400">
            No team members yet. Add your first team member!
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-[#1E293B] p-4"
            >
              <GripVertical className="h-5 w-5 cursor-grab text-slate-500" />

              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-slate-700">
                {member.image && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">{member.name}</h3>
                <p className="text-sm text-slate-400">{member.role}</p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    member.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-600/50 text-slate-400'
                  }`}
                >
                  {member.published ? 'Published' : 'Draft'}
                </span>

                <button
                  onClick={() => togglePublish(member)}
                  className={`rounded-lg p-2 transition-colors ${
                    member.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400 hover:text-green-400'
                  }`}
                >
                  {member.published ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(member)}
                  className="rounded-lg bg-slate-700 p-2 text-slate-300 transition-colors hover:bg-[#37AFE1] hover:text-white"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
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
          <div className="w-full max-w-lg rounded-2xl bg-[#1E293B]">
            <div className="border-b border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
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
                  Role
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="e.g., CEO, Lead Developer"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Image Path
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="/team/member-name.png"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Add image to public/team/ folder and enter path here
                </p>
              </div>

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

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-600 text-[#37AFE1] focus:ring-[#37AFE1]"
                />
                <span className="text-slate-300">Published</span>
              </label>

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
                  {editingMember ? 'Update' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
