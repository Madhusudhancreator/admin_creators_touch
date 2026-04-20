'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  MessageSquare,
  Newspaper,
  Inbox,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Blogs',     icon: Newspaper,       href: '/dashboard/blogs' },
  { label: 'Contacts',  icon: Inbox,           href: '/dashboard/contacts' },
  { label: 'Members',   icon: Users,           href: '/dashboard/members', adminOnly: true },
  { label: 'Tasks',     icon: CheckSquare,     href: '/dashboard/tasks',    disabled: true },
  { label: 'Calendar',  icon: Calendar,        href: '/dashboard/calendar', disabled: true },
  { label: 'Chat',      icon: MessageSquare,   href: '/dashboard/chat',     disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = NAV_ITEMS.filter((item) => {
    if (item.adminOnly && user?.role !== 'admin') return false;
    return true;
  });

  function isActive(href) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <aside
      className="flex flex-col h-full bg-[#0d1b2e] border-r border-white/10 flex-shrink-0"
      style={{ width: 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <Image
          src="/creator_touch_logo.png"
          alt="CTG"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.disabled) {
            return (
              <div
                key={item.href}
                title="Coming soon"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium opacity-35 cursor-not-allowed select-none"
              >
                <Icon size={18} className="text-white/40" />
                <span className="text-white/40">{item.label}</span>
                <span className="ml-auto text-[10px] text-white/25 border border-white/15 rounded px-1.5 py-0.5">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-[#0977a8] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={active ? 'text-white' : 'text-white/50'} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      {user && (
        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 py-2 mb-1">
            <p className="text-white/80 text-xs font-medium truncate">{user.name}</p>
            <p className="text-white/30 text-[10px] truncate">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
