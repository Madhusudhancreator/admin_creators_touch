'use client';

import { useState } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfMonth,
  format,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  parseISO,
  isAfter,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Plus, Clock, Users } from 'lucide-react';
import MeetingModal from './MeetingModal';

const MEETING_TYPE_COLORS = {
  standup: '#0977a8',
  client: '#cc0066',
  review: '#f59e0b',
};

const INITIAL_MEETINGS = [
  {
    id: 1,
    title: 'Daily Standup',
    date: '2026-04-11',
    time: '09:00',
    attendees: ['Jordan Lee', 'Alex Rivera', 'Sam Chen'],
    type: 'standup',
  },
  {
    id: 2,
    title: 'Client Discovery Call – Apex Media',
    date: '2026-04-14',
    time: '14:00',
    attendees: ['Jordan Lee', 'Taylor Smith'],
    type: 'client',
  },
  {
    id: 3,
    title: 'Q2 Strategy Review',
    date: '2026-04-17',
    time: '11:00',
    attendees: ['Jordan Lee', 'Alex Rivera', 'Sam Chen', 'Taylor Smith'],
    type: 'review',
  },
  {
    id: 4,
    title: 'Brand Sprint Kickoff',
    date: '2026-04-22',
    time: '10:00',
    attendees: ['Jordan Lee', 'Alex Rivera'],
    type: 'client',
  },
];

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 10)); // April 2026
  const [meetings, setMeetings] = useState(INITIAL_MEETINGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  function getMeetingsForDay(day) {
    return meetings.filter((m) => isSameDay(parseISO(m.date), day));
  }

  function handleDayClick(day) {
    setSelectedDate(day);
    setModalOpen(true);
  }

  function handleSaveMeeting(meeting) {
    setMeetings((prev) => [...prev, { ...meeting, id: Date.now() }]);
    setModalOpen(false);
  }

  const today = new Date(2026, 3, 10);

  const upcomingMeetings = meetings
    .filter((m) => !isAfter(parseISO(m.date), new Date(2026, 3, 30)))
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar size={22} className="text-[#cc0066]" />
          <h1 className="text-xl font-bold text-white">Calendar</h1>
        </div>
        <button
          onClick={() => { setSelectedDate(today); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#cc0066] hover:bg-[#cc0066]/80 text-white text-sm font-semibold rounded-lg transition"
        >
          <Plus size={16} />
          Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-[#112236] border border-white/10 rounded-xl p-5">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => setCurrentDate((d) => subMonths(d, 1))}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-white font-semibold text-base">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentDate((d) => addMonths(d, 1))}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-white/30 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day) => {
              const dayMeetings = getMeetingsForDay(day);
              const isToday = isSameDay(day, today);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={`relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-lg text-xs transition hover:bg-white/10 ${
                    isCurrentMonth ? 'text-white' : 'text-white/20'
                  } ${isToday ? 'ring-2 ring-[#0977a8] bg-[#0977a8]/10' : ''}`}
                >
                  <span className={`font-medium ${isToday ? 'text-[#0977a8]' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayMeetings.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayMeetings.slice(0, 3).map((m) => (
                        <span
                          key={m.id}
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: MEETING_TYPE_COLORS[m.type] }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            {Object.entries(MEETING_TYPE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs text-white/40 capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-[#112236] border border-white/10 rounded-xl p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Upcoming Meetings</h3>
          <div className="space-y-3">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/8 transition"
              >
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: MEETING_TYPE_COLORS[meeting.type] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{meeting.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={11} className="text-white/30" />
                    <span className="text-white/40 text-xs">
                      {format(parseISO(meeting.date), 'MMM d')} at {meeting.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Users size={11} className="text-white/30" />
                    <span className="text-white/30 text-xs">
                      {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {upcomingMeetings.length === 0 && (
              <p className="text-white/30 text-sm text-center py-4">No upcoming meetings</p>
            )}
          </div>
        </div>
      </div>

      <MeetingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveMeeting}
        initialDate={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
      />
    </div>
  );
}
