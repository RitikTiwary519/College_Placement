import React, { useState } from 'react';
import { Difficulty, InterviewExperience } from '../types';
import { User } from '../App';

interface SubmitExperienceFormProps {
    onSubmit: (experience: Omit<InterviewExperience, 'id' | 'popularity' | 'likes' | 'comments'>) => void;
    onCancel: () => void;
    currentUser: User;
}

const SubmitExperienceForm: React.FC<SubmitExperienceFormProps> = ({ onSubmit, onCancel, currentUser }) => {
    const [formData, setFormData] = useState({
        company_name: '',
        role: '',
        interview_date: new Date().toISOString().split('T')[0],
        difficulty: Difficulty.Medium,
        rounds: '',
        questions: '',
        tips: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newExperience = {
            ...formData,
            student_name: currentUser.username, // Use current user's name
            rounds: [{type: 'Summary', description: formData.rounds}], // Simplified for form
        };
        
        onSubmit(newExperience);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Share Your Interview Experience</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="company_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                            <input type="text" name="company_name" id="company_name" required value={formData.company_name} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500" />
                        </div>
                         <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role / Position</label>
                            <input type="text" name="role" id="role" required value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="interview_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Interview Date</label>
                            <input type="date" name="interview_date" id="interview_date" required value={formData.interview_date} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500" />
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Difficulty</label>
                            <select name="difficulty" id="difficulty" required value={formData.difficulty} onChange={handleChange} className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500">
                                {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="rounds" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Interview Rounds</label>
                        <textarea name="rounds" id="rounds" rows={4} required value={formData.rounds} onChange={handleChange} placeholder="Describe the number and type of rounds (e.g., 1. Online Assessment, 2. Technical Interview...)" className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                    <div>
                        <label htmlFor="questions" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Questions Asked</label>
                        <textarea name="questions" id="questions" rows={4} required value={formData.questions} onChange={handleChange} placeholder="What were some of the key questions you were asked?" className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                     <div>
                        <label htmlFor="tips" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Preparation Tips</label>
                        <textarea name="tips" id="tips" rows={4} required value={formData.tips} onChange={handleChange} placeholder="Any tips for students preparing for this role?" className="mt-1 block w-full rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-primary-500"></textarea>
                    </div>
                     <div>
                        <label htmlFor="student_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Your Name</label>
                        <input type="text" name="student_name" id="student_name" value={currentUser.username} readOnly className="mt-1 block w-full rounded-md bg-slate-200 dark:bg-slate-600 border-transparent focus:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition">Submit Experience</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitExperienceForm;