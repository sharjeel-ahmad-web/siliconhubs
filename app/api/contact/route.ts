import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';
import { Contact } from '@/lib/db/models';
import { sendContactNotification } from '@/lib/email/resend';

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    const contact: Omit<Contact, '_id'> = {
      name,
      email,
      phone: phone || null,
      company: company || null,
      service: service || null,
      message,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTIONS.CONTACTS).insertOne(contact);

    // Send email notification
    await sendContactNotification({
      name,
      email,
      company: company || undefined,
      service: service || undefined,
      message,
    });

    return NextResponse.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
