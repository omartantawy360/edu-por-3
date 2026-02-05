import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-xl',
    secondary: 'bg-secondary text-secondary-foreground border border-border dark:border-slate-600 dark:shadow-md',
    destructive: 'bg-destructive text-destructive-foreground border-0 dark:shadow-md',
    outline: 'text-foreground border-2 border-border bg-transparent dark:border-slate-600',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-xl',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-xl',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-xl',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-300 ease-out animate-scale-in hover:scale-105',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
