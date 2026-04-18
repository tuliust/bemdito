import { motion } from 'motion/react';
import { MessageCircle, HelpCircle, Phone } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export interface FloatingButtonProps {
  icon?: 'message' | 'help' | 'phone' | 'MessageCircle' | 'HelpCircle' | 'Phone';
  position?: 'bottom-right' | 'bottom-left';
  onClick?: () => void;
  label?: string;
  previewMode?: boolean;
}

const icons = {
  message: MessageCircle,
  help: HelpCircle,
  phone: Phone,
};

export function FloatingButton({
  icon = 'help',
  position = 'bottom-right',
  onClick,
  label = 'Ajuda',
  previewMode = false,
}: FloatingButtonProps) {
  const normalizedIcon =
    icon === 'MessageCircle'
      ? 'message'
      : icon === 'HelpCircle'
      ? 'help'
      : icon === 'Phone'
      ? 'phone'
      : icon;
  const Icon = icons[normalizedIcon];

  const positionStyles = {
    'bottom-right': 'bottom-6 right-6 md:bottom-8 md:right-8',
    'bottom-left': 'bottom-6 left-6 md:bottom-8 md:left-8',
  };

  return (
    <motion.button
      className={cn(
        `${previewMode ? 'absolute' : 'fixed'} z-40 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/10 flex items-center justify-center`,
        'hover:scale-110 transition-transform',
        positionStyles[position]
      )}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={label}
    >
      <Icon className="w-6 h-6 md:w-7 md:h-7" />
    </motion.button>
  );
}
