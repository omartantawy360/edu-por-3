import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, Clock, Github, ExternalLink, MessageSquare } from 'lucide-react';

const SubmissionsOverview = () => {
    const { submissions, students, competitions, updateSubmissionStatus } = useApp();
    const [filter, setFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');

    const filteredSubmissions = submissions.filter(sub => {
        if (filter === 'all') return true;
        return sub.status === filter;
    });

    const getStudent = (studentId) => students.find(s => s.id === studentId);
    const getCompetition = (competitionId) => competitions.find(c => c.id === competitionId);

    const handleApprove = (submissionId) => {
        updateSubmissionStatus(submissionId, 'approved', feedbackText || 'Approved');
        setSelectedSubmission(null);
        setFeedbackText('');
    };

    const handleReject = (submissionId) => {
        updateSubmissionStatus(submissionId, 'rejected', feedbackText || 'Needs improvement');
        setSelectedSubmission(null);
        setFeedbackText('');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Submissions Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage student submissions</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-primary-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        All ({submissions.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'pending'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        Pending ({submissions.filter(s => s.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'approved'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        Approved ({submissions.filter(s => s.status === 'approved').length})
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            filter === 'rejected'
                                ? 'bg-red-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        Rejected ({submissions.filter(s => s.status === 'rejected').length})
                    </button>
                </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                    const student = getStudent(submission.studentId);
                    const competition = getCompetition(submission.competitionId);

                    return (
                        <div key={submission.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50">{submission.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            submission.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {submission.status === 'approved' && <CheckCircle className="inline mr-1" size={12} />}
                                            {submission.status === 'pending' && <Clock className="inline mr-1" size={12} />}
                                            {submission.status === 'rejected' && <XCircle className="inline mr-1" size={12} />}
                                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400">Student</p>
                                            <p className="font-medium text-slate-800 dark:text-slate-50">{student?.name || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400">Competition</p>
                                            <p className="font-medium text-slate-800 dark:text-slate-50">{competition?.name || 'Unknown'}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400">Submitted</p>
                                            <p className="font-medium text-slate-800 dark:text-slate-50">{submission.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400">Type</p>
                                            <p className="font-medium text-slate-800 dark:text-slate-50 flex items-center gap-1">
                                                {submission.type === 'github' ? <Github size={14} /> : <ExternalLink size={14} />}
                                                {submission.type}
                                            </p>
                                        </div>
                                    </div>

                                    <a
                                        href={submission.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1 mb-3"
                                    >
                                        View Submission <ExternalLink size={14} />
                                    </a>

                                    {submission.feedback && (
                                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                                                <MessageSquare size={12} /> Feedback
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-200">{submission.feedback}</p>
                                        </div>
                                    )}
                                </div>

                                {submission.status === 'pending' && (
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => setSelectedSubmission(submission)}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {filteredSubmissions.length === 0 && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <p className="text-slate-400 dark:text-slate-500">No submissions found</p>
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-50 mb-4">Review Submission</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Title</p>
                                <p className="text-slate-900 dark:text-slate-50">{selectedSubmission.title}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Student</p>
                                <p className="text-slate-900 dark:text-slate-50">{getStudent(selectedSubmission.studentId)?.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Feedback</label>
                                <textarea
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                                    rows="4"
                                    placeholder="Provide feedback for the student..."
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    onClick={() => {
                                        setSelectedSubmission(null);
                                        setFeedbackText('');
                                    }}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReject(selectedSubmission.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedSubmission.id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionsOverview;
