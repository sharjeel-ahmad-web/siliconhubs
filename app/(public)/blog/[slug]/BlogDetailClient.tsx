'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Tag, User, Share2 } from 'lucide-react';
import { Timeline } from '@/components/ui/timeline-animation';

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

interface BlogDetailClientProps {
  initialBlog: BlogPost;
}

// Parse blog content into timeline sections
function BlogTimeline({ content }: { content: string }) {
  const timelineData = useMemo(() => {
    const sections: { title: string; content: React.ReactNode }[] = [];
    const parts = content.split(/^# /m).filter(Boolean);

    parts.forEach((part) => {
      const lines = part.split('\n');
      const title = lines[0]?.trim() || 'Section';
      const sectionContent = lines.slice(1).join('\n').trim();

      sections.push({
        title,
        content: (
          <div className="space-y-4 text-slate-300">
            {sectionContent.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h3
                    key={idx}
                    className="mb-3 mt-6 text-xl font-bold text-white"
                  >
                    {paragraph.slice(3)}
                  </h3>
                );
              }
              if (paragraph.startsWith('### ')) {
                return (
                  <h4
                    key={idx}
                    className="mb-2 mt-4 text-lg font-semibold text-[#37AFE1]"
                  >
                    {paragraph.slice(4)}
                  </h4>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={idx} className="ml-4 space-y-2">
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 text-[#F58122]">✓</span>
                        <span>{item.slice(2)}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.trim()) {
                return (
                  <p key={idx} className="leading-relaxed text-slate-300">
                    {paragraph}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ),
      });
    });

    // If no sections found, create a single section
    if (sections.length === 0) {
      sections.push({
        title: 'Content',
        content: (
          <div className="leading-relaxed text-slate-300">{content}</div>
        ),
      });
    }

    return sections;
  }, [content]);

  return <Timeline data={timelineData} />;
}

export default function BlogDetailClient({ initialBlog }: BlogDetailClientProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const blog = initialBlog;

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const res = await fetch(`/api/blogs?category=${blog.category}&limit=3`);
        if (res.ok) {
          const data = await res.json();
          setRelatedBlogs(
            data.filter((b: BlogPost) => b.slug !== blog.slug).slice(0, 3)
          );
        }
      } catch (error) {
        console.error('Error fetching related blogs:', error);
      }
    };
    fetchRelatedBlogs();
  }, [blog.category, blog.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative px-6 pb-20 pt-32">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {blog.coverImage || blog.thumbnail ? (
            <>
              <Image
                src={blog.coverImage || blog.thumbnail}
                alt={blog.title}
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-[#37AFE1]/10 to-black" />
          )}
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-[#37AFE1]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Category */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-block rounded-full bg-[#37AFE1] px-4 py-1 text-sm font-medium text-white"
          >
            {blog.category}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
          >
            {blog.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-slate-400"
          >
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {blog.readTime || 5} min read
            </span>
            <button
              onClick={sharePost}
              className="flex items-center gap-2 transition-colors hover:text-[#37AFE1]"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </motion.div>
        </div>
      </section>

      {/* Content with Timeline */}
      <section className="py-12">
        <BlogTimeline content={blog.content} />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mx-auto max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 border-t border-slate-800 pt-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Tag className="h-4 w-4 text-slate-500" />
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="cursor-pointer rounded-full bg-[#1E293B] px-3 py-1 text-sm text-slate-300 transition-colors hover:bg-[#37AFE1]/20 hover:text-[#37AFE1]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* Related Posts */}
      {relatedBlogs.length > 0 && (
        <section className="bg-[#0F172A] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 text-center text-3xl font-bold text-white"
            >
              Related <span className="text-[#37AFE1]">Posts</span>
            </motion.h2>

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.article
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={relatedBlog?.slug ? `/blog/${relatedBlog.slug}` : '/blog'}>
                    <div className="group overflow-hidden rounded-xl border border-slate-800 bg-[#1E293B]/50 transition-all duration-300 hover:border-[#37AFE1]/50">
                      <div className="relative h-40 overflow-hidden">
                        {relatedBlog.thumbnail ? (
                          <Image
                            src={relatedBlog.thumbnail}
                            alt={relatedBlog.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-[#37AFE1]/20 to-[#F58122]/20" />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="line-clamp-2 text-lg font-semibold text-white transition-colors group-hover:text-[#37AFE1]">
                          {relatedBlog.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                          {relatedBlog.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

