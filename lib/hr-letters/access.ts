import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

export async function getHRAdminSession() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}
