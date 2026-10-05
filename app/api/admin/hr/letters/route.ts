import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getHRAdminSession } from '@/lib/hr-letters/access';
import {
  buildEmployeeVariables,
  DEFAULT_COMPANY,
  renderTemplate,
  type CompanyDetails,
  type HREmployeeInput,
  type HRLetterTemplateInput,
} from '@/lib/hr-letters/types';
import { removeEmployeeIdFromLetter } from '@/lib/hr-letters/letter-format';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toHREmployee(employee: Record<string, unknown>): HREmployeeInput {
  return {
    employeeId: String(employee.employeeId || ''),
    name: String(employee.name || ''),
    email: String(employee.email || ''),
    designation: String(employee.designation || ''),
    department: String(employee.department || ''),
    employmentType: String(employee.employmentType || ''),
    joiningDate: String(employee.joiningDate || ''),
    salary: String(employee.salary || ''),
    phone: String(employee.phone || ''),
    address: String(employee.address || ''),
    managerName: String(employee.managerName || ''),
    managerDesignation: String(employee.managerDesignation || ''),
    active: employee.active !== false,
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!(await getHRAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const db = await connectDB();
    const { searchParams } = request.nextUrl;
    const search = (searchParams.get('search') || '').trim().slice(0, 100);
    const letterType = searchParams.get('letterType') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    if (
      (startDate && Number.isNaN(Date.parse(startDate))) ||
      (endDate && Number.isNaN(Date.parse(endDate)))
    ) {
      return NextResponse.json(
        { error: 'Invalid date filter.' },
        { status: 400 }
      );
    }
    const filter: Record<string, unknown> = {};

    if (search) {
      const expression = new RegExp(escapeRegex(search), 'i');
      filter.$or = [
        { letterNumber: expression },
        { letterType: expression },
        { 'employeeSnapshot.name': expression },
        { 'employeeSnapshot.employeeId': expression },
      ];
    }
    if (letterType) filter.letterType = letterType;
    if (department) filter['employeeSnapshot.department'] = department;
    if (status) filter.status = status;
    if (startDate || endDate) {
      const createdAt: Record<string, Date> = {};
      if (!Number.isNaN(Date.parse(startDate))) {
        createdAt.$gte = new Date(startDate);
      }
      if (!Number.isNaN(Date.parse(endDate))) {
        const upperBound = new Date(endDate);
        upperBound.setDate(upperBound.getDate() + 1);
        createdAt.$lt = upperBound;
      }
      if (Object.keys(createdAt).length) filter.createdAt = createdAt;
    }

    const [letters, allLetters] = await Promise.all([
      db
        .collection('hrLetters')
        .find(filter)
        .project({ verificationToken: 0 })
        .sort({ createdAt: -1 })
        .limit(500)
        .toArray(),
      db
        .collection('hrLetters')
        .find({}, { projection: { createdAt: 1, status: 1, employeeId: 1 } })
        .toArray(),
    ]);
    const monthStart = new Date();
    monthStart.setUTCDate(1);
    monthStart.setUTCHours(0, 0, 0, 0);
    const stats = {
      total: allLetters.length,
      thisMonth: allLetters.filter(
        (letter) => new Date(letter.createdAt).getTime() >= monthStart.getTime()
      ).length,
      pending: allLetters.filter((letter) => letter.status === 'Draft').length,
      employees: new Set(allLetters.map((letter) => String(letter.employeeId)))
        .size,
    };

    return NextResponse.json({
      letters: letters.map((letter) => ({
        ...letter,
        _id: letter._id.toString(),
      })),
      stats,
    });
  } catch (error) {
    console.error('[api/admin/hr/letters GET]', error);
    return NextResponse.json(
      { error: 'Failed to load HR letters' },
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
        { error: 'Invalid letter request.' },
        { status: 400 }
      );
    }
    const employeeId =
      typeof body.employeeId === 'string' ? body.employeeId : '';
    const templateId =
      typeof body.templateId === 'string' ? body.templateId : '';
    if (!ObjectId.isValid(employeeId) || !ObjectId.isValid(templateId)) {
      return NextResponse.json(
        { error: 'Select a valid employee and letter template.' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const employee = await db
      .collection('hrEmployees')
      .findOne({ _id: new ObjectId(employeeId), active: { $ne: false } });
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found or inactive.' },
        { status: 404 }
      );
    }
    const template = await db
      .collection('hrLetterTemplates')
      .findOne({ _id: new ObjectId(templateId), active: true });
    if (!template) {
      return NextResponse.json(
        { error: 'Template is unavailable. Choose an active template.' },
        { status: 404 }
      );
    }

    const employeeSnapshot = toHREmployee(employee);
    const overrides =
      body.variables && typeof body.variables === 'object'
        ? (body.variables as Record<string, unknown>)
        : {};
    const companyRecord = await db
      .collection('settings')
      .findOne<{ value?: Record<string, unknown> }>({ key: 'general' });
    const signatoryRecord = await db.collection('settings').findOne<{
      value?: Record<string, unknown>;
    }>({ key: 'hr_letter_config' });
    const companySettings = companyRecord?.value || {};
    const signatorySettings = signatoryRecord?.value || {};
    const configuredWebsite =
      typeof companySettings.siteUrl === 'string'
        ? companySettings.siteUrl.trim()
        : DEFAULT_COMPANY.website;
    const companySnapshot: CompanyDetails = {
      ...DEFAULT_COMPANY,
      name:
        typeof companySettings.siteName === 'string' &&
        companySettings.siteName.trim()
          ? companySettings.siteName.trim()
          : DEFAULT_COMPANY.name,
      tagline:
        typeof companySettings.siteDescription === 'string' &&
        companySettings.siteDescription.trim()
          ? companySettings.siteDescription.trim()
          : DEFAULT_COMPANY.tagline,
      email:
        typeof companySettings.contactEmail === 'string' &&
        companySettings.contactEmail.trim()
          ? companySettings.contactEmail.trim()
          : DEFAULT_COMPANY.email,
      phone:
        typeof companySettings.contactPhone === 'string' &&
        companySettings.contactPhone.trim()
          ? companySettings.contactPhone.trim()
          : DEFAULT_COMPANY.phone,
      website: configuredWebsite
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, ''),
      address:
        typeof companySettings.address === 'string'
          ? companySettings.address.trim()
          : DEFAULT_COMPANY.address,
      signatoryName:
        typeof signatorySettings.signatoryName === 'string'
          ? signatorySettings.signatoryName.trim().slice(0, 120)
          : DEFAULT_COMPANY.signatoryName,
      signatoryDesignation:
        typeof signatorySettings.signatoryDesignation === 'string' &&
        signatorySettings.signatoryDesignation.trim()
          ? signatorySettings.signatoryDesignation.trim().slice(0, 120)
          : DEFAULT_COMPANY.signatoryDesignation,
      signatureImage:
        typeof signatorySettings.signatureImage === 'string' &&
        /^data:image\/(?:png|jpeg);base64,[a-zA-Z0-9+/=]+$/.test(
          signatorySettings.signatureImage
        ) &&
        signatorySettings.signatureImage.length <= 550_000
          ? signatorySettings.signatureImage
          : DEFAULT_COMPANY.signatureImage,
    };
    const variables = buildEmployeeVariables(
      employeeSnapshot,
      overrides,
      new Date(),
      companySnapshot
    );
    const renderedSubject = renderTemplate(
      typeof body.subject === 'string'
        ? body.subject.trim().slice(0, 240)
        : String((template as unknown as HRLetterTemplateInput).subject),
      variables
    );
    const safeTemplateBody = removeEmployeeIdFromLetter(
      typeof body.body === 'string'
        ? body.body.trim().slice(0, 30000)
        : String((template as unknown as HRLetterTemplateInput).body)
    );
    const renderedBody = renderTemplate(safeTemplateBody, variables);
    if (
      /\{\{\s*[a-zA-Z0-9_]+\s*\}\}/.test(`${renderedSubject}\n${renderedBody}`)
    ) {
      return NextResponse.json(
        { error: 'The selected template contains unsupported variables.' },
        { status: 422 }
      );
    }

    const now = new Date();
    const _id = new ObjectId();
    const letterNumber = `SH-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${_id.toHexString().slice(-6).toUpperCase()}`;
    const record = {
      _id,
      letterNumber,
      letterType: String(template.letterType),
      status: 'Generated',
      verificationToken: randomBytes(32).toString('hex'),
      employeeId: employee._id.toString(),
      employeeSnapshot,
      companySnapshot,
      templateSnapshot: {
        name: String(template.name),
        letterType: String(template.letterType),
        subject:
          typeof body.subject === 'string'
            ? body.subject.trim().slice(0, 240)
            : String(template.subject),
        body: safeTemplateBody,
      },
      variables,
      renderedSubject,
      renderedBody,
      createdBy: session.user?.email || session.user?.name || 'Admin',
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('hrLetters').insertOne(record);
    await db.collection('hrLetterAuditLog').insertOne({
      action: 'letter.generated',
      resourceId: _id.toString(),
      letterNumber,
      employeeId: employeeSnapshot.employeeId,
      actor: record.createdBy,
      createdAt: now,
    });
    return NextResponse.json(
      { ...record, _id: _id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/admin/hr/letters POST]', error);
    return NextResponse.json(
      { error: 'Failed to generate HR letter' },
      { status: 500 }
    );
  }
}
