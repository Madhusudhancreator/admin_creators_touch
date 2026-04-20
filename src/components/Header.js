'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles';

function getPageTitle(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1 && segments[0] === 'dashboard') return 'Dashboard';
  const last = segments[segments.length - 1];
  const titles = {
    blocks:   'Content Blocks',
    blogs:    'Blog Posts',
    contacts: 'Contacts',
    members:  'Members',
    new:      'New Blog Post',
    tasks:    'Tasks',
    calendar: 'Calendar',
    chat:     'Chat',
    admin:    'Admin Panel',
  };
  return titles[last] || last.charAt(0).toUpperCase() + last.slice(1);
}

export default function Header() {
  const pathname = usePathname();
  const title    = getPageTitle(pathname);
  const { user } = useAuth();

  return (
    <header
      className="flex items-center justify-between bg-white border-b border-gray-200 px-6 flex-shrink-0"
      style={{ height: 64 }}
    >
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition">
          <Bell size={20} />
        </button>

        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: ROLE_COLORS[user.role] || '#0977a8' }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-800 leading-none">{user.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: ROLE_COLORS[user.role] || '#0977a8' }}>
                {ROLE_LABELS[user.role] || user.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
