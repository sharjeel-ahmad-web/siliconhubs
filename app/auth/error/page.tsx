'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification:
      'The verification token has expired or has already been used.',
    Default: 'An error occurred during authentication.',
  };

  const message = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>

      <h1 className="mb-2 text-center text-2xl font-bold text-slate-900">
        Authentication Error
      </h1>

      <p className="mb-6 text-center text-slate-600">{message}</p>

      <Link
        href="/auth/signin"
        className="block w-full rounded-lg bg-gradient-to-r from-[#2563EB] to-[#37AFE1] py-3 text-center font-medium text-white transition-all duration-200 hover:shadow-lg"
      >
        Try Again
      </Link>

      <div className="mt-4 text-center">
        <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
          Back to website
        </Link>
      </div>
    </>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1E293B] via-[#2563EB] to-[#37AFE1] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
              </div>
            }
          >
            <ErrorContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
