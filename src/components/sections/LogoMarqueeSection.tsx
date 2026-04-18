import { motion } from 'motion/react';
import { Section, Container } from '@/components/foundation';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface Logo {
  id: string;
  src: string;
  alt: string;
}

export interface LogoMarqueeSectionProps {
  title?: string;
  logos: Logo[];
  animated?: boolean;
}

export function LogoMarqueeSection({
  title,
  logos = [],
  animated = true,
}: LogoMarqueeSectionProps) {
  const isDesktop = useIsDesktop();

  if (!logos || logos.length === 0) {
    return (
      <Section spacing="md" background="muted">
        <Container size="wide">
          {title && <h3 className="text-lg font-medium text-center text-muted-foreground mb-4">{title}</h3>}
          <p className="text-center text-muted-foreground">Nenhum logo disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="md" background="muted">
      <Container size="wide">
        {title && (
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
          </motion.div>
        )}

        {isDesktop ? (
          // DESKTOP: Centered flex-wrap grid
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-16 items-center justify-center flex-wrap"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {logos.map((logo, index) => (
                <motion.div
                  key={logo.id}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-10 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          // MOBILE: Horizontal scroll
          <div className="overflow-x-auto -mx-6 px-6 scrollbar-hide">
            <motion.div
              className="flex gap-8 items-center min-w-max"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {logos.map((logo) => (
                <div key={logo.id} className="flex-shrink-0">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 grayscale opacity-60"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </Container>
    </Section>
  );
}
