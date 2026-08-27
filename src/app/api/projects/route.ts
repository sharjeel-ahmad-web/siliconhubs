import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, COLLECTIONS } from '@/lib/db/mongodb';

// GET - Public API to fetch published projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!)
      : undefined;

    const db = await getDatabase();
    const collection = db.collection(COLLECTIONS.PROJECTS);

    // Build query - only fetch published projects
    const query: Record<string, any> = { published: true };
    if (featured) {
      query.featured = true;
    }

    let projectsQuery = collection
      .find(query)
      .sort({ publishedAt: -1, createdAt: -1 }); // Sort by publish date, then creation date

    if (limit) {
      projectsQuery = projectsQuery.limit(limit);
    }

    const projects = await projectsQuery.toArray();

    // Add cache headers for CDN and browser caching
    const headers = {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    };

    return NextResponse.json({ projects }, { headers });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
