import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import clientPromise from '@/lib/db/mongodb';
import { sendContactReply } from '@/lib/email/resend';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid contact id' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const message = String(body.message || '').trim();
    if (!message) {
      return NextResponse.json(
        { error: 'Reply message is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('siliconhubs');
    const contact = await db.collection('contacts').findOne({
      _id: new ObjectId(params.id),
    });

    if (!contact?.email) {
      return NextResponse.json(
        { error: 'Contact email was not found' },
        { status: 404 }
      );
    }

    await sendContactReply({
      recipient: contact.email,
      contactName: contact.name || 'there',
      message,
    });

    await db
      .collection('contacts')
      .updateOne(
        { _id: contact._id },
        { $set: { status: 'replied', updatedAt: new Date() } }
      );

    return NextResponse.json({
      success: true,
      message: 'Reply sent successfully.',
    });
  } catch (error) {
    console.error('Contact reply error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to send reply',
      },
      { status: 400 }
    );
  }
}
