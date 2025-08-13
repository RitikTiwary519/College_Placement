import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import { CompanyIcon } from './Icons';

interface AuthPageProps {
    onLogin: (username: string, password?: string) => boolean;
    onSignup: (username: string, password?: string) => {success: boolean, message: string};
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup }) => {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <CompanyIcon className="mx-auto h-12 w-12 text-primary-500"/>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-4">Campus Placement Portal</h1>
                </div>
                <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl px-8 pt-6 pb-8 mb-4">
                    {isLoginView ? (
                        <LoginPage onLogin={onLogin} onSwitchToSignup={() => setIsLoginView(false)} />
                    ) : (
                        <SignupPage onSignup={onSignup} onSwitchToLogin={() => setIsLoginView(true)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;