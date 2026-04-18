import { motion } from 'motion/react';
import { Section, Container } from '@/components/foundation';
import { useIsDesktop } from '@/hooks/use-breakpoint';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

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

function resolveIcon(iconName: string): LucideIcon {
  return (Icons as Record<string, LucideIcon>)[iconName] || Icons.Circle;
}

export function IconFeatureListSection({
  title,
  description,
  features = [],
}: IconFeatureListSectionProps) {
  const isDesktop = useIsDesktop();

  if (!features.length) {
    return (
      <Section spacing="lg">
        <Container size="wide">
          {title ? (
            <h2 className="mb-4 text-center text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mb-8 text-center text-muted-foreground">{description}</p>
          ) : null}
          <p className="text-center text-muted-foreground">Nenhum recurso disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg">
      <Container size="wide">
        {(title || description) && (
          <div className="mb-14 text-center md:mb-16">
            {title ? (
              <motion.h2
                className="mx-auto max-w-[15ch] text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl lg:text-[3.2rem]"
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
                className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg"
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

        <div className={isDesktop ? 'grid grid-cols-2 gap-x-16' : 'space-y-0'}>
          {features.map((feature, index) => {
            const Icon = resolveIcon(feature.icon);

            return (
              <motion.div
                key={feature.id}
                className="border-t border-border/70 py-7 first:border-t md:py-8"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="flex gap-5">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-muted/55 text-foreground">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}