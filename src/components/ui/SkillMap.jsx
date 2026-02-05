import React from 'react';
import { Target, TrendingUp, Presentation, Lightbulb, Users } from 'lucide-react';

const SkillMap = ({ skills = [] }) => {
  const defaultSkills = [
    { id: 1, name: 'Project Presentation', level: 75, maxLevel: 100, icon: Presentation, gradient: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Research & Analysis', level: 60, maxLevel: 100, icon: Lightbulb, gradient: 'from-emerald-500 to-green-500' },
    { id: 3, name: 'Teamwork & Collaboration', level: 85, maxLevel: 100, icon: Users, gradient: 'from-violet-500 to-purple-500' },
    { id: 4, name: 'Problem Solving', level: 70, maxLevel: 100, icon: Target, gradient: 'from-orange-500 to-amber-500' },
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  return (
    <div className="rounded-2xl border border-border dark:border-slate-700/50 bg-card shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-50">Competition Skills</h2>
        <div className="p-2 rounded-xl bg-primary/10">
          <TrendingUp className="text-primary" size={22} />
        </div>
      </div>

      <div className="space-y-6">
        {displaySkills.map((skill) => {
          const Icon = skill.icon;
          const percentage = (skill.level / skill.maxLevel) * 100;
          const gradient = skill.gradient || (skill.color ? `from-${skill.color.replace('bg-', '')} to-${skill.color.replace('bg-', '')}` : 'from-primary-500 to-primary-600');
          return (
            <div key={skill.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-primary/10`}>
                    <Icon className="text-primary" size={20} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{skill.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{skill.level}/{skill.maxLevel}</span>
              </div>
              <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${skill.gradient || 'from-primary-500 to-primary-600'} rounded-full transition-all duration-700`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillMap;
