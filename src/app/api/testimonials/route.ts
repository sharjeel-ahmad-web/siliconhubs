import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { Testimonial } from '@/lib/db/models';

// GET - Fetch published testimonials (public API)
export async function GET() {
  try {
    const db = await connectDB();

    const testimonials = await db
      .collection<Testimonial>('testimonials')
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(Array.isArray(testimonials) ? testimonials : []);
  } catch (error) {
    console.error('[api/testimonials GET]', error);
    return NextResponse.json([]);
  }
}
