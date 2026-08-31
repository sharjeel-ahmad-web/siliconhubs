import { NextResponse } from 'next/server';
import { getUploadSignature, reconfigureFromSettings } from '@/lib/cloudinary';

// GET - Get upload signature for client-side uploads
export async function GET(request: Request) {
  try {
    await reconfigureFromSettings();
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'silicon-hubs';

    const signatureData = getUploadSignature(folder);

    return NextResponse.json(signatureData);
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload signature' },
      { status: 500 }
    );
  }
}
