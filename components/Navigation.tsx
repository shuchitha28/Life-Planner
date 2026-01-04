
import React from 'react';
import { Layout, LogOut, User as UserIcon, Palette } from 'lucide-react';

interface NavigationProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: 'landing' | 'auth' | 'planner') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate('landing')}
        >
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Layout className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            LifePlanner
          </span>
        </div>

        <div className="flex items-center space-x-6">
          {!user?.isLoggedIn ? (
            <>
              <button 
                onClick={() => onNavigate('auth')}
                className="text-slate-600 hover:text-indigo-600 font-medium transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('auth')}
                className="bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('planner')}
                className="flex items-center space-x-2 text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <Palette className="w-5 h-5" />
                <span className="hidden sm:inline">My Board</span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline font-medium text-slate-700">{user.name}</span>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
