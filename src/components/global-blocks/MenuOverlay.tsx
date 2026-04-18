import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/foundation';
import { useIsDesktop } from '@/hooks/use-breakpoint';
import { cn } from '@/app/components/ui/utils';

export interface MenuItem {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
}

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  previewMode?: boolean;
  navigation?: MenuItem[];
  primaryItems?: MenuItem[];
  secondaryItems?: MenuItem[];
  socialLinks?: SocialLink[];
  backgroundImage?: string;
  currentLanguage?: string;
  cta?: {
    label: string;
    href: string;
  };
}

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'TikTok', href: 'https://tiktok.com' },
  { name: 'Facebook', href: 'https://facebook.com' },
];

const DEFAULT_PRIMARY_ITEMS: MenuItem[] = [
  { label: 'Recursos', href: '/recursos' },
  { label: 'Preços', href: '/precos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Contato', href: '/contato' },
];

const DEFAULT_SECONDARY_ITEMS: MenuItem[] = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Subscription terms', href: '/subscription-terms' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Money-back policy', href: '/refund-policy' },
  { label: 'e-Privacy Settings', href: '/privacy-settings' },
];

const DEFAULT_CTA = {
  label: 'Começar grátis',
  href: '/cadastro',
};

const DEFAULT_BACKGROUND =
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1400&auto=format&fit=crop';

export function MenuOverlay({
  isOpen,
  onClose,
  previewMode = false,
  navigation,
  primaryItems = DEFAULT_PRIMARY_ITEMS,
  secondaryItems = DEFAULT_SECONDARY_ITEMS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  backgroundImage = DEFAULT_BACKGROUND,
  currentLanguage = 'PT',
  cta = DEFAULT_CTA,
}: MenuOverlayProps) {
  const isDesktop = useIsDesktop();
  const resolvedPrimaryItems =
    navigation && navigation.length > 0 ? navigation : primaryItems;

  const containerClass = previewMode ? 'absolute' : 'fixed';

  const handleNavigate = (href: string) => {
    onClose();
    window.location.href = href;
  };

  const handleBackdropKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={cn(containerClass, 'inset-0 z-50')}
          onKeyDown={handleBackdropKeyDown}
        >
          <motion.div
            className={cn(containerClass, 'inset-0 bg-black/16')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          {isDesktop ? (
            <motion.aside
              className={cn(
                containerClass,
                'inset-4 overflow-hidden rounded-[32px] bg-background shadow-2xl',
              )}
              initial={{ opacity: 0, scale: 0.985, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 10 }}
              transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
              aria-modal="true"
              role="dialog"
              aria-label="Menu principal"
            >
              <div className="grid h-full grid-cols-[46%_54%]">
                <div className="relative h-full overflow-hidden bg-muted">
                  <img
                    src={backgroundImage}
                    alt="Imagem de apoio do menu"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex h-full flex-col bg-background">
                  <div className="flex items-center justify-between border-b border-border px-10 py-6">
                    <div className="flex items-center gap-8">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] font-medium text-foreground transition-colors hover:text-foreground/65"
                        >
                          {social.name}
                        </a>
                      ))}
                    </div>

                    <div className="flex items-center gap-8">
                      <a
                        href="/ajuda"
                        className="text-[15px] font-medium text-foreground transition-colors hover:text-foreground/65"
                      >
                        Need Help?
                      </a>
                      <Button
                        variant="outline"
                        size="md"
                        pill
                        className="h-12 px-7"
                        onClick={() => handleNavigate('/login')}
                      >
                        Log in
                      </Button>
                      <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar menu"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col justify-between px-14 py-12">
                    <nav aria-label="Links principais do menu">
                      <ul className="space-y-3">
                        {resolvedPrimaryItems.map((item, index) => (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            <a
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavigate(item.href);
                              }}
                              className="block text-[clamp(3rem,4vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.055em] text-foreground transition-colors hover:text-foreground/60"
                            >
                              {item.label}
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </nav>

                    <div className="mt-12 grid grid-cols-[1fr_auto] items-end gap-8">
                      <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                        {secondaryItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigate(item.href);
                            }}
                            className="text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="text-base font-medium text-foreground">
                          {currentLanguage}
                        </span>
                        <Button
                          variant="primary"
                          size="md"
                          pill
                          className="h-12 px-7"
                          onClick={() => handleNavigate(cta.href)}
                        >
                          {cta.label}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          ) : (
            <motion.aside
              className={cn(
                containerClass,
                'left-0 top-0 h-full w-full overflow-y-auto bg-background',
              )}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
              onClick={(e) => e.stopPropagation()}
              aria-modal="true"
              role="dialog"
              aria-label="Menu principal"
            >
              <div className="flex min-h-full flex-col">
                <div className="border-b border-border px-6 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground transition-colors hover:text-foreground/65"
                        >
                          {social.name}
                        </a>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Fechar menu"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-accent"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-6 py-8">
                  <nav aria-label="Links principais do menu">
                    <ul className="space-y-5">
                      {resolvedPrimaryItems.map((item, index) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ delay: index * 0.04 }}
                        >
                          <a
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavigate(item.href);
                            }}
                            className="block text-[2.25rem] font-semibold leading-none tracking-[-0.05em] text-foreground"
                          >
                            {item.label}
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  <div className="mt-12 space-y-4">
                    {secondaryItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate(item.href);
                        }}
                        className="block text-[15px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>

                  <div className="mt-auto pt-10">
                    <Button
                      variant="primary"
                      size="lg"
                      pill
                      className="h-12 px-7"
                      onClick={() => handleNavigate(cta.href)}
                    >
                      {cta.label}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}