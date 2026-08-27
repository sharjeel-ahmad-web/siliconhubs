import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

/**
 * Get the current user session
 * @returns User session or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Check if user is authenticated
 * @returns True if authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

/**
 * Check if user has a specific role
 * @param role Role to check
 * @returns True if user has the role, false otherwise
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user is an admin
 * @returns True if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Check if user is an editor or admin
 * @returns True if user is editor or admin, false otherwise
 */
export async function canEdit(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin' || user?.role === 'editor';
}

/**
 * Require authentication middleware
 * Throws error if user is not authenticated
 */
export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    throw new Error('Authentication required');
  }
}

/**
 * Require specific role middleware
 * Throws error if user doesn't have the required role
 */
export async function requireRole(role: string) {
  await requireAuth();
  const hasRequiredRole = await hasRole(role);
  if (!hasRequiredRole) {
    throw new Error(`Role '${role}' required`);
  }
}

/**
 * Require admin role middleware
 * Throws error if user is not an admin
 */
export async function requireAdmin() {
  await requireRole('admin');
}
