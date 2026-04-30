import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/app/components/ui/utils';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'full' | 'wide' | 'default' | 'narrow' | 'tight';
  padding?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', padding = true, ...props }, ref) => {
    const sizes = {
      full: 'max-w-none',
      wide: 'max-w-[1440px]',
      default: 'max-w-[1200px]',
      narrow: 'max-w-[960px]',
      tight: 'max-w-[640px]',
    };

    const paddingStyles = padding ? 'px-6 md:px-8' : '';

    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full', sizes[size], paddingStyles, className)}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export { Container };
