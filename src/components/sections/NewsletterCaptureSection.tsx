import { useState } from 'react';
import { motion } from 'motion/react';
import { Section, Container, Button } from '@/components/foundation';

export interface NewsletterCaptureSectionProps {
  title: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  legalText?: string;
}

export function NewsletterCaptureSection({
  title,
  description,
  placeholder = 'Seu email',
  buttonLabel = 'Inscrever',
  legalText = 'Ao se inscrever, você concorda com nossa política de privacidade.',
}: NewsletterCaptureSectionProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <Section spacing="lg" className="border-t border-border">
      <Container size="narrow">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="text-3xl font-semibold leading-[1] tracking-[-0.05em] text-foreground md:text-4xl">
            {title}
          </h2>

          {description ? (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          ) : null}

          <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="h-14 flex-1 rounded-full border border-border bg-input-background px-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <Button type="submit" variant="primary" pill size="lg" className="min-w-[140px]">
                {buttonLabel}
              </Button>
            </div>

            {legalText ? (
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {legalText}
              </p>
            ) : null}
          </form>
        </motion.div>
      </Container>
    </Section>
  );
}