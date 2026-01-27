'use client';

import { Check, X } from 'lucide-react';

interface Permission {
  category: string;
  actions: {
    name: string;
    admin: boolean;
    editor: boolean;
    viewer: boolean;
  }[];
}

export default function PermissionMatrix() {
  const permissions: Permission[] = [
    {
      category: 'User Management',
      actions: [
        { name: 'View users', admin: true, editor: false, viewer: false },
        { name: 'Create users', admin: true, editor: false, viewer: false },
        { name: 'Edit users', admin: true, editor: false, viewer: false },
        { name: 'Delete users', admin: true, editor: false, viewer: false },
        { name: 'Manage 2FA', admin: true, editor: false, viewer: false },
      ],
    },
    {
      category: 'Content Management',
      actions: [
        { name: 'View pages', admin: true, editor: true, viewer: true },
        { name: 'Create pages', admin: true, editor: true, viewer: false },
        { name: 'Edit pages', admin: true, editor: true, viewer: false },
        { name: 'Delete pages', admin: true, editor: true, viewer: false },
        { name: 'Publish pages', admin: true, editor: true, viewer: false },
      ],
    },
    {
      category: 'Projects',
      actions: [
        { name: 'View projects', admin: true, editor: true, viewer: true },
        { name: 'Create projects', admin: true, editor: true, viewer: false },
        { name: 'Edit projects', admin: true, editor: true, viewer: false },
        { name: 'Delete projects', admin: true, editor: true, viewer: false },
      ],
    },
    {
      category: 'Services',
      actions: [
        { name: 'View services', admin: true, editor: true, viewer: true },
        { name: 'Create services', admin: true, editor: true, viewer: false },
        { name: 'Edit services', admin: true, editor: true, viewer: false },
        { name: 'Delete services', admin: true, editor: true, viewer: false },
      ],
    },
    {
      category: 'Media Library',
      actions: [
        { name: 'View media', admin: true, editor: true, viewer: true },
        { name: 'Upload media', admin: true, editor: true, viewer: false },
        { name: 'Delete media', admin: true, editor: true, viewer: false },
      ],
    },
    {
      category: 'Animation Presets',
      actions: [
        { name: 'View presets', admin: true, editor: true, viewer: true },
        { name: 'Create presets', admin: true, editor: true, viewer: false },
        { name: 'Edit presets', admin: true, editor: true, viewer: false },
        { name: 'Delete presets', admin: true, editor: true, viewer: false },
      ],
    },
    {
      category: 'Analytics',
      actions: [
        { name: 'View analytics', admin: true, editor: true, viewer: true },
        { name: 'Export data', admin: true, editor: true, viewer: false },
      ],
    },
    {
      category: 'Settings',
      actions: [
        { name: 'View settings', admin: true, editor: false, viewer: false },
        { name: 'Edit settings', admin: true, editor: false, viewer: false },
      ],
    },
  ];

  const PermissionIcon = ({ allowed }: { allowed: boolean }) => {
    return allowed ? (
      <Check className="h-5 w-5 text-green-400" />
    ) : (
      <X className="h-5 w-5 text-slate-600" />
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
      <div className="border-b border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white">Permission Matrix</h3>
        <p className="mt-1 text-sm text-slate-400">
          Overview of permissions for each role
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-700 bg-[#0F172A]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Permission
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
                <div className="flex flex-col items-center">
                  <span>Admin</span>
                  <span className="font-semibold text-red-400">
                    Full Access
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
                <div className="flex flex-col items-center">
                  <span>Editor</span>
                  <span className="font-semibold text-[#37AFE1]">
                    Content Only
                  </span>
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-400">
                <div className="flex flex-col items-center">
                  <span>Viewer</span>
                  <span className="font-semibold text-slate-400">
                    Read Only
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {permissions.map((category, categoryIndex) => (
              <>
                <tr key={`category-${categoryIndex}`} className="bg-[#0F172A]">
                  <td
                    colSpan={4}
                    className="px-6 py-3 text-sm font-semibold text-white"
                  >
                    {category.category}
                  </td>
                </tr>
                {category.actions.map((action, actionIndex) => (
                  <tr
                    key={`action-${categoryIndex}-${actionIndex}`}
                    className="hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {action.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <PermissionIcon allowed={action.admin} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <PermissionIcon allowed={action.editor} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <PermissionIcon allowed={action.viewer} />
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-700 bg-[#0F172A] p-6">
        <div className="space-y-2 text-sm text-slate-400">
          <p>
            <strong className="text-white">Admin:</strong> Full access to all
            features including user management, settings, and all content
            operations.
          </p>
          <p>
            <strong className="text-white">Editor:</strong> Can create, edit,
            and delete content (pages, projects, services, media) but cannot
            manage users or system settings.
          </p>
          <p>
            <strong className="text-white">Viewer:</strong> Read-only access to
            view content and analytics but cannot make any changes.
          </p>
        </div>
      </div>
    </div>
  );
}
