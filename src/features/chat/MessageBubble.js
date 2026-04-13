import { format, parseISO } from 'date-fns';

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function MessageBubble({ message }) {
  const { sender, content, timestamp, isSelf } = message;

  let timeStr = '';
  try {
    timeStr = format(parseISO(timestamp), 'h:mm a');
  } catch {
    timeStr = '';
  }

  if (isSelf) {
    return (
      <div className="flex justify-end items-end gap-2">
        <div className="max-w-[70%]">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-white/30 text-[10px]">{timeStr}</span>
          </div>
          <div className="bg-[#0977a8] text-white px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-sm">
            {content}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-[#0977a8]/60 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mb-0.5">
          {getInitials(sender)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mb-0.5">
        {getInitials(sender)}
      </div>
      <div className="max-w-[70%]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/60 text-xs font-medium">{sender}</span>
          <span className="text-white/30 text-[10px]">{timeStr}</span>
        </div>
        <div className="bg-white/10 text-white/90 px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed shadow-sm">
          {content}
        </div>
      </div>
    </div>
  );
}
