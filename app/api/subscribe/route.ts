import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// POST - Public newsletter subscription endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source = 'website' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Check for existing subscriber
    const existing = await db.collection('subscribers').findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      if (existing.status === 'unsubscribed') {
        // Reactivate unsubscribed user
        await db
          .collection('subscribers')
          .updateOne(
            { _id: existing._id },
            { $set: { status: 'active', updatedAt: new Date() } }
          );
        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
      });
    }

    // Create new subscriber
    const now = new Date();
    await db.collection('subscribers').insertOne({
      email: email.toLowerCase(),
      name: name || '',
      source,
      status: 'active',
      tags: [],
      subscribedAt: now,
      createdAt: now,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to our newsletter!',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
