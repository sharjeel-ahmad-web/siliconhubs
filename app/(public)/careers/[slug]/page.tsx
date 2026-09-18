import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/db/mongodb';
import StructuredData from '@/components/seo/StructuredData';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { generateJobPostingSchema } from '@/lib/seo/structuredData';
import {
  getBaseUrl,
  isJobOpen,
  serializeId,
  toPublicJob,
} from '@/lib/careers/helpers';
import JobDetailClient from './JobDetailClient';
import { CareerJob } from '@/types/careers';

interface PageProps {
  params: { slug: string };
  searchParams?: { preview?: string };
}

async function fetchJobForPage(slug: string, previewKey?: string) {
  const db = await connectDB();
  const job = await db.collection('jobs').findOne({ slug });
  if (!job) return null;

  const isPreview =
    previewKey && job.previewKey && previewKey === job.previewKey;
  if (!isPreview && !isJobOpen(job)) return null;

  return { job: toPublicJob(serializeId(job)!) as CareerJob, isPreview };
}

/** Dynamic, unique metadata per job — no duplicates, canonical + social. */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  try {
    const result = await fetchJobForPage(params.slug);
    if (!result) {
      return { title: 'Position Not Found | SiliconHubs Careers' };
    }
    const job = result.job;
    const title = job.seoTitle || `${job.title} at SiliconHubs | Careers`;
    const description =
      job.seoDescription ||
      job.shortDescription ||
      job.description?.replace(/<[^>]*>/g, '').slice(0, 160) ||
      `Apply for the ${job.title} position at SiliconHubs.`;

    return {
      title,
      description,
      keywords: [
        job.department,
        job.employmentType,
        job.experienceLevel,
        ...(job.skills || []),
      ]
        .filter(Boolean)
        .join(', '),
      openGraph: {
        title,
        description,
        url: `${baseUrl}/careers/${job.slug}`,
        siteName: 'SiliconHubs',
        type: 'website',
        images: job.featuredImage
          ? [
              {
                url: job.featuredImage,
                width: 1200,
                height: 630,
                alt: job.title,
              },
            ]
          : [`${baseUrl}/og-image.jpg`],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: job.featuredImage
          ? [job.featuredImage]
          : [`${baseUrl}/og-image.jpg`],
      },
      alternates: {
        canonical: `${baseUrl}/careers/${job.slug}`,
      },
      robots: { index: true, follow: true },
    };
  } catch (error) {
    console.error('Error generating job metadata:', error);
    return { title: 'Careers at SiliconHubs' };
  }
}

export default async function JobDetailPage({
  params,
  searchParams,
}: PageProps) {
  const baseUrl = getBaseUrl();
  const previewKey = searchParams?.preview;

  try {
    const result = await fetchJobForPage(params.slug, previewKey);
    if (!result) notFound();

    const job = result.job;
    const jobUrl = `${baseUrl}/careers/${job.slug}`;
    const postedDate =
      job.publishedAt || job.createdAt
        ? new Date(job.publishedAt || job.createdAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    // JobPosting schema — only fields actually available on the job.
    const jobSchema = generateJobPostingSchema({
      title: job.title,
      description:
        job.shortDescription ||
        job.description?.replace(/<[^>]*>/g, '').slice(0, 400) ||
        job.title,
      url: jobUrl,
      datePosted: postedDate,
      validThrough: job.closingDate
        ? new Date(job.closingDate).toISOString().split('T')[0]
        : undefined,
      employmentType: job.employmentType || undefined,
      experienceLevel: job.experienceLevel || undefined,
      location: job.location || undefined,
      city: job.city || undefined,
      country: job.country || undefined,
      remoteStatus: job.remoteStatus || undefined,
      salary: job.salary || undefined,
      skills: job.skills || undefined,
      featuredImage: job.featuredImage || undefined,
    });

    return (
      <>
        <StructuredData schema={jobSchema} />
        <BreadcrumbSchema
          items={[
            { name: 'Careers', url: `${baseUrl}/careers` },
            { name: job.title, url: jobUrl },
          ]}
        />
        <JobDetailClient job={job} isPreview={result.isPreview} />
      </>
    );
  } catch (error) {
    console.error('Error fetching job:', error);
    notFound();
  }
}
