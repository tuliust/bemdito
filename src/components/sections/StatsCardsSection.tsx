import { motion } from 'motion/react';
import { Section, Container, Card } from '@/components/foundation';

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

export function StatsCardsSection({ title, stats = [] }: StatsCardsSectionProps) {
  if (!stats || stats.length === 0) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
          <p className="text-center text-muted-foreground">Nenhuma estatística disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {title && (
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <Card variant="elevated" padding="none" className="h-full overflow-hidden flex flex-col shadow-sm">
                <div className="p-8 flex-1">
                  <div className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                    {stat.value}
                  </div>
                  <div className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {stat.description}
                    </div>
                  )}
                </div>
                {stat.image && (
                  <div className="hidden md:block">
                    <img
                      src={stat.image.src}
                      alt={stat.image.alt}
                      className="w-full h-48 object-cover rounded-b-2xl"
                    />
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
