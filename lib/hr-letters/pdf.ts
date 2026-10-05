'use client';

import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { DEFAULT_COMPANY, type HRLetter } from '@/lib/hr-letters/types';
import {
  formatHRLetterText,
  removeEmployeeIdFromLetter,
} from '@/lib/hr-letters/letter-format';
import { getHRLetterVerificationUrl } from '@/lib/hr-letters/verification';

/* =========================================================
   SILICONHUBS BRAND SYSTEM
========================================================= */

const BRAND = {
  cream: '#FFF9F0',
  creamPanel: '#FFF3E4',
  orange: '#F4511E',
  orangeSoft: '#FF7A45',
  navy: '#0A192F',
  navyLight: '#24364D',
  muted: '#64748B',
  border: '#E7D8C5',
  white: '#FFFFFF',
};

/* =========================================================
   IMAGE LOADER
========================================================= */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => reject(new Error(`Could not load image: ${src}`));

    image.src = src;
  });
}

async function normalizeImageToPng(src: string): Promise<string> {
  const image = await loadImage(src);
  const maxWidth = 1200;
  const maxHeight = 600;
  const scale = Math.min(
    1,
    maxWidth / image.naturalWidth,
    maxHeight / image.naturalHeight
  );
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Could not prepare the authorized signature for the PDF.');
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
}

/* =========================================================
   MAIN LOGO
========================================================= */

