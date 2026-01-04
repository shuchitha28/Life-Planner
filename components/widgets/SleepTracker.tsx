
import React from 'react';
import { Moon, Star } from 'lucide-react';

interface SleepTrackerProps {
  data: { hours: number; quality: number };
  onChange: (newData: any) => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ data, onChange }) => {
  const hours = data.hours || 0;
  const quality = data.quality || 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <Moon className="text-indigo-600 w-6 h-6" />
        <span className="text-sm font-bold text-slate-600">{hours}h Sleep</span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Duration</label>
          <input 
            type="range" 
            min="0" max="12" step="0.5"
            className="w-full accent-indigo-600"
            value={hours}
            onChange={(e) => onChange({ ...data, hours: parseFloat(e.target.value) })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Quality</label>
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map(q => (
              <button
                key={q}
                onClick={() => onChange({ ...data, quality: q })}
                className={`p-2 rounded-full transition-all ${quality >= q ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}
              >
                <Star className={`w-6 h-6 ${quality >= q ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
