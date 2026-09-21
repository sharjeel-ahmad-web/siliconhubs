import { getUploadAuthParams } from '@imagekit/next/server';

const URL_ENDPOINT =
  process.env.NEXT_PUBLIC_URL_ENDPOINT || 'https://ik.imagekit.io/siliconhubs';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_PUBLIC_KEY || '';

const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || '';

const IMAGEKIT_UPLOAD_ENDPOINT = 'https://api.imagekit.io/v1/files/upload';

const IMAGEKIT_API_ENDPOINT = 'https://api.imagekit.io/v1/files';

function getImageKitAuthorization(): string {
  assertImageKitConfig();
  return `Basic ${Buffer.from(`${PRIVATE_KEY}:`).toString('base64')}`;
}

/**
 * Upload a file to ImageKit from the server.
 *
 * IMPORTANT:
 * - Private key is only used server-side.
 * - The browser never receives ImageKit authentication parameters.
 * - Resume uploads should use resourceType = "raw".
 */
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
  width?: number;
  height?: number;
}> {
  assertImageKitConfig();

  if (!buffer || buffer.length === 0) {
    throw new Error('Cannot upload an empty file to ImageKit.');
  }

  if (!fileName || !fileName.trim()) {
    throw new Error('A valid file name is required for ImageKit upload.');
  }

  if (!folder || !folder.trim()) {
    throw new Error('A valid ImageKit folder is required.');
  }

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

  const response = await fetch(IMAGEKIT_UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`ImageKit upload failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();

  if (!data?.fileId) {
    throw new Error('ImageKit upload succeeded but did not return a fileId.');
  }

  return {
    fileId: data.fileId,
    url: data.url || '',
    fileName: data.fileName || fileName,
    fileSize: buffer.length,
    format: data.format || getExtension(fileName) || 'raw',
    folder,
    width: data.width,
    height: data.height,
  };
}

/**
 * Delete a file from ImageKit.
 *
 * This function must only be called from trusted server-side code.
 */
export async function deleteFromImageKit(fileId: string): Promise<boolean> {
  if (!fileId || typeof fileId !== 'string') {
    return false;
  }

  try {
    assertImageKitConfig();

    /**
     * ImageKit's file-management endpoint requires
     * authenticated server-side access.
     *
     * Keep the private key on the server only.
     */
    const response = await fetch(
      `${IMAGEKIT_API_ENDPOINT}/${encodeURIComponent(fileId)}`,
      {
        method: 'DELETE',
        headers: { Authorization: getImageKitAuthorization() },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(`ImageKit delete failed: ${response.status} ${errorText}`);

      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting from ImageKit:', error);

    return false;
  }
}

/** Derive folders from ImageKit file paths without relying on a folder endpoint. */
export async function listImageKitFolders(
  parentFolderPath = ''
): Promise<{ name: string; path: string }[]> {
  const params = new URLSearchParams({
    limit: '1000',
    fileType: 'all',
  });
  const response = await fetch(
    `${IMAGEKIT_API_ENDPOINT}?${params.toString()}`,
    {
      headers: { Authorization: getImageKitAuthorization() },
    }
  );

  if (!response.ok) {
    throw new Error(`ImageKit file listing failed: ${response.status}`);
  }

  const files = await response.json();
  const parent = parentFolderPath.replace(/^\/+|\/+$/g, '');
  const folderPaths = new Set<string>();

  for (const file of Array.isArray(files) ? files : []) {
    const filePath = String(file.filePath || '').replace(/^\/+|\/+$/g, '');
    if (!filePath) continue;

    const parts = filePath.split('/');
    const parentParts = parent ? parent.split('/') : [];
    if (
      parentParts.length > parts.length - 1 ||
      parentParts.some((part, index) => parts[index] !== part)
    ) {
      continue;
    }

    const childFolder = parts.slice(0, parentParts.length + 1).join('/');
    if (childFolder !== parent) folderPaths.add(childFolder);
  }

  return Array.from(folderPaths)
    .sort()
    .map((path) => ({ name: path.split('/').pop() || path, path }));
}

/** List files in an ImageKit folder. */
export async function listImageKitFiles(
  folder = '',
  type: 'image' | 'video' = 'image',
  limit = 500
): Promise<any[]> {
  const params = new URLSearchParams({
    path: folder ? `/${folder}` : '/',
    limit: String(Math.min(limit, 1000)),
    fileType: 'all',
  });
  const response = await fetch(
    `${IMAGEKIT_API_ENDPOINT}?${params.toString()}`,
    {
      headers: { Authorization: getImageKitAuthorization() },
    }
  );

  if (!response.ok) {
    throw new Error(`ImageKit file listing failed: ${response.status}`);
  }

  const files = await response.json();
  return (Array.isArray(files) ? files : []).filter((file: any) => {
    const fileType = file.fileType || file.type;
    return fileType === type;
  });
}

/**
 * Build an ImageKit URL for a known path/file reference.
 *
 * This helper is suitable for public assets.
 *
 * DO NOT use this function to expose candidate resumes
 * to the public application UI.
 */
export function getImageKitUrl(
  path: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | 'auto';
    format?: string;
  } = {}
): string {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (path.startsWith('/_next/')) {
    return path;
  }

  const { width, height, quality = 80, format } = options;

  const transformations: string[] = [];

  if (width) {
    transformations.push(`w-${width}`);
  }

  if (height) {
    transformations.push(`h-${height}`);
  }

  transformations.push(`q-${quality}`);

  if (format) {
    transformations.push(`f-${format}`);
  }

  const cleanPath = path.replace(/^\//, '');

  const transformationString = transformations.join(',');

  return `${URL_ENDPOINT}/${cleanPath}?tr=${transformationString}`;
}

/**
 * Confirm required ImageKit server configuration exists.
 */
function assertImageKitConfig(): void {
  if (!PUBLIC_KEY) {
    throw new Error('ImageKit public key is not configured.');
  }

  if (!PRIVATE_KEY) {
    throw new Error('ImageKit private key is not configured.');
  }
}

/**
 * Get a normalized file extension.
 */
function getExtension(fileName: string): string {
  const cleanName = fileName.split(/[\\/]/).pop()?.trim() || '';

  const extension = cleanName.split('.').pop()?.toLowerCase() || '';

  return extension;
}
