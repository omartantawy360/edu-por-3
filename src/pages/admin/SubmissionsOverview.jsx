import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link, useLocation } from 'react-router-dom';
import { useTeam } from '../../context/TeamContext';
import { useJudge } from '../../context/JudgeContext';
import { 
    CheckCircle, XCircle, Clock, Github, ExternalLink, MessageSquare, 
    FileText, Paperclip, Video, Image as ImageIcon, FileCode, Search, Trophy, User, Target, ChevronRight
} from 'lucide-react';

const SubmissionsOverview = () => {
    const { submissions, students, competitions, updateSubmissionStatus, addPost, editSubmission } = useApp();
    const { teams, updateTeamStatus } = useTeam();
    const { getAverageScore } = useJudge();
    
    const location = useLocation();
    const [filter, setFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [feedbackText, setFeedbackText] = useState('');

    // Stage Promotion Modal State
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [actionCompId, setActionCompId] = useState('');
    const [selectedQualifiers, setSelectedQualifiers] = useState({});

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

    const toggleQualifier = (teamId) => {
        setSelectedQualifiers(prev => ({ ...prev, [teamId]: !prev[teamId] }));
    };

    const handleExecutePromotion = () => {
        const comp = getCompetition(actionCompId);
        if (!comp) return;

        // Eliminate non-selected teams
        const compTeams = teams.filter(t => t.competitionId === actionCompId && t.status !== 'Eliminated');
        let promotedCount = 0;
        
        compTeams.forEach(team => {
            if (!selectedQualifiers[team.id]) {
                updateTeamStatus(team.id, 'Eliminated');
            } else {
                promotedCount++;
            }
        });

        // Announce
        const activeStage = comp.stages.find(s => s.status !== 'Completed') || comp.stages[0];
        addPost(actionCompId, {
            type: 'Stage',
            title: `Stage Results: ${activeStage.name} Concluded!`,
            description: `Congratulations to the ${promotedCount} top teams that qualified and advanced to the next phase of the competition! Teams that did not advance have been notified. Keep innovating!`,
            date: new Date().toISOString().split('T')[0],
            status: 'published'
        });

        alert(`Successfully promoted ${promotedCount} teams!`);
        setShowPromotionModal(false);
        setActionCompId('');
        setSelectedQualifiers({});
    };

    const handleFinalizeWinners = () => {
        const comp = getCompetition(actionCompId);
        if (!comp) return;

        const compTeams = teams.filter(t => t.competitionId === actionCompId && t.status !== 'Eliminated');
        
        // Sort teams by Judge score descending
        const scoredTeams = compTeams.map(team => {
            const sub = submissions.find(s => s.teamId === team.id && s.competitionId === actionCompId);
            const score = sub ? getAverageScore(sub.id) : 0;
            return { team, sub, score };
        }).sort((a, b) => b.score - a.score);

        // Assign Rank 1, 2, 3
        scoredTeams.forEach((item, index) => {
            if (item.sub) {
                const rank = index + 1;
                const isWinner = rank <= 3;
                editSubmission(item.sub.id, {
                    isWinner: isWinner,
                    rank: isWinner ? rank : null
                });
                if (isWinner) {
                    updateTeamStatus(item.team.id, `Winner (Rank ${rank})`);
                }
            }
        });

        addPost(actionCompId, {
            type: 'Result',
            title: `🏆 FINAL RESULTS: ${comp.name} Winners Announced!`,
            description: `The moment we've all been waiting for! The final results are in. Head over to the Leaderboard and Virtual Expo to see the winning projects. Congratulations to all participants!`,
            date: new Date().toISOString().split('T')[0],
            status: 'published'
        });

        alert(`Successfully finalized the Top 3 winners for ${comp.name}!`);
        setShowFinalizeModal(false);
        setActionCompId('');
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Submissions Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Review and manage student submissions</p>
            </div>

            {/* Filter Tabs & Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-wrap gap-2">
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

                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-4">
                    <button
                        onClick={() => { setShowPromotionModal(true); setActionCompId(''); }}
                        className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Target size={18} /> Advance Stage
                    </button>
                    <button
                        onClick={() => { setShowFinalizeModal(true); setActionCompId(''); }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Trophy size={18} /> Finalize Winners
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

                                    <div className="flex items-center gap-4">
                                        <Link
                                            to={location.pathname.startsWith('/admin') ? `/admin/submission/${submission.id}` : `/submission/${submission.id}`}
                                            className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                                        >
                                            <Search size={14} /> Full Details
                                        </Link>

                                        {submission.url && (
                                            <a
                                                href={submission.url.startsWith('http') ? submission.url : `https://${submission.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-500 hover:text-primary-600 text-sm flex items-center gap-1.5 transition-colors"
                                            >
                                                <ExternalLink size={14} /> External Link
                                            </a>
                                        )}
                                    </div>

                                    {submission.feedback && (
                                        <div className="mt-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20">
                                            <p className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest mb-1 shadow-sm">Official Feedback</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">"{submission.feedback}"</p>
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-0 ring-1 ring-white/10 sidebar-scroll">
                        {/* Modal Header */}
                        <div className="sticky top-0 z-10 p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">{selectedSubmission.title}</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                    <User size={14} /> {getStudent(selectedSubmission.studentId)?.name}
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    {getCompetition(selectedSubmission.competitionId)?.name}
                                </p>
                            </div>
                            <button 
                                onClick={() => { setSelectedSubmission(null); setFeedbackText(''); }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Technical Report */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} className="text-violet-500" /> TECHNICAL REPORT
                                </h4>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {selectedSubmission.description || "No technical report provided for this submission."}
                                </div>
                            </div>

                            {/* Assets Grid */}
                            {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Paperclip size={16} className="text-violet-500" /> PROJECT ASSETS ({selectedSubmission.files.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedSubmission.files.map((file, idx) => {
                                            const fileName = file.name || file;
                                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                                            const isVideo = /\.(mp4|mov|avi|wmv)$/i.test(fileName);
                                            const isPdf = /\.pdf$/i.test(fileName);
                                            return (
                                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-violet-200 transition-all">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className={`p-2 rounded-lg ${isImage ? 'bg-blue-50 text-blue-500' : isVideo ? 'bg-amber-50 text-amber-500' : isPdf ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                                                            {isImage ? <ImageIcon size={14} /> : isVideo ? <Video size={14} /> : isPdf ? <FileText size={14} /> : <FileCode size={14} />}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{fileName}</span>
                                                    </div>
                                                    <ExternalLink size={14} className="text-slate-300 group-hover:text-violet-500 transition-colors" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Code Preview */}
                            {selectedSubmission.codeSnippet && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Github size={16} className="text-violet-500" /> SOURCE CODE PREVIEW
                                    </h4>
                                    <div className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl">
                                        <div className="absolute top-0 left-0 w-full h-8 bg-slate-800/80 flex items-center justify-between px-4 border-b border-white/5">
                                            <div className="flex gap-1.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-400 font-bold tracking-wider">main{selectedSubmission.codeExt || '.js'}</span>
                                        </div>
                                        <pre className="p-6 pt-12 text-xs font-mono text-slate-300 overflow-x-auto sidebar-scroll leading-relaxed">
                                            <code>{selectedSubmission.codeSnippet}</code>
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Actions & Feedback */}
                            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">JUDGE FEEDBACK / DECISION SUMMARY</label>
                                    <textarea
                                        className="w-full px-5 py-4 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none dark:bg-slate-950 dark:text-white transition-all shadow-inner min-h-[120px]"
                                        placeholder="Enter constructive feedback for the student..."
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <button
                                        onClick={() => handleReject(selectedSubmission.id)}
                                        className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-bold flex items-center justify-center gap-2 border border-red-100"
                                    >
                                        <XCircle size={18} /> Reject Submission
                                    </button>
                                    <button
                                        onClick={() => handleApprove(selectedSubmission.id)}
                                        className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:shadow-lg hover:shadow-emerald-500/20 transition-all font-bold flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Approve Submission
                                    </button>
                                </div>
                                <button
                                    onClick={() => { setSelectedSubmission(null); setFeedbackText(''); }}
                                    className="w-full py-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-sm font-semibold"
                                >
                                    Close without changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Advance Stage / Promotion Modal */}
            {showPromotionModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-0 ring-1 ring-white/10 sidebar-scroll p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2"><Target size={24} className="text-violet-500"/> Team Promotion</h3>
                                <p className="text-sm text-slate-500 mt-1">Select teams to skip elimination and advance to the next competition stage.</p>
                            </div>
                            <button onClick={() => setShowPromotionModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><XCircle size={24} className="text-slate-400" /></button>
                        </div>
                        
                        <div className="space-y-4">
                            <select 
                                value={actionCompId} 
                                onChange={(e) => {
                                    setActionCompId(e.target.value);
                                    setSelectedQualifiers({});
                                }}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-slate-50 dark:bg-slate-800 font-bold"
                            >
                                <option value="">-- Choose Competition to Conclude Phase --</option>
                                {competitions.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            {actionCompId && (
                                <div className="space-y-3 mt-4">
                                    <p className="text-sm font-bold text-slate-500 uppercase">Qualifying Teams</p>
                                    {teams.filter(t => t.competitionId === actionCompId && t.status !== 'Eliminated').map(team => {
                                        const sub = submissions.find(s => s.teamId === team.id && s.competitionId === actionCompId);
                                        const score = sub ? getAverageScore(sub.id) : 0;
                                        const isSelected = !!selectedQualifiers[team.id];
                                        return (
                                            <div key={team.id} className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all ${isSelected ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-violet-300'}`} onClick={() => toggleQualifier(team.id)}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isSelected ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                                    {isSelected && <CheckCircle size={14} className="text-white" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{team.name}</h4>
                                                    <p className="text-xs text-slate-500">Judges Average: {score}/100</p>
                                                </div>
                                                <div className={`px-3 py-1 bg-white dark:bg-slate-800 shadow-sm rounded-lg font-mono font-bold ${score >= 75 ? 'text-emerald-600' : 'text-slate-600'}`}>
                                                    {score} pts
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {teams.filter(t => t.competitionId === actionCompId && t.status !== 'Eliminated').length === 0 && (
                                        <p className="text-red-500 text-sm">No active teams remaining.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button 
                                disabled={!actionCompId}
                                onClick={handleExecutePromotion}
                                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                            >
                                <ChevronRight size={18} /> Execute Elimination & Promote
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Finalize Winners Modal */}
            {showFinalizeModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border-0 ring-1 ring-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2"><Trophy size={24} className="text-amber-500"/> Finalize Winners</h3>
                                <p className="text-sm text-slate-500 mt-1">Automatically assign Rank 1, 2, 3 to the teams with the highest Judge scores.</p>
                            </div>
                            <button onClick={() => setShowFinalizeModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><XCircle size={24} className="text-slate-400" /></button>
                        </div>
                        
                        <div className="space-y-4">
                            <select 
                                value={actionCompId} 
                                onChange={(e) => setActionCompId(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-violet-500 bg-slate-50 dark:bg-slate-800 font-bold"
                            >
                                <option value="">-- Choose Competition to Finalize --</option>
                                {competitions.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            {actionCompId && (
                                <div className="space-y-3 mt-4">
                                    <p className="text-sm font-bold text-slate-500 uppercase">Top 3 Leaderboard Preview</p>
                                    {teams.filter(t => t.competitionId === actionCompId && t.status !== 'Eliminated').map(team => {
                                        const sub = submissions.find(s => s.teamId === team.id && s.competitionId === actionCompId);
                                        return { team, sub, score: sub ? getAverageScore(sub.id) : 0 };
                                    }).sort((a,b) => b.score - a.score).slice(0, 3).map((item, index) => (
                                        <div key={item.team.id} className="p-4 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-amber-400 text-white font-black flex items-center justify-center">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-amber-900 dark:text-amber-100">{item.team.name}</h4>
                                                <p className="text-xs text-amber-700/70 dark:text-amber-300">Score: {item.score}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <button 
                                disabled={!actionCompId}
                                onClick={handleFinalizeWinners}
                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:shadow-lg hover:shadow-amber-500/30 text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50"
                            >
                                <Trophy size={18} /> Confirm Winners & Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionsOverview;
