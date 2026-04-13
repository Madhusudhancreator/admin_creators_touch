'use client';

import { ROLE_LABELS, ROLE_COLORS } from '@/lib/roles';
import {
  Shield,
  Users,
  CheckSquare,
  CalendarDays,
  Clock,
  AlertCircle,
} from 'lucide-react';

const MOCK_EMPLOYEES = [
  { id: 1, name: 'Sam Chen', role: 'employee', taskCount: 4, email: 'sam@ctg.com' },
  { id: 2, name: 'Morgan Blake', role: 'employee', taskCount: 3, email: 'morgan@ctg.com' },
  { id: 3, name: 'Casey Park', role: 'employee', taskCount: 5, email: 'casey@ctg.com' },
];

const PENDING_APPROVALS = [
  { id: 1, task: 'Brand guidelines revision', requestedBy: 'Sam Chen', priority: 'high', submitted: '1 hr ago' },
  { id: 2, task: 'Social media calendar May', requestedBy: 'Casey Park', priority: 'medium', submitted: '3 hrs ago' },
  { id: 3, task: 'Blog post draft review', requestedBy: 'Morgan Blake', priority: 'low', submitted: 'Yesterday' },
];

const WEEK_MEETINGS = [
  { id: 1, title: 'Daily Standup', day: 'Mon', time: '09:00 AM', type: 'standup' },
  { id: 2, title: 'Client Call – Apex Media', day: 'Wed', time: '02:00 PM', type: 'client' },
  { id: 3, title: 'Sprint Review', day: 'Fri', time: '11:00 AM', type: 'review' },
];

const PRIORITY_COLORS = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };
const MEETING_COLORS = { standup: '#0977a8', client: '#cc0066', review: '#f59e0b' };

export default function StandardView() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-indigo-500/10">
          <Shield size={28} className="text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              STANDARD
            </span>
          </div>
          <p className="text-white/50 text-sm mt-0.5">
            Manage your team, tasks, and schedule.
          </p>
        </div>
      </div>

      {/* Employee List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[#0977a8]" />
          <h2 className="text-lg font-semibold text-white">My Employees</h2>
          <span className="text-white/30 text-sm">{MOCK_EMPLOYEES.length} members</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_EMPLOYEES.map((emp) => (
            <div
              key={emp.id}
              className="bg-[#112236] border border-white/10 rounded-xl p-5 hover:border-white/20 transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: ROLE_COLORS[emp.role] }}
                >
                  {emp.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{emp.name}</p>
                  <p className="text-white/30 text-xs">{emp.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: ROLE_COLORS[emp.role] + '22',
                    color: ROLE_COLORS[emp.role],
                  }}
                >
                  {ROLE_LABELS[emp.role]}
                </span>
                <div className="flex items-center gap-1.5 text-white/40 text-xs">
                  <CheckSquare size={12} />
                  {emp.taskCount} tasks
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Task Approvals */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle size={18} className="text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Pending Approvals</h2>
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
            {PENDING_APPROVALS.length}
          </span>
        </div>
        <div className="bg-[#112236] border border-white/10 rounded-xl divide-y divide-white/5">
          {PENDING_APPROVALS.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: PRIORITY_COLORS[item.priority] }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{item.task}</p>
                <p className="text-white/40 text-xs mt-0.5">
                  Requested by {item.requestedBy} · {item.submitted}
                </p>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0"
                style={{
                  backgroundColor: PRIORITY_COLORS[item.priority] + '22',
                  color: PRIORITY_COLORS[item.priority],
                }}
              >
                {item.priority}
              </span>
              <div className="flex gap-2 flex-shrink-0">
                <button className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium rounded-lg transition">
                  Approve
                </button>
                <button className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This Week's Meetings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={18} className="text-[#cc0066]" />
          <h2 className="text-lg font-semibold text-white">This Week's Meetings</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {WEEK_MEETINGS.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-[#112236] border border-white/10 rounded-xl p-5 hover:border-white/20 transition"
            >
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: MEETING_COLORS[meeting.type] }}
              >
                {meeting.type}
              </div>
              <p className="text-white font-medium text-sm mb-3">{meeting.title}</p>
              <div className="flex items-center gap-4 text-white/40 text-xs">
                <div className="flex items-center gap-1">
                  <CalendarDays size={11} />
                  {meeting.day}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={11} />
                  {meeting.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
