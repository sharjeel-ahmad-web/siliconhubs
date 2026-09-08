import { NextResponse } from 'next/server';
import { uploadToCloudinary, reconfigureFromSettings } from '@/lib/cloudinary';

export async function POST(request: Request) {
  try {
    await reconfigureFromSettings();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'siliconhubs';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine resource type
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    // Convert buffer to base64 data URI
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(dataUri, {
      folder,
      resourceType,
    });

    return NextResponse.json({
      success: true,
      file: {
        publicId: result.publicId,
        url: result.secureUrl,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        type: result.resourceType,
        name: file.name,
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
