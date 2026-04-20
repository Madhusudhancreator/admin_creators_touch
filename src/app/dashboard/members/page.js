'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { fetchAllUsers, approveUser, rejectUser, deleteUser } from '@/lib/api';
import { ROLE_LABELS, ROLE_COLORS, STATUS_LABELS, STATUS_COLORS } from '@/lib/roles';
import { Users, Clock, CheckCircle, Trash2, UserCheck, UserX } from 'lucide-react';

export default function MembersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    if (user && user.role !== 'admin') { router.replace('/dashboard'); return; }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load members.');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    setActing(id);
    try {
      const updated = await approveUser(id);
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, ...updated } : m));
    } catch { setError('Failed to approve.'); }
    finally { setActing(null); }
  }

  async function handleReject(id) {
    setActing(id);
    try {
      const updated = await rejectUser(id);
      setMembers((prev) => prev.map((m) => m.id === id ? { ...m, ...updated } : m));
    } catch { setError('Failed to reject.'); }
    finally { setActing(null); }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this member permanently?')) return;
    setActing(id);
    try {
      await deleteUser(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch { setError('Failed to delete.'); }
    finally { setActing(null); }
  }

  const pending = members.filter((m) => m.status === 'pending');
  const active  = members.filter((m) => m.status === 'active');

  if (loading) return <div className="p-6 text-sm text-gray-400">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage team access and approve new requests.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Members', value: members.length, icon: Users,       color: '#0977a8' },
          { label: 'Active',        value: active.length,  icon: CheckCircle, color: '#10b981' },
          { label: 'Pending',       value: pending.length, icon: Clock,       color: '#f59e0b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pending approvals */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Clock size={14} className="text-amber-500" />
            Pending Approval ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((m) => (
              <div key={m.id} className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Requested {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={acting === m.id}
                    onClick={() => handleApprove(m.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition"
                  >
                    <UserCheck size={15} /> Approve
                  </button>
                  <button
                    disabled={acting === m.id}
                    onClick={() => handleReject(m.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition"
                  >
                    <UserX size={15} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All members table */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">All Members</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: ROLE_COLORS[m.role] || '#6b7280' }}>
                      {ROLE_LABELS[m.role] || m.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${STATUS_COLORS[m.status]}20`, color: STATUS_COLORS[m.status] }}>
                      {STATUS_LABELS[m.status] || m.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {m.role !== 'admin' && (
                      <button
                        disabled={acting === m.id}
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                    No members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
