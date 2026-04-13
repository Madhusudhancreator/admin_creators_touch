'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllBlogs, deleteBlog } from '@/lib/api';
import { Plus, Trash2, RefreshCw, ExternalLink, Pencil } from 'lucide-react';

export default function BlogsPage() {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {blogs.length} post{blogs.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <Link
            href="/dashboard/blogs/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0977a8] text-white text-sm font-semibold hover:bg-[#0977a8]/90 transition"
          >
            <Plus size={16} />
            New Post
          </Link>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-gray-400 py-10 text-center">Loading…</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-4 shadow-sm"
            >
              {/* Thumbnail */}
              {blog.social_image && (
                <img
                  src={blog.social_image}
                  alt={blog.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  {blog.cached_tag_list && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0977a8]/10 text-[#0977a8]">
                      {blog.cached_tag_list}
                    </span>
                  )}
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    blog.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">{blog.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(blog.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                  {blog.reading_time > 0 && ` · ${blog.reading_time} min read`}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`/blog/${blog.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Preview on frontend"
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <ExternalLink size={15} />
                </a>
                <Link
                  href={`/dashboard/blogs/${blog.id}`}
                  title="Edit"
                  className="p-2 rounded-lg text-gray-400 hover:text-[#0977a8] hover:bg-[#0977a8]/10 transition"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(blog.id, blog.title)}
                  disabled={deleting === blog.id}
                  title="Delete"
                  className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          {blogs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400 mb-3">No blog posts yet.</p>
              <Link
                href="/dashboard/blogs/new"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0977a8] hover:underline"
              >
                <Plus size={14} /> Create your first post
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
