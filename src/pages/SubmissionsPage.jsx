import React from 'react';
import SubmissionTracker from '../components/ui/SubmissionTracker';

const SubmissionsPage = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">My Submissions</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage your project submissions</p>
            </div>
            <SubmissionTracker />
        </div>
    );
};

export default SubmissionsPage;
