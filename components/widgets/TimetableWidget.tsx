
import React from 'react';
import { Clock } from 'lucide-react';

export const TimetableWidget: React.FC<{ data: any, onChange: (d: any) => void }> = ({ data, onChange }) => {
  const slots = [
    { time: '08:00', task: '' },
    { time: '12:00', task: '' },
    { time: '18:00', task: '' },
    { time: '21:00', task: '' },
  ];
  
  const currentSlots = data.slots && data.slots.length > 0 ? data.slots : slots;

  const updateSlot = (index: number, val: string) => {
    const newSlots = [...currentSlots];
    newSlots[index].task = val;
    onChange({ slots: newSlots });
  };

  return (
    <div className="space-y-3">
      {currentSlots.map((s: any, i: number) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 w-10">{s.time}</span>
          <input 
            value={s.task}
            onChange={e => updateSlot(i, e.target.value)}
            placeholder="Plan..."
            className="flex-1 text-xs border-b border-slate-100 focus:border-indigo-300 outline-none py-1"
          />
        </div>
      ))}
    </div>
  );
};
