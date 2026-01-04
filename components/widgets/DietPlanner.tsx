
import React, { useState } from 'react';
import { Utensils, Plus, Trash2 } from 'lucide-react';

export const DietPlanner: React.FC<{ data: any, onChange: (d: any) => void }> = ({ data, onChange }) => {
  const [mealName, setMealName] = useState('');
  const meals = data.meals || [];

  const addMeal = () => {
    if (!mealName) return;
    onChange({ ...data, meals: [...meals, { id: Date.now(), name: mealName, calories: 0 }] });
    setMealName('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Utensils className="text-orange-500 w-5 h-5" />
        <span className="text-xs font-bold text-slate-400">{meals.length} meals today</span>
      </div>
      <div className="flex gap-2">
        <input 
          value={mealName}
          onChange={e => setMealName(e.target.value)}
          placeholder="Add meal..."
          className="flex-1 text-sm bg-slate-50 border rounded-lg px-2 py-1 outline-none"
        />
        <button onClick={addMeal} className="bg-orange-500 text-white p-1 rounded-lg">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
        {meals.map((m: any) => (
          <div key={m.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg group">
            <span className="text-slate-700">{m.name}</span>
            <button 
              onClick={() => onChange({ ...data, meals: meals.filter((x: any) => x.id !== m.id) })}
              className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
