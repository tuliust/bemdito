import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Section, Container, Card } from '@/components/foundation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface Award {
  id: string;
  organization: string;
  logo: {
    src: string;
    alt: string;
  };
  title: string;
  year: string;
}

export interface AwardsSectionProps {
  title?: string;
  description?: string;
  awards: Award[];
}

function AwardCard({ award }: { award: Award }) {
  return (
    <Card
      variant="elevated"
      padding="none"
      className="h-full rounded-[28px] border border-border/70 bg-card shadow-sm"
    >
      <div className="flex h-full flex-col items-center justify-between p-8 text-center md:p-9">
        <div className="flex h-20 items-center justify-center">
          <img
            src={award.logo.src}
            alt={award.logo.alt}
            className="max-h-full w-auto max-w-[150px] object-contain grayscale opacity-70"
          />
        </div>

        <div className="mt-8 flex-1">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">
            {award.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {award.organization}
          </p>
        </div>

        <div className="mt-8 inline-flex rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground">
          {award.year}
        </div>
      </div>
    </Card>
  );
}

export function AwardsSection({
  title,
  description,
  awards = [],
}: AwardsSectionProps) {
  const isDesktop = useIsDesktop();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!awards.length) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title ? (
            <h2 className="mb-4 text-center text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="mb-8 text-center text-muted-foreground">{description}</p>
          ) : null}
          <p className="text-center text-muted-foreground">Nenhum prêmio disponível.</p>
        </Container>
      </Section>
    );
  }

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + awards.length) % awards.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % awards.length);
  };

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {(title || description) && (
          <div className="mb-12 text-center md:mb-16">
            {title ? (
              <motion.h2
                className="mx-auto max-w-[14ch] text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl lg:text-[3rem]"
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
                transition={{ duration: 0.55, delay: 0.05 }}
              >
                {description}
              </motion.p>
            ) : null}
          </div>
        )}

        {isDesktop ? (
          <div className="grid grid-cols-3 gap-6 md:gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                className="h-full"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <AwardCard award={award} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={awards[currentIndex].id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
              >
                <AwardCard award={awards[currentIndex]} />
              </motion.div>
            </AnimatePresence>

            {awards.length > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Prêmio anterior"
                  onClick={goPrevious}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label="Próximo prêmio"
                  onClick={goNext}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>
        )}
      </Container>
    </Section>
  );
}