import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CompetitionCard from '../components/ui/CompetitionCard';

const RecommendationsPage = () => {
    const navigate = useNavigate();
    const { competitions } = useApp();

    const handleRegister = (competition) => {
        navigate('/register', { state: { selectedCompetition: competition } });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6 sm:mb-10">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50 mb-2">Find Competitions</h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">Discover exciting competitions and interesting challenges</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {competitions.map((competition) => (
                    <CompetitionCard
                        key={competition.id}
                        competition={competition}
                        onRegister={handleRegister}
                        showActions={true}
                    />
                ))}
            </div>

            {competitions.length === 0 && (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <p>No competitions available at the moment</p>
                </div>
            )}
        </div>
    );
};

export default RecommendationsPage;
