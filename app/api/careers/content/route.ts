import { NextRequest, NextResponse } from 'next/server';
import { getCareerSettings } from '@/lib/careers/data';

/**
 * GET /api/careers/content
 * Public career page content (hero, why-join, life, process, testimonials,
 * benefits, FAQs, general application) — always returns merged defaults.
 */
export async function GET(_request: NextRequest) {
  const settings = await getCareerSettings();
  return NextResponse.json(settings, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}
