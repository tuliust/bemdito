import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/components/ui/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', pill = true, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors';

    const variants = {
      default: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground border border-border',
      outline: 'border border-border bg-background',
      success: 'bg-green-100 text-green-800 border border-green-200',
      warning: 'bg-amber-100 text-amber-800 border border-amber-200',
      error: 'bg-red-100 text-red-800 border border-red-200',
    };

    const sizes = {
      sm: 'h-5 px-2 text-xs',
      md: 'h-6 px-3 text-sm',
      lg: 'h-8 px-4 text-base',
    };

    const roundedStyles = pill ? 'rounded-full' : 'rounded-lg';

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], roundedStyles, className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
