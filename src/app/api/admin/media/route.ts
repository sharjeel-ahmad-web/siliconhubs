import { NextResponse } from 'next/server';
import { listCloudinaryFiles, deleteFromCloudinary } from '@/lib/cloudinary';
import cloudinary from '@/lib/cloudinary';

// GET - List all media files
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const type = (searchParams.get('type') as 'image' | 'video') || 'image';
    const debug = searchParams.get('debug') === 'true';

    // Debug mode: list all folders first
    if (debug) {
      try {
        const foldersResult = await cloudinary.api.root_folders();
        const subFolders = folder
          ? await cloudinary.api
              .sub_folders(folder)
              .catch(() => ({ folders: [] }))
          : { folders: [] };
        return NextResponse.json({
          rootFolders: foldersResult.folders,
          subFolders: subFolders.folders,
          searchFolder: folder,
          type,
        });
      } catch (debugError) {
        console.error('Debug error:', debugError);
      }
    }

    const files = await listCloudinaryFiles(folder, type, 500);

    // Format the response - extract folder from public_id
    const formattedFiles = files.map((file: any) => {
      const publicId = file.public_id;
      const lastSlash = publicId.lastIndexOf('/');
      const fileFolder = lastSlash > -1 ? publicId.substring(0, lastSlash) : '';

      return {
        publicId: file.public_id,
        url: file.secure_url,
        format: file.format,
        width: file.width,
        height: file.height,
        size: file.bytes,
        type: file.resource_type,
        createdAt: file.created_at,
        folder: file.folder || fileFolder,
      };
    });

    return NextResponse.json({
      files: formattedFiles,
      count: formattedFiles.length,
      folder,
      type,
    });
  } catch (error) {
    console.error('Error listing media:', error);
    return NextResponse.json(
      { error: 'Failed to list media files', details: String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Delete a media file
export async function DELETE(request: Request) {
  try {
    const { publicId, resourceType = 'image' } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteFromCloudinary(publicId, resourceType);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully',
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media file' },
      { status: 500 }
    );
  }
}
