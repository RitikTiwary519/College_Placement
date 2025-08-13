import React, { useState, useMemo } from 'react';
import { companies } from '../data';
import CompanyCard from './CompanyCard';

const ITEMS_PER_PAGE = 12;

const CompanyListings: React.FC<{onCompanySelect: (companyName: string) => void}> = ({ onCompanySelect }) => {
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        category: 'all',
        criteria: 'all'
    });
    const [currentPage, setCurrentPage] = useState(1);
    
    const uniqueCriteria = useMemo(() => [...new Set(companies.flatMap(c => c.criteria))], []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const filteredCompanies = useMemo(() => {
        let sortedCompanies = [...companies].sort((a,b) => (b.registration_date || "").localeCompare(a.registration_date || ""));

        return sortedCompanies.filter(company => {
            const searchMatch = company.company_name.toLowerCase().includes(filters.search.toLowerCase());
            const typeMatch = filters.type === 'all' || company.type.toLowerCase().includes(filters.type.toLowerCase());
            const categoryMatch = filters.category === 'all' || company.category === filters.category;
            const criteriaMatch = filters.criteria === 'all' || company.criteria.includes(filters.criteria);
            return searchMatch && typeMatch && categoryMatch && criteriaMatch;
        });
    }, [filters]);

    const paginatedCompanies = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredCompanies, currentPage]);

    const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Last Year's Visiting Companies</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Click on a company to view student interview experiences.</p>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm mb-8 sticky top-[65px] z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search company..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="all">All Types</option>
                        <option value="Job">Job</option>
                        <option value="Internship">Internship</option>
                        <option value="Job,Internship">Job & Internship</option>
                    </select>
                    <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="all">All Categories</option>
                        <option value="A1">A1</option>
                        <option value="A">A</option>
                    </select>
                    <select name="criteria" value={filters.criteria} onChange={handleFilterChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option value="all">All Criteria</option>
                        {uniqueCriteria.sort().map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {paginatedCompanies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedCompanies.map(company => (
                        <div key={company.company_name + (company.start_date || '')} onClick={() => onCompanySelect(company.company_name)} className="cursor-pointer group">
                             <CompanyCard company={company} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold">No Companies Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your filters.</p>
                </div>
            )}
            
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-slate-600 dark:text-slate-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default CompanyListings;
