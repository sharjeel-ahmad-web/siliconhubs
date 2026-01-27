import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db/connection';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      'SELECT * FROM animation_presets WHERE id = $1',
      [params.id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Failed to fetch animation preset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch animation preset' },
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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, preset_type, config } = body;

    // Validate required fields
    if (!name || !preset_type || !config) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate preset_type
    if (!['scroll', 'hover', 'entrance'].includes(preset_type)) {
      return NextResponse.json(
        { error: 'Invalid preset_type' },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE animation_presets
       SET name = $1, description = $2, preset_type = $3, config = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description || '', preset_type, JSON.stringify(config), params.id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    console.error('Failed to update animation preset:', error);

    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A preset with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update animation preset' },
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
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      'DELETE FROM animation_presets WHERE id = $1 RETURNING id',
      [params.id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Preset not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete animation preset:', error);
    return NextResponse.json(
      { error: 'Failed to delete animation preset' },
      { status: 500 }
    );
  }
}
