'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Hash } from 'lucide-react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ channel, messages, onSend }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Channel Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 flex-shrink-0">
        <Hash size={16} className="text-white/40" />
        <span className="text-white font-semibold text-sm">{channel.name}</span>
        <span className="text-white/30 text-xs ml-1">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channel.name}...`}
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] text-sm transition"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 bg-[#0977a8] hover:bg-[#0977a8]/80 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition flex-shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
        <p className="text-white/20 text-[10px] mt-1.5 px-1">Press Enter to send</p>
      </div>
    </div>
  );
}
