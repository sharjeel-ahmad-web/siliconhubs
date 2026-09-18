'use client';

/**
 * General / talent-pool application form (no specific job required).
 */
import { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { ResumeFile } from '@/types/careers';

export interface GeneralApplicationResult {
  referenceId: string;
  email: string;
}

interface GeneralApplicationFormProps {
  onSuccess: (result: GeneralApplicationResult) => void;
}

const inputClass =
  'w-full rounded-xl border border-[#E8D8C5] bg-white px-4 py-2.5 text-sm text-[#14213D] placeholder:text-[#8A7E72] focus:border-[#FC4C00] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-[#14213D]';
const errorClass = 'mt-1 text-xs text-red-600';

export function GeneralApplicationForm({
  onSuccess,
}: GeneralApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    areaOfExpertise: '',
    currentRole: '',
    location: '',
    linkedinUrl: '',
    portfolioUrl: '',
    message: '',
    consent: false,
  });
  const [resume, setResume] = useState<ResumeFile | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeError('');
    setResume(null);
    if (!file) return;

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext)) {
      setResumeError('Resume must be a PDF, DOC or DOCX file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('Resume must be smaller than 5MB.');
      return;
    }

    setUploadingResume(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/careers/applications/resume', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setResumeError(
          data.error || 'Failed to upload resume. Please try again.'
        );
        return;
      }
      setResume(data.resume);
    } catch {
      setResumeError('Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Your full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address.';
    if (!formData.areaOfExpertise.trim())
      errs.areaOfExpertise = 'Please tell us your area of expertise.';
    if (!formData.consent)
      errs.consent = 'You must agree to the privacy consent to continue.';
    if (resumeError) errs.resume = resumeError;
    setErrors(errs);
    setSubmitError('');
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/careers/applications/general', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, resume }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else
          setSubmitError(
            data.error || 'Something went wrong. Please try again.'
          );
        return;
      }
      onSuccess({ referenceId: data.referenceId, email: data.email });
    } catch {
      setSubmitError(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="gName" className={labelClass}>
            Full name <span className="text-[#FC4C00]">*</span>
          </label>
          <input
            id="gName"
            type="text"
            value={formData.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass}
            placeholder="Sarah Khan"
            autoComplete="name"
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="gEmail" className={labelClass}>
            Email <span className="text-[#FC4C00]">*</span>
          </label>
          <input
            id="gEmail"
            type="email"
            value={formData.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass}
            placeholder="sarah@example.com"
            autoComplete="email"
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="gPhone" className={labelClass}>
            Phone
          </label>
          <input
            id="gPhone"
            type="tel"
            value={formData.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass}
            placeholder="+92 300 0000000"
          />
        </div>
        <div>
          <label htmlFor="gArea" className={labelClass}>
            Area of expertise <span className="text-[#FC4C00]">*</span>
          </label>
          <input
            id="gArea"
            type="text"
            value={formData.areaOfExpertise}
            onChange={(e) => update('areaOfExpertise', e.target.value)}
            className={inputClass}
            placeholder="e.g. Web Development, Design, Marketing…"
          />
          {errors.areaOfExpertise && (
            <p className={errorClass}>{errors.areaOfExpertise}</p>
          )}
        </div>
        <div>
          <label htmlFor="gRole" className={labelClass}>
            Current role
          </label>
          <input
            id="gRole"
            type="text"
            value={formData.currentRole}
            onChange={(e) => update('currentRole', e.target.value)}
            className={inputClass}
            placeholder="Mid-Level Developer"
          />
        </div>
        <div>
          <label htmlFor="gLocation" className={labelClass}>
            Location
          </label>
          <input
            id="gLocation"
            type="text"
            value={formData.location}
            onChange={(e) => update('location', e.target.value)}
            className={inputClass}
            placeholder="City, Country"
          />
        </div>
        <div>
          <label htmlFor="gLinkedin" className={labelClass}>
            LinkedIn
          </label>
          <input
            id="gLinkedin"
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => update('linkedinUrl', e.target.value)}
            className={inputClass}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div>
          <label htmlFor="gPortfolio" className={labelClass}>
            Portfolio
          </label>
          <input
            id="gPortfolio"
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => update('portfolioUrl', e.target.value)}
            className={inputClass}
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="gMessage" className={labelClass}>
          Message
        </label>
        <textarea
          id="gMessage"
          rows={4}
          value={formData.message}
          onChange={(e) => update('message', e.target.value)}
          className={inputClass}
          placeholder="Tell us about yourself and what you are looking for…"
        />
      </div>

      {/* Resume upload */}
      <div>
        <span className={labelClass}>Resume / CV</span>
        <label
          htmlFor="gResume"
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            resume
              ? 'border-green-500/50 bg-green-50'
              : resumeError
                ? 'border-red-400 bg-red-50/50'
                : 'border-[#E8D8C5] bg-white/60 hover:border-[#FC4C00]/50 hover:bg-white'
          }`}
        >
          {uploadingResume ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-[#FC4C00]" />
              <span className="text-sm font-medium text-[#5F6368]">
                Uploading… securely processing your file.
              </span>
            </>
          ) : resume ? (
            <>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <span className="text-sm font-semibold text-[#14213D]">
                {resume.fileName}
              </span>
              <span className="text-xs text-[#8A7E72]">
                {(resume.fileSize / 1024).toFixed(0)} KB — uploaded.
              </span>
            </>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-[#FC4C00]" />
              <span className="text-sm font-medium text-[#5F6368]">
                Click to upload or drag your resume here
              </span>
              <span className="text-xs text-[#8A7E72]">
                PDF, DOC or DOCX — max 5MB
              </span>
            </>
          )}
        </label>
        <input
          id="gResume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          className="sr-only"
        />
        {resumeError && (
          <p className={`${errorClass} flex items-center gap-1`}>
            <XCircle className="h-3.5 w-3.5" /> {resumeError}
          </p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={formData.consent}
            onChange={(e) => update('consent', e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#E8D8C5] text-[#FC4C00] focus:ring-[#FC4C00]/30"
          />
          <span className="text-sm text-[#5F6368]">
            I consent to SiliconHubs storing my personal information and resume
            to process my general application.{' '}
            <span className="text-[#FC4C00]">*</span>
          </span>
        </label>
        {errors.consent && <p className={errorClass}>{errors.consent}</p>}
      </div>

      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FC4C00] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#FC4C00]/25 transition-all hover:-translate-y-0.5 hover:bg-[#E04300] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FC4C00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          'Submit General Application'
        )}
      </button>
    </form>
  );
}

export default GeneralApplicationForm;
