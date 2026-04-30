import { motion } from 'motion/react';
import { Section, Container, Button } from '@/components/foundation';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface ClosingCTASectionProps {
  title: string;
  description?: string;
  tagline?: string;
  cta: {
    label: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
}

export function ClosingCTASection({
  title,
  description,
  tagline,
  cta,
  image,
}: ClosingCTASectionProps) {
  const isDesktop = useIsDesktop();

  return (
    <Section spacing="xl" className="bg-[#f5f1eb]">
      <Container size="wide">
        {isDesktop && image ? (
          // DESKTOP: Two-column layout (content left, image right)
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div>
              <motion.h2
                className="text-4xl lg:text-5xl font-bold text-foreground leading-[1.1] text-balance mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {title}
              </motion.h2>

              {description && (
                <motion.p
                  className="text-xl text-muted-foreground mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {description}
                </motion.p>
              )}

              {tagline && (
                <motion.p
                  className="text-lg font-medium text-foreground mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {tagline}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  variant="primary"
                  size="xl"
                  pill
                  animated
                  onClick={() => (window.location.href = cta.href)}
                >
                  {cta.label}
                </Button>
              </motion.div>
            </div>

            {/* Right: Image */}
            <motion.div
              className="rounded-3xl overflow-hidden shadow-sm"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        ) : (
          // MOBILE: Centered single column
          <div className="text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-foreground leading-[1.1] text-balance mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {title}
            </motion.h2>

            {description && (
              <motion.p
                className="text-xl text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {description}
              </motion.p>
            )}

            {tagline && (
              <motion.p
                className="text-lg font-medium text-foreground mb-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {tagline}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                variant="primary"
                size="xl"
                pill
                animated
                onClick={() => (window.location.href = cta.href)}
              >
                {cta.label}
              </Button>
            </motion.div>

            {image && (
              <motion.div
                className="mt-12 rounded-3xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}
