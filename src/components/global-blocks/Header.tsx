import { useState, useEffect } from 'react';
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

export function Header({
  logo,
  navigation = [],
  cta,
  onMenuToggle,
  sticky = true,
  hideOnScroll = true,
}: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
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
  }, [lastScrollY, hideOnScroll]);

  return (
    <motion.header
      className={cn(
        'w-full bg-background/80 backdrop-blur-lg border-b border-border z-50 transition-transform',
        sticky && 'sticky top-0'
      )}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <Container size="wide">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <div className="flex items-center flex-shrink-0">
            {logo ? (
              <img src={logo.src} alt={logo.alt} className="h-8 lg:h-10" />
            ) : (
              <div className="text-xl lg:text-2xl font-bold text-foreground">BetterMe</div>
            )}
          </div>

          {navigation.length > 0 && (
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-foreground/70 transition-colors font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3 lg:gap-4">
            <a
              href="/privacy-policy"
              className="hidden lg:inline-block text-sm text-foreground hover:text-foreground/70 transition-colors"
            >
              Privacy policy
            </a>

            <Button
              variant="outline"
              size="md"
              pill
              className="hidden lg:inline-flex"
              onClick={() => (window.location.href = cta?.href || '/request-demo')}
            >
              {cta?.label || 'Request a demo'}
            </Button>

            <button
              onClick={onMenuToggle}
              className="flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 rounded-full border-2 border-border hover:border-foreground/30 transition-all"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
