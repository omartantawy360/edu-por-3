import React from 'react';
import BadgeCase from '../components/ui/BadgeCase';

const AchievementsPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-50">
          My Achievements
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
          View earned achievements and unlock new ones
        </p>
      </div>
      <BadgeCase />
    </div>
  );
};

export default AchievementsPage;
