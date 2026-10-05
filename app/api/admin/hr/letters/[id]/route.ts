import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getHRAdminSession } from '@/lib/hr-letters/access';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await getHRAdminSession())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid letter ID' }, { status: 400 });
    }
    const db = await connectDB();
    let letter = await db
      .collection('hrLetters')
      .findOne({ _id: new ObjectId(params.id) });
    if (!letter) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
    }

    if (
      typeof letter.verificationToken !== 'string' ||
      !letter.verificationToken
    ) {
      const verificationToken = randomBytes(32).toString('hex');
      await db.collection('hrLetters').updateOne(
        {
          _id: letter._id,
          $or: [
            { verificationToken: { $exists: false } },
            { verificationToken: null },
            { verificationToken: '' },
          ],
        },
        { $set: { verificationToken } }
      );
      letter = await db
        .collection('hrLetters')
        .findOne({ _id: new ObjectId(params.id) });
      if (!letter) {
        return NextResponse.json(
          { error: 'Letter not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({ ...letter, _id: letter._id.toString() });
  } catch (error) {
    console.error('[api/admin/hr/letters/[id] GET]', error);
    return NextResponse.json(
      { error: 'Failed to load HR letter' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
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
    const body = await request.json();
    const status = body.status;
    if (!['Issued', 'Cancelled', 'Archived'].includes(status)) {
      return NextResponse.json(
        {
          error: 'Only issue, cancel, or archive status changes are supported.',
        },
        { status: 400 }
      );
    }
    const db = await connectDB();
    const _id = new ObjectId(params.id);
    const existing = await db.collection('hrLetters').findOne({ _id });
    if (!existing) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
    }
    if (existing.status === 'Archived') {
      return NextResponse.json(
        { error: 'Archived letters cannot be changed.' },
        { status: 409 }
      );
    }
    const allowedTransitions =
      existing.status === 'Generated'
        ? ['Issued', 'Cancelled', 'Archived']
        : ['Archived'];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json(
        {
          error: `A ${String(existing.status)} letter cannot be changed to ${status}.`,
        },
        { status: 409 }
      );
    }
    const now = new Date();
    await db.collection('hrLetters').updateOne(
      { _id },
      {
        $set: {
          status,
          updatedAt: now,
          ...(status === 'Issued' ? { issuedAt: now } : {}),
        },
      }
    );
    await db.collection('hrLetterAuditLog').insertOne({
      action: `letter.${String(status).toLowerCase()}`,
      resourceId: params.id,
      letterNumber: existing.letterNumber,
      actor: session.user?.email || session.user?.name || 'Admin',
      createdAt: now,
    });
    return NextResponse.json({
      ...existing,
      _id: params.id,
      status,
      updatedAt: now,
      ...(status === 'Issued' ? { issuedAt: now } : {}),
    });
  } catch (error) {
    console.error('[api/admin/hr/letters/[id] PATCH]', error);
    return NextResponse.json(
      { error: 'Failed to update HR letter' },
      { status: 500 }
    );
  }
}
