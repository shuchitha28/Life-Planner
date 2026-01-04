
import React, { useState, useEffect } from 'react';
import { User } from './types';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'auth' | 'planner'>('landing');
  const [user, setUser] = useState<User | null>(null);

  // Check for existing session
  useEffect(() => {
    const savedUser = localStorage.getItem('lifeplanner_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('lifeplanner_user', JSON.stringify(newUser));
    setCurrentPage('planner');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lifeplanner_user');
    setCurrentPage('landing');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={() => setCurrentPage(user ? 'planner' : 'auth')} />;
      case 'auth':
        return <AuthPage onLogin={handleLogin} />;
      case 'planner':
        return user ? <Dashboard user={user} /> : <AuthPage onLogin={handleLogin} />;
      default:
        return <LandingPage onStart={() => setCurrentPage('auth')} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={setCurrentPage} 
      />
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