async function getCroppedLogo(): Promise<string> {
  const image = await loadImage('/logos/Siliconhubs main logo.png');

  const canvas = document.createElement('canvas');

  canvas.width = 1200;
  canvas.height = 360;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not prepare SiliconHubs logo.');
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /*
   * Crop the useful portion of the original
   * SiliconHubs logo.
   */
  const sourceHeight = image.naturalHeight * 0.31;

  ctx.drawImage(
    image,
    0,
    image.naturalHeight * 0.34,
    image.naturalWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL('image/png');
}

/* =========================================================
   PROFESSIONAL WATERMARK

   IMPORTANT:
   Use the SiliconHubs ICON instead of the full wordmark.

   This creates a much more premium watermark and prevents
   the word "siliconhubs" from becoming distracting.
========================================================= */

async function getWatermarkLogo(): Promise<string> {
  const image = await loadImage('/logos/siliconhubs logo icon.png');

  /*
   * A4 aspect ratio canvas.
   *
   * 1240 x 1754 ~= A4 ratio.
   */
  const canvas = document.createElement('canvas');

  canvas.width = 1240;
  canvas.height = 1754;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not prepare watermark.');
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /*
   * VERY subtle watermark.
   */
  ctx.globalAlpha = 0.045;

  /*
   * Center of page.
   */
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  ctx.save();

  /*
   * Professional diagonal angle.
   *
   * Not too aggressive.
   */
  ctx.translate(centerX, centerY);

  ctx.rotate((-14 * Math.PI) / 180);

  /*
   * Keep watermark comfortably
   * inside the A4 page.
   */
  const watermarkSize = 950;

  ctx.drawImage(
    image,
    -watermarkSize / 2,
    -watermarkSize / 2,
    watermarkSize,
    watermarkSize
  );

  ctx.restore();

  return canvas.toDataURL('image/png');
}

/* =========================================================
   DRAW PAGE BACKGROUND
========================================================= */

function drawPageBackground(pdf: jsPDF, watermarkLogo: string) {
  const pageWidth = pdf.internal.pageSize.getWidth();

  const pageHeight = pdf.internal.pageSize.getHeight();

  /*
   * Cream paper
   */
  pdf.setFillColor(BRAND.cream);

  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  /*
   * Full A4 watermark.
   *
   * Since the watermark canvas is also A4 ratio,
   * it stays completely inside the page.
   */
  pdf.addImage(
    watermarkLogo,
    'PNG',
    0,
    0,
    pageWidth,
    pageHeight,
    undefined,
    'FAST'
  );
}

/* =========================================================
   DRAW HEADER
========================================================= */

function drawHeader(pdf: jsPDF, logo: string, company: typeof DEFAULT_COMPANY) {
  const pageWidth = pdf.internal.pageSize.getWidth();

  const left = 20;
  const right = pageWidth - 20;
  const top = 16;

  /*
   * Logo
   */
  pdf.addImage(logo, 'PNG', left, top, 47, 14, undefined, 'FAST');

  /*
   * Small brand line
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(6.5);

  pdf.setTextColor(BRAND.navy);

  pdf.text('BUILD. AUTOMATE. SCALE.', left, top + 19);

  /*
   * Right side company information
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(9);

  pdf.setTextColor(BRAND.navy);

  pdf.text(company.name, right, top + 3, {
    align: 'right',
  });

  pdf.setFont('helvetica', 'normal');

  pdf.setFontSize(7);

  pdf.setTextColor(BRAND.muted);

  pdf.text(company.email, right, top + 8, {
    align: 'right',
  });

  pdf.text(`${company.phone}  •  ${company.website}`, right, top + 13, {
    align: 'right',
  });

  /*
   * Main orange separator
   */
  pdf.setDrawColor(BRAND.orange);

  pdf.setLineWidth(0.65);

  pdf.line(left, top + 27, right, top + 27);

  /*
   * Small navy continuation
   */
  pdf.setDrawColor(BRAND.navy);

  pdf.setLineWidth(0.18);

  pdf.line(left, top + 29, left + 35, top + 29);
}

/* =========================================================
   DRAW FOOTER
========================================================= */

function drawFooter(
  pdf: jsPDF,
  company: typeof DEFAULT_COMPANY,
  pageNumber: number
) {
  const pageWidth = pdf.internal.pageSize.getWidth();

  const pageHeight = pdf.internal.pageSize.getHeight();

  const left = 20;
  const right = pageWidth - 20;

  const footerY = pageHeight - 17;

  /*
   * Footer separator
   */
  pdf.setDrawColor(BRAND.border);

  pdf.setLineWidth(0.3);

  pdf.line(left, footerY - 5, right, footerY - 5);

  /*
   * Company contact
   */
  pdf.setFont('helvetica', 'normal');

  pdf.setFontSize(6.8);

  pdf.setTextColor(BRAND.muted);

  pdf.text(
    `${company.email}  •  ${company.phone}  •  ${company.website}`,
    left,
    footerY
  );

  /*
   * Page number
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setTextColor(BRAND.orange);

  pdf.text(`PAGE ${pageNumber}`, right, footerY, {
    align: 'right',
  });
}

/* =========================================================
   DRAW DOCUMENT TITLE
========================================================= */

function drawDocumentTitle(pdf: jsPDF, letter: HRLetter) {
  const left = 20;
  const right = pdf.internal.pageSize.getWidth() - 20;

  /*
   * Eyebrow
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(7);

  pdf.setTextColor(BRAND.orange);

  pdf.text('OFFICIAL HR DOCUMENT', left, 59);

  /*
   * Main title
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(24);

  pdf.setTextColor(BRAND.navy);

  pdf.text('OFFER LETTER', left, 70);

  /*
   * Orange underline
   */
  pdf.setDrawColor(BRAND.orange);

  pdf.setLineWidth(1);

  pdf.line(left, 76, left + 31, 76);

  /*
   * Letter metadata panel
   */
  const boxX = 116;
  const boxY = 54;
  const boxW = right - boxX;
  const boxH = 25;

  pdf.setFillColor(BRAND.creamPanel);

  pdf.setDrawColor(BRAND.border);

  pdf.setLineWidth(0.25);

  pdf.roundedRect(boxX, boxY, boxW, boxH, 2.5, 2.5, 'FD');

  /*
   * Letter number
   */
  pdf.setFont('helvetica', 'normal');

  pdf.setFontSize(6.5);

  pdf.setTextColor(BRAND.muted);

  pdf.text('LETTER NO.', boxX + 5, boxY + 8);

  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(8);

  pdf.setTextColor(BRAND.navy);

  pdf.text(
    letter.id ? `SH-HR-${letter.id.slice(0, 8).toUpperCase()}` : 'SH-HR',
    boxX + 5,
    boxY + 13
  );

  /*
   * Date
   */
  pdf.setFont('helvetica', 'normal');

  pdf.setFontSize(6.5);

  pdf.setTextColor(BRAND.muted);

  pdf.text('ISSUED', boxX + boxW - 5, boxY + 8, {
    align: 'right',
  });

  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(8);

  pdf.setTextColor(BRAND.navy);

  pdf.text(
    letter.issuedAt
      ? new Date(letter.issuedAt).toISOString().slice(0, 10)
      : letter.variables.letter_date || '',
    boxX + boxW - 5,
    boxY + 13,
    {
      align: 'right',
    }
  );
}

/* =========================================================
   DRAW EMPLOYEE / POSITION CARD
========================================================= */

function drawPositionCard(
  pdf: jsPDF,
  letter: HRLetter,
  startY: number
): number {
  const left = 20;

  const pageWidth = pdf.internal.pageSize.getWidth();

  const right = pageWidth - 20;

  const width = right - left;

  const height = 51;

  /*
   * Outer card
   */
  pdf.setFillColor(BRAND.white);

  pdf.setDrawColor(BRAND.border);

  pdf.setLineWidth(0.3);

  pdf.roundedRect(left, startY, width, height, 3, 3, 'FD');

  /*
   * Orange vertical accent
   */
  pdf.setFillColor(BRAND.orange);

  pdf.roundedRect(left, startY, 2.2, height, 1, 1, 'F');

  /*
   * Card title
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(7);

  pdf.setTextColor(BRAND.orange);

  pdf.text('POSITION DETAILS', left + 9, startY + 10);

  /*
   * Divider
   */
  pdf.setDrawColor(BRAND.border);

  pdf.setLineWidth(0.2);

  pdf.line(left + 9, startY + 14, right - 9, startY + 14);

  const col1 = left + 9;
  const col2 = left + width / 2 + 4;

  const rows = [
    {
      y: startY + 24,
      label1: 'POSITION',
      value1: letter.employeeSnapshot.designation,
      label2: 'DEPARTMENT',
      value2: letter.employeeSnapshot.department,
    },
    {
      y: startY + 36,
      label1: 'EMPLOYMENT TYPE',
      value1: letter.employeeSnapshot.employmentType,
      label2: 'START DATE',
      value2:
        letter.variables.start_date || letter.variables.joining_date || '',
    },
    {
      y: startY + 48,
      label1: 'WORK LOCATION',
      value1: letter.variables.work_location || '—',
      label2: 'COMPENSATION',
      value2: letter.variables.salary || '—',
    },
  ];

  for (const row of rows) {
    /*
     * Left label
     */
    pdf.setFont('helvetica', 'normal');

    pdf.setFontSize(5.8);

    pdf.setTextColor(BRAND.muted);

    pdf.text(row.label1, col1, row.y - 3);

    /*
     * Left value
     */
    pdf.setFont('helvetica', 'bold');

    pdf.setFontSize(8);

    pdf.setTextColor(BRAND.navy);

    pdf.text(String(row.value1 || '—'), col1, row.y + 3);

    /*
     * Right label
     */
    pdf.setFont('helvetica', 'normal');

    pdf.setFontSize(5.8);

    pdf.setTextColor(BRAND.muted);

    pdf.text(row.label2, col2, row.y - 3);

    /*
     * Right value
     */
    pdf.setFont('helvetica', 'bold');

    pdf.setFontSize(8);

    pdf.setTextColor(row.label2 === 'COMPENSATION' ? BRAND.orange : BRAND.navy);

    pdf.text(String(row.value2 || '—'), col2, row.y + 3);
  }

  return startY + height;
}

/* =========================================================
   BODY TEXT
========================================================= */

function drawBody(
  pdf: jsPDF,
  letter: HRLetter,
  startY: number,
  footerY: number,
  watermarkLogo: string,
  logo: string,
  company: typeof DEFAULT_COMPANY
): number {
  const left = 20;

  const right = pdf.internal.pageSize.getWidth() - 20;

  let y = startY;

  /*
   * Salutation
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(11);

  pdf.setTextColor(BRAND.navy);

  pdf.text(`Dear ${letter.employeeSnapshot.name},`, left, y);

  y += 10;

  /*
   * Body paragraphs
   */
  const paragraphs = removeEmployeeIdFromLetter(letter.renderedBody).split(
    /\r?\n/
  );

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      y += 4;
      continue;
    }

    let x = left;

    const segments = formatHRLetterText(paragraph, {
      employeeName: letter.employeeSnapshot.name,

      employmentType: letter.employeeSnapshot.employmentType,

      issuedDate: letter.issuedAt
        ? new Date(letter.issuedAt).toISOString().slice(0, 10)
        : letter.variables.letter_date,
    });

    for (const segment of segments) {
      const highlighted = segment.style !== 'normal';

      pdf.setFont('helvetica', highlighted ? 'bold' : 'normal');

      pdf.setFontSize(9.5);

      pdf.setTextColor(highlighted ? BRAND.navy : BRAND.navyLight);

      const words = segment.text.match(/\S+\s*|\s+/g) || [];

      for (const word of words) {
        const output = x === left ? word.trimStart() : word;

        if (!output) continue;

        const wordWidth = pdf.getTextWidth(output);

        if (x > left && x + wordWidth > right) {
          x = left;
          y += 5.2;
        }

        /*
         * New page
         */
        if (y > footerY - 13) {
          pdf.addPage();

          drawPageBackground(pdf, watermarkLogo);

          drawHeader(pdf, logo, company);

          drawFooter(pdf, company, pdf.getNumberOfPages());

          y = 40;
          x = left;
        }

        pdf.text(output, x, y);

        x += pdf.getTextWidth(output);
      }
    }

    x = left;

    y += 5.2;
  }

  return y;
}

