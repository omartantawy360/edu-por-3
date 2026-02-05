import React from 'react';
import SkillMap from '../components/ui/SkillMap';

const SkillsPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50">My Skills</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your performance skills and progress</p>
            </div>
            <SkillMap />
        </div>
    );
};

export default SkillsPage;
