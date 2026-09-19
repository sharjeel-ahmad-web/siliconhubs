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

export interface ResumeValidationInput {
  name?: string;
  size?: number;
  type?: string;
  mimeType?: string;
}

/**
 * Validate resume metadata before reading/uploading the file.
 *
 * Allowed formats:
 * - PDF
 * - DOC
 * - DOCX
 *
 * This validates extension, MIME metadata and size.
 * File-content validation is performed separately through
 * validateResumeBuffer().
 */
export function validateResumeFile(
  file: ResumeValidationInput | null
): { ok: true } | { ok: false; error: string } {
  if (!file || !file.name) {
    return {
      ok: false,
      error: 'Please attach a resume/CV file.',
    };
  }

  const extension = getFileExtension(file.name);
  const mime = (file.type || file.mimeType || '').toLowerCase();

  if (
    !ALLOWED_RESUME_EXTENSIONS.includes(
      extension as (typeof ALLOWED_RESUME_EXTENSIONS)[number]
    )
  ) {
    return {
      ok: false,
      error: 'Resume must be a PDF, DOC or DOCX file.',
    };
  }

  /**
   * Browser MIME metadata can sometimes be empty, so an empty MIME
   * is allowed here. When provided, however, it must be supported.
   */
  if (mime && !(ALLOWED_RESUME_TYPES as readonly string[]).includes(mime)) {
    return {
      ok: false,
      error: 'Resume file type is not supported. Use PDF, DOC or DOCX.',
    };
  }

  if (typeof file.size === 'number' && file.size > MAX_RESUME_SIZE) {
    return {
      ok: false,
      error: 'Resume must be smaller than 5MB.',
    };
  }

  if (typeof file.size === 'number' && file.size <= 0) {
    return {
      ok: false,
      error: 'The uploaded file is empty. Please try another file.',
    };
  }

  return { ok: true };
}

/**
 * Validate the actual file bytes.
 *
 * This prevents a user from simply renaming an arbitrary file to
 * .pdf, .doc or .docx.
 *
 * Signatures:
 * - PDF  -> %PDF
 * - DOC  -> OLE Compound File
 * - DOCX -> ZIP container
 */
export function validateResumeBuffer(
  buffer: Buffer,
  extension: string
): { ok: true } | { ok: false; error: string } {
  if (!buffer || buffer.length === 0) {
    return {
      ok: false,
      error: 'The uploaded file is empty. Please try another file.',
    };
  }

  if (buffer.length > MAX_RESUME_SIZE) {
    return {
      ok: false,
      error: 'Resume must be smaller than 5MB.',
    };
  }

  const normalizedExtension = extension.replace(/^\./, '').toLowerCase();

  if (
    !ALLOWED_RESUME_EXTENSIONS.includes(
      normalizedExtension as (typeof ALLOWED_RESUME_EXTENSIONS)[number]
    )
  ) {
    return {
      ok: false,
      error: 'Resume must be a PDF, DOC or DOCX file.',
    };
  }

  // ---------------------------------------------------------
  // PDF
  // ---------------------------------------------------------

  if (normalizedExtension === 'pdf') {
    const pdfSignature = buffer.subarray(0, 4).toString('ascii');

    if (pdfSignature !== '%PDF') {
      return {
        ok: false,
        error: 'The uploaded file does not appear to be a valid PDF.',
      };
    }

    return { ok: true };
  }

  // ---------------------------------------------------------
  // Legacy Microsoft Word DOC
  // ---------------------------------------------------------

  if (normalizedExtension === 'doc') {
    const docSignature = Buffer.from([
      0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1,
    ]);

    if (!buffer.subarray(0, 8).equals(docSignature)) {
      return {
        ok: false,
        error: 'The uploaded file does not appear to be a valid DOC document.',
      };
    }

    return { ok: true };
  }

  // ---------------------------------------------------------
  // DOCX
  // ---------------------------------------------------------

  if (normalizedExtension === 'docx') {
    /**
     * DOCX files are ZIP containers.
     *
     * ZIP local-file signatures commonly begin with:
     * PK\x03\x04
     */
    const zipSignature = Buffer.from([0x50, 0x4b, 0x03, 0x04]);

    const zipEmptySignature = Buffer.from([0x50, 0x4b, 0x05, 0x06]);

    const zipSpannedSignature = Buffer.from([0x50, 0x4b, 0x07, 0x08]);

    const isZip =
      buffer.subarray(0, 4).equals(zipSignature) ||
      buffer.subarray(0, 4).equals(zipEmptySignature) ||
      buffer.subarray(0, 4).equals(zipSpannedSignature);

    if (!isZip) {
      return {
        ok: false,
        error: 'The uploaded file does not appear to be a valid DOCX document.',
      };
    }

    return { ok: true };
  }

  return {
    ok: false,
    error: 'Resume file type is not supported.',
  };
}

/**
 * Upload a validated resume to ImageKit.
 *
 * The file is stored as a raw file under the dedicated careers
 * resume folder.
 */
export async function uploadResume(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<ResumeUploadResult> {
  const extension = getFileExtension(originalName);

  const metadataValidation = validateResumeFile({
    name: originalName,
    size: buffer.length,
    type: mimeType,
  });

  if (!metadataValidation.ok) {
    throw new Error(metadataValidation.error);
  }

  const contentValidation = validateResumeBuffer(buffer, extension);

  if (!contentValidation.ok) {
    throw new Error(contentValidation.error);
  }

  const safeFileName = sanitizeFileName(originalName);

  const upload = await uploadToImageKit(
    buffer,
    safeFileName,
    RESUME_FOLDER,
    'raw'
  );

  return {
    imagekitFileId: upload.fileId,
    fileName: safeFileName,
    fileType: mimeType || getMimeTypeFromExtension(extension),
    fileSize: buffer.length,
    format: upload.format,
    url: upload.url,
  };
}

/**
 * Resolve a resume download URL from its private storage reference.
 *
 * The fileId is the canonical storage identifier used by the
 * application layer.
 */
export function getResumeDownloadUrl(
  fileId: string,
  _fileName: string,
  _format = 'pdf'
): string {
  return getImageKitUrl(fileId);
}

/**
 * Delete a resume from ImageKit.
 */
export async function deleteResume(fileId: string): Promise<boolean> {
  if (!fileId || typeof fileId !== 'string') {
    return false;
  }

  return deleteFromImageKit(fileId);
}

/**
 * Extract a normalized extension from a filename.
 */
function getFileExtension(fileName: string): string {
  const cleanName = fileName.split(/[\\/]/).pop()?.trim() || '';

  const parts = cleanName.split('.');

  if (parts.length < 2) {
    return '';
  }

  return parts.pop()?.toLowerCase() || '';
}

/**
 * Sanitize the original filename before sending it to storage.
 *
 * This keeps the candidate's useful filename while preventing
 * path traversal and problematic characters.
 */
function sanitizeFileName(fileName: string): string {
  const extension = getFileExtension(fileName);

  const baseName =
    fileName
      .split(/[\\/]/)
      .pop()
      ?.replace(/\.[^/.]+$/, '') || 'resume';

  const safeBaseName = baseName
    .replace(/[^a-zA-Z0-9._ -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 140);

  const finalBaseName = safeBaseName || 'resume';

  return extension ? `${finalBaseName}.${extension}` : finalBaseName;
}

/**
 * Fallback MIME type based on the validated extension.
 */
function getMimeTypeFromExtension(extension: string): string {
  switch (extension) {
    case 'pdf':
      return 'application/pdf';

    case 'doc':
      return 'application/msword';

    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    default:
      return 'application/octet-stream';
  }
}