/* =========================================================
   SIGNATURE
========================================================= */

function drawSignature(
  pdf: jsPDF,
  company: typeof DEFAULT_COMPANY,
  startY: number,
  footerY: number,
  watermarkLogo: string,
  logo: string,
  verificationQr = ''
): number {
  const left = 20;

  /*
   * Ensure signature fits.
   */
  if (startY + 42 > footerY - 5) {
    pdf.addPage();

    drawPageBackground(pdf, watermarkLogo);

    drawHeader(pdf, logo, company);

    drawFooter(pdf, company, pdf.getNumberOfPages());

    startY = 40;
  }

  /*
   * Closing
   */
  pdf.setFont('helvetica', 'normal');

  pdf.setFontSize(9);

  pdf.setTextColor(BRAND.navyLight);

  pdf.text('Sincerely,', left, startY);

  let y = startY + 12;

  /*
   * Signature image
   */
  if (company.signatureImage) {
    pdf.addImage(company.signatureImage, 'PNG', left, y - 7, 38, 15);

    y += 10;
  }

  /*
   * Signature line
   */
  pdf.setDrawColor(BRAND.navy);

  pdf.setLineWidth(0.25);

  pdf.line(left, y + 2, left + 57, y + 2);

  /*
   * Name
   */
  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(10);

  pdf.setTextColor(BRAND.navy);

  pdf.text(company.signatoryName, left, y + 9);

  /*
   * Designation
   */
  pdf.setFont('helvetica', 'normal');

  pdf.setFontSize(8);

  pdf.setTextColor(BRAND.orange);

  pdf.text(company.signatoryDesignation, left, y + 14);

  /*
   * Company
   */
  pdf.setTextColor(BRAND.muted);

  pdf.text(company.name, left, y + 19);

  if (verificationQr) {
    const qrSize = 25;
    const qrX = pdf.internal.pageSize.getWidth() - 20 - qrSize;
    pdf.addImage(
      verificationQr,
      'PNG',
      qrX,
      startY + 3,
      qrSize,
      qrSize,
      undefined,
      'FAST'
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.5);
    pdf.setTextColor(BRAND.navy);
    pdf.text('SCAN TO VERIFY DOCUMENT', qrX + qrSize / 2, startY + 31, {
      align: 'center',
    });
  }

  return y + 24;
}

