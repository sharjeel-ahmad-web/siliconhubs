'use client';

import Image from 'next/image';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { DEFAULT_COMPANY, type HRLetter } from '@/lib/hr-letters/types';
import {
  formatHRLetterText,
  type HRLetterTextStyle,
} from '@/lib/hr-letters/letter-format';
import { getHRLetterVerificationUrl } from '@/lib/hr-letters/verification';

export default function HRLetterDocument({ letter }: { letter: HRLetter }) {
  const [verificationQr, setVerificationQr] = useState('');
  const company = {
    ...DEFAULT_COMPANY,
    ...letter.companySnapshot,
    signatoryName:
      letter.companySnapshot?.signatoryName ?? DEFAULT_COMPANY.signatoryName,
    signatoryDesignation:
      letter.companySnapshot?.signatoryDesignation ||
      DEFAULT_COMPANY.signatoryDesignation,
  };
  useEffect(() => {
    if (!letter.verificationToken) {
      setVerificationQr('');
      return;
    }

    let active = true;
    QRCode.toDataURL(getHRLetterVerificationUrl(letter.verificationToken), {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: { dark: '#0A192F', light: '#FFF9F0' },
    })
      .then((dataUrl) => {
        if (active) setVerificationQr(dataUrl);
      })
      .catch((error: unknown) => {
        console.error(
          'Failed to generate the HR-letter verification QR.',
          error
        );
        if (active) setVerificationQr('');
      });

    return () => {
      active = false;
    };
  }, [letter.verificationToken]);

  const textStyle = (style: HRLetterTextStyle) => {
    if (
      style === 'employeeName' ||
      style === 'employmentType' ||
      style === 'issuedDate'
    ) {
      return 'font-bold text-[#0A192F]';
    }
    return '';
  };

  return (
    <article className="hr-letter-paper relative isolate mx-auto flex min-h-[1123px] w-full max-w-[794px] flex-col overflow-hidden bg-[#FFF8EC] px-7 py-8 text-[#14213D] shadow-2xl sm:px-14 sm:py-12 print:min-h-0 print:max-w-none print:bg-[#FFF8EC] print:px-12 print:py-10 print:shadow-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[54%] z-0 aspect-square w-[96%] -translate-x-1/2 -translate-y-1/2"
      >
        <Image
          src="/logos/siliconhubs logo icon.png"
          alt=""
          fill
          sizes="650px"
          className="object-contain opacity-[0.045] mix-blend-multiply"
        />
      </div>

      <header className="relative z-10 flex items-center justify-center border-b-[3px] border-[#F4511E] pb-5">
        <div className="relative h-14 w-36 shrink-0 overflow-hidden sm:h-16 sm:w-48">
          <Image
            src="/logos/Siliconhubs main logo.png"
            alt="SiliconHubs"
            fill
            sizes="192px"
            className="object-cover"
            style={{ objectPosition: 'center 47%' }}
            priority
          />
        </div>
      </header>

      <div className="relative z-10 mt-9 flex flex-wrap items-start justify-between gap-4 border-y border-[#F4511E]/20 py-4 text-sm">
        <div>
          <p className="font-bold text-[#F4511E]">{letter.renderedSubject}</p>
          <p className="mt-1 text-xs text-[#14213D]/65">
            Reference: {letter.letterNumber}
          </p>
        </div>
        <div className="flex gap-5 text-right">
          <p className="text-xs text-[#14213D]/70">
            <span className="block font-semibold uppercase tracking-wide">
              Employment type
            </span>
            <span className="mt-1 block font-bold text-[#0A192F]">
              {letter.employeeSnapshot.employmentType}
            </span>
          </p>
          <p className="whitespace-nowrap text-xs text-[#14213D]/70">
            <span className="block font-semibold uppercase tracking-wide">
              Issued on
            </span>
            <span className="mt-1 block font-bold text-[#0A192F]">
              {letter.issuedAt
                ? new Date(letter.issuedAt).toISOString().slice(0, 10)
                : letter.variables.letter_date}
            </span>
          </p>
        </div>
      </div>

      <section className="relative z-10 mt-8 flex-1 whitespace-pre-wrap break-words text-[15px] leading-7 text-[#14213D]">
        {formatHRLetterText(letter.renderedBody, {
          employeeName: letter.employeeSnapshot.name,
          employmentType: letter.employeeSnapshot.employmentType,
          issuedDate: letter.issuedAt
            ? new Date(letter.issuedAt).toISOString().slice(0, 10)
            : letter.variables.letter_date,
        }).map((segment, index) => (
          <span className={textStyle(segment.style)} key={index}>
            {segment.text}
          </span>
        ))}
      </section>

      <div className="relative z-10 mb-5 mt-8 max-w-xs">
        {company.signatureImage && (
          <Image
            src={company.signatureImage}
            alt="Authorized signature"
            width={200}
            height={80}
            unoptimized
            className="mb-1 max-h-16 max-w-48 object-contain object-left"
          />
        )}
        <div className="w-56 border-t border-[#14213D]/50 pt-2">
          {company.signatoryName && (
            <p className="font-bold text-[#14213D]">{company.signatoryName}</p>
          )}
          <p className="text-sm font-semibold text-[#F4511E]">
            {company.signatoryDesignation}
          </p>
          <p className="text-xs text-[#14213D]/70">{company.name}</p>
        </div>
      </div>

      <footer className="relative z-10 mt-auto flex items-end justify-between gap-4 border-t border-[#F4511E]/40 pt-4 text-xs leading-5 text-[#14213D]/70">
        <div className="text-left">
          {company.address && <p>{company.address}</p>}
          <p>
            {company.email} · {company.phone} · {company.website}
          </p>
        </div>
        {letter.verificationToken && (
          <div className="flex shrink-0 flex-col items-center text-center text-[9px] leading-3 text-[#0A192F]">
            {verificationQr ? (
              <Image
                src={verificationQr}
                alt="Scan to verify this HR letter was issued by SiliconHubs"
                width={76}
                height={76}
                unoptimized
                className="h-[76px] w-[76px]"
              />
            ) : (
              <span className="flex h-[76px] w-[76px] items-center justify-center">
                Preparing QR…
              </span>
            )}
            <span className="mt-1 max-w-[92px] font-semibold">
              Scan to verify letter
            </span>
          </div>
        )}
      </footer>
    </article>
  );
}
