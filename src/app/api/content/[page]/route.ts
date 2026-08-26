import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import * as fs from 'fs';
import * as path from 'path';

/**
 * GET /api/content/[page]
 * Returns all site content for the given page from MongoDB (siteContent).
 * If MongoDB has no content for this page, falls back to public/content/[page].json.
 * Compatible with useSiteContent(page, section). Always returns 200; missing or
 * failed content returns {} so clients never see 404.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ page: string  }> }
) {
  try {
    const { page } = await params;
    if (!page) {
      return NextResponse.json({}, { status: 200 });
    }

    const db = await connectDB();
    const content = await db
      .collection('siteContent')
      .find({ page })
      .toArray();

    let payload: Record<string, unknown> = {};

    for (const doc of content ?? []) {
      const section = doc?.section;
      if (section && typeof section === 'string' && doc?.content && typeof doc.content === 'object') {
        payload[section] = { ...(payload[section] as object || {}), ...doc.content };
      }
    }

    // Fallback to static JSON when MongoDB has no content for this page
    if (Object.keys(payload).length === 0) {
      const safePage = page.replace(/[^a-z0-9-]/gi, '');
      const contentPath = path.join(process.cwd(), 'public', 'content', `${safePage}.json`);
      if (fs.existsSync(contentPath)) {
        try {
          const raw = fs.readFileSync(contentPath, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
            payload = parsed as Record<string, unknown>;
          }
        } catch {
          // keep payload {}
        }
      }
    }

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch {
    return NextResponse.json({}, { status: 200 });
  }
}
