import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/lib/db/mongodb';

// Configure Cloudinary from environment variables by default
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

let cachedSettings: {
  cloud_name?: string;
  api_key?: string;
  api_secret?: string;
} | null = null;

export async function reconfigureFromSettings(): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db('siliconhubs');
    const setting = await db
      .collection('settings')
      .findOne({ key: 'cloudinary' });

    if (setting?.value) {
      const v = setting.value as Record<string, string>;
      cachedSettings = {
        cloud_name: v.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME,
        api_key: v.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY,
        api_secret: v.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET,
      };
    } else {
      cachedSettings = null;
    }

    cloudinary.config({
      cloud_name:
        cachedSettings?.cloud_name || process.env.CLOUDINARY_CLOUD_NAME,
      api_key: cachedSettings?.api_key || process.env.CLOUDINARY_API_KEY,
      api_secret:
        cachedSettings?.api_secret || process.env.CLOUDINARY_API_SECRET,
    });
  } catch {
    // ignore DB errors; keep env-based config
  }
}

function getCloudName(): string {
  return cachedSettings?.cloud_name || process.env.CLOUDINARY_CLOUD_NAME || '';
}

function getApiKey(): string {
  return cachedSettings?.api_key || process.env.CLOUDINARY_API_KEY || '';
}

function getApiSecret(): string {
  return cachedSettings?.api_secret || process.env.CLOUDINARY_API_SECRET || '';
}

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

  return `https://res.cloudinary.com/${getCloudName()}/image/upload/${transformString}/${publicId}`;
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

  return `https://res.cloudinary.com/${getCloudName()}/video/upload/${transformString}/${publicId}`;
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
    folder = 'siliconhubs',
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
      const result = await cloudinary.api.resources({
        type: 'upload',
        resource_type: resourceType,
        max_results: maxResults,
      });

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
export function getUploadSignature(folder: string = 'siliconhubs'): {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
} {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    getApiSecret()
  );

  return {
    signature,
    timestamp,
    cloudName: getCloudName(),
    apiKey: getApiKey(),
    folder,
  };
}
