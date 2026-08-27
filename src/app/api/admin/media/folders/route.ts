import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// GET - List all folders from Cloudinary
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentFolder = searchParams.get('folder') || '';

    let folders: any[] = [];

    if (!parentFolder) {
      // Get root folders
      const result = await cloudinary.api.root_folders();
      folders = result.folders || [];
    } else {
      // Get subfolders of the specified folder
      try {
        const result = await cloudinary.api.sub_folders(parentFolder);
        folders = result.folders || [];
      } catch (e: any) {
        // If folder doesn't exist or has no subfolders
        if (e.error?.http_code !== 404) {
          console.error('Error getting subfolders:', e);
        }
        folders = [];
      }
    }

    return NextResponse.json({
      success: true,
      parentFolder,
      folders: folders.map((f: any) => ({
        name: f.name,
        path: f.path,
      })),
    });
  } catch (error: any) {
    console.error('Error listing folders:', error);
    return NextResponse.json(
      { error: 'Failed to list folders', details: error.message },
      { status: 500 }
    );
  }
}
