import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useJudge } from '../context/JudgeContext';
import { Gavel, ClipboardList, CheckCircle2, Clock, BarChart3, ChevronRight, FileText, Eye, Lock, AlertCircle, TrendingUp } from 'lucide-react';

const JudgeDashboard = ({ tab }) => {
    const { user } = useAuth();
    const { submissions, competitions } = useApp();
    const { getJudgeAssignments, getAssignedSubmissions, getAnonymousSubmission, getEvaluation, getJudgeProgress, isLocked } = useJudge();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tab || 'overview');

    // Sync state with prop if it changes via navigation
    React.useEffect(() => {
        if (tab) setActiveTab(tab);
    }, [tab]);

    const judgeId = user?.id;

    const assignedSubs = useMemo(() =>
        getAssignedSubmissions(judgeId, submissions),
        [judgeId, submissions, getAssignedSubmissions]
    );

    const progress = useMemo(() =>
        getJudgeProgress(judgeId, submissions),
        [judgeId, submissions, getJudgeProgress]
    );

    const assignedCompetitions = useMemo(() => {
        const assigns = getJudgeAssignments(judgeId);
        const compIds = [...new Set(assigns.map(a => a.competitionId))];
        return compIds.map(cid => {
            const comp = competitions.find(c => c.id === cid);
            const compSubs = assignedSubs.filter(s => s.competitionId === cid);
            const reviewed = compSubs.filter(s => isLocked(judgeId, s.id)).length;
            return { ...comp, totalSubs: compSubs.length, reviewed };
        }).filter(c => c.id);
    }, [judgeId, competitions, assignedSubs, getJudgeAssignments, isLocked]);

    const pendingSubs = useMemo(() =>
        assignedSubs.filter(sub => !isLocked(judgeId, sub.id)),
        [assignedSubs, judgeId, isLocked]
    );

    const completedSubs = useMemo(() =>
        assignedSubs.filter(sub => isLocked(judgeId, sub.id)),
        [assignedSubs, judgeId, isLocked]
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'assigned', label: 'Pending', icon: ClipboardList, count: pendingSubs.length },
        { id: 'completed', label: 'Completed', icon: CheckCircle2, count: completedSubs.length },
    ];

    const renderSubmissionCard = (sub, index, isCompleted = false) => {
        const anon = getAnonymousSubmission(sub, index);
        const evaluation = getEvaluation(judgeId, sub.id);
        const comp = competitions.find(c => c.id === sub.competitionId);

        return (
            <div key={sub.id} className="group p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                                {anon.anonymousLabel}
                            </span>
                            {isCompleted && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Lock size={8} /> Reviewed
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">{sub.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{comp?.name || 'Unknown Competition'}</p>
                        {isCompleted && evaluation && (
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-20 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                            style={{ width: `${evaluation.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{evaluation.percentage}%</span>
                                </div>
                                <span className="text-[10px] text-slate-400">{evaluation.total}/{evaluation.maxTotal}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => navigate(`/judge/evaluate/${sub.id}`)}
                        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                            isCompleted
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5'
                        }`}
                    >
                        {isCompleted ? <Eye size={14} /> : <Gavel size={14} />}
                        {isCompleted ? 'View' : 'Evaluate'}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                        Judge Panel
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name}</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl px-4 py-2">
                    <Gavel size={16} className="text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Secure Evaluation Mode</span>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Assigned', value: progress.total, icon: ClipboardList, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Completed', value: progress.completed, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Remaining', value: progress.remaining, icon: Clock, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Progress', value: `${progress.percentage}%`, icon: TrendingUp, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm`}>
                                <stat.icon size={16} />
                            </div>
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{stat.value}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Phase Awareness Banners */}
            <div className="space-y-3">
                {assignedCompetitions.some(c => c.phase === 'Results Published') && (
                    <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-violet-500 shrink-0" />
                        <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">
                            Results for some assigned competitions have already been published. Evaluations are now read-only.
                        </p>
                    </div>
                )}
                {!assignedCompetitions.some(c => c.phase === 'Evaluation') && !assignedCompetitions.some(c => c.phase === 'Results Published') && (
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                        <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                            No competitions are currently in the Evaluation phase. You can preview submissions, but scoring may not be saved.
                        </p>
                    </div>
                )}
                {assignedCompetitions.some(c => c.phase === 'Evaluation') && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                        <Gavel className="h-5 w-5 text-emerald-500 shrink-0" />
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                            Evaluation phase is active. Please review all assigned submissions by the deadline.
                        </p>
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Evaluation Progress</span>
                    <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{progress.completed}/{progress.total}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ease-out"
                        style={{ width: `${progress.percentage}%` }}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-1.5">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                            activeTab === t.id
                                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <t.icon size={14} />
                        {t.label}
                        {t.count !== undefined && (
                            <span className={`h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                                activeTab === t.id ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                            }`}>
                                {t.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    {/* Assigned Competitions */}
                    <div>
                        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-emerald-500" /> Assigned Competitions
                        </h2>
                        {assignedCompetitions.length === 0 ? (
                            <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                <AlertCircle className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                                <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No competitions assigned yet</p>
                                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Contact admin for assignments</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {assignedCompetitions.map(comp => (
                                    <div key={comp.id} className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{comp.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{comp.description}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{comp.reviewed}/{comp.totalSubs}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase">Reviewed</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                                style={{ width: `${comp.totalSubs > 0 ? (comp.reviewed / comp.totalSubs) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Pending */}
                    {pendingSubs.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Clock size={16} className="text-amber-500" /> Pending Evaluations
                                </h2>
                                <button onClick={() => setActiveTab('assigned')} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                                    View All <ChevronRight size={12} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {pendingSubs.slice(0, 3).map((sub) => renderSubmissionCard(sub, assignedSubs.indexOf(sub), false))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'assigned' && (
                <div className="space-y-3">
                    {pendingSubs.length === 0 ? (
                        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 mb-3" />
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">All caught up!</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">You've reviewed all assigned submissions</p>
                        </div>
                    ) : (
                        pendingSubs.map((sub) => renderSubmissionCard(sub, assignedSubs.indexOf(sub), false))
                    )}
                </div>
            )}

            {activeTab === 'completed' && (
                <div className="space-y-3">
                    {completedSubs.length === 0 ? (
                        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <ClipboardList className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No reviews yet</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start evaluating to see completed reviews here</p>
                        </div>
                    ) : (
                        completedSubs.map((sub) => renderSubmissionCard(sub, assignedSubs.indexOf(sub), true))
                    )}
                </div>
            )}
        </div>
    );
};

export default JudgeDashboard;
