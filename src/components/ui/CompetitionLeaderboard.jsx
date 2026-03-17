import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Medal, Award, TrendingUp, Crown, Filter } from 'lucide-react';

const CompetitionLeaderboard = () => {
    const { competitions, students, scores } = useApp();
    const [selectedCompetition, setSelectedCompetition] = useState('');

    // Calculate leaderboard for selected competition
    const getCompetitionLeaderboard = (competitionId) => {
        if (!competitionId) return [];

        const compScores = scores.filter(s => s.competitionId === competitionId);

        // Filter students by competition
        const competitionStudents = students.filter(s => {
            const comp = competitions.find(c => c.name === s.competition);
            return comp?.id === competitionId;
        });

        // Use real scores, fallback to 0
        const mapped = competitionStudents
            .map((student) => {
                const sScore = compScores.find(s => s.studentId === student.id);
                return {
                    id: student.id,
                    name: student.name,
                    score: sScore ? sScore.total : 0,
                    innovation: sScore ? sScore.innovation : 0,
                    design: sScore ? sScore.design : 0,
                    presentation: sScore ? sScore.presentation : 0,
                    technical: sScore ? sScore.technical : 0,
                    status: student.status,
                    result: student.result,
                    stage: student.stage,
                    avatar: student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                };
            })
            .sort((a, b) => b.score - a.score);

        // Assign category awards if score > 0
        const bestInnovation = [...mapped].sort((a, b) => b.innovation - a.innovation)[0];
        const bestDesign = [...mapped].sort((a, b) => b.design - a.design)[0];
        const bestPresentation = [...mapped].sort((a, b) => b.presentation - a.presentation)[0];

        const sorted = mapped.map((student, index) => ({
            ...student,
            rank: index + 1,
            bestInnovation: student.score > 0 && student.id === bestInnovation?.id,
            bestDesign: student.score > 0 && student.id === bestDesign?.id,
            bestPresentation: student.score > 0 && student.id === bestPresentation?.id
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
                                                {student.bestInnovation && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">Best Innovation</span>}
                                                {student.bestDesign && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400">Best Design</span>}
                                                {student.bestPresentation && <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400">Best Presentation</span>}
                                                {(!student.bestInnovation && !student.bestDesign && !student.bestPresentation) && (
                                                    <>
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">{student.stage}</span>
                                                    </>
                                                )}
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
