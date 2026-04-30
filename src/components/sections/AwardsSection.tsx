import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

export function AwardsSection({
  title,
  description,
  awards = [],
}: AwardsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDesktop = useIsDesktop();

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % awards.length);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + awards.length) % awards.length);
  };

  if (!awards || awards.length === 0) {
    return (
      <Section spacing="lg" background="muted">
        <Container size="wide">
          {title && <h2 className="text-3xl font-bold text-center mb-4">{title}</h2>}
          {description && <p className="text-center text-muted-foreground mb-8">{description}</p>}
          <p className="text-center text-muted-foreground">Nenhum prêmio disponível.</p>
        </Container>
      </Section>
    );
  }

  const AwardCard = ({ award }: { award: Award }) => (
    <Card
      variant="elevated"
      padding="lg"
      className="bg-muted/30 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center h-20">
        <img
          src={award.logo.src}
          alt={award.logo.alt}
          className="max-h-full max-w-full object-contain grayscale opacity-70"
        />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-foreground mb-2">
          {award.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-1">
          {award.organization}
        </p>
        <p className="text-sm font-semibold text-primary">
          {award.year}
        </p>
      </div>
    </Card>
  );

  return (
    <Section spacing="lg" background="muted">
      <Container size="wide">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {title}
              </motion.h2>
            )}
            {description && (
              <motion.p
                className="text-lg text-muted-foreground max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        )}

        {isDesktop ? (
          // DESKTOP: Grid 3 columns
          <div className="grid grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <AwardCard award={award} />
              </motion.div>
            ))}
          </div>
        ) : (
          // MOBILE: Carousel
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <AwardCard award={awards[currentIndex]} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {awards.length > 1 && (
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={previous}
                  className="w-12 h-12 rounded-full border border-border hover:bg-accent transition-all flex items-center justify-center"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-12 h-12 rounded-full border border-border hover:bg-accent transition-all flex items-center justify-center"
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
