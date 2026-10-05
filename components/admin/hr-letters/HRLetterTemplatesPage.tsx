'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Check,
  CopyPlus,
  FilePlus2,
  Pencil,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import {
  DEFAULT_COMPANY,
  LETTER_CATALOG,
  TEMPLATE_VARIABLES,
  type HRLetterTemplate,
  type HRLetterTemplateInput,
} from '@/lib/hr-letters/types';

const EMPTY_TEMPLATE: HRLetterTemplateInput = {
  name: '',
  letterType: LETTER_CATALOG[0].name,
  category: LETTER_CATALOG[0].category,
  subject: '',
  body: '',
  active: true,
  isDefault: false,
};

export default function HRLetterTemplatesPage() {
  const [templates, setTemplates] = useState<HRLetterTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<HRLetterTemplate | null>(null);
  const [form, setForm] = useState<HRLetterTemplateInput>(EMPTY_TEMPLATE);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingSignatory, setSavingSignatory] = useState(false);
  const [signatoryName, setSignatoryName] = useState(
    DEFAULT_COMPANY.signatoryName
  );
  const [signatoryDesignation, setSignatoryDesignation] = useState(
    DEFAULT_COMPANY.signatoryDesignation
  );
  const [signatureImage, setSignatureImage] = useState('');
  const [error, setError] = useState('');

  async function loadTemplates() {
    setLoading(true);
    setError('');
    try {
      const [response, signatoryResponse] = await Promise.all([
        fetch('/api/admin/hr/letters/templates'),
        fetch('/api/admin/settings?key=hr_letter_config'),
      ]);
      const [data, signatoryData] = await Promise.all([
        response.json(),
        signatoryResponse.json(),
      ]);
      if (!response.ok)
        throw new Error(data.error || 'Could not load templates.');
      if (!signatoryResponse.ok) {
        throw new Error(
          signatoryData.error || 'Could not load signature settings.'
        );
      }
      setTemplates(data);
      setSignatoryName(
        signatoryData?.signatoryName || DEFAULT_COMPANY.signatoryName
      );
      setSignatoryDesignation(
        signatoryData?.signatoryDesignation ||
          DEFAULT_COMPANY.signatoryDesignation
      );
      setSignatureImage(
        typeof signatoryData?.signatureImage === 'string' &&
          /^data:image\/(?:png|jpeg);base64,[a-zA-Z0-9+/=]+$/.test(
            signatoryData.signatureImage
          ) &&
          signatoryData.signatureImage.length <= 550_000
          ? signatoryData.signatureImage
          : ''
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load templates.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTemplates();
  }, []);

  function createTemplate() {
    setEditing(null);
    setForm(EMPTY_TEMPLATE);
    setError('');
    setShowForm(true);
  }

  function editTemplate(template: HRLetterTemplate) {
    setEditing(template);
    const {
      _id: _templateId,
      version: _version,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...values
    } = template;
    setForm(values);
    setError('');
    setShowForm(true);
  }

  function selectType(letterType: string) {
    const selected = LETTER_CATALOG.find((item) => item.name === letterType);
    setForm((current) => ({
      ...current,
      letterType,
      category: selected?.category || current.category,
    }));
  }

  async function saveTemplate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch(
        editing
          ? `/api/admin/hr/letters/templates/${editing._id}`
          : '/api/admin/hr/letters/templates',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not save template.');
      setShowForm(false);
      await loadTemplates();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Could not save template.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeTemplate(
    template: HRLetterTemplate,
    update: Partial<HRLetterTemplateInput>
  ) {
    const {
      _id: _templateId,
      version: _version,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...values
    } = template;
    try {
      const response = await fetch(
        `/api/admin/hr/letters/templates/${template._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, ...update }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not update template.');
      await loadTemplates();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Could not update template.'
      );
    }
  }

  async function deleteTemplate(template: HRLetterTemplate) {
    if (!window.confirm(`Delete the "${template.name}" template?`)) return;
    try {
      const response = await fetch(
        `/api/admin/hr/letters/templates/${template._id}`,
        { method: 'DELETE' }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not delete template.');
      await loadTemplates();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Could not delete template.'
      );
    }
  }

  async function saveSignatory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingSignatory(true);
    setError('');
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'hr_letter_config',
          value: { signatoryName, signatoryDesignation, signatureImage },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Could not save signature settings.');
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Could not save signature settings.'
      );
    } finally {
      setSavingSignatory(false);
    }
  }

  function selectSignature(file?: File) {
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Upload a PNG or JPEG signature image.');
      return;
    }
    if (file.size > 400 * 1024) {
      setError('Signature images must be 400 KB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setError('Could not read the signature image.');
        return;
      }
      setSignatureImage(reader.result);
      setError('');
    };
    reader.onerror = () => setError('Could not read the signature image.');
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/hr/letters"
            className="rounded-xl border border-[#E8D8C5] bg-white p-2 text-[#14213D] hover:bg-[#FFEDD7]"
            aria-label="Back to HR letters"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F4511E]">
              Human Resources
            </p>
            <h1 className="text-3xl font-bold text-[#14213D]">
              Letter templates
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Maintain reusable letter formats and template variables.
            </p>
          </div>
        </div>
        <button
          onClick={createTemplate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F4511E] px-4 py-3 font-semibold text-white hover:bg-[#d94316]"
        >
          <FilePlus2 className="h-5 w-5" /> New template
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={saveSignatory}
        className="grid gap-5 rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <div className="sm:col-span-3">
          <h2 className="font-bold text-[#14213D]">Letterhead signatory</h2>
          <p className="mt-1 text-sm text-slate-500">
            Optional authorized signatory details and a small PNG/JPEG signature
            image. This information is snapshotted into new letters.
          </p>
        </div>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Signatory name
          <input
            value={signatoryName}
            onChange={(event) => setSignatoryName(event.target.value)}
            maxLength={120}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
          />
        </label>
        <label className="space-y-1.5 text-sm font-medium text-slate-700">
          Designation
          <input
            value={signatoryDesignation}
            onChange={(event) => setSignatoryDesignation(event.target.value)}
            maxLength={120}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
          />
        </label>
        <button
          type="submit"
          disabled={savingSignatory}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14213D] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {savingSignatory ? 'Saving…' : 'Save signatory'}
        </button>
        <label className="block space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
          Optional signature image (PNG/JPEG, max 400 KB)
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(event) => selectSignature(event.target.files?.[0])}
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#FFF0E4] file:px-3 file:py-1.5 file:font-semibold file:text-[#A33C1C]"
          />
        </label>
        {signatureImage && (
          <div className="flex items-center gap-3">
            <Image
              src={signatureImage}
              alt="Authorized signature preview"
              width={160}
              height={64}
              unoptimized
              className="max-h-16 max-w-40 object-contain"
            />
            <button
              type="button"
              onClick={() => setSignatureImage('')}
              className="text-sm font-semibold text-red-600 underline"
            >
              Remove
            </button>
          </div>
        )}
      </form>

      {showForm && (
        <form
          onSubmit={saveTemplate}
          className="space-y-4 rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#14213D]">
              {editing ? 'Edit template' : 'Create template'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close template editor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Template name
              <input
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
                maxLength={120}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700">
              Letter type
              <select
                value={form.letterType}
                onChange={(event) => selectType(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
              >
                {LETTER_CATALOG.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
              Subject
              <input
                value={form.subject}
                onChange={(event) =>
                  setForm({ ...form, subject: event.target.value })
                }
                required
                maxLength={240}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
              />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm font-medium text-slate-700">
            Letter body
            <textarea
              value={form.body}
              onChange={(event) =>
                setForm({ ...form, body: event.target.value })
              }
              required
              rows={13}
              maxLength={30000}
              className="w-full rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm leading-6"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_VARIABLES.map((variable) => (
              <button
                key={variable}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    body: `${form.body}{{${variable}}}`,
                  })
                }
                className="rounded-full bg-[#FFF0E4] px-2.5 py-1 font-mono text-xs text-[#A33C1C] hover:bg-[#FFE3D1]"
              >
                <CopyPlus className="mr-1 inline h-3 w-3" />
                {`{{${variable}}}`}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  setForm({ ...form, active: event.target.checked })
                }
              />
              Active and available for generation
            </label>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              <Save className="h-4 w-4" />{' '}
              {saving ? 'Saving…' : 'Save template'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E8D8C5] bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading templates…
          </div>
        ) : templates.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No templates found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {templates.map((template) => (
              <div
                key={template._id}
                className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-[#14213D]">
                      {template.name}
                    </h3>
                    {template.isDefault && (
                      <span className="bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                        Default
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        template.active
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {template.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {template.category} · {template.letterType} · Version{' '}
                    {template.version}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!template.isDefault && (
                    <button
                      onClick={() =>
                        void changeTemplate(template, { isDefault: true })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <Check className="h-4 w-4" /> Set default
                    </button>
                  )}
                  <button
                    onClick={() =>
                      void changeTemplate(template, {
                        active: !template.active,
                      })
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {template.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => editTemplate(template)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                    aria-label={`Edit ${template.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => void deleteTemplate(template)}
                    className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"
                    aria-label={`Delete ${template.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
