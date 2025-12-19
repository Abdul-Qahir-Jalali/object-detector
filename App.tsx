
import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import Training from './components/Training';
import Stats from './components/Stats';
import { PageState } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>(() => {
    const saved = localStorage.getItem('app_page');
    return (saved as PageState) || 'login';
  });
  const [loginMessage, setLoginMessage] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('app_page', currentPage);
  }, [currentPage]);

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
    setLoginMessage('');
  };

  const handleSignupSuccess = () => {
    setLoginMessage('Account Created Successfully');
    setCurrentPage('login');
  };

  const navigateToSignup = () => {
    setCurrentPage('signup');
    setLoginMessage('');
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
    setLoginMessage('');
  };

  const isLoggedIn = currentPage === 'dashboard' || currentPage === 'training' || currentPage === 'stats';

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#111827] relative overflow-hidden bg-pattern flex font-sans">

      {/* Side Master (Sidebar Navigation) - Only shown when logged in */}
      {isLoggedIn && (
        <div className="w-64 h-screen fixed left-0 top-0 z-50 bg-white/80 backdrop-blur-md border-r border-gray-200 flex flex-col p-6 animate-in slide-in-from-left duration-700 shadow-xl">
          <div className="mb-12">
            <h2 className="text-xl font-black italic tracking-tighter text-gray-900">
              OBJECT <span className="text-[#116dff]">DETECTOR</span>
            </h2>
            <p className="text-gray-500 text-[8px] uppercase tracking-[0.4em] font-bold mt-1">Advanced AI Vision Console</p>
          </div>

          <nav className="flex-grow space-y-4">
            {[
              { id: 'dashboard', label: 'Prediction', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
              { id: 'training', label: 'Training', icon: 'M12 2v20M2 12h20M5.88 5.88l12.24 12.24M18.12 5.88L5.88 18.12' },
              { id: 'stats', label: 'Dashboard', icon: 'M3 3v18h18M7 16v-4M11 16V8M15 16v-6M19 16v-2' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as PageState)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${currentPage === item.id
                  ? 'bg-[#116dff] text-white shadow-[0_4px_14px_rgba(17,109,255,0.4)]'
                  : 'text-gray-400 hover:text-[#116dff] hover:bg-blue-50'
                  }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-gray-100">
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-[10px] uppercase tracking-[0.2em] font-bold"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-grow transition-all duration-700 ${isLoggedIn ? 'pl-64' : ''}`}>
        {/* Dynamic Render based on state */}
        {currentPage === 'login' && (
          <LoginForm
            onLogin={handleLoginSuccess}
            onNavigateToSignup={navigateToSignup}
            initialMessage={loginMessage}
          />
        )}

        {currentPage === 'signup' && (
          <SignupForm
            onSignup={handleSignupSuccess}
            onNavigateToLogin={navigateToLogin}
          />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard />
        )}

        {currentPage === 'training' && (
          <Training />
        )}

        {currentPage === 'stats' && (
          <Stats />
        )}
      </div>

      {/* Aesthetic Architectural Elements - Modified for light theme */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-blue-100 rotate-12 transform scale-150"></div>
        <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-blue-50 -rotate-6 transform"></div>
      </div>
    </div>
  );
};

export default App;
