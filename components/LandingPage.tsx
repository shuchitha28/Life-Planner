
import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Zap, Layout as LayoutIcon, Brain, Sparkles } from 'lucide-react';

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Life Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight">
            Design Your Life, <br />
            <span className="text-indigo-600">Element by Element.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            The first Canva-inspired life planner. Drag, drop, and customize your personal tracking board to master your habits, health, and productivity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center group shadow-xl shadow-indigo-100"
            >
              Build Your Planner
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need in one board</h2>
            <p className="text-slate-600">Six core modules designed to cover every aspect of your daily growth.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Habit Trackers", desc: "Water, Sleep, and Exercise monitoring with visual progress." },
              { icon: LayoutIcon, title: "Canva-like Board", desc: "Customize your layout. Place widgets exactly where you want them." },
              { icon: Brain, title: "AI Daily Reports", desc: "Receive personalized feedback and coaching from Gemini AI." },
              { icon: CheckCircle2, title: "Smart To-Do", desc: "Prioritize tasks and watch your productivity soar." },
              { icon: Shield, title: "Daily Reset", desc: "Start every morning with a clean slate and fresh focus." },
              { icon: Sparkles, title: "Dynamic Modules", desc: "New modules added regularly to fit your lifestyle needs." }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all hover:shadow-lg group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="text-indigo-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h2 className="text-4xl font-bold mb-6">Why LifePlanner?</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Standard planners are rigid. Your life isn't. We built LifePlanner to be as flexible as a design tool, but as powerful as a productivity machine.
            </p>
            <ul className="space-y-4">
              {["Customizable layouts", "Data-driven insights", "Progress tracking over time", "Beautiful aesthetic design"].map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <div className="bg-indigo-600/20 p-1 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:w-1/2 relative">
             <div className="w-full aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center transform rotate-2">
                <LayoutIcon className="w-32 h-32 text-white opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                   <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl w-full h-full border border-white/20">
                      <div className="h-4 w-32 bg-white/30 rounded mb-4"></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="h-24 bg-white/20 rounded-xl"></div>
                         <div className="h-24 bg-white/20 rounded-xl"></div>
                         <div className="h-24 bg-white/20 rounded-xl"></div>
                         <div className="h-24 bg-white/20 rounded-xl"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to take control?</h2>
          <p className="text-slate-600 mb-10">Join thousands of users who have transformed their daily routines with our modular planner.</p>
          <button 
            onClick={onStart}
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            Start For Free
          </button>
        </div>
      </section>

      <footer className="py-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2024 LifePlanner AI. All rights reserved. Built with ❤️ for productivity.
        </div>
      </footer>
    </div>
  );
};
