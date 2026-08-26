'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { useSiteContent } from '@/lib/hooks/useSiteContent';
import {
  getCloudinaryUrl,
  isExternalUrl,
} from '@/components/ui/cloudinary-image';
import { StarButton } from '@/components/ui/star-button';
import { ParticleWrapper } from '@/components/ui/particle-button';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  category: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Derive array once; guard against API returning object or non-array
  const blogList: BlogPost[] = Array.isArray(blogs) ? blogs : [];

  // Fetch CMS content
  const { content: sectionContent } = useSiteContent<{
    eyebrow?: string;
    title?: string;
    titleHighlight?: string;
    subtitle?: string;
  }>('home', 'blog');

  // Default values
  const eyebrow = sectionContent?.eyebrow || 'Latest Insights';
  const title = sectionContent?.title || 'From Our';
  const titleHighlight = sectionContent?.titleHighlight || 'Blog';
  const subtitle =
    sectionContent?.subtitle ||
    'Stay updated with the latest trends, tips, and insights in web development and digital marketing.';

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?limit=4');
      const data = await res.json();
      if (!res.ok) {
        setBlogs([]);
        return;
      }
      const list = Array.isArray(data)
        ? data
        : Array.isArray((data as { blogs?: unknown })?.blogs)
          ? (data as { blogs: BlogPost[] }).blogs
          : Array.isArray((data as { data?: unknown })?.data)
            ? (data as { data: BlogPost[] }).data
            : [];
      setBlogs(list);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="bg-navy px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="container mx-auto flex max-w-7xl justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-cyan/30 border-t-[#06b6d4]" />
        </div>
      </section>
    );
  }

  if (blogList.length === 0) {
    return null;
  }

  const featuredBlog = blogList.find((b) => b.featured) || blogList[0];
  const otherBlogs = blogList
    .filter((b) => b._id !== featuredBlog._id)
    .slice(0, 3);

  return (
    <section className="bg-navy px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-cyan/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-orange/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto max-w-7xl">
        {/* Section Header */}
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          titleHighlight={titleHighlight}
          subtitle={subtitle}
        />

        {/* Blog Grid - Unique Bento Layout - responsive */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Featured Post - Large Card */}
          <motion.article
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group lg:row-span-2"
          >
            <Link
              href={featuredBlog?.slug ? `/blog/${featuredBlog.slug}` : '/blog'}
            >
              <div className="relative h-full min-h-[500px] overflow-hidden rounded-3xl border border-slate-800 transition-all duration-500 hover:border-cyan/50">
                {/* Background Image */}
                <div className="absolute inset-0">
                  {featuredBlog.thumbnail ? (
                    <Image
                      src={
                        isExternalUrl(featuredBlog.thumbnail)
                          ? featuredBlog.thumbnail
                          : getCloudinaryUrl(featuredBlog.thumbnail, {
                              width: 800,
                              height: 600,
                            })
                      }
                      alt={featuredBlog.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-cyan/30 to-orange/30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-full bg-orange px-3 py-1 text-xs font-bold text-white">
                      FEATURED
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur-sm">
                      {featuredBlog.category}
                    </span>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white transition-colors group-hover:text-cyan md:text-3xl">
                    {featuredBlog.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-slate-300">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(featuredBlog.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredBlog.readTime || 5} min
                    </span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </div>
            </Link>
          </motion.article>

          {/* Other Posts - Smaller Cards */}
          <div className="space-y-6">
            {otherBlogs.map((blog, index) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={blog?.slug ? `/blog/${blog.slug}` : '/blog'}>
                  <div className="flex gap-5 rounded-2xl border border-slate-800/50 bg-navy/30 p-4 transition-all duration-300 hover:border-cyan/30 hover:bg-navy/50">
                    {/* Thumbnail */}
                    <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl">
                      {blog.thumbnail ? (
                        <Image
                          src={
                            isExternalUrl(blog.thumbnail)
                              ? blog.thumbnail
                              : getCloudinaryUrl(blog.thumbnail, {
                                  width: 200,
                                  height: 200,
                                })
                          }
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-cyan/20 to-orange/20" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-medium text-cyan">
                        {blog.category}
                      </span>
                      <h4 className="mb-2 mt-1 line-clamp-2 font-semibold text-white transition-colors group-hover:text-cyan">
                        {blog.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(blog.publishedAt)}</span>
                        <span>•</span>
                        <span>{blog.readTime || 5} min read</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center">
                      <ArrowRight className="h-5 w-5 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-cyan" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>

        {/* View All Button - responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <ParticleWrapper>
            <Link href="/blog">
              <StarButton
                className="h-10 px-6 text-sm font-semibold transition-transform hover:scale-105 sm:h-12 sm:px-8 sm:text-base"
                duration={2.5}
              >
                View All Posts
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </StarButton>
            </Link>
          </ParticleWrapper>
        </motion.div>
      </div>
    </section>
  );
}
