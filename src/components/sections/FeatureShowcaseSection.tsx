import { motion } from 'motion/react';
import { Section, Container, Badge } from '@/components/foundation';
import { Check, Circle } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';
import * as Icons from 'lucide-react';

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

  const getIcon = (iconName?: string) => {
    if (!iconName) return Check;
    if (iconName === 'check') return Check;
    if (iconName === 'circle') return Circle;
    return (Icons as any)[iconName] || Check;
  };

  return (
    <Section spacing="lg">
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

        {isDesktop ? (
          // DESKTOP: 1 imagem grande + 4 benefit cards horizontais
          <>
            {image && (
              <motion.div
                className="relative rounded-3xl overflow-hidden mb-12"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover rounded-3xl"
                />

                {/* Floating Overlays */}
                {overlays.map((overlay, index) => (
                  <motion.div
                    key={overlay.id}
                    className="absolute"
                    style={overlay.position}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    {overlay.type === 'chip' && (
                      <Badge variant="default" pill>
                        {overlay.content}
                      </Badge>
                    )}
                    {overlay.type === 'stat' && (
                      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md">
                        <div className="text-2xl font-bold text-foreground">
                          {overlay.content}
                        </div>
                      </div>
                    )}
                    {overlay.type === 'label' && (
                      <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-2 shadow-md">
                        <div className="text-sm font-medium text-foreground">
                          {overlay.content}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Benefit Cards Grid - 4 colunas horizontal */}
            {benefits.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = getIcon(benefit.icon);
                  return (
                    <motion.div
                      key={benefit.id}
                      className="flex gap-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-foreground/70" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground leading-tight">
                          {benefit.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // MOBILE: 4 feature cards verticais
          <div className="space-y-8">
            {featureCards.map((card, cardIndex) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: cardIndex * 0.1 }}
              >
                {/* Image with Overlays */}
                <div className="relative rounded-3xl overflow-hidden mb-4">
                  <img
                    src={card.image.src}
                    alt={card.image.alt}
                    className="w-full h-auto object-cover rounded-3xl"
                  />

                  {/* Overlays */}
                  {card.overlays?.map((overlay, index) => (
                    <div
                      key={overlay.id}
                      className="absolute"
                      style={overlay.position}
                    >
                      {overlay.type === 'chip' && (
                        <Badge variant="default" pill className="text-xs">
                          {overlay.content}
                        </Badge>
                      )}
                      {overlay.type === 'stat' && (
                        <div className="bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-md">
                          <div className="text-lg font-bold text-foreground">
                            {overlay.content}
                          </div>
                        </div>
                      )}
                      {overlay.type === 'label' && (
                        <div className="bg-white/90 backdrop-blur-md rounded-lg px-3 py-1.5 shadow-md">
                          <div className="text-xs font-medium text-foreground">
                            {overlay.content}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Subtitle */}
                <h3 className="text-2xl font-bold text-foreground mb-4">{card.subtitle}</h3>

                {/* Benefits */}
                <ul className="space-y-3">
                  {card.benefits.map((benefit) => {
                    const Icon = getIcon(benefit.icon);
                    return (
                      <li key={benefit.id} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-foreground text-sm leading-relaxed">
                          {benefit.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
