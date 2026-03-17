import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useJudge } from '../../context/JudgeContext';
import { Trophy, Medal, Award, TrendingUp, Crown, Filter } from 'lucide-react';

const CompetitionLeaderboard = () => {
    const { competitions, students, scores, submissions } = useApp();
    const { getAverageScore } = useJudge();
    const [selectedCompetition, setSelectedCompetition] = useState('');

    // Calculate leaderboard for selected competition
    const getCompetitionLeaderboard = (competitionId) => {
        if (!competitionId) return [];

        // Filter students who belong to this competition OR have a submission in it
        const competitionStudents = students.filter(s => {
            const hasSubmission = submissions.some(sub => sub.studentId === s.id && sub.competitionId === competitionId);
            const comp = competitions.find(c => c.name === s.competition);
            const isRegistered = comp?.id === competitionId;
            return hasSubmission || isRegistered;
        });

        // Use judge average scores first, fallback to legacy scores
        const mapped = competitionStudents
            .map((student) => {
                // Check for judge evaluations via submissions
                const studentSubs = submissions.filter(s => s.studentId === student.id && s.competitionId === competitionId);
                let totalScore = 0;
                let hasJudgeScore = false;

                for (const sub of studentSubs) {
                    const avg = getAverageScore(sub.id);
                    if (avg) {
                        totalScore = avg.averageTotal;
                        hasJudgeScore = true;
                        break;
                    }
                }

                // Fallback to legacy scores
                if (!hasJudgeScore) {
                    const legacyScore = scores.find(s => s.studentId === student.id && s.competitionId === competitionId);
                    totalScore = legacyScore ? legacyScore.total : 0;
                }

                return {
                    id: student.id,
                    name: student.name,
                    score: totalScore,
                    status: student.status,
                    result: student.result,
                    stage: student.stage,
                    avatar: student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                };
            })
            .sort((a, b) => b.score - a.score);

        const sorted = mapped.map((student, index) => ({
            ...student,
            rank: index + 1,
        }));

        return sorted;
    };

    const leaderboardData = selectedCompetition ? getCompetitionLeaderboard(selectedCompetition) : [];

    const getRankIcon = (rank) => {
        switch(rank) {
            case 1:
                return { icon: Crown, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/40' };
            case 2:
                return { icon: Medal, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' };
            case 3:
                return { icon: Award, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/40' };
            default:
                return null;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-soft border border-slate-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Trophy className="text-primary-600" size={24} />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-50">Competition Leaderboard</h2>
                </div>
            </div>

            {/* Competition Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Select Competition</label>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <select
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
                        value={selectedCompetition}
                        onChange={(e) => setSelectedCompetition(e.target.value)}
                    >
                        <option value="">Choose a competition...</option>
                        {competitions.map(comp => (
                            <option key={comp.id} value={comp.id}>{comp.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Leaderboard Display */}
            {!selectedCompetition ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <Trophy size={48} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                    <p>Select a competition to view leaderboard</p>
                </div>
            ) : leaderboardData.length === 0 ? (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <p>No participants in this competition yet</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {leaderboardData.map((student) => {
                        const rankConfig = getRankIcon(student.rank);
                        const RankIcon = rankConfig?.icon;
                        
                        return (
                            <div 
                                key={student.id} 
                                className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                                    student.rank <= 3 
                                        ? 'bg-gradient-to-r from-violet-50/80 to-transparent dark:from-violet-900/30 dark:to-transparent border border-violet-200/50 dark:border-violet-700/30 shadow-sm' 
                                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm ${
                                        rankConfig ? rankConfig.bg + ' ' + rankConfig.color : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                    }`}>
                                        {rankConfig ? <RankIcon size={16} /> : student.rank}
                                    </div>
                                    
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                                            student.rank <= 3 ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300' : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                            {student.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-50">{student.name}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                {student.rank <= 3 && student.score > 0 && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                                        Top {student.rank}
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{student.stage}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right pl-4">
                                    <div className={`text-xl font-black ${
                                        student.rank <= 3 ? 'text-violet-600 dark:text-violet-400' : 'text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {student.score}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Score</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CompetitionLeaderboard;
