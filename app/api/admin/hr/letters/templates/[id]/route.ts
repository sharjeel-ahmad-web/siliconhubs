import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getHRAdminSession } from '@/lib/hr-letters/access';

function clean(value: unknown, maxLength = 30000): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
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
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Invalid template record.' },
        { status: 400 }
      );
    }
    const template = {
      name: clean(body.name, 120),
      letterType: clean(body.letterType, 120),
      category: clean(body.category, 80),
      subject: clean(body.subject, 240),
      body: clean(body.body),
      active: body.active !== false,
      isDefault: body.isDefault === true,
    };
    if (
      !template.name ||
      !template.letterType ||
      !template.subject ||
      !template.body
    ) {
      return NextResponse.json(
        {
          error: 'Template name, letter type, subject, and body are required.',
        },
        { status: 400 }
      );
    }
    const db = await connectDB();
    const collection = db.collection('hrLetterTemplates');
    const templateId = new ObjectId(params.id);
    const existing = await collection.findOne({ _id: templateId });
    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    if (template.isDefault) {
      await collection.updateMany(
        { letterType: template.letterType },
        { $set: { isDefault: false } }
      );
    }
    const now = new Date();
    await collection.updateOne(
      { _id: templateId },
      {
        $set: {
          ...template,
          version: Number(existing.version || 1) + 1,
          updatedAt: now,
        },
      }
    );
    await db.collection('hrLetterAuditLog').insertOne({
      action: 'template.updated',
      resourceId: params.id,
      actor: session.user?.email || session.user?.name || 'Admin',
      createdAt: now,
    });
    return NextResponse.json({
      ...template,
      _id: params.id,
      version: Number(existing.version || 1) + 1,
      createdAt: existing.createdAt,
      updatedAt: now,
    });
  } catch (error) {
    console.error('[api/admin/hr/letters/templates PUT]', error);
    return NextResponse.json(
      { error: 'Failed to update letter template' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getHRAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }
    const db = await connectDB();
    const templateId = new ObjectId(params.id);
    const collection = db.collection('hrLetterTemplates');
    const existing = await collection.findOne({ _id: templateId });
    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }
    if (existing.seedKey === 'catalog-default') {
      await collection.updateOne(
        { _id: templateId },
        { $set: { active: false, isDefault: false, updatedAt: new Date() } }
      );
    } else {
      await collection.deleteOne({ _id: templateId });
    }
    if (existing.isDefault) {
      const replacement = await collection.findOne(
        {
          letterType: existing.letterType,
          active: { $ne: false },
          _id: { $ne: templateId },
        },
        { sort: { updatedAt: -1 } }
      );
      if (replacement) {
        await collection.updateOne(
          { _id: replacement._id },
          { $set: { isDefault: true, updatedAt: new Date() } }
        );
      }
    }
    await db.collection('hrLetterAuditLog').insertOne({
      action: 'template.deleted',
      resourceId: params.id,
      actor: session.user?.email || session.user?.name || 'Admin',
      createdAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[api/admin/hr/letters/templates DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete letter template' },
      { status: 500 }
    );
  }
}
