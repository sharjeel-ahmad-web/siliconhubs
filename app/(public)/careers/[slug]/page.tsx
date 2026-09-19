import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMetaTags } from '@/lib/seo/getMetaTags';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import StructuredData from '@/components/seo/StructuredData';
import { getPublishedJobBySlug } from '@/lib/careers/data';
import { generateJobPostingSchema } from '@/lib/seo/structuredData';
import { getJobSchemaDescription } from '@/lib/careers/helpers';
import JobDetailClient from './JobDetailClient';
import { CareerJob } from '@/types/careers';

interface Props {
  params: { slug: string };
  searchParams: { preview?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getPublishedJobBySlug(params.slug);
  const base = await getMetaTags(`/careers/${params.slug}`);
  if (!job) return base;
  return {
    ...base,
    title: job.seoTitle || job.title,
    description: job.seoDescription || job.shortDescription,
  };
}

export default async function JobDetailPage({ params, searchParams }: Props) {
  const job = await getPublishedJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  const preview = searchParams.preview || '';
  const isPreview = preview && job.previewKey && preview === job.previewKey;

  const schema = generateJobPostingSchema({
    title: job.title,
    description: getJobSchemaDescription(job),
    url: `/careers/${job.slug}`,
    datePosted: job.publishedAt ? new Date(job.publishedAt).toISOString() : '',
    validThrough: job.closingDate
      ? new Date(job.closingDate).toISOString()
      : undefined,
    employmentType: job.employmentType || undefined,
    experienceLevel: job.experienceLevel || undefined,
    location: job.location || undefined,
    city: job.city || undefined,
    country: job.country || undefined,
    remoteStatus: job.remoteStatus || undefined,
    salary: job.salary || undefined,
    skills: Array.isArray(job.skills) ? job.skills : undefined,
    featuredImage: undefined,
  });

  return (
    <>
      {schema && <StructuredData schema={schema} />}
      <BreadcrumbSchema
        items={[
          { name: 'Careers', url: '/careers' },
          { name: job.title, url: `/careers/${job.slug}` },
        ]}
      />
      <JobDetailClient job={job} />
      {isPreview && (
        <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
          <div className="rounded-lg bg-[#FFEDD7] px-4 py-3 text-sm text-[#8A7E72]">
            This is a preview of a draft job posting.
          </div>
        </div>
      )}
    </>
  );
}
