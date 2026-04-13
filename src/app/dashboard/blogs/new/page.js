'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBlog } from '@/lib/api';
import { ArrowLeft, Save, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import TagInput from '@/components/TagInput';

// Load TipTap editor client-side only (no SSR)
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

// Estimate reading time from HTML string (avg 200 wpm)
function calcReadingTime(html) {
  const text  = html.replace(/<[^>]+>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function NewBlogPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title:         '',
    tags:          '',
    description:   '',
    body_html:     '',
    social_image:  '',
    canonical_url: '',
    reading_time:  '',
    published:     false,
  });
  const [autoTime, setAutoTime] = useState(null); // auto-calculated reading time
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState(null);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // Recalculate reading time whenever body changes
  useEffect(() => {
    if (!form.body_html) { setAutoTime(null); return; }
    setAutoTime(calcReadingTime(form.body_html));
  }, [form.body_html]);

  async function handleSave() {
    setError(null);
    if (!form.title.trim()) { setError('Title is required.'); return; }

    setSaving(true);
    try {
      const rt = form.reading_time
        ? parseInt(form.reading_time, 10)
        : (autoTime ?? 1);

      await createBlog({
        title:         form.title,
        tags:          form.tags,
        description:   form.description,
        body_html:     form.body_html,
        body_markdown: form.body_html, // store HTML in markdown field too for compatibility
        social_image:  form.social_image,
        canonical_url: form.canonical_url,
        reading_time:  rt,
        published:     form.published,
      });
      router.push('/dashboard/blogs');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/dashboard/blogs')}
          className="text-gray-400 hover:text-gray-700 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details and save to the database.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
          {error}
        </div>
      )}

      <div className="space-y-5">

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Why First Impressions Matter..."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0977a8]/30 focus:border-[#0977a8]"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Tags
          </label>
          <TagInput value={form.tags} onChange={(v) => setField('tags', v)} />
          <p className="text-[10px] text-gray-400 mt-1">Press Enter or comma to add a tag.</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="A short summary shown on the blog listing page…"
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#0977a8]/30 focus:border-[#0977a8]"
          />
        </div>

        {/* Social image */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Cover Image URL
          </label>
          <input
            type="url"
            value={form.social_image}
            onChange={(e) => setField('social_image', e.target.value)}
            placeholder="https://images.unsplash.com/…"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0977a8]/30 focus:border-[#0977a8]"
          />
          {form.social_image && (
            <img
              src={form.social_image}
              alt="preview"
              className="mt-2 h-36 w-full object-cover rounded-lg bg-gray-100"
            />
          )}
        </div>

        {/* Canonical URL + Reading time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              Canonical URL <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="url"
              value={form.canonical_url}
              onChange={(e) => setField('canonical_url', e.target.value)}
              placeholder="https://yoursite.com/blog/…"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0977a8]/30 focus:border-[#0977a8]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              Reading Time (min)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={form.reading_time}
                onChange={(e) => setField('reading_time', e.target.value)}
                placeholder={autoTime ? String(autoTime) : '5'}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0977a8]/30 focus:border-[#0977a8]"
              />
              <Clock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {autoTime && !form.reading_time && (
              <p className="text-[10px] text-gray-400 mt-1">Auto: {autoTime} min</p>
            )}
          </div>
        </div>

        {/* Rich text body */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Body
          </label>
          <RichTextEditor
            value={form.body_html}
            onChange={(html) => setField('body_html', html)}
            placeholder="Write your post content here…"
          />
        </div>

        {/* Published toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setField('published', !form.published)}
            className={`relative w-10 h-5 rounded-full transition-colors ${
              form.published ? 'bg-[#0977a8]' : 'bg-gray-200'
            }`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              form.published ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
          <span className="text-sm text-gray-600">
            {form.published ? 'Published' : 'Save as draft'}
          </span>
        </div>

        {/* Save */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0977a8] text-white text-sm font-semibold hover:bg-[#0977a8]/90 disabled:opacity-50 transition"
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Save Post'}
          </button>
        </div>

      </div>
    </div>
  );
}
