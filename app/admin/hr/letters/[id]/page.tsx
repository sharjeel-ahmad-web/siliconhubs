import HRLetterDetailPage from '@/components/admin/hr-letters/HRLetterDetailPage';

export default async function HRLetterRecordPage({
  params,
}: {
  params: { id: string };
}) {
  return <HRLetterDetailPage id={params.id} />;
}
