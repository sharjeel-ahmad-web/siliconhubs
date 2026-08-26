import { NextResponse } from 'next/server';

// Master seed endpoint - seeds all CMS content
// Use ?force=true to clear and re-seed all data
export async function GET(request: Request) {
  const baseUrl = new URL(request.url).origin;
  const url = new URL(request.url);
  const force = url.searchParams.get('force') === 'true';
  const results: Record<string, any> = {};

  try {
    // If force, clear all data first
    if (force) {
      const clearRes = await fetch(`${baseUrl}/api/seed/clear`);
      results.cleared = await clearRes.json();
    }

    // Seed site content (with force if specified)
    const contentRes = await fetch(
      `${baseUrl}/api/seed/content${force ? '?force=true' : ''}`
    );
    results.content = await contentRes.json();

    // Seed team members
    const teamRes = await fetch(`${baseUrl}/api/seed/team`);
    results.team = await teamRes.json();

    // Seed testimonials
    const testimonialsRes = await fetch(`${baseUrl}/api/seed/testimonials`);
    results.testimonials = await testimonialsRes.json();

    // Seed services
    const servicesRes = await fetch(`${baseUrl}/api/seed/services`);
    results.services = await servicesRes.json();

    // Seed blogs
    const blogsRes = await fetch(`${baseUrl}/api/seed/blogs`);
    results.blogs = await blogsRes.json();

    // Seed projects
    const projectsRes = await fetch(`${baseUrl}/api/seed/projects`);
    results.projects = await projectsRes.json();

    return NextResponse.json({
      message: force
        ? 'All content cleared and re-seeded successfully'
        : 'All content seeded successfully',
      results,
    });
  } catch (error) {
    console.error('Error seeding all content:', error);
    return NextResponse.json(
      {
        error: 'Failed to seed all content',
        results,
      },
      { status: 500 }
    );
  }
}
