import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground border border-border',
    destructive: 'bg-destructive text-destructive-foreground border-0',
    outline: 'text-foreground border-2 border-border bg-transparent',
    success: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-sm',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
