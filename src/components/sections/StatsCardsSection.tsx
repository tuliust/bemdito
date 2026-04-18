import { motion } from 'motion/react';
import { Section, Container, Card } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';

export interface StatCard {
  id: string;
  value: string;
  label: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
}

export interface StatsCardsSectionProps {
  title?: string;
  stats: StatCard[];
}

export function StatsCardsSection({
  title,
  stats = [],
}: StatsCardsSectionProps) {
  if (!stats || stats.length === 0) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title ? (
            <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
              {title}
            </h2>
          ) : null}
          <p className="text-center text-muted-foreground">
            Nenhuma estatística disponível.
          </p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {title ? (
          <motion.h2
            className="mb-12 text-center text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="h-full"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <Card
                variant="elevated"
                padding="none"
                className={cn(
                  'flex h-full min-h-[360px] flex-col overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-sm',
                  'transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md',
                )}
              >
                <div className="flex flex-1 flex-col justify-between p-8 md:p-9">
                  <div>
                    <div className="text-[3.25rem] font-semibold leading-none tracking-[-0.07em] text-foreground md:text-[4rem]">
                      {stat.value}
                    </div>

                    <div className="mt-5 max-w-[18ch] text-xl font-semibold leading-tight tracking-[-0.03em] text-foreground md:text-2xl">
                      {stat.label}
                    </div>

                    {stat.description ? (
                      <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                        {stat.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                {stat.image ? (
                  <div className="mt-auto h-[150px] w-full overflow-hidden border-t border-border/50 bg-muted/40">
                    <img
                      src={stat.image.src}
                      alt={stat.image.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mt-auto border-t border-border/50 px-8 py-6 md:px-9">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Indicador estratégico
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}