'use client';

import { useState, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * TagInput — pill-based tag input.
 *
 * Props:
 *   value    : string   comma-separated tag string (e.g. "Branding, SEO")
 *   onChange : fn(string) called with updated comma-separated string
 */
export default function TagInput({ value, onChange }) {
  const tags    = value ? value.split(',').map((t) => t.trim()).filter(Boolean) : [];
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  function addTag(raw) {
    const tag = raw.trim();
    if (!tag || tags.includes(tag)) { setInput(''); return; }
    onChange([...tags, tag].join(', '));
    setInput('');
  }

  function removeTag(index) {
    const next = tags.filter((_, i) => i !== index);
    onChange(next.join(', '));
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div
      className="flex flex-wrap gap-1.5 items-center border border-gray-200 rounded-lg px-3 py-2 min-h-[42px] cursor-text focus-within:ring-2 focus-within:ring-[#0977a8]/30 focus-within:border-[#0977a8] bg-white"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[#0977a8]/10 text-[#0977a8]"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(i); }}
            className="hover:text-red-500 transition-colors"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={tags.length === 0 ? 'Add tags… (press Enter or comma)' : ''}
        className="flex-1 min-w-[120px] text-sm text-gray-800 outline-none bg-transparent placeholder:text-gray-400"
      />
    </div>
  );
}
