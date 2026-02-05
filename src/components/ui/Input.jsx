import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full animate-fade-in">
      {label && (
        <label className="text-sm font-medium leading-none mb-2 block text-foreground transition-colors duration-200">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm transition-all duration-300 ease-out',
          'placeholder:text-muted-foreground hover:border-primary-200/50 dark:hover:border-primary-700/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:border-primary-400/50 focus-visible:scale-105',
          'dark:focus-visible:ring-offset-slate-800',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <span className="text-xs text-destructive mt-1.5 block animate-fade-in">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
