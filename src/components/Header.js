'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

function getPageTitle(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1 && segments[0] === 'dashboard') return 'Dashboard';
  const last = segments[segments.length - 1];
  const titles = {
    blocks: 'Content Blocks',
    blogs: 'Blog Posts',
    new: 'New Blog Post',
    tasks: 'Tasks',
    calendar: 'Calendar',
    chat: 'Chat',
    admin: 'Admin Panel',
  };
  return titles[last] || last.charAt(0).toUpperCase() + last.slice(1);
}

export default function Header() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className="flex items-center justify-between bg-white border-b border-gray-200 px-6 flex-shrink-0"
      style={{ height: 64 }}
    >
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
