import {
  uploadToImageKit,
  getImageKitUrl,
  deleteFromImageKit,
} from '@/lib/imagekit';

const RESUME_FOLDER = 'siliconhubs/resumes';

export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ALLOWED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'] as const;
export const MAX_RESUME_SIZE = 5 * 1024 * 1024;

export interface ResumeUploadResult {
  imagekitFileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  format: string;
  url: string;
}

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

export async function uploadResume(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<ResumeUploadResult> {
  const upload = await uploadToImageKit(
    buffer,
    originalName,
    RESUME_FOLDER,
    'raw'
  );

  return {
    imagekitFileId: upload.fileId,
    fileName: originalName,
    fileType: mimeType || 'application/pdf',
    fileSize: buffer.length,
    format: upload.format,
    url: upload.url,
  };
}

export function getResumeDownloadUrl(
  fileId: string,
  _fileName: string,
  _format = 'pdf'
): string {
  return getImageKitUrl(fileId);
}

export async function deleteResume(fileId: string): Promise<boolean> {
  return deleteFromImageKit(fileId);
}
