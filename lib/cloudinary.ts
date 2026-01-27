import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper to generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop && (width || height)) transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}/${publicId}`;
}

// Helper to generate optimized video URL
export function getOptimizedVideoUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'mp4' | 'webm';
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${transformString}/${publicId}`;
}

// Upload options interface
export interface UploadOptions {
  folder?: string;
  publicId?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: object;
}

// Upload result interface
export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  resourceType: string;
  createdAt: string;
}

// Upload file to Cloudinary
export async function uploadToCloudinary(
  file: string | Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    folder = 'rising-dot',
    publicId,
    resourceType = 'auto',
    transformation,
  } = options;

  const uploadOptions: any = {
    folder,
    resource_type: resourceType,
    transformation,
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  // If file is a Buffer, convert to base64 data URI
  const fileToUpload = Buffer.isBuffer(file)
    ? `data:image/png;base64,${file.toString('base64')}`
    : file;

  const result = await cloudinary.uploader.upload(fileToUpload, uploadOptions);

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    resourceType: result.resource_type,
    createdAt: result.created_at,
  };
}

// Delete file from Cloudinary
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

// List files in a folder (searches all subfolders)
export async function listCloudinaryFiles(
  folder: string = '',
  resourceType: 'image' | 'video' | 'raw' = 'image',
  maxResults: number = 500
): Promise<any[]> {
  try {
    let allResources: any[] = [];
    let nextCursor: string | undefined;

    // Use search API to find files in specific folder
    if (folder) {
      // Search for files in this specific folder (not subfolders)
      const searchExpression = `folder="${folder}" AND resource_type:${resourceType}`;

      do {
        const result: any = await cloudinary.search
          .expression(searchExpression)
          .max_results(Math.min(maxResults - allResources.length, 500))
          .next_cursor(nextCursor || '')
          .execute();

        allResources = allResources.concat(result.resources || []);
        nextCursor = result.next_cursor;
      } while (nextCursor && allResources.length < maxResults);
    } else {
      // Get root level files (files without a folder)
      const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: resourceType,
        max_results: maxResults,
      });

      // Filter to only root-level files (no folder in public_id)
      allResources = (result.resources || []).filter(
        (r: any) => !r.public_id.includes('/')
      );
    }

    console.log(
      `Cloudinary found ${allResources.length} ${resourceType}s in folder: ${folder || 'root'}`
    );
    return allResources;
  } catch (error) {
    console.error('Error listing Cloudinary files:', error);
    return [];
  }
}

// Get upload signature for client-side uploads
export function getUploadSignature(folder: string = 'rising-dot'): {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
} {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
  };
}
