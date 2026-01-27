import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { Service } from '@/lib/db/models';

// GET - Fetch all services
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const services = await db
      .collection<Service>('services')
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      icon,
      features,
      published,
      order,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    // Generate slug if not provided
    const serviceSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    const now = new Date();
    const newService: Omit<Service, '_id'> = {
      name,
      slug: serviceSlug,
      description: description || '',
      shortDescription: shortDescription || '',
      icon: icon || '🔧',
      features: features || [],
      published: published ?? true,
      order: order || 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection('services').insertOne(newService);

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...newService,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
