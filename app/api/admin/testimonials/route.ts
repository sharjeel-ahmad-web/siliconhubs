import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { Testimonial } from '@/lib/db/models';

// GET - Fetch all testimonials
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const testimonials = await db
      .collection<Testimonial>('testimonials')
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      role,
      company,
      avatar,
      text,
      rating,
      results,
      featured,
      published,
      order,
    } = body;

    if (!name || !text) {
      return NextResponse.json(
        { error: 'Name and text are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const newTestimonial: Omit<Testimonial, '_id'> = {
      name,
      role: role || '',
      company: company || '',
      avatar: avatar || '/media/home/testimonials/placeholder.jpg',
      text,
      rating: rating || 5,
      results: results || [],
      featured: featured ?? false,
      published: published ?? true,
      order: order || 0,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection('testimonials')
      .insertOne(newTestimonial);

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...newTestimonial,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}
