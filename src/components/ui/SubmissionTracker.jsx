import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, XCircle, Github, ExternalLink, Plus, Filter } from 'lucide-react';

const SubmissionTracker = () => {
    const { submissions, competitions, addSubmission, getStudentSubmissions } = useApp();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [filterCompetition, setFilterCompetition] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        type: 'github',
        competitionId: ''
    });

    // Use logged-in student ID from auth context
    const currentStudentId = user?.id || 'ST-001';
    const studentSubmissions = getStudentSubmissions(currentStudentId);

    const filteredSubmissions = studentSubmissions.filter(sub => {
        if (filterCompetition === 'all') return true;
        return sub.competitionId === filterCompetition;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addSubmission({
            ...formData,
            studentId: currentStudentId
        });
        setFormData({ title: '', url: '', type: 'github', competitionId: '' });
        setShowForm(false);
    };

    const getCompetitionName = (competitionId) => {
        const comp = competitions.find(c => c.id === competitionId);
        return comp?.name || 'Unknown';
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'approved': return <CheckCircle className="text-green-600" size={18} />;
            case 'pending': return <Clock className="text-yellow-600" size={18} />;
            case 'rejected': return <XCircle className="text-red-600" size={18} />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-50">Submission Tracker</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Submission
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4 flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <select
                    className="px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                    value={filterCompetition}
                    onChange={(e) => setFilterCompetition(e.target.value)}
                >
                    <option value="all">All Competitions</option>
                    {competitions.map(comp => (
                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                    ))}
                </select>
            </div>

            {/* Add Submission Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Competition</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                            value={formData.competitionId}
                            onChange={(e) => setFormData({...formData, competitionId: e.target.value})}
                            required
                        >
                            <option value="">Select Competition</option>
                            {competitions.map(comp => (
                                <option key={comp.id} value={comp.id}>{comp.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Project title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">URL</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                            value={formData.url}
                            onChange={(e) => setFormData({...formData, url: e.target.value})}
                            placeholder="https://github.com/..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Type</label>
                        <select
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="github">GitHub</option>
                            <option value="link">External Link</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            )}

            {/* Submissions List */}
            <div className="space-y-3">
                {filteredSubmissions.map((submission) => (
                        <div 
                        key={submission.id}
                        className={`p-4 rounded-lg border ${getStatusColor(submission.status)} dark:bg-slate-900`}
                    >
                        <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-slate-800 dark:text-slate-50">{submission.title}</h3>
                                    {getStatusIcon(submission.status)}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                                    {getCompetitionName(submission.competitionId)} • {submission.date}
                                </p>
                                <a
                                    href={submission.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                >
                                    {submission.type === 'github' ? <Github size={14} /> : <ExternalLink size={14} />}
                                    View Submission
                                </a>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                        </div>
                        {submission.feedback && (
                            <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                                <p className="text-xs font-medium text-slate-700 mb-1">Feedback:</p>
                                <p className="text-sm text-slate-600 italic">"{submission.feedback}"</p>
                            </div>
                        )}
                    </div>
                ))}

                        {filteredSubmissions.length === 0 && (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                        <p>No submissions yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionTracker;
