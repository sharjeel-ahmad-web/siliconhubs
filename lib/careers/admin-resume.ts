import type { ResumeFile } from '@/types/careers';

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const IMAGEKIT_FILES_API = 'https://api.imagekit.io/v1/files';
const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export async function loadAdminResume(resume: ResumeFile) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) throw new Error('Resume storage is not configured.');

  const detailsResponse = await fetch(
    `${IMAGEKIT_FILES_API}/${encodeURIComponent(resume.imagekitFileId)}/details`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString('base64')}`,
      },
      cache: 'no-store',
    }
  );
  if (!detailsResponse.ok)
    throw new Error('Resume file could not be retrieved.');

  const details = await detailsResponse.json();
  const filePath = String(details.filePath || '').replace(/^\/+/, '');
  if (!filePath.startsWith('siliconhubs/resumes/')) {
    throw new Error('The requested file is not a stored resume.');
  }

  const fileUrl = new URL(String(details.url || ''));
  const endpoint = new URL(
    process.env.NEXT_PUBLIC_URL_ENDPOINT || 'https://ik.imagekit.io/siliconhubs'
  );
  if (fileUrl.origin !== endpoint.origin) {
    throw new Error('Resume storage returned an unexpected file location.');
  }

  const fileResponse = await fetch(fileUrl, { cache: 'no-store' });
  if (!fileResponse.ok) throw new Error('Resume file could not be downloaded.');

  const contentLength = Number(fileResponse.headers.get('content-length') || 0);
  if (contentLength > MAX_RESUME_SIZE) {
    throw new Error('Resume file exceeds the allowed size.');
  }

  const buffer = Buffer.from(await fileResponse.arrayBuffer());
  if (buffer.length === 0 || buffer.length > MAX_RESUME_SIZE) {
    throw new Error('Resume file is empty or exceeds the allowed size.');
  }

  const extension = resume.fileName.split('.').pop()?.toLowerCase() || '';
  const contentType = MIME_TYPES[extension];
  if (!contentType) throw new Error('Resume file type is not supported.');

  return { buffer, contentType, extension };
}

export function createAdminResumeResponse(
  buffer: Buffer,
  contentType: string,
  fileName: string,
  download: boolean
) {
  const safeFileName = fileName.replace(/[\r\n"\\]/g, '_') || 'resume';
  const disposition = download ? 'attachment' : 'inline';
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `${disposition}; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
