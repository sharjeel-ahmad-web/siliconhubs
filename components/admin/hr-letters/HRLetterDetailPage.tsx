'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Archive,
  ArrowLeft,
  ArrowDownToLine,
  CheckCircle2,
  Loader2,
  Printer,
  XCircle,
} from 'lucide-react';
import HRLetterDocument from '@/components/admin/hr-letters/HRLetterDocument';
import { downloadHRLetterPdf } from '@/lib/hr-letters/preview-pdf';
import type { HRLetter } from '@/lib/hr-letters/types';

export default function HRLetterDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const [letter, setLetter] = useState<HRLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadLetter = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/hr/letters/${id}`);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not load this letter.');
      setLetter(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load this letter.'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadLetter();
  }, [loadLetter]);

  useEffect(() => {
    if (
      letter &&
      new URLSearchParams(window.location.search).get('print') === '1'
    ) {
      window.setTimeout(() => window.print(), 300);
    }
  }, [letter]);

  async function changeStatus(status: 'Issued' | 'Cancelled' | 'Archived') {
    if (!letter) return;
    if (
      status === 'Archived' &&
      !window.confirm('Are you sure you want to archive this HR letter?')
    ) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/hr/letters/${letter._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not update letter status.');
      setLetter(data);
      if (status === 'Archived') router.push('/admin/hr/letters');
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Could not update letter status.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!letter) return;
    setError('');
    try {
      const paper = document.querySelector<HTMLElement>(
        '.hr-letter-print-root .hr-letter-paper'
      );
      if (!paper) {
        throw new Error('Could not find the displayed HR letter.');
      }
      await downloadHRLetterPdf(letter, paper);
    } catch (downloadError) {
      console.error('[HR letter PDF download]', downloadError);
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'PDF generation failed. Please try again.'
      );
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/hr/letters"
            className="rounded-xl border border-[#E8D8C5] bg-white p-2 text-[#14213D] hover:bg-[#FFEDD7] print:hidden"
            aria-label="Back to HR letters"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="print:hidden">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F4511E]">
              HR letter record
            </p>
            <h1 className="text-2xl font-bold text-[#14213D]">
              {letter?.letterNumber || 'Letter preview'}
            </h1>
          </div>
        </div>
        {letter && (
          <div className="flex flex-wrap gap-2 print:hidden">
            {letter.status !== 'Archived' && letter.status !== 'Cancelled' && (
              <button
                onClick={() => void changeStatus('Issued')}
                disabled={busy || letter.status === 'Issued'}
                className="border-emerald-200 text-emerald-700 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm font-semibold disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                {letter.status === 'Issued' ? 'Issued' : 'Mark issued'}
              </button>
            )}
            {letter.status === 'Generated' && (
              <button
                onClick={() => void changeStatus('Cancelled')}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-white px-3 py-2.5 text-sm font-semibold text-amber-700 disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" /> Cancel letter
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E8D8C5] bg-white px-3 py-2.5 text-sm font-semibold text-[#14213D]"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              onClick={() => void download()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-3 py-2.5 text-sm font-semibold text-white"
            >
              <ArrowDownToLine className="h-4 w-4" /> Download PDF
            </button>
            {letter.status !== 'Archived' && (
              <button
                onClick={() => void changeStatus('Archived')}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
                Archive
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700 print:hidden"
        >
          {error}
        </p>
      )}
      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading letter…
        </div>
      ) : letter ? (
        <>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 print:hidden">
            <span>Status: {letter.status}</span>
            <span>Generated by: {letter.createdBy}</span>
            <span>{new Date(letter.createdAt).toLocaleString()}</span>
          </div>
          <div className="hr-letter-print-root overflow-x-auto rounded-2xl bg-slate-200 p-3 sm:p-6 print:overflow-visible print:bg-white print:p-0">
            <div className="min-w-[360px]">
              <HRLetterDocument letter={letter} />
            </div>
          </div>
          <style jsx global>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              .hr-letter-print-root,
              .hr-letter-print-root * {
                visibility: visible !important;
              }
              .hr-letter-print-root {
                position: absolute !important;
                inset: 0 !important;
                overflow: visible !important;
                width: 100% !important;
                padding: 0 !important;
                background: white !important;
              }
              .hr-letter-paper {
                width: 210mm !important;
                min-height: 0 !important;
                margin: 0 !important;
                padding: 15mm 18mm !important;
                background: #fff8ec !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                box-shadow: none !important;
              }
            }
          `}</style>
        </>
      ) : (
        <div className="rounded-2xl border border-[#E8D8C5] bg-white p-10 text-center text-slate-600">
          Letter record not found.
        </div>
      )}
    </div>
  );
}
