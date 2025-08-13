import React, { useState, useMemo, useEffect } from 'react';
import { InterviewExperience, Difficulty, View } from '../types';
import { SparklesIcon, CloseIcon } from './Icons';
import { generatePrepTips } from '../services/geminiService';
import ExperienceCard from './ExperienceCard';
import { User } from '../App';


const AIPoweredTips: React.FC<{ company: string, role: string, onDone: () => void }> = ({ company, role, onDone }) => {
    const [tips, setTips] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            if (!company || !role) {
                 setTips("<p>Please select a company and role from an experience card.</p>");
                 setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const generatedTips = await generatePrepTips(company, role);
            setTips(generatedTips);
            setIsLoading(false);
        };

        fetchTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company, role]);

    return (
        <div className="relative mt-4 p-4 border border-primary-300 dark:border-primary-700 rounded-lg bg-primary-50 dark:bg-primary-900/20">
             <button onClick={onDone} className="absolute top-3 right-3 p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors" aria-label="Close helper">
                <CloseIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary-700 dark:text-primary-300 mb-2 pr-8">
                <SparklesIcon className="w-6 h-6" />
                Prep Tips for {role} at {company}
            </h3>
            
            {isLoading && <div className="mt-4 text-center animate-pulse text-slate-600 dark:text-slate-400">Generating tips...</div>}
            {tips && (
                 <div className="mt-2 prose prose-slate dark:prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: tips }}></div>
            )}
        </div>
    );
}

interface InterviewPortalProps {
    experiences: InterviewExperience[];
    onNavigate: (view: View) => void;
    onLike: (id: number) => void;
    onAddComment: (id: number, text: string) => void;
    onDeleteComment: (experienceId: number, commentDate: string, commentUser: string) => void;
    currentUser: User | null;
}

const InterviewPortal: React.FC<InterviewPortalProps> = ({ experiences, onNavigate, onLike, onAddComment, onDeleteComment, currentUser }) => {
    const [search, setSearch] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    const [sortBy, setSortBy] = useState('popularity');
    const [aiHelperState, setAiHelperState] = useState<{show: boolean, company: string, role: string}>({show: false, company: '', role: ''});

    const filteredExperiences = useMemo(() => {
        let filtered = experiences.filter(exp =>
            (exp.company_name.toLowerCase().includes(search.toLowerCase()) || exp.role.toLowerCase().includes(search.toLowerCase())) &&
            (difficultyFilter === 'all' || exp.difficulty === difficultyFilter)
        );

        if (sortBy === 'popularity') {
            filtered.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === 'date') {
            filtered.sort((a, b) => new Date(b.interview_date).getTime() - new Date(a.interview_date).getTime());
        }

        return filtered;
    }, [experiences, search, difficultyFilter, sortBy]);
    
    const handleSelectForAITips = (company: string, role: string) => {
        setAiHelperState({ show: true, company, role });
        const sidebar = document.getElementById('ai-prep-sidebar');
        if (sidebar) {
            sidebar.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className="md:w-auto px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="all">All Difficulties</option>
                            {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                         <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="md:w-auto px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="popularity">Sort by Likes</option>
                            <option value="date">Sort by Date</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        {filteredExperiences.length > 0 ? (
                            filteredExperiences.map(exp => 
                                <ExperienceCard 
                                    key={exp.id} 
                                    experience={exp}
                                    onSelectForAITips={handleSelectForAITips}
                                    onLike={onLike}
                                    onAddComment={onAddComment}
                                    onDeleteComment={onDeleteComment}
                                    currentUser={currentUser}
                                />)
                        ) : (
                             <div className="text-center py-16">
                                <h3 className="text-xl font-semibold">No Experiences Found</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <aside id="ai-prep-sidebar" className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2">Share Your Story</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                {currentUser ? "Help your peers by sharing your interview experience." : "Log in to share your experience and help the community."}
                            </p>
                            <button 
                                onClick={() => onNavigate(View.SubmitExperience)}
                                disabled={!currentUser}
                                className="w-full bg-primary-500 text-white font-bold px-4 py-2 rounded-md hover:bg-primary-600 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                Submit Experience
                            </button>
                        </div>
                         <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6 text-primary-500"/>
                                AI Prep Assistant
                            </h3>
                             <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Click the ✨ icon on an experience card to get tailored prep tips for that role.
                            </p>
                             {aiHelperState.show && (
                                <AIPoweredTips company={aiHelperState.company} role={aiHelperState.role} onDone={() => setAiHelperState({show: false, company: '', role: ''})} />
                             )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default InterviewPortal;