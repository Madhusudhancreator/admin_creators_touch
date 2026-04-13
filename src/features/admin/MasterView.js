'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles';
import {
  Crown,
  Users,
  CheckSquare,
  CalendarDays,
  MessageSquare,
  Activity,
  Server,
  Database,
  ShieldCheck,
} from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: 'Jordan Lee', role: 'master', email: 'jordan@ctg.com', lastActive: '2 min ago', taskCount: 8 },
  { id: 2, name: 'Taylor Smith', role: 'premium', email: 'taylor@ctg.com', lastActive: '15 min ago', taskCount: 5 },
  { id: 3, name: 'Alex Rivera', role: 'standard', email: 'alex@ctg.com', lastActive: '1 hr ago', taskCount: 6 },
  { id: 4, name: 'Sam Chen', role: 'employee', email: 'sam@ctg.com', lastActive: '30 min ago', taskCount: 4 },
  { id: 5, name: 'Morgan Blake', role: 'employee', email: 'morgan@ctg.com', lastActive: '3 hrs ago', taskCount: 3 },
];

export default function MasterView() {
  const [health, setHealth] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await apiFetch('/api/health');
        setHealth({ ok: true, status: data.status });
      } catch {
        setHealth({ ok: false, status: 'unreachable' });
      } finally {
        setHealthLoading(false);
      }
    }
    checkHealth();
  }, []);

  const stats = [
    { label: 'Total Users', value: 12, icon: Users, color: '#0977a8' },
    { label: 'Active Tasks', value: 18, icon: CheckSquare, color: '#f59e0b' },
    { label: 'Meetings Today', value: 3, icon: CalendarDays, color: '#cc0066' },
    { label: 'Messages Today', value: 47, icon: MessageSquare, color: '#6366f1' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-amber-500/10">
          <Crown size={28} className="text-amber-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Master Dashboard</h1>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              MASTER
            </span>
          </div>
          <p className="text-white/50 text-sm mt-0.5">
            You have full access to all data and settings.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#112236] border border-white/10 rounded-xl p-5 hover:border-white/20 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <Icon size={18} style={{ color: stat.color }} />
                <span className="text-white/50 text-sm">{stat.label}</span>
              </div>
              <p className="text-white text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Team Activity */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-[#0977a8]" />
          <h2 className="text-lg font-semibold text-white">Team Activity</h2>
        </div>
        <div className="bg-[#112236] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-white/40 font-medium">Member</th>
                <th className="text-left px-5 py-3 text-white/40 font-medium">Role</th>
                <th className="text-left px-5 py-3 text-white/40 font-medium">Last Active</th>
                <th className="text-right px-5 py-3 text-white/40 font-medium">Tasks</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u, i) => (
                <tr
                  key={u.id}
                  className={`${
                    i < MOCK_USERS.length - 1 ? 'border-b border-white/5' : ''
                  } hover:bg-white/3 transition`}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: ROLE_COLORS[u.role] }}
                      >
                        {u.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{u.name}</p>
                        <p className="text-white/30 text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: ROLE_COLORS[u.role] + '22',
                        color: ROLE_COLORS[u.role],
                      }}
                    >
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white/40 text-xs">{u.lastActive}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-white font-semibold">{u.taskCount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Overview */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Server size={18} className="text-[#cc0066]" />
          <h2 className="text-lg font-semibold text-white">System Overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Backend Health */}
          <div className="bg-[#112236] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Activity size={16} className="text-white/40" />
              <span className="text-white/60 text-sm">Backend Health</span>
            </div>
            {healthLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#0977a8] border-t-transparent rounded-full animate-spin" />
                <span className="text-white/40 text-sm">Checking...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${health?.ok ? 'bg-green-400' : 'bg-red-400'}`}
                />
                <span
                  className={`text-sm font-semibold ${health?.ok ? 'text-green-400' : 'text-red-400'}`}
                >
                  {health?.ok ? 'Healthy' : 'Unreachable'}
                </span>
              </div>
            )}
          </div>

          {/* Blocks */}
          <div className="bg-[#112236] border border-white/10 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Database size={16} className="text-white/40" />
              <span className="text-white/60 text-sm">Content Blocks</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-2xl font-bold">9</span>
              <span className="text-white/40 text-sm">sections managed</span>
            </div>
          </div>

          {/* Access Level */}
          <div className="bg-[#112236] border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck size={16} className="text-amber-400" />
              <span className="text-white/60 text-sm">Access Level</span>
            </div>
            <span className="text-amber-400 text-sm font-bold">FULL ACCESS</span>
            <p className="text-white/30 text-xs mt-1">All data and settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
