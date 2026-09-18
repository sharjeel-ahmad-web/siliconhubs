'use client';

/**
 * Application form for a specific job. Uses the same input treatment as the
 * rest of the site. Validates types/sizes, uploads the resume first (secure,
 * non-public ImageKit reference), then submits the application.
 */
import { useState } from 'react';
import { UploadCloud, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { CareerJob, ResumeFile } from '@/types/careers';

export interface SubmittedApplication {
  referenceId: string;
  jobTitle: string;
  email: string;
  general: boolean;
}

interface ApplicationFormProps {
  job: CareerJob;
  onSuccess: (result: SubmittedApplication) => void;
}

const inputClass =
  'w-full rounded-xl border border-[#E8D8C5] bg-white px-4 py-2.5 text-sm text-[#14213D] placeholder:text-[#8A7E72] focus:border-[#FC4C00] focus:outline-none focus:ring-2 focus:ring-[#FC4C00]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-[#14213D]';
const errorClass = 'mt-1 text-xs text-red-600';

interface ValidationErrors {
  [key: string]: string;
}

export function ApplicationForm({ job, onSuccess }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    currentRole: '',
    yearsOfExperience: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    expectedSalary: '',
    availability: '',
    coverLetter: '',
    additionalInfo: '',
    consent: false,
  });
  const [resume, setResume] = useState<ResumeFile | null>(null);
  const [resumeError, setResumeError] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validate = (): ValidationErrors => {
    const errs: ValidationErrors = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = 'Enter a valid email address.';
    if (formData.coverLetter.trim().length < 20)
      errs.coverLetter =
        'Please write a short cover letter (at least 20 characters).';
    if (!formData.consent)
      errs.consent = 'You must agree to the privacy consent to continue.';
    if (resumeError) errs.resume = resumeError;
    return errs;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeError('');
    setResume(null);
    if (!file) return;

    const allowedExt = ['pdf', 'doc', 'docx'];
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!allowedExt.includes(ext)) {
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
    const errs = validate();
    setErrors(errs);
    setSubmitError('');
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/careers/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          jobId: job._id,
          jobSlug: job.slug,
          resume,
        }),
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

      onSuccess({
        referenceId: data.referenceId,
        jobTitle: data.jobTitle || job.title,
        email: data.email,
        general: false,
      });
    } catch {
      setSubmitError(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const field = (id: string, label: string, props: any = {}) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {props.required && <span className="text-[#FC4C00]"> *</span>}
      </label>
      <input
        id={id}
        type={props.type || 'text'}
        value={(formData as any)[id]}
        onChange={(e) => update(id, e.target.value)}
        className={inputClass}
        {...props}
      />
      {errors[id] && <p className={errorClass}>{errors[id]}</p>}
    </div>
  );

  const selectField = (id: string, label: string, options: string[]) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <select
        id={id}
        value={(formData as any)[id]}
        onChange={(e) => update(id, e.target.value)}
        className={inputClass}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field('firstName', 'First name', {
          required: true,
          placeholder: 'Sarah',
          autoComplete: 'given-name',
        })}
        {field('lastName', 'Last name', {
          required: true,
          placeholder: 'Khan',
          autoComplete: 'family-name',
        })}
        {field('email', 'Email', {
          required: true,
          type: 'email',
          placeholder: 'sharjeel@example.com',
          autoComplete: 'email',
        })}
        {field('phone', 'Phone', {
          type: 'tel',
          placeholder: '+92 300 0000000',
          autoComplete: 'tel',
        })}
        {field('location', 'Location', { placeholder: 'City, Country' })}
        {field('currentRole', 'Current role', {
          placeholder: 'Junior Developer',
        })}
        {selectField('yearsOfExperience', 'Years of experience', [
          'Less than 1 year',
          '1–2 years',
          '3–5 years',
          '5–8 years',
          '8+ years',
        ])}
        {selectField('availability', 'Availability', [
          'Immediately',
          'Within 2 weeks',
          'Within 1 month',
          'Within 2-3 months',
        ])}
        {field('linkedinUrl', 'LinkedIn URL', {
          type: 'url',
          placeholder: 'https://linkedin.com/in/username',
        })}
        {field('githubUrl', 'GitHub URL', {
          type: 'url',
          placeholder: 'https://github.com/username',
        })}
        {field('portfolioUrl', 'Portfolio URL', {
          type: 'url',
          placeholder: 'https://yourportfolio.com',
        })}
        {field('expectedSalary', 'Expected salary', {
          placeholder: 'e.g. $50,000 – $65,000 / year',
        })}
      </div>
      <div>
        <label htmlFor="coverLetter" className={labelClass}>
          Cover letter <span className="text-[#FC4C00]">*</span>
        </label>
        <textarea
          id="coverLetter"
          rows={5}
          value={formData.coverLetter}
          onChange={(e) => update('coverLetter', e.target.value)}
          className={inputClass}
          placeholder="Tell us why you are a great fit for this role at SiliconHubs…"
        />
        {errors.coverLetter && (
          <p className={errorClass}>{errors.coverLetter}</p>
        )}
      </div>

      <div>
        <label htmlFor="additionalInfo" className={labelClass}>
          Additional information
        </label>
        <textarea
          id="additionalInfo"
          rows={3}
          value={formData.additionalInfo}
          onChange={(e) => update('additionalInfo', e.target.value)}
          className={inputClass}
          placeholder="Anything else we should know (optional)"
        />
      </div>

      {/* Resume upload */}
      <div>
        <span className={labelClass}>Resume / CV</span>
        <label
          htmlFor="resume"
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
          id="resume"
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

      {/* Consent */}
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
            to process this application.{' '}
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
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting application…
          </>
        ) : (
          'Submit Application'
        )}
      </button>
    </form>
  );
}

export default ApplicationForm;
