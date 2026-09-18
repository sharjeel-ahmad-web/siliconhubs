'use client';

/**
 * Polished application success state — confirmation message, reference id,
 * applied position, next steps and links back to careers / other roles.
 */
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, ArrowRight, Home, Search } from 'lucide-react';
import { SubmittedApplication } from '@/components/careers/ApplicationForm';

interface SuccessStateProps {
  result: SubmittedApplication;
  onReset?: () => void;
}

export function ApplicationSuccess({ result, onReset }: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-2xl rounded-3xl border border-[#E8D8C5] bg-white p-8 text-center shadow-xl shadow-[#FC4C00]/5 md:p-12"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
      >
        <CheckCircle2 className="h-11 w-11 text-green-600" />
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-[#14213D] md:text-3xl">
        Application received!
      </h2>

      <p className="mx-auto mb-6 max-w-md text-[#5F6368]">
        Thank you for applying to{' '}
        <strong className="text-[#14213D]">{result.jobTitle}</strong>. Our
        recruitment team will review your application and get back to you soon.
      </p>

      <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-dashed border-[#FC4C00]/40 bg-[#FFF4E6] px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[#8A7E72]">
          Your reference id
        </p>
        <p className="font-mono text-lg font-bold text-[#14213D]">
          {result.referenceId}
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-[#5F6368]">
          <FileText className="h-3.5 w-3.5" />
          Keep this id for future correspondence
        </p>
      </div>

      <div className="mb-8 rounded-2xl bg-[#FFEDD7] px-6 py-5 text-left">
        <h3 className="mb-2 text-sm font-semibold text-[#14213D]">
          What happens next?
        </h3>
        <ol className="space-y-1.5 text-sm text-[#5F6368]">
          <li>1. Our team reviews your application against the role.</li>
          <li>
            2. If there is a match, we will invite you for a short intro call.
          </li>
          <li>
            3. You can track your email — we never leave candidates in the dark.
          </li>
        </ol>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/careers"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl bg-[#FC4C00] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FC4C00]/25 transition-all hover:-translate-y-0.5 hover:bg-[#E04300]"
        >
          <Home className="h-4 w-4" /> Back to Careers
        </Link>
        <Link
          href="/careers#open-positions"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8D8C5] bg-white px-6 py-3 text-sm font-semibold text-[#14213D] transition-all hover:border-[#FC4C00]/40 hover:text-[#FC4C00]"
        >
          <Search className="h-4 w-4" /> View other positions
        </Link>
      </div>

      <p className="mt-6 text-xs text-[#8A7E72]">
        A confirmation email has been sent to your inbox.
      </p>
      <span
        className="mt-6 inline-flex items-center gap-2 text-xs text-[#FC4C00]"
        aria-hidden="true"
      >
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </motion.div>
  );
}

export default ApplicationSuccess;
