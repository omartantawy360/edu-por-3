import React from 'react';
import { Trophy, Users, ArrowRight, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { cn } from '../../utils/cn';

const CompetitionProjectCard = ({ project, competitionName }) => {
  const isWinner = project.isWinner;
  const rank = project.rank;

  const getRankColor = (r) => {
    switch (r) {
      case 1: return 'from-amber-400 to-yellow-600';
      case 2: return 'from-slate-300 to-slate-500';
      case 3: return 'from-orange-400 to-orange-700';
      default: return 'from-violet-500 to-purple-600';
    }
  };

  const getRankLabel = (r) => {
    switch (r) {
      case 1: return '1st Place';
      case 2: return '2nd Place';
      case 3: return '3rd Place';
      default: return 'Winner';
    }
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
      {/* Achievement Badge */}
      {isWinner && (
        <div className={cn(
          "absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg bg-gradient-to-r",
          getRankColor(rank)
        )}>
          <div className="flex items-center gap-1.5">
            <Trophy size={12} />
            {getRankLabel(rank)}
          </div>
        </div>
      )}

      {/* Hero Image / Gallery Preview */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={project.gallery?.[0] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
        
        {/* Project Tags */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {project.tags?.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-semibold text-white uppercase tracking-wider">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[10px] font-black text-violet-500 dark:text-violet-400 uppercase tracking-[0.2em] mb-1">
            {competitionName}
          </p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-violet-600 transition-colors">
            {project.title}
          </h3>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* Footer Meta */}
        <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
               <Users size={14} />
            </div>
            <div className="text-[10px]">
              <p className="font-bold text-slate-900 dark:text-slate-100">Team Project</p>
              <p className="text-slate-500">3 Members</p>
            </div>
          </div>

          <Link 
            to={`/project/${project.id}`}
            className="flex items-center gap-2 text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-800 transition-colors group/btn"
          >
            Explore
            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompetitionProjectCard;
