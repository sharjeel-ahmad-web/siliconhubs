import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getHRAdminSession } from '@/lib/hr-letters/access';
import { removeEmployeeIdFromLetter } from '@/lib/hr-letters/letter-format';
import { renderTemplate } from '@/lib/hr-letters/types';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getHRAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid letter ID' }, { status: 400 });
    }
    const db = await connectDB();
    const original = await db
      .collection('hrLetters')
      .findOne({ _id: new ObjectId(params.id) });
    if (!original) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
    }

    const now = new Date();
    const _id = new ObjectId();
    const variables = {
      ...(original.variables as Record<string, string>),
      letter_date: now.toISOString().slice(0, 10),
    };
    const templateBody = removeEmployeeIdFromLetter(
      String(original.templateSnapshot.body)
    );
    const {
      verificationToken: _verificationToken,
      issuedAt: _issuedAt,
      ...originalSnapshot
    } = original;
    const copy = {
      ...originalSnapshot,
      _id,
      letterNumber: `SH-${now.toISOString().slice(0, 10).replace(/-/g, '')}-${_id.toHexString().slice(-6).toUpperCase()}`,
      status: 'Generated',
      verificationToken: randomBytes(32).toString('hex'),
      variables,
      renderedSubject: renderTemplate(
        String(original.templateSnapshot.subject),
        variables
      ),
      renderedBody: renderTemplate(templateBody, variables),
      templateSnapshot: {
        ...original.templateSnapshot,
        body: templateBody,
      },
      createdBy: session.user?.email || session.user?.name || 'Admin',
      createdAt: now,
      updatedAt: now,
      duplicatedFrom: original._id.toString(),
    };
    await db.collection('hrLetters').insertOne(copy);
    await db.collection('hrLetterAuditLog').insertOne({
      action: 'letter.duplicated',
      resourceId: _id.toString(),
      duplicatedFrom: original._id.toString(),
      letterNumber: copy.letterNumber,
      actor: copy.createdBy,
      createdAt: now,
    });
    return NextResponse.json({ ...copy, _id: _id.toString() }, { status: 201 });
  } catch (error) {
    console.error('[api/admin/hr/letters/[id]/duplicate POST]', error);
    return NextResponse.json(
      { error: 'Failed to duplicate HR letter' },
      { status: 500 }
    );
  }
}
