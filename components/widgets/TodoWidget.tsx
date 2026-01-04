
import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';

interface TodoWidgetProps {
  data: { items: { id: string; text: string; completed: boolean }[] };
  onChange: (newData: any) => void;
}

export const TodoWidget: React.FC<TodoWidgetProps> = ({ data, onChange }) => {
  const [newItem, setNewItem] = useState('');
  const items = data.items || [];

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = { id: Date.now().toString(), text: newItem, completed: false };
    onChange({ items: [...items, item] });
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    onChange({
      items: items.map(it => it.id === id ? { ...it, completed: !it.completed } : it)
    });
  };

  const removeItem = (id: string) => {
    onChange({ items: items.filter(it => it.id !== id) });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="New task..."
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-l-lg outline-none text-sm focus:border-indigo-400"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button 
          onClick={addItem}
          className="px-3 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {items.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">No tasks for today.</div>
        ) : (
          items.map(it => (
            <div key={it.id} className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <div 
                className="flex items-center space-x-3 cursor-pointer flex-1"
                onClick={() => toggleItem(it.id)}
              >
                {it.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
                <span className={`text-sm ${it.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {it.text}
                </span>
              </div>
              <button 
                onClick={() => removeItem(it.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
