import React from 'react';
import { Users, Trophy, Star, Shield, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function TeamCard({ team, onAction, actionType = 'view', isPending = false }) {
    const memberCount = team.members?.length || 0;

    // Generate gradient based on team name
    const getGradient = () => {
        const gradients = [
            'from-violet-500 to-purple-600',
            'from-blue-500 to-cyan-600',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-pink-500 to-rose-600',
        ];
        const index = team.id.charCodeAt(team.id.length - 1) % gradients.length;
        return gradients[index];
    };

    const getActionButton = () => {
        if (isPending) {
            return (
                <button
                    disabled
                    className="flex-1 py-2 px-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-yellow-200 dark:border-yellow-900/30"
                >
                    Request Pending
                </button>
            );
        }

        if (actionType === 'view') {
            return (
                <button
                    onClick={() => onAction(team)}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 group/btn"
                >
                    View Team
                    <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
            );
        }

        return (
            <button
                onClick={() => onAction(team)}
                className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700/50 text-violet-600 dark:text-violet-400 rounded-xl text-sm font-bold hover:bg-violet-50 dark:hover:bg-slate-700/50 transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
            >
                Request to Join
                <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
        );
    };

    return (
        <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 p-6 shadow-soft hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield size={120} />
            </div>

            {/* Team Header */}
            <div className="relative z-10 flex items-start gap-4 mb-5">
                <div className={cn(
                    "h-16 w-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300",
                    getGradient()
                )}>
                    {team.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 py-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 truncate group-hover:text-primary transition-colors">
                        {team.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 truncate max-w-full">
                            {team.competitionName}
                        </span>
                    </div>
                </div>
            </div>

            {/* Team Description */}
            <div className="relative z-10 mb-6 min-h-[40px]">
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {team.description}
                </p>
            </div>

            {/* Team Stats grid */}
            <div className="relative z-10 grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Users size={14} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Members</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{memberCount}</p>
                    </div>
                </div>
                {team.rank ? (
                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                            <Trophy size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Rank</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">#{team.rank}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                            <Star size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Score</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{team.score || 0}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Member Avatars & Action */}
            <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex -space-x-3 hover:space-x-1 transition-all duration-300">
                    {team.members?.slice(0, 3).map((member, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-9 w-9 rounded-full bg-gradient-to-br flex items-center justify-center border-2 border-white dark:border-slate-900 text-xs font-bold text-white shadow-sm ring-2 ring-transparent transition-all hover:scale-110 hover:z-20",
                                getGradient()
                            )}
                            title={member.name}
                        >
                            {member.avatar || member.name.charAt(0)}
                        </div>
                    ))}
                    {memberCount > 3 && (
                        <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-900 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-sm z-10">
                            +{memberCount - 3}
                        </div>
                    )}
                </div>

                {getActionButton()}
            </div>
        </div>
    );
}
