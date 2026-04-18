import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Section, Container } from '@/components/foundation';
import { ChevronDown } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';
import { cn } from '@/app/components/ui/utils';

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

export function FAQSection({
  title,
  description,
  items = [],
}: FAQSectionProps) {
  const isDesktop = useIsDesktop();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  if (!items.length) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title ? (
            <h2 className="mb-4 text-center text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mb-8 text-center text-muted-foreground">{description}</p>
          ) : null}
          <p className="text-center text-muted-foreground">Nenhuma pergunta disponível.</p>
        </Container>
      </Section>
    );
  }

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {isDesktop ? (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
            <div>
              {title ? (
                <motion.h2
                  className="max-w-[12ch] text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl lg:text-[3rem]"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55 }}
                >
                  {title}
                </motion.h2>
              ) : null}

              {description ? (
                <motion.p
                  className="mt-5 max-w-[42ch] text-base leading-relaxed text-muted-foreground md:text-lg"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.06 }}
                >
                  {description}
                </motion.p>
              ) : null}
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const isOpen = openId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className="overflow-hidden rounded-[24px] border border-border/70 bg-card"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-accent/45"
                    >
                      <span className="pr-4 text-[1.02rem] font-semibold leading-snug text-foreground">
                        {item.question}
                      </span>

                      <ChevronDown
                        className={cn(
                          'h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/60 px-6 py-5 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                            {item.answer}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            {(title || description) && (
              <div className="mb-10 text-center">
                {title ? (
                  <motion.h2
                    className="mx-auto max-w-[14ch] text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                  >
                    {title}
                  </motion.h2>
                ) : null}

                {description ? (
                  <motion.p
                    className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.06 }}
                  >
                    {description}
                  </motion.p>
                ) : null}
              </div>
            )}

            <div className="space-y-4">
              {items.map((item, index) => {
                const isOpen = openId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className="overflow-hidden rounded-[22px] border border-border/70 bg-card"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/45"
                    >
                      <span className="pr-4 text-base font-semibold leading-snug text-foreground">
                        {item.question}
                      </span>

                      <ChevronDown
                        className={cn(
                          'h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform',
                          isOpen && 'rotate-180',
                        )}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/60 px-5 py-4 text-[15px] leading-relaxed text-muted-foreground">
                            {item.answer}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}