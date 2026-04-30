import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/app/components/ui/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pill?: boolean;
  asChild?: boolean;
  animated?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      pill = false,
      asChild = false,
      animated = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const MotionComp = animated ? motion.button : Comp;

    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
      outline: 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-13 px-8 text-lg',
      xl: 'h-16 px-10 text-xl',
    };

    const roundedStyles = pill ? 'rounded-full' : 'rounded-xl';

    const motionProps = animated
      ? {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { type: 'spring', stiffness: 400, damping: 17 },
        }
      : {};

    return (
      <MotionComp
        className={cn(baseStyles, variants[variant], sizes[size], roundedStyles, className)}
        ref={ref}
        {...motionProps}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
