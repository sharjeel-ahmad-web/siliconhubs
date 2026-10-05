import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getHRAdminSession } from '@/lib/hr-letters/access';
import {
  createDefaultTemplate,
  LETTER_CATALOG,
  type HRLetterTemplateInput,
} from '@/lib/hr-letters/types';

function clean(value: unknown, maxLength = 30000): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function readTemplate(
  body: Record<string, unknown>
): HRLetterTemplateInput | null {
  const template = {
    name: clean(body.name, 120),
    letterType: clean(body.letterType, 120),
    category: clean(body.category, 80),
    subject: clean(body.subject, 240),
    body: clean(body.body),
    active: body.active !== false,
    isDefault: body.isDefault === true,
  };
  return template.name &&
    template.letterType &&
    template.subject &&
    template.body
    ? template
    : null;
}

async function ensureDefaultTemplates() {
  const db = await connectDB();
  const now = new Date();
  const collection = db.collection('hrLetterTemplates');
  await collection.createIndex(
    { letterType: 1, seedKey: 1 },
    {
      unique: true,
      partialFilterExpression: { seedKey: 'catalog-default' },
    }
  );
  await collection.bulkWrite(
    LETTER_CATALOG.map((letterType) => {
      const template = createDefaultTemplate(letterType);
      return {
        updateOne: {
          filter: {
            letterType: template.letterType,
            seedKey: 'catalog-default',
          },
          update: {
            $setOnInsert: {
              ...template,
              seedKey: 'catalog-default',
              version: 1,
              createdAt: now,
              updatedAt: now,
            },
          },
          upsert: true,
        },
      };
    })
  );
  return db;
}

export async function GET() {
  try {
    if (!(await getHRAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const db = await ensureDefaultTemplates();
    const templates = await db
      .collection('hrLetterTemplates')
      .find({})
      .sort({ category: 1, name: 1 })
      .toArray();
    return NextResponse.json(
      templates.map((template) => ({
        ...template,
        _id: template._id.toString(),
      }))
    );
  } catch (error) {
    console.error('[api/admin/hr/letters/templates GET]', error);
    return NextResponse.json(
      { error: 'Failed to load letter templates' },
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
        { error: 'Invalid template record.' },
        { status: 400 }
      );
    }
    const template = readTemplate(body);
    if (!template) {
      return NextResponse.json(
        {
          error: 'Template name, letter type, subject, and body are required.',
        },
        { status: 400 }
      );
    }
    const db = await connectDB();
    if (template.isDefault) {
      await db
        .collection('hrLetterTemplates')
        .updateMany(
          { letterType: template.letterType },
          { $set: { isDefault: false } }
        );
    }
    const now = new Date();
    const result = await db.collection('hrLetterTemplates').insertOne({
      ...template,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
    await db.collection('hrLetterAuditLog').insertOne({
      action: 'template.created',
      resourceId: result.insertedId.toString(),
      actor: session.user?.email || session.user?.name || 'Admin',
      createdAt: now,
    });
    return NextResponse.json(
      {
        ...template,
        _id: result.insertedId.toString(),
        version: 1,
        createdAt: now,
        updatedAt: now,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/admin/hr/letters/templates POST]', error);
    return NextResponse.json(
      { error: 'Failed to create letter template' },
      { status: 500 }
    );
  }
}
