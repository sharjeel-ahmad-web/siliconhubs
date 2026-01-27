import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Validation
    if (!name || !email || !text) {
      return NextResponse.json(
        { error: 'Name, email, and testimonial text are required' },
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

    let avatarUrl = '/media/home/testimonials/placeholder.jpg';

    // Upload image to Cloudinary if provided
    if (image && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: 'testimonials',
                transformation: [
                  { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                  { quality: 'auto', fetch_format: 'auto' },
                ],
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(buffer);
        });

        avatarUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Continue with placeholder if upload fails
      }
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const now = new Date();
    const newTestimonial = {
      name,
      email, // Store email for reference but don't display publicly
      role: role || '',
      company: company || '',
      avatar: avatarUrl,
      text,
      rating: Math.min(5, Math.max(1, rating)),
      results: [],
      featured: false,
      published: false, // Requires approval
      status: 'pending', // pending, approved, rejected
      order: 999, // Will be at the end until reordered
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
