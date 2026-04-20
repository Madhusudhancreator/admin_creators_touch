'use client';

import { useState } from 'react';
import Link from 'next/link';
import { registerApi } from '@/lib/api';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm]             = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  function setField(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setSubmitting(true);
    try {
      await registerApi(form.name, form.email, form.password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1b2e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#112236] border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#0977a8]/20 flex items-center justify-center mb-4">
              <UserPlus size={24} className="text-[#0977a8]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Request Access</h1>
            <p className="text-sm text-white/50 mt-1">Submit your details for admin approval</p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-white font-semibold mb-2">Request Submitted!</p>
              <p className="text-white/50 text-sm mb-6">Your request has been submitted. The admin will review your access and notify you.</p>
              <Link href="/login" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0977a8] text-white rounded-lg text-sm font-semibold hover:bg-[#0977a8]/80 transition">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)}
                    placeholder="Jane Smith" required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Password</label>
                  <input type="password" value={form.password} onChange={(e) => setField('password', e.target.value)}
                    placeholder="Min. 6 characters" required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={(e) => setField('confirm', e.target.value)}
                    placeholder="••••••••" required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] transition"
                  />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0977a8] hover:bg-[#0977a8]/80 disabled:opacity-50 text-white font-semibold rounded-lg transition mt-2">
                  {submitting
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><UserPlus size={18} /> Submit Request</>
                  }
                </button>
              </form>
              <p className="text-center text-sm text-white/40 mt-6">
                Already have access?{' '}
                <Link href="/login" className="text-[#0977a8] hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
