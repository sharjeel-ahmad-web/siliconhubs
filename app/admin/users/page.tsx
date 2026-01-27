'use client';

import { useState } from 'react';
import { Plus, Shield, Activity } from 'lucide-react';
import UsersList from '@/components/admin/UsersList';
import UserEditor from '@/components/admin/UserEditor';
import TwoFactorManager from '@/components/admin/TwoFactorManager';
import PermissionMatrix from '@/components/admin/PermissionMatrix';
import ActivityLogViewer from '@/components/admin/ActivityLogViewer';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<
    'users' | 'permissions' | 'activity'
  >('users');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [managing2FA, setManaging2FA] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDeleteUser = async (user: User) => {
    if (
      !confirm(
        `Are you sure you want to delete ${user.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRefreshTrigger((prev) => prev + 1);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleSaveUser = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleUpdate2FA = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="mt-1 text-slate-400">
            Manage users, roles, and permissions
          </p>
        </div>
        {activeTab === 'users' && (
          <button
            onClick={() => setCreatingUser(true)}
            className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'border-[#37AFE1] text-[#37AFE1]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'permissions'
                ? 'border-[#37AFE1] text-[#37AFE1]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4" />
            Permissions
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition-colors ${
              activeTab === 'activity'
                ? 'border-[#37AFE1] text-[#37AFE1]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="h-4 w-4" />
            Activity Log
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <UsersList
          onEditUser={setEditingUser}
          onDeleteUser={handleDeleteUser}
          onManage2FA={setManaging2FA}
          refreshTrigger={refreshTrigger}
        />
      )}

      {activeTab === 'permissions' && <PermissionMatrix />}

      {activeTab === 'activity' && <ActivityLogViewer />}

      {/* Modals */}
      {(editingUser || creatingUser) && (
        <UserEditor
          user={editingUser}
          onClose={() => {
            setEditingUser(null);
            setCreatingUser(false);
          }}
          onSave={handleSaveUser}
        />
      )}

      {managing2FA && (
        <TwoFactorManager
          user={managing2FA}
          onClose={() => setManaging2FA(null)}
          onUpdate={handleUpdate2FA}
        />
      )}
    </div>
  );
}
