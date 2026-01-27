'use client';

import { useState, useEffect } from 'react';
import {
  Upload,
  Database,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Cloud,
  HardDrive,
} from 'lucide-react';

interface MigrationStatus {
  migrated: boolean;
  migratedAt?: string;
  stats?: {
    total: number;
    success: number;
    failed: number;
  };
  urlMappingCount?: number;
}

interface ScanResult {
  totalFiles: number;
  files: {
    localPath: string;
    cloudinaryId: string;
    type: string;
    size: number;
  }[];
}

interface MigrationResult {
  stats: {
    total: number;
    uploaded: number;
    failed: number;
  };
  urlMapping: Record<string, string>;
  failed: { file: string; error: string }[];
}

export default function MigratePage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [migrationResult, setMigrationResult] =
    useState<MigrationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [updatingDb, setUpdatingDb] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/media/migrate');
      const data = await response.json();
      setStatus(data);
      if (data.migrated) {
        setCurrentStep(3);
      }
    } catch (err) {
      setError('Failed to check migration status');
    } finally {
      setLoading(false);
    }
  };

  const scanFiles = async () => {
    setScanning(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/media/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scan' }),
      });
      const data = await response.json();
      setScanResult(data);
      setCurrentStep(2);
    } catch (err) {
      setError('Failed to scan files');
    } finally {
      setScanning(false);
    }
  };

  const migrateFiles = async () => {
    setMigrating(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/media/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'migrate' }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setMigrationResult(data);
        setCurrentStep(3);
      }
    } catch (err) {
      setError('Failed to migrate files');
    } finally {
      setMigrating(false);
    }
  };

  const updateDatabase = async () => {
    setUpdatingDb(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/media/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-database' }),
      });
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setCurrentStep(4);
        checkStatus();
      }
    } catch (err) {
      setError('Failed to update database');
    } finally {
      setUpdatingDb(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Cloudinary Migration</h1>
        <p className="mt-1 text-slate-400">
          Migrate all local media files to Cloudinary for optimized delivery
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/20 p-4">
          <XCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-400">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            &times;
          </button>
        </div>
      )}

      {/* Migration Status */}
      {status?.migrated && (
        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="font-medium text-green-400">
                  Migration Completed
                </p>
                <p className="text-sm text-green-400/70">
                  {status.stats?.success} files migrated on{' '}
                  {new Date(status.migratedAt!).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentStep(1);
                setScanResult(null);
                setMigrationResult(null);
              }}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white transition-colors hover:bg-orange-600"
            >
              <RefreshCw className="h-4 w-4" />
              Re-migrate Files
            </button>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="mb-8 flex items-center gap-4">
        {[
          { num: 1, label: 'Scan Files' },
          { num: 2, label: 'Upload to Cloudinary' },
          { num: 3, label: 'Update Database' },
          { num: 4, label: 'Complete' },
        ].map((step, index) => (
          <div key={step.num} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                currentStep >= step.num
                  ? 'bg-[#37AFE1] text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {currentStep > step.num ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step.num
              )}
            </div>
            <span
              className={`ml-2 ${currentStep >= step.num ? 'text-white' : 'text-slate-500'}`}
            >
              {step.label}
            </span>
            {index < 3 && (
              <ArrowRight className="mx-4 h-5 w-5 text-slate-600" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Step 1: Scan */}
        <div
          className={`rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 ${currentStep !== 1 && currentStep !== 4 && 'opacity-50'}`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <HardDrive className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Step 1: Scan Local Files
              </h3>
              <p className="text-sm text-slate-400">
                Find all images and videos in /public
              </p>
            </div>
          </div>

          {scanResult && (
            <div className="mb-4 rounded-lg bg-[#0F172A] p-4">
              <p className="mb-2 font-medium text-white">
                Found {scanResult.totalFiles} files
              </p>
              <div className="max-h-40 space-y-1 overflow-y-auto">
                {scanResult.files.slice(0, 20).map((file, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="truncate text-slate-400">
                      {file.localPath}
                    </span>
                    <span className="text-slate-500">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                ))}
                {scanResult.totalFiles > 20 && (
                  <p className="text-xs text-slate-500">
                    ...and {scanResult.totalFiles - 20} more
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={scanFiles}
            disabled={scanning || (currentStep > 1 && currentStep < 4)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-3 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {scanning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <HardDrive className="h-4 w-4" />
                Scan Files
              </>
            )}
          </button>
        </div>

        {/* Step 2: Migrate */}
        <div
          className={`rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 ${currentStep !== 2 && 'opacity-50'}`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
              <Cloud className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Step 2: Upload to Cloudinary
              </h3>
              <p className="text-sm text-slate-400">
                Upload all files to Cloudinary CDN
              </p>
            </div>
          </div>

          {migrationResult && (
            <div className="mb-4 rounded-lg bg-[#0F172A] p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {migrationResult.stats.total}
                  </p>
                  <p className="text-xs text-slate-400">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {migrationResult.stats.uploaded}
                  </p>
                  <p className="text-xs text-slate-400">Uploaded</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {migrationResult.stats.failed}
                  </p>
                  <p className="text-xs text-slate-400">Failed</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={migrateFiles}
            disabled={migrating || currentStep !== 2}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 text-white transition-colors hover:bg-cyan-600 disabled:opacity-50"
          >
            {migrating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Uploading... (this may take a while)
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload to Cloudinary
              </>
            )}
          </button>
        </div>

        {/* Step 3: Update Database */}
        <div
          className={`rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 ${currentStep !== 3 && 'opacity-50'}`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
              <Database className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Step 3: Update Database
              </h3>
              <p className="text-sm text-slate-400">
                Replace local URLs with Cloudinary URLs
              </p>
            </div>
          </div>

          <p className="mb-4 text-sm text-slate-400">
            This will update all database records (team members, blogs,
            projects, services, content) to use Cloudinary URLs instead of local
            paths.
          </p>

          <button
            onClick={updateDatabase}
            disabled={updatingDb || currentStep !== 3}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-4 py-3 text-white transition-colors hover:bg-purple-600 disabled:opacity-50"
          >
            {updatingDb ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Updating Database...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Update Database Records
              </>
            )}
          </button>
        </div>

        {/* Step 4: Complete */}
        <div
          className={`rounded-xl border border-slate-700/50 bg-[#1E293B] p-6 ${currentStep !== 4 && 'opacity-50'}`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Step 4: Migration Complete
              </h3>
              <p className="text-sm text-slate-400">
                All media is now served from Cloudinary
              </p>
            </div>
          </div>

          {currentStep === 4 && (
            <div className="space-y-3">
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                <p className="text-sm text-green-400">
                  ✓ All images and videos are now optimized and served via
                  Cloudinary CDN
                </p>
              </div>
              <div className="text-sm text-slate-400">
                <p className="mb-2">Benefits you now have:</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Automatic format conversion (WebP/AVIF)</li>
                  <li>Responsive image sizing</li>
                  <li>Global CDN delivery</li>
                  <li>Automatic quality optimization</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 rounded-xl border border-slate-700/50 bg-[#1E293B] p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-400" />
          <div>
            <p className="font-medium text-white">Important Notes</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-400">
              <li>
                • The migration process may take several minutes depending on
                the number of files
              </li>
              <li>• Original files in /public will remain as backup</li>
              <li>
                • After migration, new uploads will automatically go to
                Cloudinary
              </li>
              <li>
                • The CloudinaryImage component will automatically use optimized
                URLs
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
