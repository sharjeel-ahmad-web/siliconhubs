import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/connection';
import { del } from '@vercel/blob';

interface MediaItem {
  id: number;
  url: string;
  alternative_text: string;
  width: number | null;
  height: number | null;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

/**
 * GET /api/admin/media/[id]
 * Get a single media file
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query<MediaItem>('SELECT * FROM media WHERE id = $1', [
      params.id,
    ]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/media/[id]
 * Update media metadata
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { alternative_text } = data;

    const result = await query<MediaItem>(
      `UPDATE media 
       SET alternative_text = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [alternative_text, params.id]
    );

    if (result.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating media:', error);
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/media/[id]
 * Delete a single media file
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the media URL before deleting
    const mediaResult = await query<{ url: string }>(
      'SELECT url FROM media WHERE id = $1',
      [params.id]
    );

    if (mediaResult.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const { url } = mediaResult[0];

    // Delete from database
    await query('DELETE FROM media WHERE id = $1', [params.id]);

    // Delete from Vercel Blob Storage
    try {
      await del(url);
    } catch (error) {
      console.error('Error deleting blob:', error);
      // Continue even if blob deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
