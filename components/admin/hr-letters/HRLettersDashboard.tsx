'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Archive,
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  FilePlus2,
  FileText,
  Files,
  Printer,
  Search,
  Users,
} from 'lucide-react';
import { downloadHRLetterPdf } from '@/lib/hr-letters/preview-pdf';
import { LETTER_CATALOG, type HRLetter } from '@/lib/hr-letters/types';

interface LetterStats {
  total: number;
  thisMonth: number;
  pending: number;
  employees: number;
}

const EMPTY_STATS: LetterStats = {
  total: 0,
  thisMonth: 0,
  pending: 0,
  employees: 0,
};

export default function HRLettersDashboard() {
  const [letters, setLetters] = useState<HRLetter[]>([]);
  const [stats, setStats] = useState<LetterStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [letterType, setLetterType] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadLetters = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set('search', search.trim());
      if (letterType) query.set('letterType', letterType);
      if (status) query.set('status', status);
      if (department) query.set('department', department);
      if (startDate) query.set('startDate', startDate);
      if (endDate) query.set('endDate', endDate);
      const response = await fetch(`/api/admin/hr/letters?${query.toString()}`);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not load HR letters.');
      setLetters(data.letters);
      setStats(data.stats);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load HR letters.'
      );
    } finally {
      setLoading(false);
    }
  }, [search, letterType, status, department, startDate, endDate]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadLetters(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadLetters]);

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          letters
            .map((letter) => letter.employeeSnapshot.department)
            .filter(Boolean)
        )
      ).sort(),
    [letters]
  );

  async function archiveLetter(letter: HRLetter) {
    if (!window.confirm('Are you sure you want to archive this HR letter?'))
      return;
    setBusyId(letter._id);
    setError('');
    try {
      const response = await fetch(`/api/admin/hr/letters/${letter._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Archived' }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not archive the letter.');
      await loadLetters();
    } catch (archiveError) {
      setError(
        archiveError instanceof Error
          ? archiveError.message
          : 'Could not archive the letter.'
      );
    } finally {
      setBusyId('');
    }
  }

  async function duplicateLetter(letter: HRLetter) {
    setBusyId(letter._id);
    setError('');
    try {
      const response = await fetch(
        `/api/admin/hr/letters/${letter._id}/duplicate`,
        { method: 'POST' }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not duplicate the letter.');
      window.location.assign(`/admin/hr/letters/${data._id}`);
    } catch (duplicateError) {
      setError(
        duplicateError instanceof Error
          ? duplicateError.message
          : 'Could not duplicate the letter.'
      );
    } finally {
      setBusyId('');
    }
  }

  async function downloadLetter(letter: HRLetter) {
    setError('');
    try {
      const response = await fetch(`/api/admin/hr/letters/${letter._id}`);
      const fullLetter = await response.json();
      if (!response.ok) {
        throw new Error(fullLetter.error || 'Could not load this HR letter.');
      }
      await downloadHRLetterPdf(fullLetter);
    } catch (downloadError) {
      console.error('[HR letter PDF download]', downloadError);
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'PDF generation failed. Please try again.'
      );
    }
  }

  const statCards = [
    {
      label: 'Total letters',
      value: stats.total,
      icon: FileText,
      tint: 'text-[#F4511E]',
    },
    {
      label: 'This month',
      value: stats.thisMonth,
      icon: CalendarDays,
      tint: 'text-blue-600',
    },
    {
      label: 'Pending review',
      value: stats.pending,
      icon: Clock3,
      tint: 'text-amber-600',
    },
    {
      label: 'Employees with letters',
      value: stats.employees,
      icon: Users,
      tint: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <Image
            src="/logos/siliconhubs logo icon.png"
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 rounded-2xl border border-[#E8D8C5] object-cover"
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F4511E]">
              Human Resources
            </p>
            <h1 className="text-3xl font-bold text-[#14213D]">HR Letters</h1>
            <p className="mt-1 text-slate-600">
              Create, manage and track official employee HR documents.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/hr/employees"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8D8C5] bg-white px-4 py-3 text-sm font-semibold text-[#14213D] hover:bg-[#FFF8F0]"
          >
            <Users className="h-4 w-4" /> Employees
          </Link>
          <Link
            href="/admin/hr/letters/templates"
            className="inline-flex items-center gap-2 rounded-xl border border-[#E8D8C5] bg-white px-4 py-3 text-sm font-semibold text-[#14213D] hover:bg-[#FFF8F0]"
          >
            <Files className="h-4 w-4" /> Manage templates
          </Link>
          <Link
            href="/admin/hr/letters/create"
            className="inline-flex items-center gap-2 rounded-xl bg-[#F4511E] px-4 py-3 text-sm font-semibold text-white hover:bg-[#d94316]"
          >
            <FilePlus2 className="h-4 w-4" /> Generate letter
          </Link>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, tint }) => (
          <div
            key={label}
            className="rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{label}</p>
              <Icon className={`h-5 w-5 ${tint}`} />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#14213D]">
              {loading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-[#E8D8C5] bg-white shadow-sm">
        <div className="border-b border-[#F2E6D9] p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <label className="relative sm:col-span-2 xl:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee, ID, letter…"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm"
              />
            </label>
            <select
              value={letterType}
              onChange={(event) => setLetterType(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">All letter types</option>
              {LETTER_CATALOG.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">All departments</option>
              {departments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
            >
              <option value="">All statuses</option>
              {['Draft', 'Generated', 'Issued', 'Cancelled', 'Archived'].map(
                (item) => (
                  <option key={item}>{item}</option>
                )
              )}
            </select>
            <div className="flex gap-2">
              <input
                aria-label="From date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-1/2 min-w-0 rounded-lg border border-slate-300 px-2 py-2 text-xs"
              />
              <input
                aria-label="To date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-1/2 min-w-0 rounded-lg border border-slate-300 px-2 py-2 text-xs"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading letters…
          </div>
        ) : letters.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0E4] text-[#F4511E]">
              <FileText className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-bold text-[#14213D]">
              {search ||
              letterType ||
              department ||
              status ||
              startDate ||
              endDate
                ? 'No letters match these filters'
                : 'No HR letters yet'}
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Generate your first employee HR document to get started.
            </p>
            <Link
              href="/admin/hr/letters/create"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#F4511E] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <FilePlus2 className="h-4 w-4" /> Generate letter
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1060px] text-left text-sm">
              <thead className="bg-[#FFF8F0] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Letter / Employee</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Department / Designation</th>
                  <th className="px-5 py-3">Generated by</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {letters.map((letter) => (
                  <tr key={letter._id} className="hover:bg-[#FFFCF8]">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/hr/letters/${letter._id}`}
                        className="font-semibold text-[#14213D] hover:text-[#F4511E]"
                      >
                        {letter.letterNumber}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        {letter.employeeSnapshot.name} ·{' '}
                        {letter.employeeSnapshot.employeeId}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {letter.letterType}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-700">
                        {letter.employeeSnapshot.department}
                      </p>
                      <p className="text-xs text-slate-500">
                        {letter.employeeSnapshot.designation}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {letter.createdBy}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {new Date(letter.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          letter.status === 'Issued'
                            ? 'bg-emerald-50 text-emerald-700'
                            : letter.status === 'Archived' ||
                                letter.status === 'Cancelled'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {letter.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/hr/letters/${letter._id}`}
                          aria-label={`View ${letter.letterNumber}`}
                          title="View"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#14213D]"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => void downloadLetter(letter)}
                          aria-label={`Download ${letter.letterNumber} as PDF`}
                          title="Download PDF"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#14213D]"
                        >
                          <ArrowDownToLine className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            window.open(
                              `/admin/hr/letters/${letter._id}?print=1`,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                          aria-label={`Print ${letter.letterNumber}`}
                          title="Print"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#14213D]"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void duplicateLetter(letter)}
                          disabled={busyId === letter._id}
                          aria-label={`Duplicate ${letter.letterNumber}`}
                          title="Duplicate"
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#14213D] disabled:opacity-50"
                        >
                          <Files className="h-4 w-4" />
                        </button>
                        {letter.status !== 'Archived' && (
                          <button
                            onClick={() => void archiveLetter(letter)}
                            disabled={busyId === letter._id}
                            aria-label={`Archive ${letter.letterNumber}`}
                            title="Archive"
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
