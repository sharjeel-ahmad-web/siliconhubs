import { connectDB } from '@/lib/db/mongodb';

interface VerificationRecord {
  letterNumber?: string;
  letterType?: string;
  status?: string;
  issuedAt?: Date | string;
  companySnapshot?: { name?: string };
}

export const dynamic = 'force-dynamic';

export default async function VerifyHRLetterPage({
  params,
}: {
  params: { token: string };
}) {
  let record: VerificationRecord | null = null;
  let serviceUnavailable = false;

  if (/^[a-f0-9]{64}$/i.test(params.token)) {
    try {
      const db = await connectDB();
      record = await db.collection<VerificationRecord>('hrLetters').findOne(
        {
          verificationToken: params.token.toLowerCase(),
        },
        {
          projection: {
            letterNumber: 1,
            letterType: 1,
            status: 1,
            issuedAt: 1,
            companySnapshot: 1,
          },
        }
      );
    } catch (error) {
      console.error('[verify/hr-letter]', error);
      serviceUnavailable = true;
    }
  }

  const verified =
    Boolean(record?.issuedAt) &&
    (record?.status === 'Issued' || record?.status === 'Archived');
  const title = serviceUnavailable
    ? 'Verification temporarily unavailable'
    : verified
      ? 'Official SiliconHubs HR document'
      : record?.status === 'Generated'
        ? 'Document not yet issued'
        : record
          ? 'Document is not valid'
          : 'Document not found';
  const message = serviceUnavailable
    ? 'Please try scanning this code again later.'
    : verified
      ? 'This HR document was issued by SiliconHubs.'
      : record?.status === 'Generated'
        ? 'This document exists in our system but has not been officially issued.'
        : 'We could not verify this document as an officially issued SiliconHubs record.';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF8EC] px-5 py-12 text-[#0A192F]">
      <section className="w-full max-w-xl rounded-3xl border border-[#E7D8C5] bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-6 flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
              verified
                ? 'bg-emerald-100 text-emerald-700'
                : serviceUnavailable
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
            }`}
          >
            {verified ? '✓' : serviceUnavailable ? '!' : '×'}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#F4511E]">
              SiliconHubs document verification
            </p>
            <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          </div>
        </div>
        <p className="leading-7 text-[#24364D]">{message}</p>
        {record && (
          <dl className="mt-7 grid gap-4 rounded-2xl bg-[#FFF9F0] p-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Document
              </dt>
              <dd className="mt-1 font-semibold">{record.letterType}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Reference
              </dt>
              <dd className="mt-1 font-semibold">{record.letterNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Issued by
              </dt>
              <dd className="mt-1 font-semibold">
                {record.companySnapshot?.name || 'SiliconHubs'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Issued on
              </dt>
              <dd className="mt-1 font-semibold">
                {record.issuedAt
                  ? new Date(record.issuedAt).toISOString().slice(0, 10)
                  : 'Not issued'}
              </dd>
            </div>
          </dl>
        )}
        <p className="mt-7 border-t border-[#E7D8C5] pt-5 text-xs leading-5 text-slate-500">
          This page verifies the document&apos;s issue status only. It does not
          display employee personal information.
        </p>
      </section>
    </main>
  );
}
