import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-soft hover:shadow-soft-md btn-lift border-0',
    secondary: 'bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:border-primary-200/50 dark:hover:border-primary-700/50 shadow-soft transition-all duration-300',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft btn-lift',
    ghost: 'hover:bg-accent hover:text-accent-foreground text-foreground transition-colors duration-200',
    link: 'text-primary underline-offset-4 hover:underline hover:text-primary-600',
  };

  const sizes = {
    default: 'h-10 px-5 py-2 rounded-xl text-sm',
    sm: 'h-9 rounded-lg px-3 text-sm',
    lg: 'h-12 rounded-xl px-8 text-base',
    icon: 'h-10 w-10 rounded-xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/80 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };
