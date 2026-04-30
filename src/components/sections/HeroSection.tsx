import { motion } from 'motion/react';
import { Section, Container, Button, Badge } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';

export interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
  overlays?: {
    id: string;
    content: any;
    position: { top?: string; right?: string; bottom?: string; left?: string };
  }[];
  variant?: 'default' | 'full-bleed';
}

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  overlays = [],
  variant = 'default',
}: HeroSectionProps) {
  return (
    <Section spacing="xl" className="min-h-[70vh] flex items-center">
      <Container size={variant === 'full-bleed' ? 'full' : 'wide'}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {eyebrow && (
              <Badge variant="secondary" className="mb-6">
                {eyebrow}
              </Badge>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] text-balance mb-6">
              {title}
            </h1>

            {description && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                {description}
              </p>
            )}

            {(primaryCTA || secondaryCTA) && (
              <div className="flex flex-col sm:flex-row gap-4">
                {primaryCTA && (
                  <Button
                    variant="primary"
                    size="xl"
                    pill
                    animated
                    className="w-full sm:w-auto"
                    onClick={() => (window.location.href = primaryCTA.href)}
                  >
                    {primaryCTA.label}
                  </Button>
                )}
                {secondaryCTA && (
                  <Button
                    variant="outline"
                    size="xl"
                    pill
                    animated
                    className="w-full sm:w-auto"
                    onClick={() => (window.location.href = secondaryCTA.href)}
                  >
                    {secondaryCTA.label}
                  </Button>
                )}
              </div>
            )}
          </motion.div>

          {/* Image with Overlays */}
          {image && (
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
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
                  className="absolute bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md"
                  style={overlay.position}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  {overlay.content}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </Container>
    </Section>
  );
}
