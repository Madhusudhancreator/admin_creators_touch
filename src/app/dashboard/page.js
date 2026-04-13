'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles';
import { fetchAllBlogs, deleteBlog } from '@/lib/api';
import {
  Newspaper,
  Plus,
  ArrowRight,
  TrendingUp,
  Pencil,
  Trash2,
  RefreshCw,
  Inbox,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  async function loadBlogs() {
    setLoading(true);
    try {
      const data = await fetchAllBlogs();
      setBlogs(data);
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

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

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ── Welcome ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-white/50 mt-1 flex items-center gap-2">
            Signed in as&nbsp;
            <span
              className="text-sm font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: ROLE_COLORS[user.role] + '22',
                color: ROLE_COLORS[user.role],
                border: `1px solid ${ROLE_COLORS[user.role]}44`,
              }}
            >
              {ROLE_LABELS[user.role]}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <TrendingUp size={16} />
          <span>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => router.push('/dashboard/blogs/new')}
            className="bg-[#0977a8] rounded-xl p-5 flex items-center justify-between hover:bg-[#0977a8]/90 transition text-left group"
          >
            <div className="flex items-center gap-3">
              <Plus size={20} className="text-white" />
              <span className="text-white font-semibold">New Blog Post</span>
            </div>
            <ArrowRight size={16} className="text-white/60 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push('/dashboard/blogs')}
            className="bg-[#112236] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:border-white/20 hover:bg-[#1a2f4a] transition text-left group"
          >
            <div className="flex items-center gap-3">
              <Newspaper size={20} className="text-[#0977a8]" />
              <span className="text-white font-medium">Manage Blogs</span>
            </div>
            <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => router.push('/dashboard/contacts')}
            className="bg-[#112236] border border-white/10 rounded-xl p-5 flex items-center justify-between hover:border-white/20 hover:bg-[#1a2f4a] transition text-left group"
          >
            <div className="flex items-center gap-3">
              <Inbox size={20} className="text-[#cc0066]" />
              <span className="text-white font-medium">View Contacts</span>
            </div>
            <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* ── Blog Posts ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Blog Posts</h2>
          <button
            onClick={loadBlogs}
            className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/80 transition"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {loading && (
          <div className="text-sm text-white/30 py-10 text-center">Loading…</div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="bg-[#112236] border border-dashed border-white/10 rounded-xl py-14 text-center">
            <p className="text-white/30 text-sm mb-3">No blog posts yet.</p>
            <Link
              href="/dashboard/blogs/new"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0977a8] hover:underline"
            >
              <Plus size={14} /> Create your first post
            </Link>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="space-y-2">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-center gap-4 bg-[#112236] border border-white/10 rounded-xl px-5 py-4 hover:border-white/20 transition"
              >
                {/* Thumbnail */}
                {blog.social_image ? (
                  <img
                    src={blog.social_image}
                    alt={blog.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-white/5"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Newspaper size={18} className="text-white/20" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {blog.cached_tag_list && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0977a8]/15 text-[#0977a8]">
                        {blog.cached_tag_list.split(',')[0].trim()}
                      </span>
                    )}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      blog.published ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-white/40'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{blog.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {new Date(blog.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                    {blog.reading_time > 0 && ` · ${blog.reading_time} min read`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/dashboard/blogs/${blog.id}`}
                    title="Edit"
                    className="p-2 rounded-lg text-white/30 hover:text-[#0977a8] hover:bg-[#0977a8]/10 transition"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(blog.id, blog.title)}
                    disabled={deleting === blog.id}
                    title="Delete"
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
