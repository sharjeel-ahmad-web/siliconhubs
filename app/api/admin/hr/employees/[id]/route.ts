import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getHRAdminSession } from '@/lib/hr-letters/access';
import type { HREmployeeInput } from '@/lib/hr-letters/types';

function clean(value: unknown, maxLength = 240): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function readEmployee(body: Record<string, unknown>): HREmployeeInput | null {
  const employee = {
    employeeId: clean(body.employeeId, 40),
    name: clean(body.name, 120),
    email: clean(body.email, 254).toLowerCase(),
    designation: clean(body.designation, 120),
    department: clean(body.department, 120),
    employmentType: clean(body.employmentType, 60),
    joiningDate: clean(body.joiningDate, 20),
    salary: clean(body.salary, 80),
    phone: clean(body.phone, 40),
    address: clean(body.address, 500),
    managerName: clean(body.managerName, 120),
    managerDesignation: clean(body.managerDesignation, 120),
    active: body.active !== false,
  };
  if (
    !employee.employeeId ||
    !employee.name ||
    !employee.email ||
    !employee.designation ||
    !employee.department ||
    !employee.employmentType ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email) ||
    (employee.joiningDate && Number.isNaN(Date.parse(employee.joiningDate)))
  ) {
    return null;
  }
  return employee;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getHRAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid employee record.' },
        { status: 400 }
      );
    }
    const employee = readEmployee(body);
    if (!employee) {
      return NextResponse.json(
        { error: 'Enter valid employee details before saving.' },
        { status: 400 }
      );
    }
    const db = await connectDB();
    const collection = db.collection('hrEmployees');
    await collection.createIndex({ employeeId: 1 }, { unique: true });
    const existing = await collection.findOne({ _id: new ObjectId(params.id) });
    if (!existing) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    const duplicate = await collection.findOne({
      employeeId: employee.employeeId,
      _id: { $ne: existing._id },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: 'That employee ID is already in use.' },
        { status: 409 }
      );
    }

    const now = new Date();
    await collection.updateOne(
      { _id: existing._id },
      { $set: { ...employee, updatedAt: now } }
    );
    await db.collection('hrLetterAuditLog').insertOne({
      action: 'employee.updated',
      resourceId: params.id,
      employeeId: employee.employeeId,
      actor: session.user?.email || session.user?.name || 'Admin',
      createdAt: now,
    });
    return NextResponse.json({
      ...employee,
      _id: params.id,
      createdAt: existing.createdAt,
      updatedAt: now,
    });
  } catch (error) {
    console.error('[api/admin/hr/employees PUT]', error);
    return NextResponse.json(
      { error: 'Failed to update HR employee' },
      { status: 500 }
    );
  }
}
