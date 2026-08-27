'use client';

import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  TriangleAlert,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';

interface Issue {
  type: 'success' | 'warning' | 'error';
  label: string;
  details: string;
}
interface Report {
  url: string;
  status: number;
  score: number;
  responseTime: number;
  title: string;
  description: string;
  h1Count: number;
  images: { total: number; withAlt: number };
  internalLinks: number;
  issues: Issue[];
}

export default function WebsiteSeoTester() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);

  const runTest = async (event: FormEvent) => {
    event.preventDefault();
    setTesting(true);
    setError('');
    setReport(null);
    try {
      const response = await fetch('/api/seo/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'SEO test failed.');
      setReport(data);
    } catch (testError) {
      setError(
        testError instanceof Error ? testError.message : 'SEO test failed.'
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <section className="bg-light-cream px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Free Website Check"
          title="Test Your SEO"
          titleHighlight="In Seconds"
          subtitle="Enter a public website URL to generate a quick technical SEO report."
        />
        <form
          onSubmit={runTest}
          className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border border-[#E8D8C5] bg-warm-cream p-4 shadow-lg sm:flex-row"
        >
          <label className="sr-only" htmlFor="seo-test-url">
            Website URL
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-grey" />
            <input
              id="seo-test-url"
              type="url"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-xl border border-[#E8D8C5] bg-[#FFEDD7] py-3 pl-12 pr-4 text-dark-grey outline-none focus:border-orange"
            />
          </div>
          <button
            type="submit"
            disabled={testing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#D84315] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {testing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            {testing ? 'Testing...' : 'Generate Report'}
          </button>
        </form>
        {error && (
          <div className="mx-auto mt-6 flex max-w-3xl items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
        {report && (
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#E8D8C5] bg-[#FFF9F1] p-6 shadow-lg md:p-8">
            <div className="flex flex-col justify-between gap-5 border-b border-[#E8D8C5] pb-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-slate-grey">Report for</p>
                <p className="break-all font-semibold text-[#14213D]">
                  {report.url}
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange">
                  {report.score}
                </div>
                <p className="text-sm text-slate-grey">SEO score</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {[
                ['Status', report.status],
                ['Response', `${report.responseTime}ms`],
                ['H1 headings', report.h1Count],
                [
                  'Images with alt',
                  `${report.images.withAlt}/${report.images.total}`,
                ],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-xl bg-[#FFEDD7] p-4"
                >
                  <p className="text-xs text-slate-grey">{label}</p>
                  <p className="mt-1 text-xl font-bold text-[#14213D]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {report.issues.map((issue) => {
                const Icon =
                  issue.type === 'success'
                    ? CheckCircle2
                    : issue.type === 'warning'
                      ? TriangleAlert
                      : AlertCircle;
                return (
                  <div
                    key={issue.label}
                    className="flex gap-3 rounded-xl border border-[#E8D8C5] p-4"
                  >
                    <Icon
                      className={`mt-0.5 h-5 w-5 shrink-0 ${issue.type === 'success' ? 'text-green-600' : issue.type === 'warning' ? 'text-orange' : 'text-red-600'}`}
                    />
                    <div>
                      <p className="font-semibold text-[#14213D]">
                        {issue.label}
                      </p>
                      <p className="text-sm text-slate-grey">{issue.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
