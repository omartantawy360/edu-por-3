import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-border bg-card text-card-foreground shadow-soft transition-all duration-300 ease-out hover:shadow-soft-lg hover:-translate-y-1 dark:border-slate-700/50 dark:shadow-md dark:hover:shadow-xl animate-fade-in',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-2 p-6 animate-fade-in', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-bold leading-tight tracking-tight text-card-foreground transition-colors duration-300',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0 animate-fade-in', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
