'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const DEFAULT_FORM = {
  title: '',
  description: '',
  assignee: '',
  priority: 'medium',
  status: 'todo',
  dueDate: '',
};

export default function TaskModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(DEFAULT_FORM);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form });
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
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="text-white font-semibold text-lg">New Task</h3>
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
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Task title..."
              required
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] text-sm transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] text-sm resize-none transition"
            />
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Assignee</label>
            <input
              type="text"
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              placeholder="Full name..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] text-sm transition"
            />
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#0977a8] text-sm appearance-none cursor-pointer"
              >
                <option value="low" className="bg-[#0d1b2e]">Low</option>
                <option value="medium" className="bg-[#0d1b2e]">Medium</option>
                <option value="high" className="bg-[#0d1b2e]">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#0977a8] text-sm appearance-none cursor-pointer"
              >
                <option value="todo" className="bg-[#0d1b2e]">To Do</option>
                <option value="inprogress" className="bg-[#0d1b2e]">In Progress</option>
                <option value="done" className="bg-[#0d1b2e]">Done</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1.5">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#0977a8] focus:ring-1 focus:ring-[#0977a8] text-sm transition [color-scheme:dark]"
            />
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
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0977a8] hover:bg-[#0977a8]/80 text-white text-sm font-semibold rounded-lg transition"
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
