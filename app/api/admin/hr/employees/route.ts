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
    !employee.employmentType
  ) {
    return null;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) return null;
  if (employee.joiningDate && Number.isNaN(Date.parse(employee.joiningDate))) {
    return null;
  }

  return employee;
}

export async function GET() {
  try {
    if (!(await getHRAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const db = await connectDB();
    const collection = db.collection('hrEmployees');
    await collection.createIndex({ employeeId: 1 }, { unique: true });
    const employees = await db
      .collection('hrEmployees')
      .find({})
      .sort({ active: -1, name: 1 })
      .toArray();

    return NextResponse.json(
      employees.map((employee) => ({
        ...employee,
        _id: employee._id.toString(),
      }))
    );
  } catch (error) {
    console.error('[api/admin/hr/employees GET]', error);
    return NextResponse.json(
      { error: 'Failed to load HR employees' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getHRAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
        {
          error:
            'Enter an employee ID, name, valid email, designation, department, and employment type.',
        },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const collection = db.collection('hrEmployees');
    await collection.createIndex({ employeeId: 1 }, { unique: true });
    const duplicate = await collection.findOne({
      employeeId: employee.employeeId,
    });
    if (duplicate) {
      return NextResponse.json(
        { error: 'That employee ID is already in use.' },
        { status: 409 }
      );
    }

    const now = new Date();
    const result = await collection.insertOne({
      ...employee,
      createdAt: now,
      updatedAt: now,
    });
    const actor = session.user?.email || session.user?.name || 'Admin';
    await db.collection('hrLetterAuditLog').insertOne({
      action: 'employee.created',
      resourceId: result.insertedId.toString(),
      employeeId: employee.employeeId,
      actor,
      createdAt: now,
    });

    return NextResponse.json(
      {
        ...employee,
        _id: result.insertedId.toString(),
        createdAt: now,
        updatedAt: now,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/admin/hr/employees POST]', error);
    return NextResponse.json(
      { error: 'Failed to create HR employee' },
      { status: 500 }
    );
  }
}
