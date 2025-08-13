import React, { useState } from 'react';
import { InterviewExperience, Difficulty, Comment } from '../types';
import { ThumbsUpIcon, ChatAltIcon, SparklesIcon, TrashIcon } from './Icons';
import { User } from '../App';

const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
    const colors = {
        [Difficulty.Easy]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        [Difficulty.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        [Difficulty.Hard]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        [Difficulty.VeryHard]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors[difficulty]}`}>{difficulty}</span>;
};

const CommentSection: React.FC<{
    comments: Comment[];
    experienceId: number;
    currentUser: User | null;
    onAddComment: (id: number, text: string) => void;
    onDeleteComment: (experienceId: number, commentDate: string, commentUser: string) => void;
}> = ({ comments, experienceId, currentUser, onAddComment, onDeleteComment }) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && currentUser) {
            onAddComment(experienceId, newComment);
            setNewComment('');
        }
    };

    return (
        <div className="mt-4">
            <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Comments ({comments.length})</h5>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {comments.map((comment, index) => (
                    <div key={index} className="group text-sm bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md flex justify-between items-start">
                        <div>
                            <p className="text-slate-800 dark:text-slate-200">{comment.text}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">- {comment.user} on {comment.date}</p>
                        </div>
                        {currentUser && (currentUser.role === 'admin' || currentUser.username === comment.user) && (
                             <button onClick={() => window.confirm('Delete this comment?') && onDeleteComment(experienceId, comment.date, comment.user)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full">
                                <TrashIcon className="w-4 h-4"/>
                             </button>
                        )}
                    </div>
                ))}
                {comments.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No comments yet.</p>}
            </div>
            {currentUser ? (
                <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button type="submit" className="px-3 py-2 text-sm font-semibold bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">Post</button>
                </form>
            ) : (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Log in to post a comment.</p>
            )}
        </div>
    );
};


interface ExperienceCardProps {
    experience: InterviewExperience;
    currentUser: User | null;
    onSelectForAITips: (company: string, role: string) => void;
    onLike: (id: number) => void;
    onAddComment: (id: number, text: string) => void;
    onDeleteComment: (experienceId: number, commentDate: string, commentUser: string) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, currentUser, onSelectForAITips, onLike, onAddComment, onDeleteComment }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{experience.company_name}</h3>
                        <p className="text-md font-semibold text-primary-600 dark:text-primary-400">{experience.role}</p>
                    </div>
                    <DifficultyBadge difficulty={experience.difficulty} />
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    <p>By: {experience.student_name || 'Anonymous'} on {experience.interview_date}</p>
                </div>
            </div>
            
            <div className="px-5 pb-4 border-t border-slate-200 dark:border-slate-700">
                 {isExpanded && (
                    <div className="mt-4 prose prose-slate dark:prose-invert prose-sm max-w-none">
                        <h4 className="font-semibold">Interview Rounds</h4>
                        <ul>
                            {experience.rounds.map((round, index) => (
                                <li key={index}><strong>{round.type}:</strong> {round.description}</li>
                            ))}
                        </ul>
                        <h4 className="font-semibold">Key Questions</h4>
                        <p>{experience.questions}</p>
                        <h4 className="font-semibold">Preparation Tips</h4>
                        <p>{experience.tips}</p>
                        <CommentSection 
                            comments={experience.comments} 
                            experienceId={experience.id}
                            currentUser={currentUser}
                            onAddComment={onAddComment}
                            onDeleteComment={onDeleteComment}
                        />
                    </div>
                )}
                
                <div className="mt-4 flex items-center justify-between">
                     <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                        <button onClick={() => onLike(experience.id)} disabled={!currentUser} className="flex items-center gap-1.5 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed">
                            <ThumbsUpIcon className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                            <span className="text-sm font-semibold">{experience.likes}</span>
                        </button>
                         <div className="flex items-center gap-1.5">
                            <ChatAltIcon className="w-5 h-5" /> 
                            <span className="text-sm font-semibold">{experience.comments.length}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => onSelectForAITips(experience.company_name, experience.role)} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                            <SparklesIcon className="w-4 h-4" />
                            Get AI Prep Tips
                        </button>
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:underline">
                            {isExpanded ? 'Show Less' : 'Show More...'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;