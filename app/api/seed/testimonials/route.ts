import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

const initialTestimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO',
    company: 'TechFlow Solutions',
    avatar: '/media/home/testimonials/sarah-chen.jpg',
    rating: 5,
    text: "Rising Starter transformed our entire digital presence. We've seen a 300% increase in organic traffic and our conversion rates have never been better. The team's expertise is unmatched.",
    results: ['300% traffic increase', '45% conversion boost', '24/7 support'],
    featured: true,
    order: 1,
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO',
    company: 'DataDrive Inc',
    avatar: '/media/home/testimonials/marcus-johnson.jpg',
    rating: 5,
    text: 'The AI chatbot solution is revolutionary. Our customer satisfaction increased by 40% while reducing response time from hours to seconds. Incredible ROI on our investment.',
    results: [
      '40% satisfaction boost',
      'Instant responses',
      'Seamless integration',
    ],
    featured: false,
    order: 2,
  },
  {
    name: 'Elena Rodriguez',
    role: 'VP Operations',
    company: 'ScaleUp Co',
    avatar: '/media/home/testimonials/elena-rodriguez.jpg',
    rating: 5,
    text: 'From N8N workflow automation to Shopify store optimization, Rising Starter handles everything. Our team can finally focus on strategy instead of repetitive tasks.',
    results: ['200+ hours saved', 'Full automation', 'Team productivity'],
    featured: false,
    order: 3,
  },
  {
    name: 'David Kim',
    role: 'Founder',
    company: 'GrowthLab',
    avatar: '/media/home/testimonials/david-kim.jpg',
    rating: 5,
    text: 'The custom WordPress solution delivered results beyond our expectations. Revenue increased 150% while our site loads in under 2 seconds. Best investment we made.',
    results: ['150% revenue growth', '2s load time', 'Scalable systems'],
    featured: false,
    order: 4,
  },
  {
    name: 'Lisa Thompson',
    role: 'Director',
    company: 'InnovateCorp',
    avatar: '/media/home/testimonials/lisa-thompson.jpg',
    rating: 5,
    text: 'Exceptional SEO and web design that actually delivers results. The implementation was smooth, and we saw improvements within weeks. Highly recommend Rising Starter.',
    results: ['Page 1 rankings', 'Smooth integration', 'High ROI'],
    featured: false,
    order: 5,
  },
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');
    const collection = db.collection('testimonials');

    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      return NextResponse.json({
        message: 'Testimonials already seeded',
        count: existingCount,
      });
    }

    const now = new Date();
    const testimonialsWithTimestamps = initialTestimonials.map((item) => ({
      ...item,
      published: true,
      createdAt: now,
      updatedAt: now,
    }));

    const result = await collection.insertMany(testimonialsWithTimestamps);

    return NextResponse.json({
      message: 'Testimonials seeded successfully',
      count: result.insertedCount,
    });
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to seed testimonials' },
      { status: 500 }
    );
  }
}
