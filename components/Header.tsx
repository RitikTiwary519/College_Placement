import React from 'react';
import { View } from '../types';
import { CompanyIcon, ExperienceIcon, SunIcon, MoonIcon, UserIcon, LogoutIcon } from './Icons';
import { User } from '../App';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, isDarkMode, toggleDarkMode, currentUser, onLogout, onNavigate }) => {
  const NavButton = ({ view, label, children }: { view: View; label: string, children: React.ReactNode }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
          isActive
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
        <span className="hidden sm:inline">{label}</span>
      </button>
    );
  };
  
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">Campus Portal</h1>
          </div>

          {currentUser && (
            <div className="flex-1 flex justify-center px-2 sm:px-4">
               <div className="flex items-center gap-2 p-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl">
                <NavButton view={View.Companies} label="Companies">
                  <CompanyIcon className="w-5 h-5" />
                </NavButton>
                <NavButton view={View.Experiences} label="Experiences">
                  <ExperienceIcon className="w-5 h-5" />
                </NavButton>
                {currentUser.role === 'admin' && (
                    <NavButton view={View.AdminDashboard} label="Admin">
                        <UserIcon className="w-5 h-5" />
                    </NavButton>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
            </button>
            {currentUser ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-200">{currentUser.username}</span>
                  <UserIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Logout"
                >
                  <LogoutIcon className="w-6 h-6" />
                </button>
              </>
            ) : (
                <button onClick={() => onNavigate(View.Auth)} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">
                    Login / Sign Up
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;