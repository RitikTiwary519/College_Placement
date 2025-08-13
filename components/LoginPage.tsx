import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (username: string, password?: string) => boolean;
    onSwitchToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        const success = onLogin(username, password);
        if (!success) {
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400">Sign in to continue</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <div className="mb-4">
                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="login-username">
                        Username
                    </label>
                    <input
                        id="login-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="login-password">
                        Password
                    </label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex flex-col items-center justify-between gap-4">
                    <button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
                    >
                        Sign In
                    </button>
                     <button
                        type="button"
                        onClick={onSwitchToSignup}
                        className="inline-block align-baseline font-bold text-sm text-primary-500 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                        Don't have an account? Sign Up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;