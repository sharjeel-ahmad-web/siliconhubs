'use client';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { createElement } from 'react';
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import HRLetterDocument from '@/components/admin/hr-letters/HRLetterDocument';
import type { HRLetter } from '@/lib/hr-letters/types';

const LETTER_WIDTH_PX = 794;
const IMAGE_LOAD_TIMEOUT_MS = 15_000;

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete) {
    return image.naturalWidth > 0
      ? Promise.resolve()
      : Promise.reject(new Error('A letter image could not be loaded.'));
  }

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('A letter image took too long to load.'));
    }, IMAGE_LOAD_TIMEOUT_MS);

    const cleanup = () => {
      window.clearTimeout(timeout);
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('A letter image could not be loaded.'));
    };

    image.addEventListener('load', onLoad, { once: true });
    image.addEventListener('error', onError, { once: true });
  });
}

async function waitForLetterAssets(
  element: HTMLElement,
  hasVerificationToken: boolean
): Promise<void> {
  const deadline = Date.now() + IMAGE_LOAD_TIMEOUT_MS;
  let verificationImage: HTMLImageElement | null = null;

  while (hasVerificationToken && !verificationImage) {
    verificationImage = element.querySelector<HTMLImageElement>(
      'img[alt^="Scan to verify"]'
    );
    if (verificationImage) break;
    if (Date.now() >= deadline) {
      throw new Error('The verification QR code could not be generated.');
    }
    await new Promise((resolve) => window.setTimeout(resolve, 50));
  }

  if (verificationImage) {
    await waitForImage(verificationImage);
  }
  await Promise.all(
    Array.from(element.querySelectorAll('img'))
      .filter((image) => image !== verificationImage)
      .map(waitForImage)
  );
  await document.fonts.ready;
}

function createLetterRender(letter: HRLetter): {
  element: HTMLElement;
  containerId: string;
  cleanup: () => void;
} {
  const container = document.createElement('div');
  const containerId = `hr-letter-pdf-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
  container.id = containerId;
  container.setAttribute('aria-hidden', 'true');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = `${LETTER_WIDTH_PX}px`;
  container.style.pointerEvents = 'none';
  container.style.visibility = 'hidden';
  container.style.zIndex = '2147483647';
  document.body.appendChild(container);

  const root: Root = createRoot(container);
  flushSync(() => {
    root.render(createElement(HRLetterDocument, { letter }));
  });

  const element = container.querySelector<HTMLElement>('.hr-letter-paper');
  if (!element) {
    root.unmount();
    container.remove();
    throw new Error('Could not render the HR letter for PDF download.');
  }

  container.querySelectorAll('img').forEach((image) => {
    image.loading = 'eager';
  });

  return {
    element,
    containerId,
    cleanup: () => {
      root.unmount();
      container.remove();
    },
  };
}

export async function downloadHRLetterPdf(
  letter: HRLetter,
  displayedLetter?: HTMLElement
): Promise<void> {
  const rendered = displayedLetter ? undefined : createLetterRender(letter);
  const element = displayedLetter || rendered?.element;
  if (!element) {
    throw new Error('Could not find the HR letter to export.');
  }

  try {
    element.querySelectorAll('img').forEach((image) => {
      image.loading = 'eager';
    });
    await waitForLetterAssets(element, Boolean(letter.verificationToken));

    const canvas = await html2canvas(element, {
      backgroundColor: '#FFF8EC',
      logging: false,
      scale: Math.min(Math.max(window.devicePixelRatio || 1, 2), 3),
      useCORS: true,
      windowWidth: LETTER_WIDTH_PX,
      width: element.scrollWidth,
      height: element.scrollHeight,
      onclone: (clonedDocument) => {
        if (!rendered) return;
        const clonedContainer = clonedDocument.getElementById(
          rendered.containerId
        );
        if (!clonedContainer) {
          throw new Error('Could not prepare the HR letter for PDF download.');
        }
        clonedContainer.style.visibility = 'visible';
      },
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const scale = Math.min(
      pageWidth / canvas.width,
      pageHeight / canvas.height
    );
    const imageWidth = canvas.width * scale;
    const imageHeight = canvas.height * scale;
    const image = canvas.toDataURL('image/jpeg', 0.96);

    pdf.addImage(
      image,
      'JPEG',
      (pageWidth - imageWidth) / 2,
      (pageHeight - imageHeight) / 2,
      imageWidth,
      imageHeight,
      undefined,
      'FAST'
    );

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
  } finally {
    rendered?.cleanup();
  }
}
