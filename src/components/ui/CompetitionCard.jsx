import React from 'react';
import { Calendar, Users, Trophy, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

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
    <div className="rounded-2xl overflow-hidden border border-border dark:border-slate-700/50 bg-card shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className={`h-48 relative ${getTypeGradient(competition.type)}`}>
        {competition.coverImage ? (
          <img
            src={competition.coverImage}
            alt={competition.name}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="text-white/40" size={80} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-4 right-4">
          <span className={`px-4 py-2 rounded-xl text-xs font-bold ${getTypeBadge(competition.type)}`}>
            {competition.type === 'Outer' ? '🌍 Global' : '🏫 Internal'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50 mb-2 group-hover:text-primary transition-colors">
            {competition.name}
          </h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            {competition.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="text-primary" size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Start</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{competition.startDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="text-primary" size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Participants</p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{competition.maxParticipants || 'Unlimited'}</p>
            </div>
          </div>
        </div>

        {competition.prize && (
          <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Trophy className="text-amber-600 dark:text-amber-400" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Prize</p>
                <p className="text-base font-semibold text-amber-900 dark:text-amber-200">{competition.prize}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 tracking-wider">Stages</p>
          <div className="flex flex-wrap gap-2">
            {competition.stages?.map((stage, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
              >
                {i + 1}. {stage}
              </span>
            ))}
          </div>
        </div>

        {showActions && (
          <>
            <div className="flex items-center justify-between py-3 border-t border-border">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-2 transition-all duration-200 rounded-lg px-2 py-1 ${
                    liked ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
                  }`}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                  <span className="text-sm font-medium">{liked ? '124' : '123'}</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors rounded-lg px-2 py-1">
                  <MessageCircle size={20} />
                  <span className="text-sm font-medium">45</span>
                </button>
                <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-500 transition-colors rounded-lg px-2 py-1">
                  <Share2 size={20} />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
              <button
                onClick={() => setSaved(!saved)}
                className={`p-2 rounded-lg transition-colors ${
                  saved ? 'text-primary' : 'text-slate-500 dark:text-slate-400 hover:text-primary'
                }`}
              >
                <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              onClick={() => onRegister && onRegister(competition)}
              className="w-full mt-3 px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 btn-lift"
            >
              <Trophy size={20} />
              Register Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CompetitionCard;
