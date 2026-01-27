import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { SiteContent } from '@/lib/db/models';

// GET - Check section visibility (public API)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    if (!page || !section) {
      return NextResponse.json(
        { error: 'Page and section are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('rising-dot');

    const content = await db
      .collection<SiteContent>('siteContent')
      .findOne({ page, section });

    // If no content exists, default to visible
    if (!content) {
      return NextResponse.json({ visible: true });
    }

    // Return visibility status (default to true if not set)
    return NextResponse.json({ visible: content.visible !== false });
  } catch (error) {
    console.error('Error checking visibility:', error);
    return NextResponse.json({ visible: true }); // Default to visible on error
  }
}
