import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, Container } from '@/components/foundation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/app/components/ui/utils';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  title?: string;
  description?: string;
  items: FAQItem[];
}

export function FAQSection({ title, description, items = [] }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);
  const isDesktop = useIsDesktop();

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Handle empty items array
  if (!items || items.length === 0) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title && <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>}
          {description && <p className="text-center text-muted-foreground mb-8">{description}</p>}
          <p className="text-center text-muted-foreground">Nenhuma pergunta disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {title}
              </motion.h2>
            )}
            {description && (
              <motion.p
                className="text-lg text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        )}

        <div className={isDesktop ? 'grid grid-cols-2 gap-6' : 'space-y-4'}>
          {items.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                className="bg-card rounded-2xl overflow-hidden border border-border"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                      <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
