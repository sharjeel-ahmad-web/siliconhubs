import { getUploadAuthParams } from '@imagekit/next/server';

const URL_ENDPOINT =
  process.env.NEXT_PUBLIC_URL_ENDPOINT || 'https://ik.imagekit.io/siliconhubs';
const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY || '';
const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || '';

export async function uploadToImageKit(
  buffer: Buffer,
  fileName: string,
  folder: string = 'siliconhubs/resumes',
  resourceType: 'image' | 'video' | 'raw' = 'raw'
): Promise<{
  fileId: string;
  url: string;
  fileName: string;
  fileSize: number;
  format: string;
  folder: string;
}> {
  const auth = getUploadAuthParams({
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
  });

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], {
    type: 'application/octet-stream',
  });
  formData.append('file', blob, fileName);
  formData.append('fileName', fileName);
  formData.append('folder', folder);
  formData.append('resourceType', resourceType);
  formData.append('useUniqueFileName', 'true');
  formData.append('token', auth.token);
  formData.append('expire', String(auth.expire));
  formData.append('signature', auth.signature);
  formData.append('publicKey', PUBLIC_KEY);

  const response = await fetch('https://api.imagekit.io/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ImageKit upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  return {
    fileId: data.fileId,
    url: data.url,
    fileName: data.fileName || fileName,
    fileSize: buffer.length,
    format: fileName.split('.').pop() || 'pdf',
    folder,
  };
}

export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  try {
    const auth = getUploadAuthParams({
      publicKey: PUBLIC_KEY,
      privateKey: PRIVATE_KEY,
    });

    const response = await fetch(
      `https://api.imagekit.io/v1/files/${fileId}?token=${auth.token}&signature=${auth.signature}&publicKey=${PUBLIC_KEY}`,
      { method: 'DELETE' }
    );
    return response.ok;
  } catch (error) {
    console.error('Error deleting from ImageKit:', error);
    return false;
  }
}

export function getImageKitUrl(
  path: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: string;
  } = {}
): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/_next/')) return path;

  const { width, height, quality = 80, format } = options;
  const transformations: string[] = [];
  if (width) transformations.push(`w-${width}`);
  if (height) transformations.push(`h-${height}`);
  transformations.push(`q-${quality}`);
  if (format) transformations.push(`f-${format}`);

  const cleanPath = path.replace(/^\//, '');
  const tr = transformations.join(',');
  return `${URL_ENDPOINT}/${cleanPath}?tr=${tr}`;
}