/* =========================================================
   MAIN FUNCTION
========================================================= */

export async function downloadHRLetterPdf(letter: HRLetter): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  /*
   * Load brand assets.
   */
  const logo = await getCroppedLogo();

  const watermarkLogo = await getWatermarkLogo();
  const verificationQr = letter.verificationToken
    ? await QRCode.toDataURL(
        getHRLetterVerificationUrl(letter.verificationToken),
        {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 256,
          color: { dark: BRAND.navy, light: BRAND.cream },
        }
      )
    : '';

  /*
   * Company snapshot.
   */
  const company = {
    ...DEFAULT_COMPANY,
    ...letter.companySnapshot,

    signatoryName:
      letter.companySnapshot?.signatoryName || DEFAULT_COMPANY.signatoryName,

    signatoryDesignation:
      letter.companySnapshot?.signatoryDesignation ||
      DEFAULT_COMPANY.signatoryDesignation,
  };
  if (company.signatureImage) {
    company.signatureImage = await normalizeImageToPng(company.signatureImage);
  }

  const pageHeight = pdf.internal.pageSize.getHeight();

  const footerY = pageHeight - 17;

  /* =======================================================
     PAGE 1
  ======================================================= */

  drawPageBackground(pdf, watermarkLogo);

  drawHeader(pdf, logo, company);

  drawFooter(pdf, company, 1);

  /* =======================================================
     TITLE
  ======================================================= */

  drawDocumentTitle(pdf, letter);

  /* =======================================================
     EMPLOYEE INFO
  ======================================================= */

  const employeeName = letter.employeeSnapshot.name;

  /*
   * Small recipient line.
   */
  pdf.setFont('helvetica', 'normal');

  pdf.setFontSize(7);

  pdf.setTextColor(BRAND.muted);

  pdf.text('PREPARED FOR', 20, 87);

  pdf.setFont('helvetica', 'bold');

  pdf.setFontSize(10);

  pdf.setTextColor(BRAND.navy);

  pdf.text(employeeName, 20, 94);

  /* =======================================================
     POSITION CARD
  ======================================================= */

  const cardBottom = drawPositionCard(pdf, letter, 102);

  /* =======================================================
     BODY
  ======================================================= */

  let y = drawBody(
    pdf,
    letter,
    cardBottom + 15,
    footerY,
    watermarkLogo,
    logo,
    company
  );

  /* =======================================================
     SIGNATURE
  ======================================================= */

  drawSignature(
    pdf,
    company,
    y + 7,
    footerY,
    watermarkLogo,
    logo,
    verificationQr
  );

  /* =======================================================
     FILE NAME
  ======================================================= */

  const safeName = letter.employeeSnapshot.name
    .trim()
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_|_$/g, '');

  const safeType = letter.letterType
    .trim()
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_|_$/g, '');

  const date = (
    letter.variables.letter_date || new Date().toISOString().slice(0, 10)
  ).replace(/[^0-9-]/g, '');

  pdf.save(`SiliconHubs_${safeType}_${safeName}_${date}.pdf`);
}
