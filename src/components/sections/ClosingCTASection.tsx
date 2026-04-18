import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
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
          <div className="grid grid-cols-[0.9fr_1.1fr] items-center gap-10 lg:gap-16">
            <div className="max-w-[560px]">
              {tagline ? (
                <motion.p
                  className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {tagline}
                </motion.p>
              ) : null}

              <motion.h2
                className="text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-foreground md:text-5xl lg:text-[4rem]"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.04 }}
              >
                {title}
              </motion.h2>

              {description ? (
                <motion.p
                  className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-foreground"
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.08 }}
                >
                  {description}
                </motion.p>
              ) : null}

              <motion.div
                className="mt-9"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.12 }}
              >
                <Button
                  variant="primary"
                  size="xl"
                  pill
                  animated
                  className="min-w-[200px]"
                  onClick={() => {
                    window.location.href = cta.href;
                  }}
                >
                  <span>{cta.label}</span>
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="overflow-hidden rounded-[32px] shadow-[0_22px_60px_rgba(0,0,0,0.12)]"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        ) : (
          <div className="text-center">
            {tagline ? (
              <motion.p
                className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {tagline}
              </motion.p>
            ) : null}

            <motion.h2
              className="mx-auto max-w-[14ch] text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-foreground md:text-5xl"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.04 }}
            >
              {title}
            </motion.h2>

            {description ? (
              <motion.p
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.08 }}
              >
                {description}
              </motion.p>
            ) : null}

            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              <Button
                variant="primary"
                size="xl"
                pill
                animated
                onClick={() => {
                  window.location.href = cta.href;
                }}
              >
                <span>{cta.label}</span>
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {image ? (
              <motion.div
                className="mt-10 overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.14 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            ) : null}
          </div>
        )}
      </Container>
    </Section>
  );
}