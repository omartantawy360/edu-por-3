import React from 'react';
import { Calendar, Users, Trophy, Heart, MessageCircle, Share2, Bookmark, ChevronRight } from 'lucide-react';

const CompetitionCard = ({ competition, onRegister, showActions = true }) => {
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const getTypeGradient = (type) => {
    return type === 'Outer'
      ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600'
      : 'bg-gradient-to-br from-blue-500 via-cyan-500 to-emerald-600';
  };

  const getTypeBadge = (type) => {
    return type === 'Outer'
      ? 'bg-white/20 backdrop-blur-md text-white border border-white/30'
      : 'bg-white/20 backdrop-blur-md text-white border border-white/30';
  };

  return (
    <div className="group relative flex flex-col h-full rounded-3xl overflow-hidden border border-white/20 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-1">
      <div className={`h-52 relative overflow-hidden ${getTypeGradient(competition.type)}`}>
        {competition.coverImage ? (
          <img
            src={competition.coverImage}
            alt={competition.name}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="text-white/40 drop-shadow-md" size={80} strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${getTypeBadge(competition.type)}`}>
            {competition.type === 'Outer' ? '🌍 Global' : '🏫 Internal'}
          </span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {competition.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm line-clamp-2">
            {competition.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 shrink-0">
              <Calendar size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Start</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{competition.startDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shrink-0">
              <Users size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slots</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{competition.maxParticipants || 'Unlimited'}</p>
            </div>
          </div>
        </div>

        {competition.prize && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/30 relative overflow-hidden group/prize">
            <div className="absolute -right-4 -top-4 text-amber-500/10 group-hover/prize:text-amber-500/20 transition-colors rotate-12">
              <Trophy size={80} />
            </div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-600/70 dark:text-amber-400/70 uppercase tracking-wider">Winning Prize</p>
                <p className="text-base font-bold text-amber-700 dark:text-amber-200">{competition.prize}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          {showActions ? (
            <div className="flex gap-3">
              <button className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Heart size={20} />
              </button>
              <button
                onClick={() => onRegister && onRegister(competition)}
                className="flex-1 py-2.5 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-sm"
              >
                Register Now
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {competition.stages?.slice(0, 3).map((stage, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
                  {stage}
                </span>
              ))}
              {competition.stages?.length > 3 && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs font-medium">+{competition.stages.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompetitionCard;
