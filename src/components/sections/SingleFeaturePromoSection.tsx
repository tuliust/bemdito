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
    // DESKTOP: Two-column layout (image left 50%, benefits right 50%)
    return (
      <Section spacing="lg" background="white">
        <Container size="wide">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            {image && (
              <motion.div
                className="rounded-3xl overflow-hidden"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            )}

            {/* Right: Content + Benefits */}
            <div>
              {subtitle && (
                <motion.p
                  className="text-sm font-semibold text-primary mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {subtitle}
                </motion.p>
              )}

              {title && (
                <motion.h2
                  className="text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight text-balance"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {title}
                </motion.h2>
              )}

              {/* Benefits with circular checkmarks */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.id}
                    className="flex gap-4 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    {/* Circular navy checkmark */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {benefit.title}
                      </h3>
                      {benefit.description && (
                        <p className="text-muted-foreground">
                          {benefit.description}
                        </p>
                      )}
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

  // MOBILE: 3 cards vertical (each with image + title + description)
  return (
    <Section spacing="lg" background="white">
      <Container size="wide">
        <div className="space-y-8">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.id}
              className="overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="rounded-3xl overflow-hidden mb-6">
                <img
                  src={card.image.src}
                  alt={card.image.alt}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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
