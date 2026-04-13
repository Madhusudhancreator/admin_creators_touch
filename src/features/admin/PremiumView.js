'use client';

import { useRouter } from 'next/navigation';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles';
import {
  Star,
  Users,
  TrendingUp,
  CheckSquare,
  ExternalLink,
  BarChart3,
} from 'lucide-react';

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Alex Rivera', role: 'standard', taskCount: 6, completedTasks: 4, status: 'active' },
  { id: 2, name: 'Sam Chen', role: 'employee', taskCount: 4, completedTasks: 2, status: 'active' },
  { id: 3, name: 'Morgan Blake', role: 'employee', taskCount: 3, completedTasks: 3, status: 'idle' },
  { id: 4, name: 'Casey Park', role: 'employee', taskCount: 5, completedTasks: 1, status: 'active' },
];

const PERFORMANCE_STATS = [
  { label: 'Tasks Completed', value: 34, change: '+12%', positive: true },
  { label: 'On-Time Delivery', value: '87%', change: '+5%', positive: true },
  { label: 'Active Projects', value: 7, change: '-1', positive: false },
  { label: 'Team Utilization', value: '92%', change: '+8%', positive: true },
];

export default function PremiumView() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-[#cc0066]/10">
          <Star size={28} className="text-[#cc0066]" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Premium Dashboard</h1>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-[#cc0066]/20 text-[#cc0066] border border-[#cc0066]/30">
              PREMIUM
            </span>
          </div>
          <p className="text-white/50 text-sm mt-0.5">
            Manage your team and monitor performance.
          </p>
        </div>
      </div>

      {/* Performance Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-[#cc0066]" />
          <h2 className="text-lg font-semibold text-white">Team Performance</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {PERFORMANCE_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#112236] border border-white/10 rounded-xl p-5 hover:border-white/20 transition"
            >
              <p className="text-white/50 text-sm mb-2">{stat.label}</p>
              <p className="text-white text-2xl font-bold mb-1">{stat.value}</p>
              <span
                className={`text-xs font-semibold ${
                  stat.positive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stat.change} this month
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Task Overview */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[#0977a8]" />
          <h2 className="text-lg font-semibold text-white">Employee Overview</h2>
        </div>
        <div className="bg-[#112236] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-5 py-3 text-white/40 font-medium">Member</th>
                <th className="text-left px-5 py-3 text-white/40 font-medium">Role</th>
                <th className="text-left px-5 py-3 text-white/40 font-medium">Progress</th>
                <th className="text-left px-5 py-3 text-white/40 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EMPLOYEES.map((emp, i) => {
                const pct = Math.round((emp.completedTasks / (emp.taskCount || 1)) * 100);
                return (
                  <tr
                    key={emp.id}
                    className={`${
                      i < MOCK_EMPLOYEES.length - 1 ? 'border-b border-white/5' : ''
                    } hover:bg-white/3 transition`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: ROLE_COLORS[emp.role] }}
                        >
                          {emp.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: ROLE_COLORS[emp.role] + '22',
                          color: ROLE_COLORS[emp.role],
                        }}
                      >
                        {ROLE_LABELS[emp.role]}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/10 rounded-full h-1.5 max-w-[100px]">
                          <div
                            className="h-1.5 rounded-full bg-[#0977a8]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-white/40 text-xs">
                          {emp.completedTasks}/{emp.taskCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            emp.status === 'active' ? 'bg-green-400' : 'bg-white/20'
                          }`}
                        />
                        <span
                          className={`text-xs capitalize ${
                            emp.status === 'active' ? 'text-green-400' : 'text-white/30'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Management */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-[#cc0066]" />
          <h2 className="text-lg font-semibold text-white">Content Management</h2>
        </div>
        <div className="bg-[#112236] border border-white/10 rounded-xl p-5">
          <p className="text-white/50 text-sm mb-4">
            Manage homepage content blocks via the backend blocks API.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Hero', 'Services', 'Reviews'].map((section) => (
              <div
                key={section}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/8 transition"
              >
                <span className="text-white text-sm font-medium">{section} Block</span>
                <ExternalLink size={14} className="text-white/30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
