import React, { useState } from 'react';

interface SignupPageProps {
    onSignup: (username: string, password?: string) => {success: boolean, message: string};
    onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!username || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        const result = onSignup(username, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit}>
                 <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create Account</h2>
                    <p className="text-slate-500 dark:text-slate-400">Join the community</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <div className="mb-4">
                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="signup-username">
                        Username
                    </label>
                    <input
                        id="signup-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="signup-password">
                        Password
                    </label>
                    <input
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                 <div className="mb-6">
                    <label className="block text-slate-700 dark:text-slate-300 text-sm font-bold mb-2" htmlFor="signup-confirm-password">
                        Confirm Password
                    </label>
                    <input
                        id="signup-confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <div className="flex flex-col items-center justify-between gap-4">
                    <button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300"
                    >
                        Sign Up
                    </button>
                     <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="inline-block align-baseline font-bold text-sm text-primary-500 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                        Already have an account? Sign In
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignupPage;