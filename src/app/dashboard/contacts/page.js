'use client';

import { useEffect, useState } from 'react';
import { fetchAllContacts, setContactRead, deleteContact } from '@/lib/api';
import { RefreshCw, Trash2, Mail, MailOpen, Phone, Briefcase, Wallet, ChevronDown, ChevronUp } from 'lucide-react';

export default function ContactsPage() {
  const [contacts, setContacts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [expanded, setExpanded]   = useState(null); // id of expanded card
  const [deleting, setDeleting]   = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllContacts();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleRead(id, current) {
    try {
      await setContactRead(id, !current);
      setContacts((prev) =>
        prev.map((c) => c.id === id ? { ...c, read: !current } : c)
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete message from "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  const unread = contacts.filter((c) => !c.read).length;

  return (
    <div className="p-6 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {contacts.length} total
            {unread > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#cc0066]/10 text-[#cc0066]">
                {unread} unread
              </span>
            )}
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="text-sm text-gray-400 py-10 text-center">Loading…</div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && contacts.length === 0 && (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 py-16 text-center">
          <Mail size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">No contact submissions yet.</p>
        </div>
      )}

      {!loading && !error && contacts.length > 0 && (
        <div className="space-y-3">
          {contacts.map((c) => {
            const isExpanded = expanded === c.id;
            return (
              <div
                key={c.id}
                className={`bg-white rounded-xl border transition-all ${
                  c.read ? 'border-gray-200' : 'border-[#0977a8]/30 shadow-sm'
                }`}
              >
                {/* ── Row ── */}
                <div className="flex items-center gap-4 px-5 py-4">

                  {/* Unread dot */}
                  <div className="flex-shrink-0 w-2 h-2 rounded-full mt-0.5"
                    style={{ backgroundColor: c.read ? 'transparent' : '#0977a8' }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${c.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {c.full_name}
                      </p>
                      {c.service && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0977a8]/10 text-[#0977a8]">
                          {c.service}
                        </span>
                      )}
                      {c.budget && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {c.budget}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {c.email}
                      {c.phone && ` · ${c.phone}`}
                      <span className="mx-1.5">·</span>
                      {new Date(c.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleRead(c.id, c.read)}
                      title={c.read ? 'Mark as unread' : 'Mark as read'}
                      className="p-2 rounded-lg text-gray-400 hover:text-[#0977a8] hover:bg-[#0977a8]/10 transition"
                    >
                      {c.read ? <Mail size={15} /> : <MailOpen size={15} />}
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.full_name)}
                      disabled={deleting === c.id}
                      title="Delete"
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setExpanded(isExpanded ? null : c.id);
                        if (!c.read && !isExpanded) handleRead(c.id, false);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded detail ── */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-5 space-y-4">

                    {/* Contact details row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-4 py-3">
                        <Mail size={14} className="text-[#0977a8] flex-shrink-0" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">Email</p>
                          <a href={`mailto:${c.email}`} className="text-sm font-medium text-gray-800 hover:text-[#0977a8] transition">
                            {c.email}
                          </a>
                        </div>
                      </div>

                      {c.phone && (
                        <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-4 py-3">
                          <Phone size={14} className="text-[#0977a8] flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Phone</p>
                            <a href={`tel:${c.phone}`} className="text-sm font-medium text-gray-800 hover:text-[#0977a8] transition">
                              {c.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {c.service && (
                        <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-4 py-3">
                          <Briefcase size={14} className="text-[#0977a8] flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Service Needed</p>
                            <p className="text-sm font-medium text-gray-800">{c.service}</p>
                          </div>
                        </div>
                      )}

                      {c.budget && (
                        <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-4 py-3">
                          <Wallet size={14} className="text-[#0977a8] flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide">Budget Range</p>
                            <p className="text-sm font-medium text-gray-800">{c.budget}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Message</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg px-4 py-3">
                        {c.message}
                      </p>
                    </div>  
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
