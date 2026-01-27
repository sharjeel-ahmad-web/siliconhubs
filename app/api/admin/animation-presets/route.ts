import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db/connection';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      'SELECT * FROM animation_presets ORDER BY created_at DESC'
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to fetch animation presets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch animation presets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
      `INSERT INTO animation_presets (name, description, preset_type, config)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description || '', preset_type, JSON.stringify(config)]
    );

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error('Failed to create animation preset:', error);

    // Handle unique constraint violation
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A preset with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create animation preset' },
      { status: 500 }
    );
  }
}
