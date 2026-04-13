'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback } from 'react';

// ── Toolbar button ───────────────────────────────────────────────────────────
function ToolBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`
        px-2 py-1 rounded text-sm transition-colors select-none
        ${active
          ? 'bg-[#0977a8] text-white'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}
        ${disabled ? 'opacity-30 cursor-default' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-gray-200 mx-0.5 self-center" />;
}

// ── Main editor ──────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Placeholder.configure({
        placeholder: placeholder || 'Write your post content here…',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rich-editor-content focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. when editing loads the saved content)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && value !== undefined) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url  = window.prompt('Enter URL', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#0977a8]/30 focus-within:border-[#0977a8]">

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">

        {/* History */}
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">↩</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">↪</ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive('heading', { level: 4 })} title="Heading 4">H4</ToolBtn>

        <Divider />

        {/* Inline marks */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><strong>B</strong></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><em>I</em></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><span style={{ textDecoration: 'underline' }}>U</span></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code"><code className="text-xs">`c`</code></ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">• List</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">1. List</ToolBtn>

        <Divider />

        {/* Block types */}
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">&quot; &quot;</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">&lt;/&gt;</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">—</ToolBtn>

        <Divider />

        {/* Link */}
        <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Insert link">🔗</ToolBtn>
        {editor.isActive('link') && (
          <ToolBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">✕ link</ToolBtn>
        )}
      </div>

      {/* ── Editor area ── */}
      <div className="px-4 py-3 min-h-[280px] bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* Word count */}
      <div className="px-4 py-1.5 border-t border-gray-100 bg-gray-50 text-right">
        <span className="text-[10px] text-gray-400">
          {editor.storage.characterCount?.words?.() ??
            editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      <style>{`
        .rich-editor-content { min-height: 260px; }
        .rich-editor-content p { margin-bottom: 0.85em; color: #374151; font-size: 0.875rem; line-height: 1.7; }
        .rich-editor-content p:last-child { margin-bottom: 0; }
        .rich-editor-content h2 { font-size: 1.25rem; font-weight: 700; color: #111827; margin: 1.2em 0 0.4em; }
        .rich-editor-content h3 { font-size: 1.1rem; font-weight: 600; color: #111827; margin: 1em 0 0.35em; }
        .rich-editor-content h4 { font-size: 0.95rem; font-weight: 600; color: #374151; margin: 0.9em 0 0.3em; }
        .rich-editor-content strong { font-weight: 700; }
        .rich-editor-content em { font-style: italic; }
        .rich-editor-content u  { text-decoration: underline; }
        .rich-editor-content s  { text-decoration: line-through; }
        .rich-editor-content code { background: #f3f4f6; border-radius: 3px; padding: 0.1em 0.35em; font-family: monospace; font-size: 0.82em; color: #cc0066; }
        .rich-editor-content pre  { background: #1e293b; border-radius: 8px; padding: 1em 1.2em; overflow-x: auto; margin: 0.75em 0; }
        .rich-editor-content pre code { background: transparent; color: #e2e8f0; font-size: 0.82em; padding: 0; }
        .rich-editor-content blockquote { border-left: 3px solid #0977a8; padding-left: 1em; color: #6b7280; font-style: italic; margin: 0.75em 0; }
        .rich-editor-content ul { list-style: disc; padding-left: 1.4em; margin: 0.6em 0; }
        .rich-editor-content ol { list-style: decimal; padding-left: 1.4em; margin: 0.6em 0; }
        .rich-editor-content li { margin-bottom: 0.25em; color: #374151; font-size: 0.875rem; }
        .rich-editor-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.2em 0; }
        .rich-editor-content a  { color: #0977a8; text-decoration: underline; }
        .tiptap p.is-editor-empty:first-child::before { color: #9ca3af; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
      `}</style>
    </div>
  );
}
