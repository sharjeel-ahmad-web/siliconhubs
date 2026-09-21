import { NextResponse } from 'next/server';
import { listImageKitFolders } from '@/lib/imagekit';

// GET - List all folders from ImageKit
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentFolder = searchParams.get('folder') || '';
    const folders = await listImageKitFolders(parentFolder);

    return NextResponse.json({
      success: true,
      parentFolder,
      folders,
    });
  } catch (error: any) {
    console.error('Error listing folders:', error);
    return NextResponse.json(
      { error: 'Failed to list folders', details: error.message },
      { status: 500 }
    );
  }
}
