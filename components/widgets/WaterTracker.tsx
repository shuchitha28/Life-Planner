
import React from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';

interface WaterTrackerProps {
  data: { glasses: number; goal: number };
  onChange: (newData: any) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ data, onChange }) => {
  const glasses = data.glasses || 0;
  const goal = data.goal || 8;

  const update = (val: number) => {
    onChange({ ...data, glasses: Math.max(0, glasses + val) });
  };

  const progress = Math.min(100, (glasses / goal) * 100);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Droplets className="text-blue-500 w-6 h-6" />
        <span className="text-sm font-medium text-slate-500">{glasses} / {goal} Glasses</span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="relative w-24 h-24 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-blue-50"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * progress) / 100}
              className="text-blue-500 transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-slate-800">
            {Math.round(progress)}%
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={() => update(-1)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Minus className="w-4 h-4 text-slate-600" />
          </button>
          <button 
            onClick={() => update(1)}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
