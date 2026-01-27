import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import SessionProvider from '@/components/admin/SessionProvider';
import { SessionTimeoutWarning } from '@/components/security/SessionTimeoutWarning';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Require authentication and admin/editor role
  if (!user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  if (user.role !== 'admin' && user.role !== 'editor') {
    redirect('/');
  }

  // Create a safe user object with default values
  const safeUser = {
    name: user.name || 'Admin',
    email: user.email || '',
    role: user.role || 'viewer',
  };

  return (
    <SessionProvider>
      <div className="flex h-screen bg-[#0F172A]">
        <AdminSidebar user={safeUser} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader user={safeUser} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
        <SessionTimeoutWarning />
      </div>
    </SessionProvider>
  );
}
