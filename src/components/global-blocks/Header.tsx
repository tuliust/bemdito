import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Menu } from 'lucide-react';
import { Container, Button } from '@/components/foundation';
import { cn } from '@/app/components/ui/utils';

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  logo?: {
    src: string;
    alt: string;
  };
  navigation?: NavLink[];
  cta?: {
    label: string;
    href: string;
  };
  onMenuToggle?: () => void;
  sticky?: boolean;
  hideOnScroll?: boolean;
}

const DEFAULT_NAVIGATION: NavLink[] = [
  { label: 'Recursos', href: '/recursos' },
  { label: 'Para empresas', href: '/empresas' },
  { label: 'Blog', href: '/blog' },
];

const DEFAULT_CTA = {
  label: 'Começar grátis',
  href: '/cadastro',
};

function resolveActiveHref(
  pathname: string,
  navigation: NavLink[],
): string | null {
  const normalizedPath = pathname.toLowerCase();

  const exactMatch = navigation.find((item) => {
    const href = item.href.toLowerCase();
    return href !== '/' && normalizedPath === href;
  });

  if (exactMatch) return exactMatch.href;

  const partialMatch = navigation.find((item) => {
    const href = item.href.toLowerCase();
    return href !== '/' && normalizedPath.startsWith(href);
  });

  if (partialMatch) return partialMatch.href;

  return navigation[1]?.href ?? navigation[0]?.href ?? null;
}

export function Header({
  logo,
  navigation = DEFAULT_NAVIGATION,
  cta = DEFAULT_CTA,
  onMenuToggle,
  sticky = true,
  hideOnScroll = false,
}: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  const resolvedNavigation = useMemo(() => {
    return navigation.length > 0 ? navigation : DEFAULT_NAVIGATION;
  }, [navigation]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setActiveHref(resolveActiveHref(window.location.pathname, resolvedNavigation));
  }, [resolvedNavigation]);

  useEffect(() => {
    if (!hideOnScroll || typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 16) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, lastScrollY]);

  const handleNavigate = (href: string) => {
    window.location.href = href;
  };

  return (
    <motion.header
      className={cn(
        'w-full border-b border-border bg-background/95 backdrop-blur-sm z-50',
        sticky && 'sticky top-0',
      )}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -104 }}
      transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Container size="wide">
        <div className="flex h-20 items-center justify-between gap-6 lg:h-24">
          {/* Left */}
          <div className="flex min-w-0 flex-shrink-0 items-center">
            <a
              href="/"
              aria-label="Ir para a página inicial"
              className="inline-flex items-center"
            >
              {logo?.src ? (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 w-auto object-contain lg:h-9"
                />
              ) : (
                <span className="text-[2rem] font-semibold tracking-[-0.04em] text-foreground">
                  BemDito
                </span>
              )}
            </a>
          </div>

          {/* Center nav */}
          <nav
            className="hidden flex-1 items-center justify-center lg:flex"
            aria-label="Navegação principal"
          >
            <ul className="flex items-center gap-10">
              {resolvedNavigation.map((item) => {
                const isActive = activeHref === item.href;

                return (
                  <li key={item.href} className="relative">
                    <a
                      href={item.href}
                      className={cn(
                        'relative inline-flex items-center text-[15px] font-medium transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-foreground/90 hover:text-foreground/65',
                      )}
                    >
                      {item.label}
                    </a>

                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-[calc(100%+8px)] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#ea526e]"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right actions */}
          <div className="flex flex-shrink-0 items-center gap-3 lg:gap-4">
            <a
              href="/privacy-policy"
              className="hidden text-sm text-foreground transition-colors hover:text-foreground/65 lg:inline-block"
            >
              Privacy policy
            </a>

            <Button
              variant="outline"
              size="md"
              pill
              className="hidden h-12 min-w-[188px] px-7 text-base lg:inline-flex"
              onClick={() => handleNavigate(cta.href)}
            >
              {cta.label}
            </Button>

            <button
              type="button"
              onClick={onMenuToggle}
              aria-label="Abrir menu"
              className={cn(
                'inline-flex items-center justify-center rounded-full border border-border bg-background text-foreground transition-all',
                'h-12 w-12 hover:bg-accent lg:h-14 lg:w-14',
              )}
            >
              <Menu className="h-5 w-5 lg:h-5.5 lg:w-5.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}