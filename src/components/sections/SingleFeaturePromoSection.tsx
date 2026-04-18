import { motion } from 'motion/react';
import { Section, Container } from '@/components/foundation';
import { Check } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface Benefit {
  id: string;
  title: string;
  description?: string;
}

export interface FeatureCard {
  id: string;
  image: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
}

export interface SingleFeaturePromoSectionProps {
  title?: string;
  subtitle?: string;
  image?: {
    src: string;
    alt: string;
  };
  benefits?: Benefit[];
  featureCards?: FeatureCard[];
}

export function SingleFeaturePromoSection({
  title,
  subtitle,
  image,
  benefits = [],
  featureCards = [],
}: SingleFeaturePromoSectionProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <Section spacing="lg">
        <Container size="wide">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            {image ? (
              <motion.div
                className="overflow-hidden rounded-[32px]"
                initial={{ opacity: 0, x: -28 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ) : null}

            <div>
              {subtitle ? (
                <motion.p
                  className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {subtitle}
                </motion.p>
              ) : null}

              {title ? (
                <motion.h2
                  className="max-w-[13ch] text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl lg:text-[3.2rem]"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.04 }}
                >
                  {title}
                </motion.h2>
              ) : null}

              <div className="mt-8 space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.id}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.48, delay: 0.08 + index * 0.06 }}
                  >
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-5 w-5" strokeWidth={2.6} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.03em] text-foreground">
                        {benefit.title}
                      </h3>
                      {benefit.description ? (
                        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                          {benefit.description}
                        </p>
                      ) : null}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="lg">
      <Container size="wide">
        <div className="space-y-8">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="overflow-hidden rounded-[28px] border border-border/70 bg-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
            >
              <img
                src={card.image.src}
                alt={card.image.alt}
                className="h-auto w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}