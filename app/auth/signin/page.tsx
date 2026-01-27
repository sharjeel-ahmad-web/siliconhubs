'use client';

import { Suspense } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Shield } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needs2FA, setNeeds2FA] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        token: needs2FA ? token : undefined,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === '2FA token required') {
          setNeeds2FA(true);
          setError('Please enter your 2FA code');
        } else if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password');
        } else {
          setError(result.error);
        }
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Sign In</h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!needs2FA ? (
          <>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="admin@risingdot.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </>
        ) : (
          <div>
            <label
              htmlFor="token"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Two-Factor Authentication Code
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                placeholder="000000"
                maxLength={6}
              />
            </div>
            <button
              type="button"
              onClick={() => setNeeds2FA(false)}
              className="mt-2 text-sm text-[#2563EB] hover:underline"
            >
              Back to login
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-[#2563EB] to-[#37AFE1] py-3 font-medium text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
          Back to website
        </Link>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1E293B] via-[#2563EB] to-[#37AFE1] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#37AFE1]" />
          </div>
          <h1 className="text-3xl font-bold text-white">Rising Dot</h1>
          <p className="mt-2 text-blue-200">Admin Dashboard</p>
        </div>

        {/* Sign In Form */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
              </div>
            }
          >
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
