import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon?: string;
  label?: string;
  action?: () => void;
}

export interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewMode?: boolean;
  title?: string;
  logo?: {
    src: string;
    alt: string;
  };
  options?: SupportOption[];
}

export function SupportModal({
  isOpen,
  onClose,
  previewMode = false,
  title = 'Como podemos ajudar?',
  logo,
  options = [
    {
      id: '1',
      title: 'Quiz rapido',
      description: 'Descubra qual solucao e ideal para voce',
    },
    {
      id: '2',
      title: 'Wellness gifts',
      description: 'Explore opcoes de presentes corporativos',
    },
    {
      id: '3',
      title: 'Duvida / Contato',
      description: 'Entre em contato com nossa equipe',
    },
  ],
}: SupportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={`${previewMode ? 'absolute' : 'fixed'} inset-0 bg-black/40 z-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <div className={`${previewMode ? 'absolute' : 'fixed'} inset-0 z-50 flex items-center justify-center p-4`}>
            <motion.div
              className="w-full max-w-2xl bg-background rounded-3xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
            >
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
                    <div className="text-xl font-bold">{title}</div>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="space-y-3">
                  {options.map((option, index) => {
                    const iconName = option.icon || 'HelpCircle';
                    const IconComponent = (Icons as Record<string, ComponentType<{ className?: string }>>)[iconName];

                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={option.action}
                        className="w-full bg-muted hover:bg-accent rounded-2xl p-6 flex items-center justify-between transition-all group"
                      >
                        <div className="text-left flex-1 flex items-start gap-4">
                          {IconComponent && (
                            <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">
                              <IconComponent className="w-5 h-5 text-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-foreground mb-1">
                              {option.title || option.label}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors ml-4" />
                      </motion.button>
                    );
                  })}
                </div>

                <div className="h-12" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
