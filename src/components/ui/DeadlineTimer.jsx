import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const DeadlineTimer = ({ deadline, title = 'Competition Deadline' }) => {
  // If no real deadline is provided, don't render a fake/test countdown
  if (!deadline) {
    return null;
  }

  const targetDeadline = new Date(deadline);

  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDeadline) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }, [targetDeadline]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const isUrgent = timeLeft.total > 0 && timeLeft.total < 24 * 60 * 60 * 1000;
  const isExpired = timeLeft.total <= 0;

  return (
    <div className={`rounded-2xl shadow-soft border p-6 transition-all duration-300 ${
      isExpired
        ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
        : isUrgent
          ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200/80 dark:border-red-800/50'
          : 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border-primary-200/50 dark:border-primary-700/30'
    }`}>
      <div className="flex items-center gap-3 mb-5">
        {isUrgent && !isExpired ? (
          <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30">
            <AlertCircle className="text-red-600 dark:text-red-400 animate-pulse" size={22} />
          </div>
        ) : (
          <div className={`p-2 rounded-xl ${isExpired ? 'bg-slate-200 dark:bg-slate-700' : 'bg-primary/10'}`}>
            <Clock className={isExpired ? 'text-slate-500' : 'text-primary'} size={22} />
          </div>
        )}
        <h2 className={`text-lg font-bold ${isExpired ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-50'}`}>
          {title}
        </h2>
      </div>

      {isExpired ? (
        <div className="text-center py-8">
          <p className="text-xl font-bold text-slate-500 dark:text-slate-400">Deadline Passed</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
            <div key={unit} className="text-center p-3 rounded-xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm">
              <div className={`text-2xl md:text-3xl font-bold tabular-nums mb-1 ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-primary'}`}>
                {String(timeLeft[unit]).padStart(2, '0')}
              </div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{unit}</div>
            </div>
          ))}
        </div>
      )}

      {isUrgent && !isExpired && (
        <div className="mt-4 p-4 rounded-xl bg-red-100/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30">
          <p className="text-sm text-red-800 dark:text-red-200 font-semibold text-center">
            ⚠️ Urgent: Less than 24 hours remaining!
          </p>
        </div>
      )}
    </div>
  );
};

export default DeadlineTimer;
