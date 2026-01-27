import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

const VALID_SECTIONS = ['team', 'testimonials', 'blog'] as const;

/**
 * GET /api/batch?sections=team,testimonials,blog&limit=4
 * Fetches multiple sections in one request. Always returns 200 with valid JSON.
 * Each section has its own try/catch; one failure does not break the batch.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sectionsParam = searchParams.get('sections');
  const sections = sectionsParam
    ? sectionsParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => VALID_SECTIONS.includes(s as (typeof VALID_SECTIONS)[number]))
    : [...VALID_SECTIONS];
  const limit = Math.min(
    Math.max(0, parseInt(searchParams.get('limit') || '4', 10) || 4),
    100
  );
  const includeVisibility = searchParams.get('includeVisibility') === 'true';

  const result: Record<string, unknown> = {};

  try {
    const db = await connectDB();

    for (const section of sections) {
      try {
        if (section === 'team') {
          const team = await db
            .collection('teamMembers')
            .find({ published: true })
            .sort({ order: 1 })
            .toArray();
          result.team = Array.isArray(team) ? team : [];
          if (includeVisibility && Array.isArray(result.team)) {
            result.team = (result.team as { visible?: boolean }[]).filter(
              (item) => item.visible !== false
            );
          }
        } else if (section === 'testimonials') {
          const testimonials = await db
            .collection('testimonials')
            .find({ published: true })
            .sort({ order: 1 })
            .toArray();
          result.testimonials = Array.isArray(testimonials) ? testimonials : [];
          if (includeVisibility && Array.isArray(result.testimonials)) {
            result.testimonials = (
              result.testimonials as { visible?: boolean }[]
            ).filter((item) => item.visible !== false);
          }
        } else if (section === 'blog') {
          const blogs = await db
            .collection('blogs')
            .find({ published: true })
            .sort({ publishedAt: -1 })
            .limit(limit)
            .toArray();
          result.blog = Array.isArray(blogs) ? blogs : [];
          if (includeVisibility && Array.isArray(result.blog)) {
            result.blog = (result.blog as { visible?: boolean }[]).filter(
              (item) => item.visible !== false
            );
          }
        }
      } catch (err) {
        console.error(`[api/batch] Error fetching section ${section}:`, err);
        result[section] = [];
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (err) {
    console.error('[api/batch]', err);
    return NextResponse.json({});
  }
}
