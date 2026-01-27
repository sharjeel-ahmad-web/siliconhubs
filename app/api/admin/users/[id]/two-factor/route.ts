import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { query } from '@/lib/db/connection';
import {
  generateTwoFactorSecret,
  enableTwoFactor,
  disableTwoFactor,
} from '@/lib/auth/two-factor';

// POST /api/admin/users/[id]/two-factor - Generate 2FA secret
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(params.id);

    // Get user email
    const users = await query<{ email: string }>(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { email } = users[0];

    // Generate 2FA secret
    const { secret, qrCode } = await generateTwoFactorSecret(userId, email);

    return NextResponse.json({ secret, qrCode });
  } catch (error) {
    console.error('Error generating 2FA secret:', error);
    return NextResponse.json(
      { error: 'Failed to generate 2FA secret' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id]/two-factor - Enable/disable 2FA
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = parseInt(params.id);
    const body = await request.json();
    const { action, secret, token } = body;

    if (!action || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let success = false;

    if (action === 'enable') {
      if (!secret) {
        return NextResponse.json(
          { error: 'Secret is required to enable 2FA' },
          { status: 400 }
        );
      }
      success = await enableTwoFactor(userId, secret, token);
    } else if (action === 'disable') {
      success = await disableTwoFactor(userId, token);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Invalid token or operation failed' },
        { status: 400 }
      );
    }

    // Log activity
    await query(
      `INSERT INTO activity_log (user_id, action, resource_type, resource_id, details, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`,
      [
        (session.user as any).id,
        action === 'enable' ? 'enable_2fa' : 'disable_2fa',
        'user',
        userId,
        JSON.stringify({ action }),
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating 2FA:', error);
    return NextResponse.json(
      { error: 'Failed to update 2FA' },
      { status: 500 }
    );
  }
}
