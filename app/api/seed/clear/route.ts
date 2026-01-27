import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Clear all seeded CMS content
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('rising-dot');

    const results: Record<string, number> = {};

    // Clear site content
    const contentResult = await db.collection('siteContent').deleteMany({});
    results.siteContent = contentResult.deletedCount;

    // Clear team members
    const teamResult = await db.collection('teamMembers').deleteMany({});
    results.teamMembers = teamResult.deletedCount;

    // Clear testimonials
    const testimonialsResult = await db
      .collection('testimonials')
      .deleteMany({});
    results.testimonials = testimonialsResult.deletedCount;

    // Clear services
    const servicesResult = await db.collection('services').deleteMany({});
    results.services = servicesResult.deletedCount;

    // Clear blogs
    const blogsResult = await db.collection('blogs').deleteMany({});
    results.blogs = blogsResult.deletedCount;

    return NextResponse.json({
      message: 'All seed data cleared successfully',
      deleted: results,
    });
  } catch (error) {
    console.error('Error clearing seed data:', error);
    return NextResponse.json(
      { error: 'Failed to clear seed data' },
      { status: 500 }
    );
  }
}
