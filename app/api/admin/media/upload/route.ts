import { NextResponse } from 'next/server';
import { uploadToImageKit } from '@/lib/imagekit';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'siliconhubs';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ImageKit stores images and videos through the same upload endpoint.
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    const result = await uploadToImageKit(
      buffer,
      file.name,
      folder,
      resourceType
    );

    return NextResponse.json({
      success: true,
      file: {
        publicId: result.fileId,
        url: result.url,
        format: result.format,
        width: result.width || 0,
        height: result.height || 0,
        size: result.fileSize,
        type: resourceType,
        name: result.fileName,
        folder: result.folder,
      },
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    const errorMessage =
      error?.message || error?.error?.message || 'Failed to upload file';
    return NextResponse.json(
      {
        error: 'Failed to upload file',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
