'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Check,
  Clock,
  Link2,
  Share2,
  Tag,
  User,
} from 'lucide-react';

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

/* -------------------------------------------------------------------------- */
/* Content parser                                                             */
/* -------------------------------------------------------------------------- */

type ContentBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; items: string[] }
  | { type: 'numbered'; items: string[] };

function parseContent(content: string): ContentBlock[] {
  const normalized = content
    .replace(/<article>/gi, '')
    .replace(/<\/article>/gi, '')
    .replace(/\r\n/g, '\n')
    .trim();

  const lines = normalized.split('\n');
  const blocks: ContentBlock[] = [];

  let paragraphBuffer: string[] = [];
  let bulletBuffer: string[] = [];
  let numberedBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ').trim();

      if (text) {
        blocks.push({
          type: 'paragraph',
          text,
        });
      }

      paragraphBuffer = [];
    }
  };

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      blocks.push({
        type: 'bullet',
        items: [...bulletBuffer],
      });

      bulletBuffer = [];
    }
  };

  const flushNumbered = () => {
    if (numberedBuffer.length > 0) {
      blocks.push({
        type: 'numbered',
        items: [...numberedBuffer],
      });

      numberedBuffer = [];
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushBullets();
    flushNumbered();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushBullets();
      flushNumbered();
      continue;
    }

    if (line.startsWith('### ')) {
      flushAll();

      blocks.push({
        type: 'heading',
        level: 3,
        text: line.slice(4).trim(),
      });

      continue;
    }

    if (line.startsWith('## ')) {
      flushAll();

      blocks.push({
        type: 'heading',
        level: 2,
        text: line.slice(3).trim(),
      });

      continue;
    }

    if (/^[-•]\s+/.test(line)) {
      flushParagraph();
      flushNumbered();

      bulletBuffer.push(line.replace(/^[-•]\s+/, '').trim());
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      flushParagraph();
      flushBullets();

      numberedBuffer.push(line.replace(/^\d+\.\s+/, '').trim());
      continue;
    }

    flushBullets();
    flushNumbered();

    paragraphBuffer.push(line);
  }

  flushAll();

  return blocks;
}

/* -------------------------------------------------------------------------- */
/* Inline formatting                                                          */
/* -------------------------------------------------------------------------- */

