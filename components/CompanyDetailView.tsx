import React from 'react';
import { InterviewExperience } from '../types';
import ExperienceCard from './ExperienceCard';
import { ArrowLeftIcon } from './Icons';
import { companies } from '../data'; // to get company details
import { User } from '../App';

interface CompanyDetailViewProps {
    companyName: string;
    allExperiences: InterviewExperience[];
    onBack: () => void;
    onLike: (id: number) => void;
    onAddComment: (id: number, text: string) => void;
    onDeleteComment: (experienceId: number, commentDate: string, commentUser: string) => void;
    currentUser: User | null;
}

const CompanyDetailView: React.FC<CompanyDetailViewProps> = ({ companyName, allExperiences, onBack, onLike, onAddComment, onDeleteComment, currentUser }) => {
    const companyDetails = companies.find(c => c.company_name === companyName);
    const relevantExperiences = allExperiences.filter(exp => exp.company_name === companyName);

    // AI tips logic would need to be handled here or passed down if desired
    const handleSelectForAITips = (company: string, role: string) => {
        // Placeholder for now, could be implemented with a modal or sidebar
        alert(`AI Prep Tips for ${role} at ${company} would be shown here.`);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex items-center gap-4">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700" aria-label="Go back">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{companyName}</h2>
                    {companyDetails && <p className="text-slate-600 dark:text-slate-400">Type: {companyDetails.type} | Category: {companyDetails.category}</p>}
                </div>
            </div>

            <div className="space-y-6">
                {relevantExperiences.length > 0 ? (
                    relevantExperiences.map(exp => (
                        <ExperienceCard 
                            key={exp.id} 
                            experience={exp} 
                            onSelectForAITips={handleSelectForAITips}
                            onLike={onLike}
                            onAddComment={onAddComment}
                            onDeleteComment={onDeleteComment}
                            currentUser={currentUser}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">No Experiences Shared Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Be the first to share an interview experience for {companyName}!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDetailView;