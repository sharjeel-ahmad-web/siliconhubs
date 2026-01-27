'use client';

import { useState, useEffect } from 'react';
import {
  RefreshCw,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

interface ReadabilityResult {
  page: string;
  title: string;
  fleschScore: number;
  fleschGrade: string;
  avgSentenceLength: number;
  avgWordLength: number;
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number;
  issues: { type: 'warning' | 'error'; message: string }[];
}

export default function ContentReadability() {
  const [results, setResults] = useState<ReadabilityResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch('/api/admin/seo/readability');
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching readability:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeReadability = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/admin/seo/readability/analyze', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setMessage({ type: 'success', text: 'Analysis complete!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to analyze readability' });
    } finally {
      setAnalyzing(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return 'text-green-400';
    if (score >= 30) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 60) return 'bg-green-500/20 border-green-500/50';
    if (score >= 30) return 'bg-amber-500/20 border-amber-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const getGradeDescription = (grade: string) => {
    const gradeMap: Record<string, string> = {
      '5th grade':
        'Very easy to read. Easily understood by an average 11-year-old student.',
      '6th grade': 'Easy to read. Conversational English for consumers.',
      '7th grade': 'Fairly easy to read.',
      '8th grade':
        'Plain English. Easily understood by 13- to 15-year-old students.',
      '9th grade': 'Fairly difficult to read.',
      '10th grade': 'Difficult to read.',
      '11th grade': 'Difficult to read.',
      '12th grade':
        'Very difficult to read. Best understood by university graduates.',
      College:
        'Very difficult to read. Best understood by university graduates.',
      'College graduate':
        'Extremely difficult to read. Best understood by university graduates.',
      Professional:
        'Extremely difficult to read. Best understood by professionals.',
    };
    return gradeMap[grade] || 'Standard readability level.';
  };

  const selectedResult = results.find((r) => r.page === selectedPage);
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + r.fleschScore, 0) / results.length
        )
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 ${message.type === 'success' ? 'border border-green-500/30 bg-green-500/20 text-green-400' : 'border border-red-500/30 bg-red-500/20 text-red-400'}`}
        >
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">{results.length}</p>
          <p className="text-sm text-slate-400">Pages Analyzed</p>
        </div>
        <div className={`rounded-xl border p-4 ${getScoreBg(avgScore)}`}>
          <p className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>
            {avgScore}
          </p>
          <p className="text-sm text-slate-400">Avg. Flesch Score</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">
            {results.length > 0
              ? Math.round(
                  results.reduce((acc, r) => acc + r.wordCount, 0) /
                    results.length
                )
              : 0}
          </p>
          <p className="text-sm text-slate-400">Avg. Word Count</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
          <p className="text-2xl font-bold text-white">
            {results.length > 0
              ? Math.round(
                  results.reduce((acc, r) => acc + r.readingTime, 0) /
                    results.length
                )
              : 0}{' '}
            min
          </p>
          <p className="text-sm text-slate-400">Avg. Reading Time</p>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          onClick={analyzeReadability}
          disabled={analyzing}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white hover:bg-[#37AFE1]/80 disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Analyze All Pages'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pages List */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B]">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">Pages</h3>
          </div>
          <div className="max-h-[500px] divide-y divide-slate-700 overflow-y-auto">
            {results.map((result) => (
              <button
                key={result.page}
                onClick={() => setSelectedPage(result.page)}
                className={`w-full p-4 text-left hover:bg-slate-700/30 ${selectedPage === result.page ? 'bg-slate-700/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{result.page}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {result.fleschGrade}
                    </p>
                  </div>
                  <span
                    className={`text-lg font-bold ${getScoreColor(result.fleschScore)}`}
                  >
                    {result.fleschScore}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Readability Details */}
        <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-[#1E293B] lg:col-span-2">
          <div className="border-b border-slate-700 p-4">
            <h3 className="font-semibold text-white">
              {selectedResult
                ? `Readability: ${selectedResult.page}`
                : 'Select a page'}
            </h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4">
            {selectedResult ? (
              <div className="space-y-6">
                {/* Score */}
                <div
                  className={`rounded-xl border-2 p-6 text-center ${getScoreBg(selectedResult.fleschScore)}`}
                >
                  <p
                    className={`text-5xl font-bold ${getScoreColor(selectedResult.fleschScore)}`}
                  >
                    {selectedResult.fleschScore}
                  </p>
                  <p className="mt-2 font-medium text-white">
                    {selectedResult.fleschGrade}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {getGradeDescription(selectedResult.fleschGrade)}
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <p className="text-2xl font-bold text-white">
                      {selectedResult.wordCount}
                    </p>
                    <p className="text-xs text-slate-400">Words</p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <p className="text-2xl font-bold text-white">
                      {selectedResult.sentenceCount}
                    </p>
                    <p className="text-xs text-slate-400">Sentences</p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <p className="text-2xl font-bold text-white">
                      {selectedResult.paragraphCount}
                    </p>
                    <p className="text-xs text-slate-400">Paragraphs</p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <p className="text-2xl font-bold text-white">
                      {selectedResult.avgSentenceLength.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-400">
                      Avg. Sentence Length
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <p className="text-2xl font-bold text-white">
                      {selectedResult.avgWordLength.toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-400">Avg. Word Length</p>
                  </div>
                  <div className="rounded-lg bg-[#0F172A] p-3">
                    <p className="text-2xl font-bold text-white">
                      {selectedResult.readingTime} min
                    </p>
                    <p className="text-xs text-slate-400">Reading Time</p>
                  </div>
                </div>

                {/* Issues */}
                {selectedResult.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">
                      Suggestions
                    </h4>
                    {selectedResult.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2 rounded-lg p-3 ${
                          issue.type === 'error'
                            ? 'border border-red-500/30 bg-red-500/10'
                            : 'border border-amber-500/30 bg-amber-500/10'
                        }`}
                      >
                        <AlertTriangle
                          className={`mt-0.5 h-4 w-4 flex-shrink-0 ${issue.type === 'error' ? 'text-red-400' : 'text-amber-400'}`}
                        />
                        <span
                          className={`text-sm ${issue.type === 'error' ? 'text-red-300' : 'text-amber-300'}`}
                        >
                          {issue.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-50" />
                <p>Select a page to view readability analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
