import { motion } from 'motion/react';
import { Section, Container } from '@/components/foundation';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface IconFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface IconFeatureListSectionProps {
  title?: string;
  description?: string;
  features: IconFeature[];
}

export function IconFeatureListSection({
  title,
  description,
  features = [],
}: IconFeatureListSectionProps) {
  const isDesktop = useIsDesktop();

  const getIcon = (iconName: string): LucideIcon => {
    return (Icons as any)[iconName] || Icons.Circle;
  };

  if (!features || features.length === 0) {
    return (
      <Section spacing="lg">
        <Container size="wide">
          {title && <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>}
          {description && <p className="text-center text-muted-foreground mb-8">{description}</p>}
          <p className="text-center text-muted-foreground">Nenhum recurso disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg">
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

        <div className={isDesktop ? 'grid grid-cols-2 gap-x-16 gap-y-12' : 'space-y-8'}>
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);

            return (
              <motion.div
                key={feature.id}
                className="flex gap-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Icon Container */}
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Icon className="w-12 h-12 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
