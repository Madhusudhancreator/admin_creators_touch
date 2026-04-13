import { format, parseISO } from 'date-fns';
import { User, Calendar, AlertCircle } from 'lucide-react';

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#22c55e', bg: 'bg-green-500/10' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'bg-amber-500/10' },
  high: { label: 'High', color: '#ef4444', bg: 'bg-red-500/10' },
};

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function TaskCard({ task }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;

  let formattedDate = '';
  try {
    formattedDate = format(parseISO(task.dueDate), 'MMM d');
  } catch {
    formattedDate = task.dueDate;
  }

  return (
    <div className="bg-[#112236] border border-white/10 rounded-xl p-4 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition cursor-default">
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priority.bg}`}
          style={{ color: priority.color }}
        >
          {priority.label}
        </span>
        <AlertCircle size={14} style={{ color: priority.color }} className="opacity-60" />
      </div>

      {/* Title */}
      <h3 className="text-white text-sm font-semibold mb-1 leading-snug">{task.title}</h3>

      {/* Description */}
      <p className="text-white/40 text-xs mb-3 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-[#0977a8] flex items-center justify-center text-[10px] font-bold text-white">
            {getInitials(task.assignee)}
          </div>
          <span className="text-white/40 text-xs truncate max-w-[90px]">{task.assignee}</span>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-1 text-white/30 text-xs">
          <Calendar size={11} />
          {formattedDate}
        </div>
      </div>
    </div>
  );
}
