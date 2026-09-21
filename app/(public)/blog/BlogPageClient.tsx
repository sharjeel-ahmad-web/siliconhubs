'use client';

/**
 * If you see "filteredBlogs.map is not a function": this file was updated and
 * no longer uses filteredBlogs. You're running a cached build. Fix: stop the
 * dev server, run "npm run clean", then "npm run dev", and hard-refresh /blog.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Hero1 } from '@/components/ui/hero-1';
import { useSiteContent } from '@/lib/hooks/useSiteContent';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
}

interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
}

interface FilterContent {
  categories: string[];
  activeColor: string;
}

interface EmptyStateContent {
  title: string;
  subtitle: string;
}

// Default content
const defaultHeroContent: HeroContent = {
  eyebrow: 'Our Blog',
  title: 'Insights & Ideas',
  subtitle:
    'Discover the latest trends, tips, and insights in web development, design, and digital marketing.',
  ctaLabel: 'Latest Posts',
  ctaHref: '#posts',
};

const defaultFilterContent: FilterContent = {
  categories: [
    'All',
    'Development',
    'Design',
    'Marketing',
    'Technology',
    'Business',
    'Tutorial',
  ],
  activeColor: '#F4511E',
};

const defaultEmptyStateContent: EmptyStateContent = {
  title: 'No blog posts found in this category.',
  subtitle: 'Check back soon for new content!',
};

function toBlogList(value: unknown): BlogPost[] {
  return Array.isArray(value) ? value : [];
}

export default function BlogPageClient() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch CMS content
  const { content: heroContent } = useSiteContent<HeroContent>('blog', 'hero');
  const { content: filterContent } = useSiteContent<FilterContent>(
    'blog',
    'filter'
  );
  const { content: emptyStateContent } = useSiteContent<EmptyStateContent>(
    'blog',
    'emptyState'
  );

  // Use CMS content with fallback to defaults; ensure arrays for .map() safety
  const hero = heroContent || defaultHeroContent;
  const filter = filterContent || defaultFilterContent;
  const emptyState = emptyStateContent || defaultEmptyStateContent;
  const categoryList: string[] = Array.isArray(filter?.categories)
    ? filter.categories
    : defaultFilterContent.categories;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
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

  const blogList = toBlogList(blogs);
  const filtered =
    selectedCategory === 'All'
      ? blogList
      : blogList.filter((blog) => blog.category === selectedCategory);
  const listToRender = toBlogList(filtered);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF4E6] text-[#14213D]">
      {/* Hero Section - Uses CMS content with fallback */}
      <Hero1
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
        ctaLabel={hero.ctaLabel}
        ctaHref={hero.ctaHref}
      />

      {/* Blog Content */}
      <section id="posts" className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Category Filter - Uses CMS content with fallback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-wrap justify-center gap-3"
          >
            {categoryList.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'text-white shadow-lg'
                    : 'bg-[#FFEDD7] text-[#5F6368] hover:text-[#14213D]'
                }`}
                style={
                  selectedCategory === category
                    ? {
                        backgroundColor: filter.activeColor,
                        boxShadow: `0 10px 15px -3px ${filter.activeColor}4D`,
                      }
                    : {}
                }
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Blog Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F4511E]/30 border-t-[#F4511E]" />
            </div>
          ) : listToRender.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="text-lg text-slate-400">{emptyState.title}</p>
              <p className="mt-2 text-slate-500">{emptyState.subtitle}</p>
            </motion.div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {toBlogList(listToRender).map((blog, index) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={blog?.slug ? `/blog/${blog.slug}` : '/blog'}>
                    <div className="overflow-hidden rounded-2xl border border-[#E8D8C5] bg-white/70 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#F4511E]/50 hover:shadow-xl hover:shadow-[#F4511E]/10">
                      {/* Thumbnail */}
                      <div className="relative h-52 overflow-hidden">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#14213D]/70 to-transparent" />
                        {blog.thumbnail ? (
                          <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-[#14213D] to-[#F4511E]" />
                        )}
                        <span className="absolute left-4 top-4 z-20 rounded-full bg-[#F4511E] px-3 py-1 text-xs font-medium text-white">
                          {blog.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-[#14213D] transition-colors group-hover:text-[#F4511E]">
                          {blog.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-sm text-[#5F6368]">
                          {blog.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-[#7C756E]">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(blog.publishedAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {blog.readTime || 5} min read
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#F4511E] transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
