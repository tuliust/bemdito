/**
 * LoadingState
 *
 * Estado de carregamento genérico
 */

import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Carregando...', size = 'md' }: LoadingStateProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className={`${sizes[size]} text-primary animate-spin mb-4`} />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
