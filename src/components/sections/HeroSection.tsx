import { motion } from 'motion/react';
import { ArrowUpRight, Play, Users, BarChart3, HeartPulse } from 'lucide-react';
import { Section, Container, Button, Badge } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';

export interface HeroOverlay {
  id: string;
  content?: React.ReactNode;
  position: { top?: string; right?: string; bottom?: string; left?: string };
}

export interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
  image?: {
    src: string;
    alt: string;
  };
  overlays?: HeroOverlay[];
  variant?: 'default' | 'full-bleed';
}

function DefaultHeroOverlays() {
  return (
    <>
      <div className="absolute left-[-2.5rem] top-[12%] hidden w-[220px] rounded-[24px] bg-background/94 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur md:block">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Equipes ativas
            </div>
            <div className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              320+
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Empresas usando jornadas personalizadas de bem-estar.
        </p>
      </div>

      <div className="absolute bottom-[10%] right-[-2rem] hidden w-[240px] rounded-[24px] bg-background/94 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur md:block">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Engajamento médio
            </div>
            <div className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
              87%
            </div>
          </div>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[87%] rounded-full bg-primary" />
        </div>
      </div>

      <div className="absolute right-[8%] top-[8%] hidden rounded-full bg-background/94 px-4 py-3 shadow-[0_18px_40px_rgba(0,0,0,0.12)] backdrop-blur md:flex md:items-center md:gap-2">
        <HeartPulse className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Atualizado em tempo real</span>
      </div>
    </>
  );
}

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  overlays = [],
  variant = 'default',
}: HeroSectionProps) {
  const resolvedPrimaryCTA = primaryCTA ?? {
    label: 'Começar agora',
    href: '/cadastro',
  };

  const resolvedSecondaryCTA = secondaryCTA ?? {
    label: 'Ver demonstração',
    href: '/demo',
  };

  return (
    <Section
      spacing="xl"
      className={cn(
        'overflow-hidden pt-8 md:pt-12 lg:pt-16',
        variant === 'full-bleed' && 'px-0',
      )}
    >
      <Container size={variant === 'full-bleed' ? 'full' : 'wide'}>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="max-w-[640px]"
          >
            {eyebrow ? (
              <Badge
                variant="secondary"
                className="mb-6 inline-flex rounded-full px-4 py-2 text-sm font-medium"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <h1 className="max-w-[12ch] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-foreground md:text-5xl lg:text-6xl xl:text-[5.25rem]">
              {title}
            </h1>

            {description ? (
              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                {description}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                variant="primary"
                size="xl"
                pill
                animated
                className="min-w-[190px]"
                onClick={() => {
                  window.location.href = resolvedPrimaryCTA.href;
                }}
              >
                <span>{resolvedPrimaryCTA.label}</span>
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="xl"
                pill
                animated
                className="min-w-[190px]"
                onClick={() => {
                  window.location.href = resolvedSecondaryCTA.href;
                }}
              >
                <Play className="mr-2 h-4 w-4" />
                <span>{resolvedSecondaryCTA.label}</span>
              </Button>
            </div>
          </motion.div>

          {/* Right image */}
          {image ? (
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.08,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
            >
              <div className="relative overflow-visible rounded-[32px]">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-auto w-full rounded-[32px] object-cover shadow-[0_24px_70px_rgba(0,0,0,0.12)]"
                />

                {overlays.length > 0 ? (
                  overlays.map((overlay, index) => (
                    <motion.div
                      key={overlay.id}
                      className="absolute"
                      style={overlay.position}
                      initial={{ opacity: 0, scale: 0.92, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
                    >
                      {overlay.content}
                    </motion.div>
                  ))
                ) : (
                  <DefaultHeroOverlays />
                )}
              </div>
            </motion.div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}