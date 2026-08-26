import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import clientPromise from '@/lib/db/mongodb';
import StructuredData from '@/modules/core/components/seo/StructuredData';
import BreadcrumbSchema from '@/modules/core/components/seo/BreadcrumbSchema';
import { generateArticleSchema } from '@/lib/seo/structuredData';
import BlogDetailClient from './BlogDetailClient';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  coverImage?: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
}

// Generate metadata for SEO - fetches blog data on server
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const client = await clientPromise;
    const db = client.db('silicon-hubs');

    const blog = await db
      .collection<BlogPost>('blogs')
      .findOne({ slug: params.slug, published: true });

    if (!blog) {
      return {
        title: 'Blog Post Not Found | Silicon Hubs',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';

    return {
      title: `${blog.title} | Silicon Hubs Blog`,
      description: blog.excerpt || blog.content.substring(0, 160),
      keywords: blog.tags?.join(', ') || '',
      authors: [{ name: blog.author }],
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.content.substring(0, 160),
        type: 'article',
        publishedTime: blog.publishedAt,
        authors: [blog.author],
        tags: blog.tags || [],
        images: blog.coverImage || blog.thumbnail
          ? [
              {
                url: blog.coverImage || blog.thumbnail,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ]
          : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt || blog.content.substring(0, 160),
        images: blog.coverImage || blog.thumbnail ? [blog.coverImage || blog.thumbnail] : [],
      },
      alternates: {
        canonical: `${baseUrl}/blog/${blog.slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Silicon Hubs',
      description: 'Read our latest blog post.',
    };
  }
}

// Server Component - SEO optimized with server-side data fetching
export default async function SingleBlogPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const client = await clientPromise;
    const db = client.db('silicon-hubs');

    const blog = await db
      .collection<BlogPost>('blogs')
      .findOne({ slug: params.slug, published: true });

    if (!blog) {
      notFound();
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://siliconhubs.agency';
    const blogUrl = `${baseUrl}/blog/${blog.slug}`;

    // Generate Article schema
    const articleSchema = generateArticleSchema({
      title: blog.title,
      description: blog.excerpt,
      image: blog.coverImage || blog.thumbnail,
      publishedAt: blog.publishedAt,
      updatedAt: (blog as any).updatedAt,
      author: blog.author,
      url: blogUrl,
      category: blog.category,
      tags: blog.tags,
    });

    // Generate breadcrumb schema
    const breadcrumbItems = [
      { name: 'Blog', url: `${baseUrl}/blog` },
      { name: blog.title, url: blogUrl },
    ];

    return (
      <>
        <StructuredData schema={articleSchema} />
        <BreadcrumbSchema items={breadcrumbItems} />
        <BlogDetailClient initialBlog={blog as BlogPost} />
      </>
    );
  } catch (error) {
    console.error('Error fetching blog:', error);
    notFound();
  }
}
