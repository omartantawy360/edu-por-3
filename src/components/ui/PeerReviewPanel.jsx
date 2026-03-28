import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Star, MessageSquare, Send, CheckCircle2, AlertTriangle, Eye, Shield } from 'lucide-react';

const PeerReviewPanel = ({ assignmentId, onClose }) => {
    const { submissions, peerAssignments, submitPeerReview, peerReviews } = useApp();
    
    const assignment = peerAssignments.find(a => a.id === assignmentId);
    const submission = submissions.find(s => s.id === assignment?.targetSubmissionId);
    const existingReview = peerReviews.find(r => r.assignmentId === assignmentId);
    
    const [scores, setScores] = useState(existingReview?.scores || {
        innovation: 5,
        execution: 5,
        clarity: 5
    });
    const [comments, setComments] = useState(existingReview?.comments || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const rubric = [
        { id: 'innovation', label: 'Innovation', desc: 'How original and creative is the idea?' },
        { id: 'execution', label: 'Execution', desc: 'How well is the project implemented?' },
        { id: 'clarity', label: 'Clarity', desc: 'How clear is the documentation and demo?' }
    ];

    const total = useMemo(() => {
        return Object.values(scores).reduce((a, b) => a + b, 0);
    }, [scores]);

    const handleSubmit = async () => {
        if (!comments.trim() || isSubmitting) return;
        
        setIsSubmitting(true);
        const result = await submitPeerReview(assignmentId, scores, comments);
        
        if (result.success) {
            setShowSuccess(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        }
        setIsSubmitting(false);
    };

    if (!submission) return null;

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in zoom-in">
                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Review Submitted!</h3>
                <p className="text-xs text-slate-500 text-center">Your feedback has been shared anonymously with the team.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Peer Review</h2>
                    <p className="text-xs text-slate-500 mt-1">Anonymized evaluation for fair feedback</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 text-violet-700 dark:text-violet-400">
                    <Shield size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Anonymous Mode</span>
                </div>
            </div>

            {/* Target Submission Info */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                        Project ID: {submission.id.slice(0, 8)}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{submission.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {submission.description || "No description provided for this submission."}
                </p>
                <div className="mt-4">
                    <button className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">
                        <Eye size={14} /> View Full Project
                    </button>
                </div>
            </div>

            {/* Rubric */}
            <div className="space-y-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Star size={14} className="text-amber-500" /> Assessment Rubric
                </h4>
                
                <div className="grid gap-6">
                    {rubric.map(item => (
                        <div key={item.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.label}</label>
                                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                                </div>
                                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{scores[item.id]}/10</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                disabled={existingReview}
                                value={scores[item.id]}
                                onChange={(e) => setScores(prev => ({ ...prev, [item.id]: parseInt(e.target.value) }))}
                                className="w-full h-2 rounded-full appearance-none bg-slate-200 dark:bg-slate-700 accent-emerald-500 cursor-pointer disabled:opacity-50"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Comments */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={14} className="text-blue-500" /> Constructive Feedback
                </h4>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    disabled={existingReview}
                    placeholder="Provide specific, helpful feedback for the team..."
                    className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none min-h-[120px] resize-none disabled:opacity-50 transition-all shadow-sm"
                />
            </div>

            {/* Footer */}
            {!existingReview ? (
                <div className="flex items-center justify-between pt-4">
                    <div className="text-right flex-1 pr-6 border-r border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Score</p>
                        <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{total}<span className="text-sm text-slate-400">/30</span></p>
                    </div>
                    <div className="flex-[2] pl-6">
                        <button
                            onClick={handleSubmit}
                            disabled={!comments.trim() || isSubmitting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={16} /> Submit Anonymous Review
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">You already reviewed this project</p>
                        <p className="text-[10px] text-slate-500">Your feedback is being processed for the final results.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PeerReviewPanel;
