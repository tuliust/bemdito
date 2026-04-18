import type { ComponentType } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export interface SupportOption {
  id: string;
  title: string;
  description: string;
  icon?: string;
  label?: string;
  action?: () => void;
  href?: string;
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

const DEFAULT_OPTIONS: SupportOption[] = [
  {
    id: '1',
    title: 'Faça um diagnóstico rápido',
    description: 'Encontre a melhor solução para sua empresa em poucos minutos.',
    icon: 'ClipboardList',
    href: '/quiz',
  },
  {
    id: '2',
    title: 'Ver planos e demonstração',
    description: 'Compare recursos e entenda como a plataforma funciona.',
    icon: 'Sparkles',
    href: '/demo',
  },
  {
    id: '3',
    title: 'Falar com nossa equipe',
    description: 'Envie sua dúvida e receba orientação comercial ou técnica.',
    icon: 'MessagesSquare',
    href: '/contato',
  },
];

function resolveIcon(iconName?: string): ComponentType<{ className?: string }> | null {
  const fallback = Icons.HelpCircle as ComponentType<{ className?: string }>;

  if (!iconName) return fallback;

  const icon = (Icons as Record<string, ComponentType<{ className?: string }>>)[iconName];
  return icon || fallback;
}

export function SupportModal({
  isOpen,
  onClose,
  previewMode = false,
  title = 'Como podemos ajudar?',
  logo,
  options = DEFAULT_OPTIONS,
}: SupportModalProps) {
  const containerClass = previewMode ? 'absolute' : 'fixed';

  const handleOptionClick = (option: SupportOption) => {
    onClose();

    if (option.action) {
      option.action();
      return;
    }

    if (option.href) {
      window.location.href = option.href;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={cn(containerClass, 'inset-0 z-[60]')} role="dialog" aria-modal="true">
          <motion.div
            className={cn(containerClass, 'inset-0 bg-black/18')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.div
            className={cn(
              containerClass,
              'right-6 top-[88px] w-[392px] overflow-hidden rounded-[22px] border border-border bg-background shadow-2xl',
              previewMode && 'right-0 top-0',
            )}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-primary px-6 py-5 text-primary-foreground">
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar painel de ajuda"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="pr-12">
                {logo?.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="mb-2 h-7 w-auto object-contain"
                  />
                ) : null}

                <h2 className="text-xl font-semibold tracking-[-0.03em]">
                  {title}
                </h2>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {options.map((option, index) => {
                  const Icon = resolveIcon(option.icon);

                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ delay: index * 0.04 }}
                      className="group flex w-full items-start gap-4 rounded-[18px] bg-muted/55 px-4 py-4 text-left transition-colors hover:bg-accent"
                    >
                      <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
                        {Icon ? <Icon className="h-5 w-5" /> : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[1rem] font-semibold leading-snug text-foreground">
                              {option.title}
                            </div>
                            <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                              {option.description}
                            </div>
                            {option.label ? (
                              <div className="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-primary">
                                {option.label}
                              </div>
                            ) : null}
                          </div>

                          <ChevronRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}