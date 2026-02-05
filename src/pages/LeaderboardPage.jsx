import React from 'react';
import CompetitionLeaderboard from '../components/ui/CompetitionLeaderboard';

const LeaderboardPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Leaderboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">See how you rank in each competition</p>
            </div>
            <CompetitionLeaderboard />
        </div>
    );
};

export default LeaderboardPage;
