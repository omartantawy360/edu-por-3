import React from 'react';
import { Award, Star, Trophy, Zap, Target, Heart, Shield, Crown } from 'lucide-react';

const BadgeCase = ({ badges = [] }) => {
  const defaultBadges = [
    { id: 1, name: 'First Commit', icon: Star, earned: true, gradient: 'from-yellow-400 to-amber-500', description: 'Made your first submission' },
    { id: 2, name: 'Team Player', icon: Heart, earned: true, gradient: 'from-pink-400 to-rose-500', description: 'Collaborated with 5+ team members' },
    { id: 3, name: 'Bug Hunter', icon: Shield, earned: true, gradient: 'from-blue-400 to-cyan-500', description: 'Fixed 10 critical bugs' },
    { id: 4, name: 'Speed Demon', icon: Zap, earned: false, gradient: 'from-violet-400 to-purple-500', description: 'Complete project in record time' },
    { id: 5, name: 'Perfectionist', icon: Target, earned: false, gradient: 'from-emerald-400 to-green-500', description: 'Score 100% on a project' },
    { id: 6, name: 'Champion', icon: Crown, earned: false, gradient: 'from-orange-400 to-amber-500', description: 'Win a competition' },
  ];

  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  return (
    <div className="rounded-2xl border border-border dark:border-slate-700/50 bg-card shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Achievement Badges</h2>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10">
          <Trophy className="text-primary" size={20} />
          <span className="text-sm font-bold text-primary">
            {displayBadges.filter(b => b.earned).length}/{displayBadges.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayBadges.map((badge) => {
          const Icon = badge.icon;
          const iconBg = badge.earned
            ? (badge.gradient ? `bg-gradient-to-br ${badge.gradient}` : badge.color || 'bg-gradient-to-br from-primary-400 to-primary-600')
            : 'bg-slate-300 dark:bg-slate-600';
          return (
            <div
              key={badge.id}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                badge.earned
                  ? 'border-primary-200 dark:border-primary-700 bg-gradient-to-br from-primary-50/80 to-white dark:from-primary-900/20 dark:to-slate-800 shadow-soft hover:shadow-soft-md'
                  : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-60 dark:opacity-70'
              }`}
              title={badge.description}
            >
              <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md ${iconBg}`}>
                <Icon className="text-white h-7 w-7" />
              </div>
              <p className={`text-center text-sm font-semibold ${badge.earned ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                {badge.name}
              </p>
              {badge.earned && (
                <div className="absolute top-3 right-3">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-sm">
                    <Award className="text-white h-3 w-3" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeCase;
