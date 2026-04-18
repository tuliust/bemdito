import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export interface FloatingButtonProps {
  icon?: 'message' | 'help' | 'phone' | 'MessageCircle' | 'HelpCircle' | 'Phone';
  position?: 'bottom-right' | 'bottom-left';
  onClick?: () => void;
  label?: string;
  previewMode?: boolean;
}

export function FloatingButton({
  position = 'bottom-right',
  onClick,
  label = 'Abrir ajuda',
  previewMode = false,
}: FloatingButtonProps) {
  const positionStyles = {
    'bottom-right': 'bottom-6 right-6 md:bottom-8 md:right-8',
    'bottom-left': 'bottom-6 left-6 md:bottom-8 md:left-8',
  };

  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        previewMode ? 'absolute' : 'fixed',
        'z-40 inline-flex items-center justify-center',
        'h-14 w-14 rounded-full md:h-16 md:w-16',
        'bg-primary text-primary-foreground',
        'shadow-[0_14px_32px_rgba(0,0,0,0.18)]',
        'transition-transform hover:scale-105 active:scale-95',
        positionStyles[position],
      )}
      initial={{ opacity: 0, scale: 0.88, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">{label}</span>

      <div className="relative flex h-full w-full items-center justify-center rounded-full">
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.2} />

        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-white/95"
        />
      </div>
    </motion.button>
  );
}