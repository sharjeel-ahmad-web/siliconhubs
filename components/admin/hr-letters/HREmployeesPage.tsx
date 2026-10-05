'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil, Plus, Save, UserRound, X } from 'lucide-react';
import type { HREmployee, HREmployeeInput } from '@/lib/hr-letters/types';

const EMPTY_EMPLOYEE: HREmployeeInput = {
  employeeId: '',
  name: '',
  email: '',
  designation: '',
  department: '',
  employmentType: 'Full Time',
  joiningDate: '',
  salary: '',
  phone: '',
  address: '',
  managerName: '',
  managerDesignation: '',
  active: true,
};

const fields: {
  key: keyof HREmployeeInput;
  label: string;
  required?: boolean;
  type?: string;
}[] = [
  { key: 'employeeId', label: 'Employee ID', required: true },
  { key: 'name', label: 'Full name', required: true },
  { key: 'email', label: 'Work email', required: true, type: 'email' },
  { key: 'designation', label: 'Designation', required: true },
  { key: 'department', label: 'Department', required: true },
  { key: 'employmentType', label: 'Employment type', required: true },
  { key: 'joiningDate', label: 'Joining date', type: 'date' },
  { key: 'salary', label: 'Salary' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'managerName', label: 'Manager name' },
  { key: 'managerDesignation', label: 'Manager designation' },
];

export default function HREmployeesPage() {
  const [employees, setEmployees] = useState<HREmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<HREmployeeInput>(EMPTY_EMPLOYEE);
  const [editing, setEditing] = useState<HREmployee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadEmployees() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/hr/employees');
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not load employees.');
      setEmployees(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Could not load employees.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEmployees();
  }, []);

  function startCreate() {
    setEditing(null);
    setForm(EMPTY_EMPLOYEE);
    setError('');
    setShowForm(true);
  }

  function startEdit(employee: HREmployee) {
    setEditing(employee);
    const {
      _id: _employeeId,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...values
    } = employee;
    setForm(values);
    setError('');
    setShowForm(true);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch(
        editing
          ? `/api/admin/hr/employees/${editing._id}`
          : '/api/admin/hr/employees',
        {
          method: editing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not save employee.');
      setShowForm(false);
      await loadEmployees();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Could not save employee.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(employee: HREmployee) {
    const {
      _id: _employeeId,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...values
    } = employee;
    try {
      const response = await fetch(`/api/admin/hr/employees/${employee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, active: !employee.active }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || 'Could not update employee.');
      await loadEmployees();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Could not update employee.'
      );
    }
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
            <h1 className="text-3xl font-bold text-[#14213D]">HR Employees</h1>
            <p className="mt-1 text-sm text-slate-600">
              Private employee records used to prepare official letters.
            </p>
          </div>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F4511E] px-4 py-3 font-semibold text-white hover:bg-[#d94316]"
        >
          <Plus className="h-5 w-5" /> Add employee
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

      {showForm && (
        <form
          onSubmit={submit}
          className="rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#14213D]">
              {editing ? 'Edit employee' : 'Add employee'}
            </h2>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close employee form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => (
              <label
                key={field.key}
                className="space-y-1.5 text-sm font-medium text-slate-700"
              >
                {field.label}
                <input
                  type={field.type || 'text'}
                  value={String(form[field.key])}
                  required={field.required}
                  onChange={(event) =>
                    setForm({ ...form, [field.key]: event.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#F4511E] focus:ring-2 focus:ring-[#F4511E]/15"
                />
              </label>
            ))}
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#14213D] px-4 py-2.5 font-semibold text-white disabled:opacity-60"
            >
              <Save className="h-4 w-4" />{' '}
              {saving ? 'Saving…' : 'Save employee'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E8D8C5] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#F2E6D9] px-5 py-4">
          <div>
            <h2 className="font-bold text-[#14213D]">Employee directory</h2>
            <p className="text-sm text-slate-500">
              {employees.filter((employee) => employee.active).length} active of{' '}
              {employees.length} employees
            </p>
          </div>
          <UserRound className="h-5 w-5 text-[#F4511E]" />
        </div>
        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading employees…
          </div>
        ) : employees.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-[#14213D]">No HR employees yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Add private employee records to create HR letters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#FFF8F0] text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Employment</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#14213D]">
                        {employee.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {employee.designation} · {employee.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {employee.employeeId}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {employee.department}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {employee.employmentType}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          employee.active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {employee.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => startEdit(employee)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                          aria-label={`Edit ${employee.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => void toggleActive(employee)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          {employee.active ? 'Deactivate' : 'Reactivate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
