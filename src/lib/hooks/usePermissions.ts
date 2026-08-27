'use client';

import { useSession } from 'next-auth/react';

export function usePermissions() {
  const { data: session } = useSession();
  const user = session?.user;

  return {
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEditor: user?.role === 'editor',
    isViewer: user?.role === 'viewer',
    canEdit: user?.role === 'admin' || user?.role === 'editor',
    canManageUsers: user?.role === 'admin',
    canDelete: user?.role === 'admin',
    role: user?.role,
  };
}
