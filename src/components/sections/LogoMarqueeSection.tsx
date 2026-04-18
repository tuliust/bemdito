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
}: LogoMarqueeSectionProps) {
  const isDesktop = useIsDesktop();

  if (!logos.length) {
    return (
      <Section spacing="md" background="muted">
        <Container size="wide">
          {title ? (
            <h3 className="mb-4 text-center text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {title}
            </h3>
          ) : null}
          <p className="text-center text-muted-foreground">Nenhum logo disponível.</p>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="md" background="muted">
      <Container size="wide">
        {title ? (
          <motion.div
            className="mb-10 text-center md:mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {title}
            </h3>
          </motion.div>
        ) : null}

        {isDesktop ? (
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-7 w-auto max-w-[140px] object-contain grayscale opacity-55 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="-mx-6 overflow-x-auto px-6">
            <div className="flex min-w-max items-center gap-10">
              {logos.map((logo, index) => (
                <motion.div
                  key={logo.id}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  className="flex items-center justify-center"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-7 w-auto max-w-[140px] object-contain grayscale opacity-60"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}