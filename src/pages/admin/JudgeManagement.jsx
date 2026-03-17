import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useJudge } from '../../context/JudgeContext';
import { Gavel, Plus, Users, BarChart3, Eye, X, ChevronDown, CheckCircle2, AlertCircle, Trash2, Settings, Award, TrendingUp } from 'lucide-react';
import RubricBuilder from '../../components/ui/RubricBuilder';

const JudgeManagement = () => {
    const { competitions, submissions, students } = useApp();
    const {
        judges, addJudge, removeJudge,
        assignments, assignJudge, unassignJudge, getJudgeAssignments, getCompetitionJudges,
        evaluations, getSubmissionEvaluations, getAverageScore,
        getRubric, saveRubric, getJudgeProgress
    } = useJudge();

    const [activeTab, setActiveTab] = useState('judges');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedJudge, setSelectedJudge] = useState(null);
    const [selectedComp, setSelectedComp] = useState(null);
    const [newJudge, setNewJudge] = useState({ name: '', specialization: '' });

    // Overview stats
    const stats = useMemo(() => ({
        totalJudges: judges.length,
        totalEvaluations: evaluations.filter(e => e.locked).length,
        assignedComps: [...new Set(assignments.map(a => a.competitionId))].length,
        avgCompletion: judges.length > 0
            ? Math.round(judges.reduce((sum, j) => {
                const p = getJudgeProgress(j.id, submissions);
                return sum + p.percentage;
            }, 0) / judges.length)
            : 0,
    }), [judges, evaluations, assignments, submissions, getJudgeProgress]);

    const handleCreateJudge = () => {
        if (!newJudge.name.trim()) return;
        addJudge(newJudge);
        setNewJudge({ name: '', specialization: '' });
        setShowCreateModal(false);
    };

    const handleAssign = (judgeId, competitionId) => {
        const compSubs = submissions.filter(s => s.competitionId === competitionId);
        assignJudge(judgeId, competitionId, compSubs.map(s => s.id));
    };

    const tabs = [
        { id: 'judges', label: 'Judges', icon: Users },
        { id: 'scores', label: 'Score Overview', icon: BarChart3 },
        { id: 'rubrics', label: 'Rubrics', icon: Settings },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                        E-Judging System
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage judges, assignments, and monitor evaluations</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all"
                >
                    <Plus size={16} /> Add Judge
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Judges', value: stats.totalJudges, icon: Users, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Evaluations', value: stats.totalEvaluations, icon: CheckCircle2, color: 'from-blue-500 to-indigo-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Competitions', value: stats.assignedComps, icon: Award, color: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
                    { label: 'Avg Completion', value: `${stats.avgCompletion}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50`}>
                        <div className="flex items-center justify-between mb-2">
                            <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-sm`}>
                                <s.icon size={14} />
                            </div>
                            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{s.value}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
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
                        <t.icon size={14} /> {t.label}
                    </button>
                ))}
            </div>

            {/* JUDGES TAB */}
            {activeTab === 'judges' && (
                <div className="space-y-4">
                    {judges.length === 0 ? (
                        <div className="text-center py-16 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No judges created yet</p>
                            <p className="text-xs text-slate-400 mt-1">Click "Add Judge" to get started</p>
                        </div>
                    ) : (
                        judges.map(judge => {
                            const progress = getJudgeProgress(judge.id, submissions);
                            const judgeAssigns = getJudgeAssignments(judge.id);
                            const assignedCompNames = judgeAssigns.map(a => competitions.find(c => c.id === a.competitionId)?.name).filter(Boolean);

                            return (
                                <div key={judge.id} className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                                {judge.avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{judge.name}</h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{judge.specialization}</p>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {assignedCompNames.length > 0 ? assignedCompNames.map((name, i) => (
                                                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                            {name}
                                                        </span>
                                                    )) : (
                                                        <span className="text-[10px] text-slate-400">No assignments</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{progress.percentage}%</div>
                                                <div className="text-[10px] text-slate-400">{progress.completed}/{progress.total}</div>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedJudge(judge); setShowAssignModal(true); }}
                                                className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 transition-all"
                                                title="Assign to Competition"
                                            >
                                                <Plus size={16} />
                                            </button>
                                            <button
                                                onClick={() => removeJudge(judge.id)}
                                                className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all"
                                                title="Remove Judge"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mini progress bar */}
                                    <div className="mt-3 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${progress.percentage}%` }} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* SCORE OVERVIEW TAB */}
            {activeTab === 'scores' && (
                <div className="space-y-6">
                    {competitions.map(comp => {
                        const compSubs = submissions.filter(s => s.competitionId === comp.id);
                        const compJudges = getCompetitionJudges(comp.id);
                        if (compJudges.length === 0 && compSubs.length === 0) return null;

                        return (
                            <div key={comp.id} className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">{comp.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{compJudges.length} judges assigned</p>

                                {compSubs.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-4 text-center">No submissions for this competition</p>
                                ) : (
                                    <div className="space-y-3">
                                        {/* Header */}
                                        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            <div className="col-span-4">Submission</div>
                                            <div className="col-span-5">Judge Scores</div>
                                            <div className="col-span-3 text-right">Average</div>
                                        </div>
                                        {compSubs.map(sub => {
                                            const subEvals = getSubmissionEvaluations(sub.id);
                                            const avg = getAverageScore(sub.id);

                                            return (
                                                <div key={sub.id} className="grid grid-cols-12 gap-2 items-center px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                                                    <div className="col-span-4">
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{sub.title}</p>
                                                        <p className="text-[10px] text-slate-400">
                                                            {students.find(s => s.id === sub.studentId)?.name || sub.studentId}
                                                        </p>
                                                    </div>
                                                    <div className="col-span-5 flex flex-wrap gap-1.5">
                                                        {subEvals.length > 0 ? subEvals.map(ev => {
                                                            const j = judges.find(jg => jg.id === ev.judgeId);
                                                            return (
                                                                <span key={ev.id} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-bold">
                                                                    <span className="text-slate-400">{j?.avatar || '??'}</span>
                                                                    <span className="text-emerald-600 dark:text-emerald-400">{ev.total}/{ev.maxTotal}</span>
                                                                </span>
                                                            );
                                                        }) : (
                                                            <span className="text-[10px] text-slate-400">No evaluations</span>
                                                        )}
                                                    </div>
                                                    <div className="col-span-3 text-right">
                                                        {avg ? (
                                                            <div>
                                                                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{avg.averageTotal}</span>
                                                                <span className="text-[10px] text-slate-400">/{avg.maxTotal}</span>
                                                                <div className="text-[10px] text-slate-400">{avg.averagePercentage}% avg</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400">—</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* RUBRICS TAB */}
            {activeTab === 'rubrics' && (
                <div className="space-y-6">
                    {competitions.map(comp => (
                        <div key={comp.id} className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4">{comp.name}</h3>
                            <RubricBuilder
                                criteria={getRubric(comp.id)}
                                onChange={(updated) => saveRubric(comp.id, updated)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* CREATE JUDGE MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Create New Judge</h3>
                            <button onClick={() => setShowCreateModal(false)} className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                                <input
                                    type="text"
                                    value={newJudge.name}
                                    onChange={(e) => setNewJudge(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Dr. Jane Smith"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Specialization</label>
                                <input
                                    type="text"
                                    value={newJudge.specialization}
                                    onChange={(e) => setNewJudge(prev => ({ ...prev, specialization: e.target.value }))}
                                    placeholder="Computer Science"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <button
                                onClick={handleCreateJudge}
                                disabled={!newJudge.name.trim()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-emerald-500/30 transition-all"
                            >
                                <Plus size={16} /> Create Judge
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ASSIGN MODAL */}
            {showAssignModal && selectedJudge && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowAssignModal(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Assign to Competition</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Judge: {selectedJudge.name}</p>
                            </div>
                            <button onClick={() => setShowAssignModal(false)} className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {competitions.map(comp => {
                                const isAssigned = getJudgeAssignments(selectedJudge.id).some(a => a.competitionId === comp.id);
                                const subCount = submissions.filter(s => s.competitionId === comp.id).length;
                                return (
                                    <button
                                        key={comp.id}
                                        onClick={() => {
                                            if (isAssigned) {
                                                unassignJudge(selectedJudge.id, comp.id);
                                            } else {
                                                handleAssign(selectedJudge.id, comp.id);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                            isAssigned
                                                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-emerald-300'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{comp.name}</p>
                                            <p className="text-[10px] text-slate-500 mt-0.5">{subCount} submissions</p>
                                        </div>
                                        {isAssigned ? (
                                            <CheckCircle2 size={18} className="text-emerald-500" />
                                        ) : (
                                            <Plus size={18} className="text-slate-400" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JudgeManagement;
