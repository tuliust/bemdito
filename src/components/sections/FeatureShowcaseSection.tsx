import { motion } from 'motion/react';
import { Section, Container, Badge } from '@/components/foundation';
import { Check, Circle } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';
import * as Icons from 'lucide-react';
import { cn } from '@/app/components/ui/utils';

export interface Benefit {
  id: string;
  text: string;
  icon?: 'check' | 'circle' | string;
}

export interface Overlay {
  id: string;
  type: 'stat' | 'label' | 'chip';
  content: string;
  position: { top?: string; right?: string; bottom?: string; left?: string };
}

export interface FeatureCard {
  id: string;
  subtitle: string;
  image: {
    src: string;
    alt: string;
  };
  overlays?: Overlay[];
  benefits: Benefit[];
}

export interface FeatureShowcaseSectionProps {
  title?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  overlays?: Overlay[];
  benefits?: Benefit[];
  featureCards?: FeatureCard[];
  variant?: 'analytics_dashboard' | 'wellness_routine' | 'single_feature_promo';
}

function getIcon(iconName?: string) {
  if (!iconName || iconName === 'check') return Check;
  if (iconName === 'circle') return Circle;
  return (Icons as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || Check;
}

function OverlayBlock({ overlay }: { overlay: Overlay }) {
  if (overlay.type === 'chip') {
    return (
      <Badge
        variant="default"
        pill
        className="bg-background/92 text-foreground shadow-[0_16px_36px_rgba(0,0,0,0.12)] backdrop-blur"
      >
        {overlay.content}
      </Badge>
    );
  }

  if (overlay.type === 'stat') {
    return (
      <div className="rounded-[22px] bg-background/94 px-5 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur">
        <div className="text-lg font-semibold tracking-[-0.03em] text-foreground md:text-xl">
          {overlay.content}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-background/94 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.14)] backdrop-blur">
      <div className="text-sm font-medium text-foreground md:text-[15px]">
        {overlay.content}
      </div>
    </div>
  );
}

export function FeatureShowcaseSection({
  title,
  description,
  image,
  overlays = [],
  benefits = [],
  featureCards = [],
  variant = 'analytics_dashboard',
}: FeatureShowcaseSectionProps) {
  const isDesktop = useIsDesktop();

  if (!image && (!featureCards || featureCards.length === 0)) {
    return null;
  }

  return (
    <Section spacing="lg">
      <Container size="wide">
        {(title || description) ? (
          <div className="mb-12 text-center md:mb-14">
            {title ? (
              <motion.h2
                className="mx-auto max-w-[14ch] text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl lg:text-[3.4rem]"
                initial={{ opacity: 0, y: 20 }}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.06 }}
              >
                {description}
              </motion.p>
            ) : null}
          </div>
        ) : null}

        {isDesktop ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] lg:items-start">
            {/* Media block */}
            {image ? (
              <motion.div
                className="relative overflow-hidden rounded-[32px]"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />

                {overlays.map((overlay, index) => (
                  <motion.div
                    key={overlay.id}
                    className="absolute"
                    style={overlay.position}
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.14 + index * 0.06 }}
                  >
                    <OverlayBlock overlay={overlay} />
                  </motion.div>
                ))}
              </motion.div>
            ) : null}

            {/* Benefit list */}
            <div
              className={cn(
                'rounded-[32px] border border-border/70 bg-card/60 p-7 md:p-8 lg:p-9',
                variant === 'single_feature_promo' && 'bg-muted/35',
              )}
            >
              <div className="space-y-6">
                {benefits.map((benefit, index) => {
                  const Icon = getIcon(benefit.icon);

                  return (
                    <motion.div
                      key={benefit.id}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.48, delay: index * 0.08 }}
                    >
                      <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-base font-medium leading-relaxed text-foreground md:text-lg">
                          {benefit.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                {benefits.length === 0 ? (
                  <p className="text-muted-foreground">Nenhum benefício disponível.</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {featureCards.length > 0 ? (
              featureCards.map((card, cardIndex) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.58, delay: cardIndex * 0.08 }}
                  className="overflow-hidden rounded-[28px] border border-border/70 bg-card"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={card.image.src}
                      alt={card.image.alt}
                      className="h-auto w-full object-cover"
                    />

                    {card.overlays?.map((overlay) => (
                      <div
                        key={overlay.id}
                        className="absolute"
                        style={overlay.position}
                      >
                        <OverlayBlock overlay={overlay} />
                      </div>
                    ))}
                  </div>

                  <div className="p-6">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {card.subtitle}
                    </p>

                    <div className="space-y-4">
                      {card.benefits.map((benefit) => {
                        const Icon = getIcon(benefit.icon);

                        return (
                          <div key={benefit.id} className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <p className="text-[15px] leading-relaxed text-foreground">
                              {benefit.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <>
                {image ? (
                  <motion.div
                    className="relative overflow-hidden rounded-[28px]"
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.58 }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-auto w-full object-cover"
                    />

                    {overlays.map((overlay) => (
                      <div
                        key={overlay.id}
                        className="absolute"
                        style={overlay.position}
                      >
                        <OverlayBlock overlay={overlay} />
                      </div>
                    ))}
                  </motion.div>
                ) : null}

                {benefits.length > 0 ? (
                  <div className="rounded-[28px] border border-border/70 bg-card/70 p-6">
                    <div className="space-y-5">
                      {benefits.map((benefit, index) => {
                        const Icon = getIcon(benefit.icon);

                        return (
                          <motion.div
                            key={benefit.id}
                            className="flex items-start gap-3.5"
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: index * 0.06 }}
                          >
                            <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Icon className="h-4.5 w-4.5" />
                            </div>
                            <p className="text-[15px] leading-relaxed text-foreground">
                              {benefit.text}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}