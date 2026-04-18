import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Section, Container, Card, Badge } from '@/components/foundation';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';
import { cn } from '@/app/components/ui/utils';

export interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    company?: string;
  };
  rating: number;
}

export interface TestimonialsSectionProps {
  title?: string;
  badge?: string;
  testimonials: Testimonial[];
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            className={cn(
              'h-4.5 w-4.5',
              filled ? 'fill-[#ea526e] text-[#ea526e]' : 'text-border',
            )}
          />
        );
      })}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card
      variant="elevated"
      padding="none"
      className="h-full rounded-[28px] border border-border/70 bg-card shadow-sm"
    >
      <div className="flex h-full flex-col p-7 md:p-8">
        <div className="mb-5">
          <RatingStars rating={testimonial.rating} />
        </div>

        <blockquote className="flex-1 text-[1.02rem] leading-relaxed text-foreground md:text-lg">
          “{testimonial.content}”
        </blockquote>

        <div className="mt-8 border-t border-border/60 pt-5">
          <div className="text-base font-semibold tracking-[-0.03em] text-foreground">
            {testimonial.author.name}
          </div>
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {testimonial.author.role}
            {testimonial.author.company ? ` · ${testimonial.author.company}` : ''}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function TestimonialsSection({
  title,
  badge,
  testimonials = [],
}: TestimonialsSectionProps) {
  const isDesktop = useIsDesktop();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!testimonials.length) {
    return (
      <Section spacing="lg">
        <Container size="wide">
          {badge ? (
            <div className="mb-4 text-center text-sm text-muted-foreground">{badge}</div>
          ) : null}
          {title ? (
            <h2 className="mb-8 text-center text-3xl font-semibold tracking-[-0.04em] text-foreground">
              {title}
            </h2>
          ) : null}
          <p className="text-center text-muted-foreground">Nenhum depoimento disponível.</p>
        </Container>
      </Section>
    );
  }

  const goPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <Section spacing="lg">
      <Container size="wide">
        <div className="mb-12 text-center md:mb-16">
          {badge ? (
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="inline-flex rounded-full px-4 py-2 text-sm font-medium"
              >
                {badge}
              </Badge>
            </motion.div>
          ) : null}

          {title ? (
            <motion.h2
              className="mx-auto max-w-[14ch] text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl lg:text-[3rem]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.04 }}
            >
              {title}
            </motion.h2>
          ) : null}
        </div>

        {isDesktop ? (
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="h-full"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[currentIndex].id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.28 }}
              >
                <TestimonialCard testimonial={testimonials[currentIndex]} />
              </motion.div>
            </AnimatePresence>

            {testimonials.length > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label="Depoimento anterior"
                  onClick={goPrevious}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label="Próximo depoimento"
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