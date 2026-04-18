import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/app/components/ui/utils';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'muted' | 'card';
  animated?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = 'lg', background = 'transparent', animated = false, ...props }, ref) => {
    const Comp = animated ? motion.section : 'section';

    const spacings = {
      none: '',
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-20 md:py-32',
      xl: 'py-24 md:py-40',
    };

    const backgrounds = {
      transparent: '',
      muted: 'bg-muted',
      card: 'bg-card',
    };

    const motionProps = animated
      ? {
          initial: { opacity: 0, y: 40 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-100px' },
          transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
        }
      : {};

    return (
      <Comp
        ref={ref}
        className={cn(spacings[spacing], backgrounds[background], className)}
        {...motionProps}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';

export { Section };
