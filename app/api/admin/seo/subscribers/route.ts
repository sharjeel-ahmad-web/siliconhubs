import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/db/mongodb';

// GET - Fetch subscribers with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const query: any = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) {
      query.status = status;
    }

    const [subscribers, total] = await Promise.all([
      db
        .collection('subscribers')
        .find(query)
        .sort({ subscribedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection('subscribers').countDocuments(query),
    ]);

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST - Add a new subscriber
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, tags } = body;

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

    // Check for duplicate
    const existing = await db
      .collection('subscribers')
      .findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already subscribed' },
        { status: 409 }
      );
    }

    const now = new Date();
    const subscriber = {
      email: email.toLowerCase(),
      name: name || '',
      source: 'admin',
      status: 'active',
      tags: tags || [],
      subscribedAt: now,
      createdAt: now,
    };

    const result = await db.collection('subscribers').insertOne(subscriber);

    return NextResponse.json(
      { _id: result.insertedId, ...subscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}

// DELETE - Delete multiple subscribers
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs are required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const objectIds = ids.map((id) => new ObjectId(id));
    const result = await db.collection('subscribers').deleteMany({
      _id: { $in: objectIds },
    });

    return NextResponse.json({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error deleting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscribers' },
      { status: 500 }
    );
  }
}
