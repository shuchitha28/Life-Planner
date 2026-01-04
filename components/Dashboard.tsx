
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Wand2, RefreshCw, X, History as HistoryIcon, Layout, ChevronRight, BarChart3, Calendar } from 'lucide-react';
import { WidgetData, WidgetType, DailyReport, DailyRecord, User } from '../types';
import { generateDailyReport } from '../services/geminiService';
import { dbService } from '../services/dbService';
import { WaterTracker } from './widgets/WaterTracker';
import { TodoWidget } from './widgets/TodoWidget';
import { SleepTracker } from './widgets/SleepTracker';
import { DietPlanner } from './widgets/DietPlanner';
import { TimetableWidget } from './widgets/TimetableWidget';

const WIDGET_META: Record<WidgetType, { title: string; defaultData: any }> = {
  water: { title: 'Water Intake', defaultData: { glasses: 0, goal: 8 } },
  todo: { title: 'To-Do List', defaultData: { items: [] } },
  sleep: { title: 'Sleep Log', defaultData: { hours: 0, quality: 0 } },
  exercise: { title: 'Exercise', defaultData: { workouts: [] } },
  diet: { title: 'Diet Planner', defaultData: { meals: [] } },
  timetable: { title: 'Timetable', defaultData: { slots: [
    { time: '08:00', task: '' },
    { time: '12:00', task: '' },
    { time: '18:00', task: '' },
    { time: '21:00', task: '' }
  ] } }
};

