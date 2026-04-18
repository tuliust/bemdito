import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/app/components/ui/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  interactive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'lg',
      animated = false,
      interactive = false,
      ...props
    },
    ref
  ) => {
    const Comp = animated ? motion.div : 'div';

    const baseStyles = 'rounded-3xl transition-all';

    const variants = {
      default: 'bg-card border border-border',
      elevated: 'bg-card shadow-md shadow-black/5',
      outline: 'bg-transparent border-2 border-border',
      ghost: 'bg-transparent',
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
    };

    const interactiveStyles = interactive
      ? 'cursor-pointer hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1'
      : '';

    const motionProps = animated
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        }
      : {};

    return (
      <Comp
        ref={ref}
        className={cn(baseStyles, variants[variant], paddings[padding], interactiveStyles, className)}
        {...motionProps}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
