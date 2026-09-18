import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { uploadToImageKit } from '@/lib/imagekit';

// POST - Submit a new testimonial (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;
    const role = formData.get('role') as string;
    const text = formData.get('text') as string;
    const rating = parseInt(formData.get('rating') as string) || 5;
    const image = formData.get('image') as File | null;

    if (!name || !email || !text) {
      return NextResponse.json(
        { error: 'Name, email, and testimonial text are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    let avatarUrl = '/media/home/testimonials/placeholder.jpg';

    if (image && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await uploadToImageKit(
          buffer,
          image.name,
          'testimonials',
          'image'
        );

        avatarUrl = uploadResult.url;
      } catch (uploadError) {
        console.error('ImageKit upload error:', uploadError);
      }
    }

    const client = await clientPromise;
    const db = client.db('siliconhubs');

    const now = new Date();
    const newTestimonial = {
      name,
      email,
      role: role || '',
      company: company || '',
      avatar: avatarUrl,
      text,
      rating: Math.min(5, Math.max(1, rating)),
      results: [],
      featured: false,
      published: false,
      status: 'pending',
      order: 999,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('testimonials').insertOne(newTestimonial);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your testimonial has been submitted for review.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to submit testimonial' },
      { status: 500 }
    );
  }
}
