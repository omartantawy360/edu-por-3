import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useJudge } from '../context/JudgeContext';
import { ArrowLeft, Lock, CheckCircle2, AlertTriangle, Gavel, FileText, MessageSquare, Send, Shield, Eye, Star } from 'lucide-react';

const EvaluationPanel = () => {
    const { submissionId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { submissions, competitions } = useApp();
    const {
        getRubric, getEvaluation, submitEvaluation, isLocked: checkLocked,
        getAnonymousSubmission, getAssignedSubmissions, getSubmissionEvaluations
    } = useJudge();

    const judgeId = user?.id;
    const submission = submissions.find(s => s.id === submissionId);
    const assignedSubs = getAssignedSubmissions(judgeId, submissions);
    const anonIndex = assignedSubs.findIndex(s => s.id === submissionId);
    const anon = getAnonymousSubmission(submission, anonIndex >= 0 ? anonIndex : 0);
    const competition = competitions.find(c => c.id === submission?.competitionId);
    const rubric = getRubric(submission?.competitionId);
    const existingEval = getEvaluation(judgeId, submissionId);
    const locked = checkLocked(judgeId, submissionId);
    const allEvals = getSubmissionEvaluations(submissionId);

    const [scores, setScores] = useState(() => {
        if (existingEval) {
            return { ...existingEval.scores };
        }
        const init = {};
        rubric.forEach(c => { init[c.id] = ''; });
        return init;
    });
    const [comments, setComments] = useState(existingEval?.comments || '');
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const total = useMemo(() => {
        return rubric.reduce((sum, c) => {
            const val = Number(scores[c.id]);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);
    }, [scores, rubric]);

    const maxTotal = useMemo(() => {
        return rubric.reduce((sum, c) => sum + c.maxScore, 0);
    }, [rubric]);

    const percentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;

    const handleScoreChange = useCallback((criterionId, value) => {
        setScores(prev => ({ ...prev, [criterionId]: value }));
        setErrors(prev => ({ ...prev, [criterionId]: null }));
        setSubmitError('');
    }, []);

    const handleSubmit = useCallback(() => {
        // Client-side validation
        const newErrors = {};
        let hasError = false;

        rubric.forEach(c => {
            const val = scores[c.id];
            if (val === '' || val === undefined || val === null) {
                newErrors[c.id] = `Score for "${c.name}" is required`;
                hasError = true;
            } else {
                const num = Number(val);
                if (isNaN(num) || num < 0) {
                    newErrors[c.id] = `Score cannot be negative`;
                    hasError = true;
                } else if (num > c.maxScore) {
                    newErrors[c.id] = `Maximum score is ${c.maxScore}`;
                    hasError = true;
                }
            }
        });

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // Submit via context
        const numericScores = {};
        rubric.forEach(c => { numericScores[c.id] = Number(scores[c.id]); });

        const result = submitEvaluation(judgeId, submissionId, submission.competitionId, numericScores, comments);

        if (!result.success) {
            setSubmitError(result.error);
            return;
        }

        setShowSuccess(true);
        setTimeout(() => {
            navigate('/judge');
        }, 2000);
    }, [scores, comments, rubric, judgeId, submissionId, submission, submitEvaluation, navigate]);

    if (!submission) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <AlertTriangle className="h-12 w-12 text-amber-400" />
                <p className="text-lg font-bold text-slate-600 dark:text-slate-300">Submission not found</p>
                <button onClick={() => navigate('/judge')} className="text-sm font-bold text-emerald-600 hover:underline">
                    ← Back to Dashboard
                </button>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-in fade-in zoom-in">
                <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Evaluation Submitted!</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your scores have been locked and recorded.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/judge')}
                    className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Evaluation Panel</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{competition?.name}</p>
                </div>
                {locked && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
                        <Lock size={14} className="text-green-600 dark:text-green-400" />
                        <span className="text-xs font-bold text-green-700 dark:text-green-300">Locked — Reviewed</span>
                    </div>
                )}
            </div>

            {/* Anonymous Security Banner */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30">
                <Shield size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Anonymous Evaluation Mode</p>
                    <p className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">All identifying information has been hidden to ensure fair judging.</p>
                </div>
            </div>

            {/* Submission Info — Anonymized */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-lg">
                        {anon?.anonymousLabel || `Submission #${submissionId}`}
                    </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mb-2">{submission.title}</h2>

                {submission.description && (
                    <div className="mt-3">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <FileText size={10} /> Description
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{submission.description}</p>
                    </div>
                )}

                {submission.files && submission.files.length > 0 && (
                    <div className="mt-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Attached Files</h4>
                        <div className="flex flex-wrap gap-2">
                            {submission.files.map((file, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    {file.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {submission.codeSnippet && (
                    <div className="mt-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Code Submission</h4>
                        <pre className="p-4 rounded-xl bg-[#0d1117] text-slate-300 text-xs font-mono overflow-x-auto leading-6 max-h-48 overflow-y-auto sidebar-scroll">
                            {submission.codeSnippet}
                        </pre>
                    </div>
                )}
            </div>

            {/* Scoring Section */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Star size={16} className="text-amber-500" /> Evaluation Criteria
                    </h3>
                    <div className="text-right">
                        <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{total}<span className="text-sm text-slate-400">/{maxTotal}</span></div>
                        <div className="text-[10px] font-bold text-slate-400">{percentage}%</div>
                    </div>
                </div>

                <div className="space-y-5">
                    {rubric.map((criterion) => (
                        <div key={criterion.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{criterion.name}</label>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Max: {criterion.maxScore}</span>
                            </div>

                            {/* Score Slider + Input */}
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max={criterion.maxScore}
                                    step="1"
                                    value={scores[criterion.id] || 0}
                                    onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                                    disabled={locked}
                                    className="flex-1 h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max={criterion.maxScore}
                                    value={scores[criterion.id]}
                                    onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                                    disabled={locked}
                                    className={`w-16 text-center px-2 py-2 rounded-xl border text-sm font-bold transition-all ${
                                        errors[criterion.id]
                                            ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600'
                                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                                />
                            </div>

                            {/* Progress bar for this criterion */}
                            <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-300"
                                    style={{ width: `${criterion.maxScore > 0 ? ((Number(scores[criterion.id]) || 0) / criterion.maxScore) * 100 : 0}%` }}
                                />
                            </div>

                            {errors[criterion.id] && (
                                <p className="text-xs font-medium text-red-500 flex items-center gap-1">
                                    <AlertTriangle size={10} /> {errors[criterion.id]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Comments */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
                    <MessageSquare size={16} className="text-blue-500" /> Judge Comments (Optional)
                </h3>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    disabled={locked}
                    placeholder="Share your feedback on this submission..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
            </div>

            {/* Multi-Judge Scores (if other judges have evaluated) */}
            {allEvals.length > 1 && locked && (
                <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
                        <Eye size={16} className="text-violet-500" /> Other Judge Scores
                    </h3>
                    <div className="space-y-2">
                        {allEvals.filter(e => e.judgeId !== judgeId).map((e, i) => (
                            <div key={e.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Judge #{i + 2}</span>
                                <span className="text-sm font-extrabold text-violet-600 dark:text-violet-400">{e.total}/{e.maxTotal} ({e.percentage}%)</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Error Display */}
            {submitError && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                    <AlertTriangle size={18} className="text-red-500 shrink-0" />
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">{submitError}</p>
                </div>
            )}

            {/* Submit Button */}
            {!locked && (
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800/30">
                    <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Ready to submit?</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <Lock size={8} /> This evaluation will be locked after submission
                        </p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Send size={16} />
                        Submit & Lock Evaluation
                    </button>
                </div>
            )}

            {/* Locked Footer */}
            {locked && (
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700">
                    <Lock size={14} className="text-slate-400" />
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Submitted on {new Date(existingEval?.submittedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default EvaluationPanel;
