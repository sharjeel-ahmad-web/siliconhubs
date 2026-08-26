import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { SiteContent } from '@/lib/db/models';

// GET - Fetch site content (public API)
export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');
    const sections = searchParams.get('sections');
    const includeHidden = searchParams.get('includeHidden') === 'true';
    const includeVisibility = searchParams.get('includeVisibility') !== 'false';

    const query: Record<string, unknown> = {};
    if (page) query.page = page;
    if (section) query.section = section;

    if (sections && !section) {
      const sectionList = sections
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (sectionList.length > 0) {
        query.section = { $in: sectionList };
      }
    }

    const content = await db
      .collection<SiteContent>('siteContent')
      .find(query)
      .toArray();

    const contentMap: Record<string, unknown> = {};
    for (const item of content ?? []) {
      const isVisible = item.visible !== false;
      if (isVisible || includeHidden) {
        const key = page ? item.section : `${item.page}_${item.section}`;
        contentMap[key] = {
          ...(item.content ?? {}),
          ...(includeVisibility ? { _visible: item.visible !== false } : {}),
        };
      }
    }

    const payload = section
      ? (contentMap[section] ?? { _visible: true })
      : contentMap;

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('[api/content GET]', error);
    return NextResponse.json({});
  }
}
