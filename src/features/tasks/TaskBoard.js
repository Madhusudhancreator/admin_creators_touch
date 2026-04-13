'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { isAdmin } from '@/lib/roles';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { Plus, CheckSquare } from 'lucide-react';

const INITIAL_TASKS = [
  {
    id: 1,
    title: 'Revise brand guidelines',
    description: 'Update color tokens and typography scale across all brand docs.',
    assignee: 'Jordan Lee',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-04-15',
  },
  {
    id: 2,
    title: 'Client onboarding deck',
    description: 'Prepare the Q2 onboarding presentation for new clients.',
    assignee: 'Alex Rivera',
    priority: 'medium',
    status: 'todo',
    dueDate: '2026-04-18',
  },
  {
    id: 3,
    title: 'Update homepage copy',
    description: 'Refresh hero headline and subheadline with approved messaging.',
    assignee: 'Jordan Lee',
    priority: 'medium',
    status: 'inprogress',
    dueDate: '2026-04-12',
  },
  {
    id: 4,
    title: 'SEO audit report',
    description: 'Run Semrush audit and compile findings into a report.',
    assignee: 'Sam Chen',
    priority: 'low',
    status: 'inprogress',
    dueDate: '2026-04-20',
  },
  {
    id: 5,
    title: 'Social media calendar',
    description: 'Plan and schedule posts for May across all platforms.',
    assignee: 'Alex Rivera',
    priority: 'low',
    status: 'done',
    dueDate: '2026-04-08',
  },
  {
    id: 6,
    title: 'Logo refresh concepts',
    description: 'Draft 3 logo concept variations for client review.',
    assignee: 'Jordan Lee',
    priority: 'high',
    status: 'done',
    dueDate: '2026-04-07',
  },
];

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#6366f1' },
  { id: 'inprogress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done', label: 'Done', color: '#22c55e' },
];

export default function TaskBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [modalOpen, setModalOpen] = useState(false);

  const adminUser = isAdmin(user?.role);

  // Employees only see their own tasks
  const visibleTasks = adminUser
    ? tasks
    : tasks.filter((t) => t.assignee === user?.name);

  function getColumnTasks(status) {
    return visibleTasks.filter((t) => t.status === status);
  }

  function handleSave(newTask) {
    setTasks((prev) => [
      ...prev,
      { ...newTask, id: Date.now() },
    ]);
    setModalOpen(false);
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckSquare size={22} className="text-[#0977a8]" />
          <h1 className="text-xl font-bold text-white">Task Board</h1>
          <span className="text-sm text-white/40">
            {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0977a8] hover:bg-[#0977a8]/80 text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {COLUMNS.map((col) => {
          const colTasks = getColumnTasks(col.id);
          return (
            <div key={col.id} className="flex flex-col">
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: col.color }}
                />
                <span className="text-sm font-semibold text-white/80">{col.label}</span>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: col.color + '22',
                    color: col.color,
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3 min-h-[200px]">
                {colTasks.length === 0 ? (
                  <div className="border-2 border-dashed border-white/10 rounded-xl h-24 flex items-center justify-center text-white/20 text-sm">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((task) => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
