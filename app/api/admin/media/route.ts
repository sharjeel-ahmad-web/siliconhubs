import { NextResponse } from 'next/server';
import { deleteFromImageKit, listImageKitFiles } from '@/lib/imagekit';

// GET - List all media files
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || '';
    const type = (searchParams.get('type') as 'image' | 'video') || 'image';
    const files = await listImageKitFiles(folder, type, 500);

    // Format the response - extract folder from public_id
    const formattedFiles = files.map((file: any) => {
      const publicId = file.fileId;
      const lastSlash = publicId.lastIndexOf('/');
      const fileFolder = lastSlash > -1 ? publicId.substring(0, lastSlash) : '';

      return {
        publicId,
        url: file.url,
        format: file.format,
        width: file.width,
        height: file.height,
        size: file.size,
        type: file.fileType || type,
        createdAt: file.createdAt,
        folder: file.filePath
          ? file.filePath.substring(0, file.filePath.lastIndexOf('/'))
          : fileFolder,
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

    const success = await deleteFromImageKit(publicId);

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
