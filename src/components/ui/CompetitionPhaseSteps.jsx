import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { COMPETITION_PHASES } from '../../context/AppContext';

const CompetitionPhaseSteps = ({ currentPhase }) => {
  const phases = Object.values(COMPETITION_PHASES);
  const currentIdx = phases.indexOf(currentPhase);

  return (
    <div className="w-full py-4 px-2 overflow-x-auto">
      <div className="relative flex items-start justify-between min-w-[640px]">
        {/* Progress Line */}
        <div className="absolute left-0 top-4 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />
        <div 
          className="absolute left-0 top-4 h-0.5 bg-violet-500 transition-all duration-500 -z-10" 
          style={{ width: `${(currentIdx / (phases.length - 1)) * 100}%` }}
        />

        {phases.map((phase, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={phase} className="flex flex-col items-center gap-2 flex-1 min-w-[72px]">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                isCompleted ? "bg-violet-500 border-violet-500 text-white shadow-lg shadow-violet-500/20" :
                isCurrent ? "bg-white dark:bg-slate-900 border-violet-500 text-violet-500 shadow-lg scale-110" :
                "bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-slate-400"
              )}>
                {isCompleted ? <CheckCircle2 size={16} /> : 
                 isCurrent ? <Clock size={16} className="animate-pulse" /> : 
                 <Circle size={12} fill="currentColor" className="opacity-20" />}
              </div>
              <span className={cn(
                "text-[9px] font-bold text-center leading-tight transition-colors duration-300 px-0.5",
                isCurrent ? "text-violet-600 dark:text-violet-400" : 
                isCompleted ? "text-slate-600 dark:text-slate-400" : 
                "text-slate-400 dark:text-slate-600"
              )}>
                {phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompetitionPhaseSteps;
