'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import ChatWindow from './ChatWindow';
import { Hash, MessageSquare } from 'lucide-react';

const MOCK_CHANNELS = [
  {
    id: 'general',
    name: 'General',
    unread: 2,
    messages: [
      {
        id: 1,
        sender: 'Jordan Lee',
        content: 'Good morning everyone! Ready for the sprint?',
        timestamp: '2026-04-10T08:30:00Z',
        isSelf: false,
      },
      {
        id: 2,
        sender: 'Alex Rivera',
        content: 'Morning! Yes, I have the design files ready to review.',
        timestamp: '2026-04-10T08:32:00Z',
        isSelf: false,
      },
      {
        id: 3,
        sender: 'Sam Chen',
        content: 'Same here. SEO audit is almost wrapped up.',
        timestamp: '2026-04-10T08:45:00Z',
        isSelf: false,
      },
      {
        id: 4,
        sender: 'You',
        content: "Perfect. Let's sync at 10am.",
        timestamp: '2026-04-10T08:47:00Z',
        isSelf: true,
      },
    ],
  },
  {
    id: 'design',
    name: 'Design Team',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'Alex Rivera',
        content: 'Just pushed the updated brand kit to Figma.',
        timestamp: '2026-04-09T14:20:00Z',
        isSelf: false,
      },
      {
        id: 2,
        sender: 'You',
        content: 'Looks great! The new color palette is much cleaner.',
        timestamp: '2026-04-09T14:35:00Z',
        isSelf: true,
      },
      {
        id: 3,
        sender: 'Alex Rivera',
        content: 'Thanks! I added the motion guidelines too.',
        timestamp: '2026-04-09T14:40:00Z',
        isSelf: false,
      },
    ],
  },
  {
    id: 'dev',
    name: 'Dev Team',
    unread: 1,
    messages: [
      {
        id: 1,
        sender: 'Sam Chen',
        content: 'Deployed the blocks API updates to staging.',
        timestamp: '2026-04-10T09:00:00Z',
        isSelf: false,
      },
      {
        id: 2,
        sender: 'You',
        content: 'Nice work! Any issues with the write queue?',
        timestamp: '2026-04-10T09:05:00Z',
        isSelf: true,
      },
      {
        id: 3,
        sender: 'Sam Chen',
        content: 'All good. The mutex is working perfectly.',
        timestamp: '2026-04-10T09:10:00Z',
        isSelf: false,
      },
    ],
  },
];

export default function ChatLayout() {
  const { user } = useAuth();
  const [channels, setChannels] = useState(MOCK_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('general');

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  function handleSelectChannel(id) {
    setActiveChannelId(id);
    // Clear unread on selection
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  }

  function handleSend(text) {
    if (!text.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: user?.name || 'You',
      content: text,
      timestamp: new Date().toISOString(),
      isSelf: true,
    };
    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannelId
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      )
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-160px)] min-h-[500px]">
      <div className="flex h-full bg-[#112236] border border-white/10 rounded-xl overflow-hidden">
        {/* Channel List */}
        <div
          className="flex flex-col border-r border-white/10 flex-shrink-0"
          style={{ width: 240 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
            <MessageSquare size={16} className="text-[#0977a8]" />
            <span className="text-white font-semibold text-sm">Messages</span>
          </div>

          {/* Channels */}
          <div className="flex-1 overflow-y-auto py-2">
            {channels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleSelectChannel(channel.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition ${
                  channel.id === activeChannelId
                    ? 'bg-[#0977a8]/15 text-white'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Hash size={14} className="flex-shrink-0" />
                <span className="flex-1 text-sm font-medium truncate">{channel.name}</span>
                {channel.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#cc0066] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {channel.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 min-w-0">
          <ChatWindow
            channel={activeChannel}
            messages={activeChannel.messages}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  );
}
