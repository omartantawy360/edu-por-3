import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Lightbulb, Trophy, ArrowRight } from 'lucide-react';

const Recommendations = ({ recommendations = [] }) => {
  const navigate = useNavigate();
  const { competitions } = useApp();

  const defaultRecommendations = competitions.map(comp => ({
    id: comp.id,
    title: comp.name,
    type: comp.type === 'Outer' ? 'external' : 'internal',
    icon: Trophy,
    description: comp.description,
    competitionData: comp,
    reason: `${comp.type} competition • ${comp.maxParticipants} participants max`
  }));

  const displayRecommendations = recommendations.length > 0 ? recommendations : defaultRecommendations;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'internal': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'external': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'workshop': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  const handleRegister = (competition) => {
    navigate('/register', { state: { selectedCompetition: competition } });
  };

  return (
    <div className="rounded-2xl border border-border dark:border-slate-700/50 bg-card shadow-soft p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-primary/10">
          <Lightbulb className="text-primary" size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Recommended Competitions</h2>
      </div>

      <div className="space-y-4">
        {displayRecommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-border dark:border-slate-700/50 hover:border-primary-300/50 dark:hover:border-primary-600/50 hover:shadow-soft transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                  <Icon className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-50 group-hover:text-primary transition-colors mb-1">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">{rec.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-3 py-1 rounded-lg font-semibold ${getTypeStyles(rec.type)}`}>
                        {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{rec.reason}</span>
                    </div>
                    {rec.competitionData && (
                      <button
                        onClick={() => handleRegister(rec.competitionData)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        Register <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
