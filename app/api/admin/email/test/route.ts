import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { sendTestEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const recipient = String(
      body.recipient ||
        process.env.CONTACT_EMAIL ||
        process.env.ADMIN_EMAIL ||
        ''
    ).trim();

    await sendTestEmail(recipient);
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully.',
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Email test failed.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
