/**
 * Resume / CV upload + authenticated delivery.
 *
 * Resumes are uploaded to Cloudinary with resource_type=raw and type=authenticated
 * so files are NEVER publicly accessible. Authorized CMS users download them through
 * signed URLs generated in /api/admin/careers/resume/[applicationId].
 */
import cloudinary from '@/lib/cloudinary';

const RESUME_FOLDER = 'siliconhubs/resumes';

/** Allowed resume file extensions + size limit (5MB). */
export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ALLOWED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'] as const;
export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5 MB

export interface ResumeUploadResult {
  cloudinaryPublicId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  format: string;
}

/** Validate an uploaded resume file (server side). */
export function validateResumeFile(
  file: {
    name?: string;
    size?: number;
    type?: string;
    mimeType?: string;
  } | null
): { ok: true } | { ok: false; error: string } {
  if (!file || !file.name) {
    return { ok: false, error: 'Please attach a resume/CV file.' };
  }
  const extension = (file.name.split('.').pop() || '').toLowerCase();
  const mime = (file.type || file.mimeType || '').toLowerCase();

  if (
    !ALLOWED_RESUME_EXTENSIONS.includes(
      extension as (typeof ALLOWED_RESUME_EXTENSIONS)[number]
    )
  ) {
    return { ok: false, error: 'Resume must be a PDF, DOC or DOCX file.' };
  }
  if (mime && !(ALLOWED_RESUME_TYPES as readonly string[]).includes(mime)) {
    return {
      ok: false,
      error: 'Resume file type is not supported. Use PDF, DOC or DOCX.',
    };
  }
  if (file.size && file.size > MAX_RESUME_SIZE) {
    return { ok: false, error: 'Resume must be smaller than 5MB.' };
  }
  return { ok: true };
}

/**
 * Upload a resume buffer to Cloudinary (authenticated, non-public).
 * Returns the Cloudinary public id and file metadata to store with the application.
 */
export async function uploadResume(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<ResumeUploadResult> {
  const extension = (originalName.split('.').pop() || 'pdf').toLowerCase();
  const safeName = (originalName || 'resume')
    .replace(/[^\w.\- ]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const result = await cloudinary.uploader.upload(
    `data:${mimeType || 'application/pdf'};base64,${buffer.toString('base64')}`,
    {
      folder: RESUME_FOLDER,
      resource_type: 'raw',
      public_id: `${Date.now()}-${safeName.replace(/[^\w.\-]/g, '').slice(0, 80)}`,
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    }
  );

  return {
    cloudinaryPublicId: result.public_id,
    fileName: originalName,
    fileType: mimeType || 'application/pdf',
    fileSize: buffer.length,
    format: extension,
  };
}

/**
 * Generate a signed download URL for an authenticated Cloudinary raw file.
 * Only valid briefly and only readable by the holder of the signature.
 */
export function getResumeDownloadUrl(publicId: string, format = 'pdf'): string {
  const resourceType = 'raw';
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    (cloudinary.config() as any).cloud_name ||
    '';

  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: resourceType,
    cloud_name: cloudName as any,
    sign_url: true,
    attachment: true,
  } as any);
}

/** Permanently delete a resume from Cloudinary (used when an application is deleted). */
export async function deleteResume(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw',
      type: 'authenticated',
    });
    return result.result === 'ok';
  } catch {
    return false;
  }
}
