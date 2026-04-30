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
  legalText = 'Ao se inscrever, você concorda com nossa política de privacidade',
}: NewsletterCaptureSectionProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <Section spacing="lg" className="border-t border-border">
      <Container size="narrow">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>

          {description && (
            <p className="text-lg text-muted-foreground mb-8">{description}</p>
          )}

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="flex-1 h-14 px-6 rounded-full bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <Button type="submit" variant="primary" pill size="lg">
                {buttonLabel}
              </Button>
            </div>

            {legalText && (
              <p className="text-xs text-muted-foreground">{legalText}</p>
            )}
          </form>
        </motion.div>
      </Container>
    </Section>
  );
}
