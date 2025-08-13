import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CompanyListings from './components/CompanyListings';
import InterviewPortal from './components/InterviewPortal';
import LoginPage from './components/LoginPage';
import SubmitExperienceForm from './components/SubmitExperienceForm';
import AdminDashboard from './components/AdminDashboard';
import CompanyDetailView from './components/CompanyDetailView';
import AuthPage from './components/AuthPage';
import { View, InterviewExperience, Comment } from './types';
import { initialExperiences } from './data';

// User type for authentication
export interface User {
    username: string;
    password?: string; // Optional for our simulation
    role: 'user' | 'admin';
}


const App: React.FC = () => {
    const [view, setView] = useState<{type: View, payload?: any}>({ type: View.Companies });
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [experiences, setExperiences] = useState<InterviewExperience[]>(initialExperiences);
    
    // In-memory user store
    const [users, setUsers] = useState<User[]>([
        { username: 'admin', password: 'admin', role: 'admin' }
    ]);
    
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('darkMode');
            if (stored) return stored === 'true';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('darkMode', 'true');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('darkMode', 'false');
        }
    }, [isDarkMode]);

    useEffect(() => {
        if (!currentUser) {
            setView({ type: View.Auth });
        } else {
            // If user logs in, default to companies view
            if(view.type === View.Auth) {
              setView({ type: View.Companies });
            }
        }
    }, [currentUser, view.type]);

    const handleLogin = (username: string, password?: string): boolean => {
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (user && user.password === password) {
            setCurrentUser(user);
            return true;
        }
        return false;
    };
    
    const handleSignup = (username: string, password?: string): {success: boolean, message: string} => {
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            return { success: false, message: "Username already exists." };
        }
        const newUser: User = { username, password, role: 'user' };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        return { success: true, message: "Signup successful!" };
    };


    const handleLogout = () => {
        setCurrentUser(null);
    };

    const handleAddExperience = (exp: Omit<InterviewExperience, 'id' | 'popularity' | 'likes' | 'comments'>) => {
        if (!currentUser) return; // Should not happen if UI is correct
        const newExperience: InterviewExperience = {
            ...exp,
            id: Date.now(),
            student_name: currentUser.username, // Attribute to current user
            popularity: 0,
            likes: 0,
            comments: []
        };
        setExperiences(prev => [newExperience, ...prev]);
        setView({ type: View.Experiences });
    };

    const handleDeleteExperience = (id: number) => {
        if (currentUser?.role !== 'admin') return;
        setExperiences(prev => prev.filter(exp => exp.id !== id));
    };

    const handleLike = (id: number) => {
        if (!currentUser) return;
        setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, likes: exp.likes + 1 } : exp));
    };

    const handleAddComment = (id: number, text: string) => {
        if (!currentUser) return;
        const newComment: Comment = {
            user: currentUser.username,
            text,
            date: new Date().toISOString().split('T')[0]
        };
        setExperiences(prev => prev.map(exp => exp.id === id ? { ...exp, comments: [...exp.comments, newComment] } : exp));
    };

    const handleDeleteComment = (experienceId: number, commentDate: string, commentUser: string) => {
        if (!currentUser) return;
        setExperiences(prev => prev.map(exp => {
            if (exp.id === experienceId) {
                const newComments = exp.comments.filter(comment => 
                    !(comment.date === commentDate && comment.user === commentUser) || 
                    (currentUser.role !== 'admin' && currentUser.username !== comment.user)
                );
                return { ...exp, comments: newComments };
            }
            return exp;
        }));
    };

    const navigate = (type: View, payload?: any) => setView({ type, payload });

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    const renderView = () => {
        switch (view.type) {
            case View.Auth:
                 return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
            case View.Companies:
                return <CompanyListings onCompanySelect={(companyName) => navigate(View.CompanyDetail, { companyName })} />;
            case View.Experiences:
                return <InterviewPortal 
                            experiences={experiences}
                            onNavigate={navigate}
                            onLike={handleLike}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            currentUser={currentUser}
                        />;
            case View.SubmitExperience:
                return <SubmitExperienceForm onSubmit={handleAddExperience} onCancel={() => navigate(View.Experiences)} currentUser={currentUser!} />;
            case View.AdminDashboard:
                 if(currentUser?.role !== 'admin') return <CompanyListings onCompanySelect={(companyName) => navigate(View.CompanyDetail, { companyName })} />;
                 return <AdminDashboard experiences={experiences} onDelete={handleDeleteExperience} onBack={() => navigate(View.Companies)} />;
            case View.CompanyDetail:
                return <CompanyDetailView 
                            companyName={view.payload.companyName} 
                            allExperiences={experiences} 
                            onBack={() => navigate(View.Companies)} 
                            onLike={handleLike}
                            onAddComment={handleAddComment}
                            onDeleteComment={handleDeleteComment}
                            currentUser={currentUser}
                        />;
            default:
                return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900">
            <Header 
                currentView={view.type} 
                setCurrentView={(v) => navigate(v)}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                currentUser={currentUser}
                onLogout={handleLogout}
                onNavigate={navigate}
            />
            <main className="flex-grow">
                {renderView()}
            </main>
            <footer className="bg-slate-200 dark:bg-slate-800 border-t border-slate-300 dark:border-slate-700 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} Campus Placement Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default App;