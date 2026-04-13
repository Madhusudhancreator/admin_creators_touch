'use client';

import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

const DEFAULT_FORM = {
  title: '',
  date: '',
  time: '10:00',
  attendees: '',
  type: 'standup',
};

export default function MeetingModal({ open, onClose, onSave, initialDate = '' }) {
  const [form, setForm] = useState({ ...DEFAULT_FORM, date: initialDate });

  useEffect(() => {
    if (open) {
      setForm({ ...DEFAULT_FORM, date: initialDate });
    }
  }, [open, initialDate]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    const attendeeList = form.attendees
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    onSave({ ...form, attendees: attendeeList });
    setForm(DEFAULT_FORM);
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#112236] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold text-lg">Schedule Meeting</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Meeting Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Q2 Strategy Review"
              required
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] text-sm transition"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#0977a8] text-sm transition [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#0977a8] text-sm transition [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">
              Attendees <span className="text-white/30 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="attendees"
              value={form.attendees}
              onChange={handleChange}
              placeholder="Jordan Lee, Alex Rivera"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] text-sm transition"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Meeting Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#0977a8] text-sm appearance-none cursor-pointer"
            >
              <option value="standup" className="bg-[#0d1b2e]">Standup</option>
              <option value="client" className="bg-[#0d1b2e]">Client</option>
              <option value="review" className="bg-[#0d1b2e]">Review</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#cc0066] hover:bg-[#cc0066]/80 text-white text-sm font-semibold rounded-lg transition"
            >
              <Plus size={16} />
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
