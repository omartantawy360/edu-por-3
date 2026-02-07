import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CompetitionCard from '../components/ui/CompetitionCard';
import { Search, Filter, Sparkles, Trophy } from 'lucide-react';
import { Button } from '../components/ui/Button';

const RecommendationsPage = () => {
    const navigate = useNavigate();
    const { competitions } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const handleRegister = (competition) => {
        navigate('/register', { state: { selectedCompetition: competition } });
    };

    const filteredCompetitions = competitions.filter(comp => {
        const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comp.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || comp.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            {/* Hero / Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 opacity-90 transition-all duration-700 group-hover:scale-105"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/3 -translate-y-1/3 transition-transform duration-700 group-hover:rotate-12">
                    <Trophy size={400} />
                </div>

                <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-violet-200 animate-fade-in">
                            <Sparkles size={14} />
                            Discover Your Next Challenge
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight animate-fade-in delay-100">
                            Find the Perfect <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-pink-200">Competition</span>
                        </h1>
                        <p className="text-lg text-violet-100/80 max-w-lg leading-relaxed animate-fade-in delay-200">
                            Explore a curated list of academic and creative competitions designed to showcase your skills and help you grow.
                        </p>
                    </div>
                </div>

                {/* Search & Filter Bar - Floating */}
                <div className="relative z-20 px-4 sm:px-8 pb-8 -mb-8">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-2 animate-fade-up delay-300">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search competitions, topics, or keywords..."
                                className="w-full h-12 pl-12 pr-4 rounded-xl bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-700/50 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                        <div className="flex items-center gap-2 w-full sm:w-auto p-1 overflow-x-auto no-scrollbar">
                            {['All', 'Internal', 'Outer'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${filterType === type
                                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md transform scale-105'
                                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="pt-12 pb-12 px-2 sm:px-0">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Trophy className="text-violet-500" size={24} />
                        Available Competitions
                        <span className="ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold">
                            {filteredCompetitions.length}
                        </span>
                    </h2>
                </div>

                {filteredCompetitions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompetitions.map((competition) => (
                            <CompetitionCard
                                key={competition.id}
                                competition={competition}
                                onRegister={handleRegister}
                                showActions={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No competitions found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2">
                            We couldn't find any competitions matching "{searchTerm}". Try adjusting your filters or search terms.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-6"
                            onClick={() => { setSearchTerm(''); setFilterType('All'); }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationsPage;
