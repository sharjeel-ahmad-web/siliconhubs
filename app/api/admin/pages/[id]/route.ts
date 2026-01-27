import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (
      !session ||
      !['admin', 'editor'].includes((session.user as any)?.role)
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rows } = await sql`
      SELECT * FROM pages WHERE id = ${params.id}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Get sections for this page
    const { rows: sections } = await sql`
      SELECT * FROM sections WHERE page_id = ${params.id} ORDER BY order_index
    `;

    return NextResponse.json({ page: rows[0], sections });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { rows } = await sql`
      UPDATE pages
      SET 
        slug = ${slug},
        title = ${title},
        meta_description = ${meta_description || null},
        seo_data = ${JSON.stringify(seo_data || {})},
        published_at = ${published_at || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ page: rows[0] });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await sql`DELETE FROM pages WHERE id = ${params.id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
