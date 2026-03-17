import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useApp } from './AppContext';

const JudgeContext = createContext(null);

export const useJudge = () => {
    const context = useContext(JudgeContext);
    if (!context) {
        throw new Error('useJudge must be used within a JudgeProvider');
    }
    return context;
};

const DEFAULT_RUBRIC = [
    { id: 'innovation', name: 'Innovation', maxScore: 10 },
    { id: 'design', name: 'Design', maxScore: 10 },
    { id: 'presentation', name: 'Presentation', maxScore: 10 },
    { id: 'technical', name: 'Technical Quality', maxScore: 10 },
];

export const JudgeProvider = ({ children }) => {
    // --- State ---
    const [judges, setJudges] = useState([
        { id: 'JUDGE-001', name: 'Dr. Sarah Mitchell', specialization: 'AI & Machine Learning', avatar: 'SM' },
        { id: 'JUDGE-002', name: 'Prof. James Chen', specialization: 'Robotics & Engineering', avatar: 'JC' },
        { id: 'JUDGE-003', name: 'Dr. Amira Hassan', specialization: 'Environmental Science', avatar: 'AH' },
    ]);

    const [assignments, setAssignments] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [rubrics, setRubrics] = useState({});

    // Access AppContext for demo mode synchronization
    const { isDemoMode } = useApp();

    // --- Rubric Management ---
    const getRubric = useCallback((competitionId) => {
        return rubrics[competitionId] || DEFAULT_RUBRIC;
    }, [rubrics]);

    const saveRubric = useCallback((competitionId, criteria) => {
        setRubrics(prev => ({ ...prev, [competitionId]: criteria }));
    }, []);

    // --- Judge Management ---
    const addJudge = useCallback((judgeData) => {
        const newJudge = {
            id: `JUDGE-${Date.now()}`,
            avatar: judgeData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
            ...judgeData,
        };
        setJudges(prev => [...prev, newJudge]);
        return newJudge;
    }, []);

    const removeJudge = useCallback((judgeId) => {
        setJudges(prev => prev.filter(j => j.id !== judgeId));
        setAssignments(prev => prev.filter(a => a.judgeId !== judgeId));
    }, []);

    // --- Assignment Management ---
    const assignJudge = useCallback((judgeId, competitionId, submissionIds = []) => {
        const existing = assignments.find(
            a => a.judgeId === judgeId && a.competitionId === competitionId
        );
        if (existing) {
            setAssignments(prev => prev.map(a =>
                a.judgeId === judgeId && a.competitionId === competitionId
                    ? { ...a, submissionIds: [...new Set([...a.submissionIds, ...submissionIds])] }
                    : a
            ));
        } else {
            setAssignments(prev => [...prev, {
                id: `assign-${Date.now()}`,
                judgeId,
                competitionId,
                submissionIds,
            }]);
        }
    }, [assignments]);

    const unassignJudge = useCallback((judgeId, competitionId) => {
        setAssignments(prev => prev.filter(
            a => !(a.judgeId === judgeId && a.competitionId === competitionId)
        ));
    }, []);

    const getJudgeAssignments = useCallback((judgeId) => {
        return assignments.filter(a => a.judgeId === judgeId);
    }, [assignments]);

    const getCompetitionJudges = useCallback((competitionId) => {
        return assignments
            .filter(a => a.competitionId === competitionId)
            .map(a => judges.find(j => j.id === a.judgeId))
            .filter(Boolean);
    }, [assignments, judges]);

    // --- Anonymous Submission Access ---
    const getAnonymousSubmission = useCallback((submission, index) => {
        if (!submission) return null;
        return {
            ...submission,
            anonymousLabel: `Submission #${String(index + 1).padStart(3, '0')}`,
            // Strip all identifying data
            studentId: undefined,
            studentName: undefined,
            teamName: undefined,
            school: undefined,
            members: undefined,
        };
    }, []);

    const getAssignedSubmissions = useCallback((judgeId, allSubmissions) => {
        const judgeAssigns = assignments.filter(a => a.judgeId === judgeId);
        const assignedSubIds = judgeAssigns.flatMap(a => a.submissionIds);

        // Also include all submissions from assigned competitions if no specific subs listed
        const assignedCompIds = judgeAssigns
            .filter(a => a.submissionIds.length === 0)
            .map(a => a.competitionId);

        return allSubmissions.filter(sub =>
            assignedSubIds.includes(sub.id) ||
            assignedCompIds.includes(sub.competitionId)
        );
    }, [assignments]);

    // --- Evaluation System ---
    const submitEvaluation = useCallback((judgeId, submissionId, competitionId, scores, comments = '') => {
        // Validate: no empty, no negatives, no above max
        const rubric = getRubric(competitionId);
        for (const criterion of rubric) {
            const score = scores[criterion.id];
            if (score === undefined || score === null || score === '') {
                return { success: false, error: `Score for "${criterion.name}" is required.` };
            }
            const numScore = Number(score);
            if (isNaN(numScore) || numScore < 0) {
                return { success: false, error: `Score for "${criterion.name}" cannot be negative.` };
            }
            if (numScore > criterion.maxScore) {
                return { success: false, error: `Score for "${criterion.name}" cannot exceed ${criterion.maxScore}.` };
            }
        }

        // Check if already locked
        const existingEval = evaluations.find(
            e => e.judgeId === judgeId && e.submissionId === submissionId
        );
        if (existingEval?.locked) {
            return { success: false, error: 'This evaluation has already been submitted and locked.' };
        }

        // Calculate total
        const total = rubric.reduce((sum, c) => sum + Number(scores[c.id] || 0), 0);
        const maxTotal = rubric.reduce((sum, c) => sum + c.maxScore, 0);

        const evaluation = {
            id: existingEval?.id || `eval-${Date.now()}`,
            judgeId,
            submissionId,
            competitionId,
            scores: { ...scores },
            comments,
            total,
            maxTotal,
            percentage: Math.round((total / maxTotal) * 100),
            locked: true,
            submittedAt: new Date().toISOString(),
        };

        setEvaluations(prev => {
            const idx = prev.findIndex(e => e.judgeId === judgeId && e.submissionId === submissionId);
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = evaluation;
                return copy;
            }
            return [...prev, evaluation];
        });

        return { success: true, evaluation };
    }, [evaluations, getRubric]);

    const isLocked = useCallback((judgeId, submissionId) => {
        const ev = evaluations.find(e => e.judgeId === judgeId && e.submissionId === submissionId);
        return ev?.locked || false;
    }, [evaluations]);

    const getEvaluation = useCallback((judgeId, submissionId) => {
        return evaluations.find(e => e.judgeId === judgeId && e.submissionId === submissionId) || null;
    }, [evaluations]);

    const getSubmissionEvaluations = useCallback((submissionId) => {
        return evaluations.filter(e => e.submissionId === submissionId);
    }, [evaluations]);

    const getAverageScore = useCallback((submissionId) => {
        const evals = evaluations.filter(e => e.submissionId === submissionId && e.locked);
        if (evals.length === 0) return null;
        const avgTotal = evals.reduce((sum, e) => sum + e.total, 0) / evals.length;
        const avgPercentage = evals.reduce((sum, e) => sum + e.percentage, 0) / evals.length;
        return {
            averageTotal: Math.round(avgTotal * 10) / 10,
            averagePercentage: Math.round(avgPercentage),
            judgeCount: evals.length,
            maxTotal: evals[0]?.maxTotal || 40,
        };
    }, [evaluations]);

    // --- Judge Progress ---
    const getJudgeProgress = useCallback((judgeId, allSubmissions) => {
        const assigned = getAssignedSubmissions(judgeId, allSubmissions);
        const completed = assigned.filter(sub =>
            evaluations.some(e => e.judgeId === judgeId && e.submissionId === sub.id && e.locked)
        );
        return {
            total: assigned.length,
            completed: completed.length,
            remaining: assigned.length - completed.length,
            percentage: assigned.length > 0 ? Math.round((completed.length / assigned.length) * 100) : 0,
        };
    }, [evaluations, getAssignedSubmissions]);

    // --- Demo Data ---
    const loadDemoData = useCallback(() => {
        setJudges([
            { id: 'JUDGE-001', name: 'Dr. Sarah Mitchell', specialization: 'AI & Machine Learning', avatar: 'SM' },
            { id: 'JUDGE-002', name: 'Prof. James Chen', specialization: 'Robotics & Engineering', avatar: 'JC' },
            { id: 'JUDGE-003', name: 'Dr. Amira Hassan', specialization: 'Environmental Science', avatar: 'AH' },
        ]);

        setAssignments([
            { id: 'assign-d1', judgeId: 'JUDGE-001', competitionId: 'c2', submissionIds: ['sub-demo1', 'sub-demo2', 'sub-demo3'] },
            { id: 'assign-d2', judgeId: 'JUDGE-002', competitionId: 'c2', submissionIds: ['sub-demo1', 'sub-demo2', 'sub-demo3'] },
            { id: 'assign-d3', judgeId: 'JUDGE-003', competitionId: 'c2', submissionIds: ['sub-demo1', 'sub-demo3'] },
            { id: 'assign-d4', judgeId: 'JUDGE-001', competitionId: 'c3', submissionIds: [] },
        ]);

        setRubrics({
            'c2': [
                { id: 'innovation', name: 'Innovation', maxScore: 10 },
                { id: 'design', name: 'Design', maxScore: 10 },
                { id: 'presentation', name: 'Presentation', maxScore: 10 },
                { id: 'technical', name: 'Technical Quality', maxScore: 10 },
            ],
            'c3': [
                { id: 'algorithm', name: 'Algorithm Efficiency', maxScore: 20 },
                { id: 'creativity', name: 'Creative Approach', maxScore: 15 },
                { id: 'documentation', name: 'Code Documentation', maxScore: 10 },
                { id: 'testing', name: 'Testing & Validation', maxScore: 5 },
            ],
        });

        setEvaluations([
            {
                id: 'eval-d1', judgeId: 'JUDGE-001', submissionId: 'sub-demo1', competitionId: 'c2',
                scores: { innovation: 9, design: 10, presentation: 8, technical: 9 },
                comments: 'Exceptional project with real-world applicability. The carbon tracking algorithm is innovative.',
                total: 36, maxTotal: 40, percentage: 90, locked: true,
                submittedAt: '2026-03-10T10:30:00Z',
            },
            {
                id: 'eval-d2', judgeId: 'JUDGE-001', submissionId: 'sub-demo2', competitionId: 'c2',
                scores: { innovation: 10, design: 7, presentation: 9, technical: 8 },
                comments: 'Highly innovative approach to irrigation. UI needs some improvement.',
                total: 34, maxTotal: 40, percentage: 85, locked: true,
                submittedAt: '2026-03-10T11:15:00Z',
            },
            {
                id: 'eval-d3', judgeId: 'JUDGE-002', submissionId: 'sub-demo1', competitionId: 'c2',
                scores: { innovation: 8, design: 9, presentation: 9, technical: 10 },
                comments: 'Solid technical implementation. Excellent code quality and testing.',
                total: 36, maxTotal: 40, percentage: 90, locked: true,
                submittedAt: '2026-03-11T09:00:00Z',
            },
            {
                id: 'eval-d4', judgeId: 'JUDGE-002', submissionId: 'sub-demo2', competitionId: 'c2',
                scores: { innovation: 9, design: 8, presentation: 8, technical: 7 },
                comments: 'Good concept but hardware integration could be more robust.',
                total: 32, maxTotal: 40, percentage: 80, locked: true,
                submittedAt: '2026-03-11T10:30:00Z',
            },
            {
                id: 'eval-d5', judgeId: 'JUDGE-003', submissionId: 'sub-demo1', competitionId: 'c2',
                scores: { innovation: 9, design: 8, presentation: 10, technical: 9 },
                comments: 'Outstanding presentation and clear environmental impact.',
                total: 36, maxTotal: 40, percentage: 90, locked: true,
                submittedAt: '2026-03-12T14:00:00Z',
            },
        ]);
    }, []);

    const clearDemoData = useCallback(() => {
        setJudges([
            { id: 'JUDGE-001', name: 'Dr. Sarah Mitchell', specialization: 'AI & Machine Learning', avatar: 'SM' },
            { id: 'JUDGE-002', name: 'Prof. James Chen', specialization: 'Robotics & Engineering', avatar: 'JC' },
            { id: 'JUDGE-003', name: 'Dr. Amira Hassan', specialization: 'Environmental Science', avatar: 'AH' },
        ]);
        setAssignments([]);
        setEvaluations([]);
        setRubrics({});
    }, []);

    // Sync with AppContext demo mode
    const prevDemoRef = useRef(isDemoMode);
    useEffect(() => {
        if (prevDemoRef.current !== isDemoMode) {
            prevDemoRef.current = isDemoMode;
            if (isDemoMode) {
                loadDemoData();
            } else {
                clearDemoData();
            }
        }
    }, [isDemoMode, loadDemoData, clearDemoData]);

    return (
        <JudgeContext.Provider value={{
            judges,
            assignments,
            evaluations,
            rubrics,
            DEFAULT_RUBRIC,
            // Judge management
            addJudge,
            removeJudge,
            // Assignment management
            assignJudge,
            unassignJudge,
            getJudgeAssignments,
            getCompetitionJudges,
            // Anonymous access
            getAnonymousSubmission,
            getAssignedSubmissions,
            // Evaluation
            submitEvaluation,
            isLocked,
            getEvaluation,
            getSubmissionEvaluations,
            getAverageScore,
            // Rubrics
            getRubric,
            saveRubric,
            // Progress
            getJudgeProgress,
            // Demo
            loadDemoData,
            clearDemoData,
        }}>
            {children}
        </JudgeContext.Provider>
    );
};
