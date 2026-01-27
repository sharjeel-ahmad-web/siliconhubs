import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { sql } from '@vercel/postgres';

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
    const { page_id, type, order_index, content, animation_config } = body;

    if (!page_id || !type || order_index === undefined || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { rows } = await sql`
      INSERT INTO sections (page_id, type, order_index, content, animation_config)
      VALUES (
        ${page_id}, 
        ${type}, 
        ${order_index}, 
        ${JSON.stringify(content)}, 
        ${JSON.stringify(animation_config || {})}
      )
      RETURNING *
    `;

    return NextResponse.json({ section: rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
