import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, Container, Card, Badge } from '@/components/foundation';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';

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

export function TestimonialsSection({
  title,
  badge,
  testimonials = [],
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDesktop = useIsDesktop();

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!testimonials || testimonials.length === 0) {
    return (
      <Section spacing="lg">
        <Container size="narrow">
          {badge && <div className="text-center mb-4 text-sm text-muted-foreground">{badge}</div>}
          {title && <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>}
          <p className="text-center text-muted-foreground">Nenhum depoimento disponível.</p>
        </Container>
      </Section>
    );
  }

  const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
    <Card className="bg-card/50 border border-border p-8 shadow-sm">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating
                ? 'text-orange-400 fill-orange-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <blockquote className="text-lg text-foreground leading-relaxed mb-6">
        "{testimonial.content}"
      </blockquote>

      {/* Author - NO avatar */}
      <div>
        <div className="font-semibold text-foreground">
          {testimonial.author.name}
        </div>
        <div className="text-sm text-muted-foreground">
          {testimonial.author.company ? (
            <>{testimonial.author.company}</>
          ) : (
            <>{testimonial.author.role}</>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <Section spacing="lg">
      <Container size={isDesktop ? 'wide' : 'narrow'}>
        {/* Header */}
        <div className="text-center mb-16">
          {badge && (
            <motion.div
              className="mb-6 flex items-center justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="inline-flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                {badge}
              </Badge>
            </motion.div>
          )}

          {title && (
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {title}
            </motion.h2>
          )}
        </div>

        {isDesktop ? (
          // DESKTOP: Grid 3 colunas
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
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
                <TestimonialCard testimonial={testimonials[currentIndex]} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {testimonials.length > 1 && (
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
