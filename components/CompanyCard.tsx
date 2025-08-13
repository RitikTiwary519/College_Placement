import React from 'react';
import { Company } from '../types';

const Tag: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${className}`}>
        {children}
    </span>
);

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
    const isRegistrationOpen = () => {
        if (!company.registration_date) return false;
        const regDate = new Date(company.registration_date);
        const today = new Date();
        const placementOpenDate = company.placement_open ? new Date(company.placement_open) : null;
        
        if (placementOpenDate && today > placementOpenDate) return false;

        // Check if registration end date is defined. If so, registration is closed after that date.
        // Assuming registration closes at the end of the start_date if no end_date is specified.
        const regEndDate = company.end_date ? new Date(company.end_date) : (company.start_date ? new Date(company.start_date) : null);
        if (regEndDate && today > regEndDate) return false;

        return today >= regDate;
    };

    const registrationStatus = isRegistrationOpen();
    const categoryClass = company.category === 'A1' ? 'bg-amber-200 text-amber-800 dark:bg-amber-700 dark:text-amber-100' : 'bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-200';
    
    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md group-hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 pr-2">{company.company_name}</h3>
                    <Tag className={categoryClass}>{company.category}</Tag>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                    <Tag className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">{company.type}</Tag>
                    <Tag className={registrationStatus ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-100'}>
                        {registrationStatus ? 'Open' : 'Closed'}
                    </Tag>
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Eligible Criteria:</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300 break-words">{company.criteria.join(', ')}</p>
                </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 text-sm">
                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                    <p><strong className="font-semibold">Registration:</strong> {company.registration_date || 'N/A'}</p>
                    <p><strong className="font-semibold">Placement:</strong> {company.placement_open || 'N/A'}</p>
                    <p><strong className="font-semibold">Starts:</strong> {company.start_date || 'N/A'}</p>
                    <p><strong className="font-semibold">Ends:</strong> {company.end_date || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};


export default CompanyCard;
