import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

export default async function HRAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/signin?callbackUrl=/admin/hr/letters');
  }
  if (user.role !== 'admin') redirect('/admin');
  return children;
}
