import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, XCircle, Github, ExternalLink, Plus, Filter, FileText, Send } from 'lucide-react';

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
        switch (status) {
            case 'approved': return <CheckCircle className="text-emerald-500" size={18} />;
            case 'pending': return <Clock className="text-amber-500" size={18} />;
            case 'rejected': return <XCircle className="text-red-500" size={18} />;
            default: return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';
            case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
            case 'rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-50 flex items-center gap-2">
                        <FileText className="text-violet-600" size={20} />
                        Submission Tracker
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track your project submissions</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none dark:bg-slate-800 dark:text-slate-200 bg-slate-50 appearance-none min-w-[180px]"
                            value={filterCompetition}
                            onChange={(e) => setFilterCompetition(e.target.value)}
                        >
                            <option value="all">All Competitions</option>
                            {competitions.map(comp => (
                                <option key={comp.id} value={comp.id}>{comp.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm ${showForm
                                ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                : 'bg-violet-600 text-white hover:bg-violet-700 hover:shadow-violet-500/25'
                            }`}
                    >
                        {showForm ? <XCircle size={16} /> : <Plus size={16} />}
                        {showForm ? 'Cancel' : 'New Submission'}
                    </button>
                </div>
            </div>

            {/* Add Submission Form */}
            {showForm && (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-violet-100 dark:border-slate-800 p-6 md:p-8 animate-fade-in-down relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Submit Your Project</h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Competition</label>
                                <select
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                    value={formData.competitionId}
                                    onChange={(e) => setFormData({ ...formData, competitionId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Competition</option>
                                    {competitions.map(comp => (
                                        <option key={comp.id} value={comp.id}>{comp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Submission Type</label>
                                <select
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="github">GitHub Repository</option>
                                    <option value="link">Project Link / Demo</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Project Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-slate-400"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. EcoTracker App"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Project URL</label>
                            <div className="relative">
                                {formData.type === 'github' ? (
                                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                ) : (
                                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                )}
                                <input
                                    type="url"
                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-slate-400"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder={formData.type === 'github' ? "https://github.com/username/repo" : "https://your-project-demo.com"}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all flex items-center gap-2"
                            >
                                <Send size={18} />
                                Submit Project
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No submissions found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                            {filterCompetition !== 'all'
                                ? "You haven't submitted anything for this competition yet."
                                : "You haven't submitted any projects yet. Get started by clicking 'Add Submission'!"}
                        </p>
                    </div>
                ) : (
                    filteredSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className={`group p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md ${getStatusColor(submission.status).replace('bg-', 'border-').split(' ')[0] === 'border-slate-200' ? 'border-slate-200 dark:border-slate-700 hover:border-violet-300' : ''} relative overflow-hidden`}
                        >
                            <div className={`absolute top-0 right-0 w-1 h-full ${submission.status === 'approved' ? 'bg-emerald-500' :
                                    submission.status === 'pending' ? 'bg-amber-500' :
                                        submission.status === 'rejected' ? 'bg-red-500' : 'bg-slate-300'
                                }`}></div>

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{submission.title}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(submission.status)}`}>
                                            {submission.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3 flex items-center gap-2">
                                        <span className="truncate max-w-[200px]">{getCompetitionName(submission.competitionId)}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                        <span>{submission.date}</span>
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <a
                                            href={submission.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors"
                                        >
                                            {submission.type === 'github' ? <Github size={16} /> : <ExternalLink size={16} />}
                                            View Project
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {submission.feedback && (
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm">
                                        <p className="font-bold text-slate-700 dark:text-slate-300 text-xs uppercase mb-1">Judge's Feedback</p>
                                        <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">"{submission.feedback}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SubmissionTracker;
