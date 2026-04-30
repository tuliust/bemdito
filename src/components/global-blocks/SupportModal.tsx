import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon?: string;
  action?: () => void;
}

export interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logo?: {
    src: string;
    alt: string;
  };
  options?: SupportOption[];
}

export function SupportModal({
  isOpen,
  onClose,
  logo,
  options = [
    {
      id: '1',
      title: 'Quiz rápido',
      description: 'Descubra qual solução é ideal para você',
    },
    {
      id: '2',
      title: 'Wellness gifts',
      description: 'Explore opções de presentes corporativos',
    },
    {
      id: '3',
      title: 'Dúvida / Contato',
      description: 'Entre em contato com nossa equipe',
    },
  ],
}: SupportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-2xl bg-background rounded-3xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary text-primary-foreground py-8 px-6 relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex justify-center">
                  {logo ? (
                    <img src={logo.src} alt={logo.alt} className="h-8" />
                  ) : (
                    <div className="text-xl font-bold">Como podemos ajudar?</div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={option.action}
                      className="w-full bg-muted hover:bg-accent rounded-2xl p-6 flex items-center justify-between transition-all group"
                    >
                      <div className="text-left flex-1">
                        <div className="font-semibold text-foreground mb-1">
                          {option.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {option.description}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors ml-4" />
                    </motion.button>
                  ))}
                </div>

                {/* Extra Space */}
                <div className="h-12" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
