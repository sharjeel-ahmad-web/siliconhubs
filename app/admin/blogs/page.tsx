'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, Search } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
    coverImage: '',
    author: 'Rising Dot Team',
    category: 'Development',
    tags: '',
    featured: false,
    published: false,
  });

  const categories = [
    'Development',
    'Design',
    'Marketing',
    'Technology',
    'Business',
    'Tutorial',
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blogs');
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBlog
        ? `/api/admin/blogs/${editingBlog._id}`
        : '/api/admin/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (res.ok) {
        fetchBlogs();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const togglePublish = async (blog: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blog, published: !blog.published }),
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
    }
  };

  const toggleFeatured = async (blog: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...blog, featured: !blog.featured }),
      });
      if (res.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const openEditModal = async (blog: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog._id}`);
      const fullBlog = await res.json();
      setEditingBlog(blog);
      setFormData({
        title: fullBlog.title,
        excerpt: fullBlog.excerpt,
        content: fullBlog.content,
        thumbnail: fullBlog.thumbnail,
        coverImage: fullBlog.coverImage || '',
        author: fullBlog.author,
        category: fullBlog.category,
        tags: fullBlog.tags?.join(', ') || '',
        featured: fullBlog.featured,
        published: fullBlog.published,
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  const resetForm = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      thumbnail: '',
      coverImage: '',
      author: 'Rising Dot Team',
      category: 'Development',
      tags: '',
      featured: false,
      published: false,
    });
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
          <p className="mt-1 text-slate-400">Manage your blog content</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-[#37AFE1] px-4 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
        >
          <Plus className="h-5 w-5" />
          New Post
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-[#1E293B] py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:border-[#37AFE1] focus:outline-none"
        />
      </div>

      {/* Blog List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#37AFE1]/30 border-t-[#37AFE1]" />
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p>No blog posts found. Create your first post!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="flex items-center gap-4 rounded-xl border border-slate-700/50 bg-[#1E293B] p-4"
            >
              <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-700">
                {blog.thumbnail && (
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="truncate font-semibold text-white">
                    {blog.title}
                  </h3>
                  {blog.featured && (
                    <Star className="h-4 w-4 fill-[#F58122] text-[#F58122]" />
                  )}
                </div>
                <p className="truncate text-sm text-slate-400">
                  {blog.excerpt}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded bg-[#37AFE1]/20 px-2 py-1 text-xs text-[#37AFE1]">
                    {blog.category}
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      blog.published
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-slate-600/50 text-slate-400'
                    }`}
                  >
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(blog)}
                  className={`rounded-lg p-2 transition-colors ${
                    blog.featured
                      ? 'bg-[#F58122]/20 text-[#F58122]'
                      : 'bg-slate-700 text-slate-400 hover:text-[#F58122]'
                  }`}
                  title={
                    blog.featured ? 'Remove from featured' : 'Mark as featured'
                  }
                >
                  <Star className="h-5 w-5" />
                </button>
                <button
                  onClick={() => togglePublish(blog)}
                  className={`rounded-lg p-2 transition-colors ${
                    blog.published
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400 hover:text-green-400'
                  }`}
                  title={blog.published ? 'Unpublish' : 'Publish'}
                >
                  {blog.published ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(blog)}
                  className="rounded-lg bg-slate-700 p-2 text-slate-300 transition-colors hover:bg-[#37AFE1] hover:text-white"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="rounded-lg bg-slate-700 p-2 text-slate-300 transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-[#1E293B]">
            <div className="border-b border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="Brief description of the post..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={10}
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 font-mono text-sm text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="Write your blog content here... (Supports Markdown)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Thumbnail URL
                  </label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                    placeholder="/media/blog/my-post/thumbnail.jpg"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                    placeholder="/media/blog/my-post/cover.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-700 bg-[#0F172A] px-4 py-2 text-white focus:border-[#37AFE1] focus:outline-none"
                  placeholder="nextjs, react, web development"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-600 text-[#F58122] focus:ring-[#F58122]"
                  />
                  <span className="text-slate-300">Featured Post</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-600 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-slate-300">Publish Now</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-slate-300 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#37AFE1] px-6 py-2 text-white transition-colors hover:bg-[#37AFE1]/80"
                >
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
