'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FilePlus2,
  Loader2,
  Users,
} from 'lucide-react';
import HRLetterDocument from '@/components/admin/hr-letters/HRLetterDocument';
import {
  buildEmployeeVariables,
  DEFAULT_COMPANY,
  renderTemplate,
  type CompanyDetails,
  type HREmployee,
  type HRLetter,
  type HRLetterTemplate,
} from '@/lib/hr-letters/types';

export default function HRLetterComposer() {
  const router = useRouter();
  const [employees, setEmployees] = useState<HREmployee[]>([]);
  const [templates, setTemplates] = useState<HRLetterTemplate[]>([]);
  const [employeeId, setEmployeeId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [company, setCompany] = useState<CompanyDetails>(DEFAULT_COMPANY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [
          employeeResponse,
          templateResponse,
          settingsResponse,
          signatoryResponse,
        ] = await Promise.all([
          fetch('/api/admin/hr/employees'),
          fetch('/api/admin/hr/letters/templates'),
          fetch('/api/admin/settings'),
          fetch('/api/admin/settings?key=hr_letter_config'),
        ]);
        const [employeeData, templateData, settingsData, signatoryData] =
          await Promise.all([
            employeeResponse.json(),
            templateResponse.json(),
            settingsResponse.json(),
            signatoryResponse.json(),
          ]);
        if (!employeeResponse.ok) {
          throw new Error(employeeData.error || 'Could not load employees.');
        }
        if (!templateResponse.ok) {
          throw new Error(templateData.error || 'Could not load templates.');
        }
        if (!settingsResponse.ok) {
          throw new Error(
            settingsData.error || 'Could not load company settings.'
          );
        }
        if (!signatoryResponse.ok) {
          throw new Error(
            signatoryData.error || 'Could not load signatory settings.'
          );
        }
        setEmployees(
          employeeData.filter((employee: HREmployee) => employee.active)
        );
        setTemplates(
          templateData.filter((template: HRLetterTemplate) => template.active)
        );
        const general = settingsData.general || {};
        const siteUrl =
          typeof general.siteUrl === 'string' && general.siteUrl.trim()
            ? general.siteUrl.trim()
            : DEFAULT_COMPANY.website;
        setCompany({
          ...DEFAULT_COMPANY,
          name: general.siteName || DEFAULT_COMPANY.name,
          tagline: general.siteDescription || DEFAULT_COMPANY.tagline,
          email: general.contactEmail || DEFAULT_COMPANY.email,
          phone: general.contactPhone || DEFAULT_COMPANY.phone,
          website: siteUrl
            .replace(/^https?:\/\//, '')
            .replace(/^www\./, '')
            .replace(/\/$/, ''),
          address: general.address || '',
          signatoryName:
            typeof signatoryData?.signatoryName === 'string'
              ? signatoryData.signatoryName.trim().slice(0, 120)
              : DEFAULT_COMPANY.signatoryName,
          signatoryDesignation:
            typeof signatoryData?.signatoryDesignation === 'string'
              ? signatoryData.signatoryDesignation ||
                DEFAULT_COMPANY.signatoryDesignation
              : DEFAULT_COMPANY.signatoryDesignation,
          signatureImage:
            typeof signatoryData?.signatureImage === 'string' &&
            /^data:image\/(?:png|jpeg);base64,[a-zA-Z0-9+/=]+$/.test(
              signatoryData.signatureImage
            ) &&
            signatoryData.signatureImage.length <= 550_000
              ? signatoryData.signatureImage
              : '',
        });
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load letter data.'
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const employee = employees.find((item) => item._id === employeeId);
  const template = templates.find((item) => item._id === templateId);

  function chooseEmployee(id: string) {
    setEmployeeId(id);
    const selected = employees.find((item) => item._id === id);
    if (selected) {
      setVariables(
        buildEmployeeVariables(
          selected,
          { effective_date: new Date().toISOString().slice(0, 10) },
          new Date(),
          company
        )
      );
    }
  }

  function chooseTemplate(id: string) {
    const selected = templates.find((item) => item._id === id);
    setTemplateId(id);
    if (selected) {
      setSubject(selected.subject);
      setBody(selected.body);
    }
  }

  const preview = useMemo<HRLetter | null>(() => {
    if (!employee || !template) return null;
    const currentVariables = buildEmployeeVariables(
      employee,
      variables,
      new Date(),
      company
    );
    return {
      _id: 'preview',
      letterNumber: 'SH-PREVIEW',
      letterType: template.letterType,
      status: 'Draft',
      employeeId: employee._id,
      employeeSnapshot: employee,
      companySnapshot: company,
      templateSnapshot: {
        name: template.name,
        letterType: template.letterType,
        subject,
        body,
      },
      variables: currentVariables,
      renderedSubject: renderTemplate(subject, currentVariables),
      renderedBody: renderTemplate(body, currentVariables),
      createdBy: 'Preview',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [employee, template, variables, subject, body, company]);

  async function generateLetter() {
    if (!employee || !template) {
      setError('Select an employee and an active template before generating.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/admin/hr/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee._id,
          templateId: template._id,
          variables,
          subject,
          body,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not generate the letter.');
      router.push(`/admin/hr/letters/${data._id}`);
    } catch (generateError) {
      setError(
        generateError instanceof Error
          ? generateError.message
          : 'Could not generate the letter.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
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
            Generate HR letter
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Select a private employee record, personalize a template, then
            preview and save.
          </p>
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
      {loading ? (
        <div className="flex min-h-64 items-center justify-center gap-3 text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading employees and
          templates…
        </div>
      ) : (
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(450px,1fr)]">
          <div className="space-y-5">
            <section className="rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0E4] font-bold text-[#F4511E]">
                  1
                </span>
                <div>
                  <h2 className="font-bold text-[#14213D]">Select employee</h2>
                  <p className="text-sm text-slate-500">
                    Employee information is snapshotted when the letter is
                    generated.
                  </p>
                </div>
              </div>
              <select
                value={employeeId}
                onChange={(event) => chooseEmployee(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm"
              >
                <option value="">Choose an active employee…</option>
                {employees.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} · {item.employeeId} · {item.designation}
                  </option>
                ))}
              </select>
              {employee ? (
                <div className="mt-4 grid gap-3 rounded-xl bg-[#FFF8F0] p-4 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-slate-500">Employee ID:</span>{' '}
                    {employee.employeeId}
                  </p>
                  <p>
                    <span className="text-slate-500">Department:</span>{' '}
                    {employee.department}
                  </p>
                  <p>
                    <span className="text-slate-500">Designation:</span>{' '}
                    {employee.designation}
                  </p>
                  <p>
                    <span className="text-slate-500">Employment:</span>{' '}
                    {employee.employmentType}
                  </p>
                  <p>
                    <span className="text-slate-500">Email:</span>{' '}
                    {employee.email}
                  </p>
                  <p>
                    <span className="text-slate-500">Joined:</span>{' '}
                    {employee.joiningDate || '—'}
                  </p>
                </div>
              ) : employees.length === 0 ? (
                <div className="mt-4 rounded-xl bg-[#FFF8F0] p-4 text-sm text-slate-600">
                  <Users className="mr-2 inline h-4 w-4 text-[#F4511E]" />
                  No active HR employee records.{' '}
                  <Link
                    href="/admin/hr/employees"
                    className="font-semibold text-[#F4511E] underline"
                  >
                    Add an employee
                  </Link>
                  .
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0E4] font-bold text-[#F4511E]">
                  2
                </span>
                <div>
                  <h2 className="font-bold text-[#14213D]">Select template</h2>
                  <p className="text-sm text-slate-500">
                    Choose an active letter format.
                  </p>
                </div>
              </div>
              <select
                value={templateId}
                onChange={(event) => chooseTemplate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm"
              >
                <option value="">Choose a letter template…</option>
                {templates.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.category} — {item.name}
                  </option>
                ))}
              </select>
              {templates.length === 0 && (
                <p className="mt-3 text-sm text-slate-600">
                  No active templates.{' '}
                  <Link
                    href="/admin/hr/letters/templates"
                    className="font-semibold text-[#F4511E] underline"
                  >
                    Manage templates
                  </Link>
                  .
                </p>
              )}
            </section>

            {template && employee && (
              <>
                <section className="rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0E4] font-bold text-[#F4511E]">
                      3
                    </span>
                    <div>
                      <h2 className="font-bold text-[#14213D]">
                        Letter-specific details
                      </h2>
                      <p className="text-sm text-slate-500">
                        Optional values replace these fields in the selected
                        template.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ['effective_date', 'Effective date', 'date'],
                      ['last_working_date', 'Last working date', 'date'],
                      ['notice_period', 'Notice period', 'text'],
                    ].map(([key, label, type]) => (
                      <label
                        key={key}
                        className="space-y-1.5 text-sm font-medium text-slate-700"
                      >
                        {label}
                        <input
                          type={type}
                          value={variables[key] || ''}
                          onChange={(event) =>
                            setVariables({
                              ...variables,
                              [key]: event.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                        />
                      </label>
                    ))}
                  </div>
                </section>

                <section className="space-y-4 rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0E4] font-bold text-[#F4511E]">
                      4
                    </span>
                    <div>
                      <h2 className="font-bold text-[#14213D]">
                        Customize letter
                      </h2>
                      <p className="text-sm text-slate-500">
                        Changes are stored in this letter’s immutable content
                        snapshot.
                      </p>
                    </div>
                  </div>
                  <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                    Subject
                    <input
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      maxLength={240}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                    />
                  </label>
                  <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                    Letter content
                    <textarea
                      value={body}
                      onChange={(event) => setBody(event.target.value)}
                      rows={12}
                      maxLength={30000}
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm leading-6"
                    />
                  </label>
                  <p className="text-xs text-slate-500">
                    Variables use braces, for example{' '}
                    <code>{'{{employee_name}}'}</code>. Unresolved variables
                    will prevent saving.
                  </p>
                </section>
              </>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/admin/hr/letters/templates"
                className="text-sm font-semibold text-[#14213D] underline underline-offset-4"
              >
                Manage templates
              </Link>
              <button
                onClick={() => void generateLetter()}
                disabled={saving || !employee || !template}
                className="inline-flex items-center gap-2 rounded-xl bg-[#F4511E] px-5 py-3 font-semibold text-white hover:bg-[#d94316] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FilePlus2 className="h-4 w-4" />
                )}
                {saving ? 'Generating…' : 'Generate & save letter'}
                {!saving && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <section className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#14213D]">
              <CalendarDays className="h-4 w-4 text-[#F4511E]" />
              5. Document preview
            </div>
            {preview ? (
              <div className="overflow-x-auto rounded-2xl bg-slate-200 p-3 sm:p-5">
                <div className="min-w-[360px]">
                  <HRLetterDocument letter={preview} />
                </div>
              </div>
            ) : (
              <div className="flex min-h-[440px] items-center justify-center rounded-2xl border border-dashed border-[#D8C9BA] bg-white/70 p-8 text-center text-slate-500">
                Select an employee and template to preview a branded A4 letter.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
