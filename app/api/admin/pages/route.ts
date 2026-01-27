import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (
      !session ||
      !['admin', 'editor'].includes((session.user as any)?.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await sql`
      SELECT 
        id, 
        slug, 
        title, 
        meta_description, 
        seo_data, 
        published_at, 
        created_at, 
        updated_at
      FROM pages
      ORDER BY updated_at DESC
    `;

    return NextResponse.json({ pages: rows });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (
      !session ||
      !['admin', 'editor'].includes((session.user as any)?.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, meta_description, seo_data, published_at } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: 'Slug and title are required' },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      INSERT INTO pages (slug, title, meta_description, seo_data, published_at)
      VALUES (${slug}, ${title}, ${meta_description || null}, ${JSON.stringify(seo_data || {})}, ${published_at || null})
      RETURNING *
    `;

    return NextResponse.json({ page: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