function renderInlineText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-[#14213D]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="rounded-md bg-[#FFF0DD] px-1.5 py-0.5 font-mono text-[0.9em] text-[#FC4C00]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/* -------------------------------------------------------------------------- */
/* Article content                                                            */
/* -------------------------------------------------------------------------- */

function ArticleContent({ content }: { content: string }) {
  const blocks = useMemo(() => parseContent(content), [content]);

  return (
    <div className="space-y-7">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level === 2) {
            return (
              <motion.h2
                key={`${block.type}-${index}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45 }}
                className="scroll-mt-28 pt-6 text-2xl font-extrabold leading-tight tracking-tight text-[#FC4C00] sm:text-3xl"
              >
                {block.text}
              </motion.h2>
            );
          }

          return (
            <motion.h3
              key={`${block.type}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4 }}
              className="scroll-mt-28 pt-3 text-xl font-bold text-[#14213D] sm:text-2xl"
            >
              {block.text}
            </motion.h3>
          );
        }

        if (block.type === 'bullet') {
          return (
            <motion.ul
              key={`${block.type}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-3 rounded-2xl border border-[#E8D8C5] bg-[#FFF9F0] p-5 sm:p-6"
            >
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-start gap-3 text-[1rem] leading-8 text-[#334155] sm:text-[1.05rem]"
                >
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FC4C00] text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>

                  <span>{renderInlineText(item)}</span>
                </li>
              ))}
            </motion.ul>
          );
        }

        if (block.type === 'numbered') {
          return (
            <motion.ol
              key={`${block.type}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {block.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-start gap-4 rounded-2xl border border-[#E8D8C5] bg-white p-5 shadow-[0_8px_30px_rgba(20,33,61,0.04)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-sm font-bold text-white">
                    {itemIndex + 1}
                  </span>

                  <span className="pt-0.5 text-[1rem] leading-8 text-[#334155] sm:text-[1.05rem]">
                    {renderInlineText(item)}
                  </span>
                </li>
              ))}
            </motion.ol>
          );
        }

        return (
          <motion.p
            key={`${block.type}-${index}`}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4 }}
            className="text-[1rem] leading-8 text-[#334155] sm:text-[1.08rem]"
          >
            {renderInlineText(block.text)}
          </motion.p>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function BlogDetailClient({
  initialBlog,
}: BlogDetailClientProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);

  const blog = initialBlog;

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const res = await fetch(
          `/api/blogs?category=${encodeURIComponent(blog.category)}&limit=4`
        );

        if (!res.ok) return;

        const data = await res.json();

        setRelatedBlogs(
          data.filter((item: BlogPost) => item.slug !== blog.slug).slice(0, 3)
        );
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

  const sharePost = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8F1E6] text-[#14213D]">
      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                               */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative border-b border-[#E8D8C5] bg-[#FFF7EA]">
        <div className="mx-auto max-w-7xl px-5 pb-10 pt-8 sm:px-6 sm:pb-14 lg:px-8">
          {/* Back navigation */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
          >
            <Link
              href="/blog"
              className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[#E8D8C5] bg-white px-4 py-2 text-sm font-semibold text-[#14213D] shadow-sm transition-all duration-300 hover:-translate-x-1 hover:border-[#FC4C00]/40 hover:text-[#FC4C00]"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          </motion.div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center rounded-full border border-[#FC4C00]/20 bg-[#FFF0DD] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#FC4C00]">
                  {blog.category}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.55 }}
                className="mt-6 max-w-4xl text-4xl font-black leading-[1.08] tracking-[-0.03em] text-[#14213D] sm:text-5xl lg:text-6xl"
              >
                {blog.title}
              </motion.h1>

              {blog.excerpt && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.5 }}
                  className="mt-6 max-w-2xl text-base leading-7 text-[#5F6368] sm:text-lg sm:leading-8"
                >
                  {blog.excerpt}
                </motion.p>
              )}

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.5 }}
                className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#5F6368]"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#FC4C00]" />
                  <span className="font-medium text-[#14213D]">
                    {blog.author}
                  </span>
                </span>

                <span className="hidden h-4 w-px bg-[#D9C8B5] sm:block" />

                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#FC4C00]" />
                  {formatDate(blog.publishedAt)}
                </span>

                <span className="hidden h-4 w-px bg-[#D9C8B5] sm:block" />

                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#FC4C00]" />
                  {blog.readTime || 5} min read
                </span>
              </motion.div>

              {/* Share */}
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.5 }}
                onClick={sharePost}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#14213D] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#14213D]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FC4C00]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Link Copied
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    Share Article
                  </>
                )}
              </motion.button>
            </div>

            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.65 }}
              className="relative"
            >
              <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[#FC4C00]/10 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-[#14213D]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-2 shadow-[0_25px_70px_rgba(20,33,61,0.12)]">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-[#FFE8C1]">
                  {blog.coverImage || blog.thumbnail ? (
                    <Image
                      src={blog.coverImage || blog.thumbnail}
                      alt={blog.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#FFE8C1]">
                      <span className="text-lg font-bold text-[#FC4C00]">
                        SiliconHubs
                      </span>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#14213D]/10 via-transparent to-[#FC4C00]/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Article area                                                       */}
      {/* ------------------------------------------------------------------ */}

      <section className="px-5 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,820px)_280px] lg:items-start lg:gap-14">
          {/* Main article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="min-w-0"
          >
            <div className="rounded-[2rem] border border-[#E8D8C5] bg-white px-5 py-8 shadow-[0_15px_50px_rgba(20,33,61,0.05)] sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              {/* Article intro */}
              <div className="mb-10 border-b border-[#EEE3D6] pb-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FC4C00]">
                  <span className="h-2 w-2 rounded-full bg-[#FC4C00]" />
                  SiliconHubs Insights
                </div>

                <p className="mt-4 text-sm leading-6 text-[#6B7280]">
                  Practical insights, strategies and digital solutions for
                  growing businesses.
                </p>
              </div>

              <ArticleContent content={blog.content} />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-14 border-t border-[#EEE3D6] pt-8">
                  <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#14213D]">
                    <Tag className="h-4 w-4 text-[#FC4C00]" />
                    Topics
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#E8D8C5] bg-[#FFF9F0] px-3.5 py-2 text-xs font-semibold text-[#14213D] transition-all duration-300 hover:border-[#FC4C00]/40 hover:bg-[#FFF0DD] hover:text-[#FC4C00]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#14213D] p-7 text-white sm:p-10"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FC4C00]/20 blur-2xl" />
              <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#FC4C00]/10 blur-2xl" />

              <div className="relative">
                <span className="inline-flex rounded-full bg-[#FC4C00] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                  SiliconHubs
                </span>

                <h2 className="mt-5 max-w-2xl text-2xl font-extrabold leading-tight sm:text-3xl">
                  Ready to build a smarter digital presence?
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                  Explore modern digital solutions for websites, AI automation,
                  eCommerce, SEO, digital marketing and business growth.
                </p>

                <Link
                  href="https://www.siliconhubs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-7 inline-flex items-center gap-2 rounded-full bg-[#FC4C00] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ff6428] hover:shadow-lg hover:shadow-[#FC4C00]/20"
                >
                  Explore SiliconHubs
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          </motion.article>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24">
            <div className="space-y-5">
              {/* Quick info */}
              <div className="rounded-3xl border border-[#E8D8C5] bg-white p-6 shadow-[0_12px_35px_rgba(20,33,61,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FC4C00]">
                  Article Info
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#FFF0DD] p-2">
                      <User className="h-4 w-4 text-[#FC4C00]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#6B7280]">Written by</p>
                      <p className="mt-0.5 text-sm font-bold text-[#14213D]">
                        {blog.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#FFF0DD] p-2">
                      <Calendar className="h-4 w-4 text-[#FC4C00]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#6B7280]">Published</p>
                      <p className="mt-0.5 text-sm font-bold text-[#14213D]">
                        {formatDate(blog.publishedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-[#FFF0DD] p-2">
                      <Clock className="h-4 w-4 text-[#FC4C00]" />
                    </div>

                    <div>
                      <p className="text-xs text-[#6B7280]">Reading time</p>
                      <p className="mt-0.5 text-sm font-bold text-[#14213D]">
                        {blog.readTime || 5} minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share card */}
              <div className="rounded-3xl border border-[#E8D8C5] bg-[#FFF9F0] p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-[#14213D]">
                  <Link2 className="h-4 w-4 text-[#FC4C00]" />
                  Enjoyed this article?
                </div>

                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  Share it with someone who may find it useful.
                </p>

                <button
                  onClick={sharePost}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#14213D] px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#FC4C00]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Link Copied
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      Share Article
                    </>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Related posts                                                      */}
      {/* ------------------------------------------------------------------ */}

      {relatedBlogs.length > 0 && (
        <section className="border-t border-[#E8D8C5] bg-[#FFF7EA] px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#FC4C00]">
                  Keep Reading
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#14213D] sm:text-4xl">
                  Related <span className="text-[#FC4C00]">Articles</span>
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280] sm:text-base">
                  Continue exploring insights and practical ideas from
                  SiliconHubs.
                </p>
              </div>

              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 text-sm font-bold text-[#14213D] transition-colors hover:text-[#FC4C00]"
              >
                View all articles
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.article
                  key={relatedBlog._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                >
                  <Link
                    href={
                      relatedBlog.slug ? `/blog/${relatedBlog.slug}` : '/blog'
                    }
                    className="group block h-full"
                  >
                    <div className="duration-400 h-full overflow-hidden rounded-3xl border border-[#E8D8C5] bg-white shadow-[0_12px_35px_rgba(20,33,61,0.04)] transition-all hover:-translate-y-1.5 hover:border-[#FC4C00]/30 hover:shadow-[0_20px_50px_rgba(20,33,61,0.09)]">
                      <div className="relative aspect-[16/9] overflow-hidden bg-[#FFE8C1]">
                        {relatedBlog.thumbnail || relatedBlog.coverImage ? (
                          <Image
                            src={
                              relatedBlog.thumbnail ||
                              relatedBlog.coverImage ||
                              ''
                            }
                            alt={relatedBlog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="font-bold text-[#FC4C00]">
                              SiliconHubs
                            </span>
                          </div>
                        )}

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#FC4C00] shadow-sm">
                            {relatedBlog.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-3 flex items-center gap-2 text-xs text-[#7A7F87]">
                          <Calendar className="h-3.5 w-3.5 text-[#FC4C00]" />
                          {formatDate(relatedBlog.publishedAt)}
                        </div>

                        <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-[#14213D] transition-colors group-hover:text-[#FC4C00]">
                          {relatedBlog.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#6B7280]">
                          {relatedBlog.excerpt}
                        </p>

                        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#FC4C00]">
                          Read article
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Bottom brand strip                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section className="bg-[#14213D] px-5 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-lg font-extrabold text-white">
              Silicon<span className="text-[#FC4C00]">Hubs</span>
            </p>
            <p className="mt-1 text-xs text-white/55">
              Digital Solutions for Growing Businesses
            </p>
          </div>

          <Link
            href="https://www.siliconhubs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-[#FC4C00]"
          >
            Build. Automate. Grow.
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