export const Dashboard: React.FC<{ user: User }> = ({ user }) => {
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [view, setView] = useState<'board' | 'history'>('board');
  const [editMode, setEditMode] = useState(false);
  const isLoaded = useRef(false);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    const data = await dbService.getUserData(user.id);
    setWidgets(data.currentDay.widgets);
    setHistory(data.history || []);
    setReport(data.currentDay.report || null);
    isLoaded.current = true;
  };

  const syncData = async (currentWidgets: WidgetData[], currentReport?: DailyReport | null) => {
    if (!isLoaded.current) return;
    setIsSaving(true);
    const reportToSave = currentReport !== undefined ? currentReport : report;
    
    try {
      await dbService.saveCurrentDayProgress(user.id, {
        date: new Date().toISOString().split('T')[0],
        widgets: currentWidgets,
        report: reportToSave || undefined
      });
    } catch (e) {
      console.error("Sync failed", e);
    } finally {
      setIsSaving(false);
    }
  };

  const addWidget = (type: WidgetType) => {
    const newWidget: WidgetData = {
      id: Date.now().toString(),
      type,
      title: WIDGET_META[type].title,
      data: WIDGET_META[type].defaultData
    };
    const updated = [...widgets, newWidget];
    setWidgets(updated);
    syncData(updated);
    setShowAddMenu(false);
  };

  const removeWidget = (id: string) => {
    const updated = widgets.filter(w => w.id !== id);
    setWidgets(updated);
    syncData(updated);
  };

  const updateWidgetData = (id: string, newData: any) => {
    const updated = widgets.map(w => w.id === id ? { ...w, data: newData } : w);
    setWidgets(updated);
    syncData(updated);
  };

  const handleArchive = async () => {
    if (!widgets.length) {
      alert("Add some elements to your board before resetting!");
      return;
    }
    
    if (confirm('Archive today\'s progress and start fresh for tomorrow?')) {
      setIsSaving(true);
      try {
        // Perform archive in storage
        const newProgress = await dbService.archiveCurrentDay(user.id);
        
        // Update all local states immediately from the returned source of truth
        setWidgets(newProgress.currentDay.widgets);
        setHistory([...newProgress.history]);
        setReport(null);
        setEditMode(false);
        
        // Briefly wait and reload from disk to be 100% sure we are in sync
        setTimeout(() => loadData(), 100);
      } catch (e) {
        console.error("Archive failed", e);
        alert("Oops! Something went wrong while resetting. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const result = await generateDailyReport(widgets);
      setReport(result);
      await syncData(widgets, result);
    } catch (err) {
      console.error("Failed to generate report", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
             <h1 className="text-3xl font-bold text-slate-900">
               {view === 'board' ? `Welcome, ${user.name}` : 'Insights & History'}
             </h1>
             {isSaving && <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-1 rounded-full animate-pulse font-bold tracking-widest uppercase">Syncing...</span>}
          </div>
          <p className="text-slate-500 font-medium">
            {view === 'board' ? "Your daily performance board." : "Track your evolution over the days."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setView(view === 'board' ? 'history' : 'board')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all font-semibold ${view === 'history' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {view === 'board' ? <HistoryIcon className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
            <span>{view === 'board' ? 'History' : 'Back to Board'}</span>
          </button>

          {view === 'board' && (
            <>
              <button 
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-xl transition-all font-semibold ${editMode ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Layout className="w-4 h-4" />
                <span>{editMode ? 'Lock Layout' : 'Customize'}</span>
              </button>
              <button 
                onClick={handleArchive}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-xl shadow-slate-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Day</span>
              </button>
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating || widgets.length === 0}
                className="flex items-center space-x-2 px-6 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Analyzing...' : 'AI Coach'}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {view === 'board' ? (
        <>
          {report && (
            <div className="mb-10 p-8 glass rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl relative overflow-hidden group animate-in slide-in-from-top duration-700">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex flex-col items-center justify-center text-white shadow-2xl shadow-indigo-200 border-4 border-white/20">
                   <span className="text-4xl font-black">{report.score}</span>
                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Score</span>
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-wider mb-4">
                    <Wand2 className="w-3 h-3" /> Gemini AI Coach
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Today's Insight</h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">"{report.summary}"</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {report.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white/60 p-4 rounded-2xl border border-indigo-50 shadow-sm">
                        <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                           <ChevronRight className="w-3 h-3" />
                        </div>
                        <span className="text-slate-600 text-sm font-semibold">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => setReport(null)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 bg-slate-50 rounded-full transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {widgets.map(w => (
              <div key={w.id} className={`group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all relative flex flex-col min-h-[320px] ${editMode ? 'ring-4 ring-indigo-200 ring-offset-4' : ''}`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                    <h3 className="font-extrabold text-slate-800 text-xl tracking-tight">{w.title}</h3>
                  </div>
                  {editMode && (
                    <button onClick={() => removeWidget(w.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  {w.type === 'water' && <WaterTracker data={w.data} onChange={(d) => updateWidgetData(w.id, d)} />}
                  {w.type === 'todo' && <TodoWidget data={w.data} onChange={(d) => updateWidgetData(w.id, d)} />}
                  {w.type === 'sleep' && <SleepTracker data={w.data} onChange={(d) => updateWidgetData(w.id, d)} />}
                  {w.type === 'diet' && <DietPlanner data={w.data} onChange={(d) => updateWidgetData(w.id, d)} />}
                  {w.type === 'timetable' && <TimetableWidget data={w.data} onChange={(d) => updateWidgetData(w.id, d)} />}
                </div>
              </div>
            ))}

            <div className="relative">
              <button 
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="w-full h-full min-h-[320px] rounded-[2rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-indigo-100 group-hover:scale-110 transition-all shadow-inner">
                  <Plus className="w-10 h-10" />
                </div>
                <span className="font-black text-xl">Add Module</span>
                <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Build your canvas</span>
              </button>

              {showAddMenu && (
                <div className="absolute top-0 left-0 w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 z-50 p-8 animate-in zoom-in duration-300">
                   <div className="flex items-center justify-between mb-8 px-2">
                     <span className="font-black text-slate-900 tracking-tighter text-xl text-left">CHOOSE COMPONENT</span>
                     <button onClick={() => setShowAddMenu(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full">
                        <X className="w-6 h-6" />
                     </button>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     {(Object.keys(WIDGET_META) as WidgetType[]).map(type => (
                       <button
                        key={type}
                        onClick={() => addWidget(type)}
                        className="flex flex-col items-center p-6 rounded-3xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 group text-left"
                       >
                         <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{WIDGET_META[type].title}</span>
                       </button>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <BarChart3 className="w-40 h-40 text-indigo-600" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <BarChart3 className="text-indigo-600" /> Overall Performance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="p-6 bg-slate-50 rounded-3xl">
                   <div className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Logged</div>
                   <div className="text-4xl font-black text-slate-900">{history.length} Days</div>
                </div>
                <div className="p-6 bg-indigo-50 rounded-3xl">
                   <div className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Average Score</div>
                   <div className="text-4xl font-black text-indigo-600">
                     {history.length > 0 
                        ? Math.round(history.reduce((acc, curr) => acc + (curr.report?.score || 0), 0) / history.length) 
                        : '0'}%
                   </div>
                </div>
                <div className="p-6 bg-purple-50 rounded-3xl">
                   <div className="text-purple-400 text-xs font-black uppercase tracking-widest mb-2">Status</div>
                   <div className="text-4xl font-black text-purple-600">Active</div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mt-12 px-2">
            <Calendar className="text-indigo-600" /> Archive Timeline
          </h3>

          <div className="space-y-6">
            {history.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100 text-slate-400 italic font-semibold">
                Your history is currently empty. Click "Reset Day" on your board to archive your first session.
              </div>
            ) : (
              [...history].reverse().map((record, idx) => (
                <div key={idx} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest mb-1">
                        <Calendar className="w-3 h-3" /> {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                      <h4 className="font-black text-slate-800 text-2xl tracking-tight">{record.date}</h4>
                    </div>
                    <div className="px-5 py-2 bg-indigo-600 text-white rounded-2xl text-xl font-black shadow-lg">
                       {record.report?.score || 'N/A'}%
                    </div>
                  </div>
                  
                  {record.report ? (
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                      <p className="text-slate-600 font-bold italic mb-6 leading-relaxed">"{record.report.summary}"</p>
                      <div className="flex flex-wrap gap-2">
                        {record.report.tips.map((tip, tIdx) => (
                           <span key={tIdx} className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-400 uppercase font-black tracking-widest">{tip}</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-3xl text-center italic text-slate-400 font-medium">
                      No report was generated for this day.
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
