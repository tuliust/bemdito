import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from '@/components/foundation';
import { useIsDesktop } from '@/hooks/use-breakpoint';

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
  primaryItems?: MenuItem[];
  secondaryItems?: MenuItem[];
  socialLinks?: SocialLink[];
  backgroundImage?: string;
  currentLanguage?: string;
}

const DEFAULT_PRIMARY_ITEMS: MenuItem[] = [
  { label: 'Products', href: '/products' },
  { label: 'Store', href: '/store' },
  { label: 'About Us', href: '/about' },
  { label: 'For Business', href: '/business' },
  { label: 'Blog', href: '/blog' },
  { label: 'Affiliate Program', href: '/affiliate' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contacts', href: '/contacts' },
];

const DEFAULT_SECONDARY_ITEMS: MenuItem[] = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Subscription terms', href: '/subscription-terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Money-back policy', href: '/money-back' },
  { label: 'e-Privacy Settings', href: '/e-privacy' },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'TikTok', href: 'https://tiktok.com' },
  { name: 'Facebook', href: 'https://facebook.com' },
];

export function MenuOverlay({
  isOpen,
  onClose,
  primaryItems = DEFAULT_PRIMARY_ITEMS,
  secondaryItems = DEFAULT_SECONDARY_ITEMS,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  backgroundImage,
  currentLanguage = 'PT',
}: MenuOverlayProps) {
  const isDesktop = useIsDesktop();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Desktop only */}
          {isDesktop && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
            />
          )}

          {/* Menu Panel */}
          <motion.div
            className="fixed inset-0 bg-white z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isDesktop ? (
              // DESKTOP: Two-column with background image
              <div className="grid grid-cols-2 h-full">
                {/* Left: Background Image */}
                {backgroundImage && (
                  <div className="relative overflow-hidden">
                    <img
                      src={backgroundImage}
                      alt="Menu background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Right: Navigation */}
                <div className="flex flex-col h-full">
                  {/* Top Bar */}
                  <div className="flex items-center justify-end gap-6 px-12 py-6 border-b border-border">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.name}
                      </a>
                    ))}
                    <a
                      href="/help"
                      className="text-sm text-primary hover:text-primary/70 transition-colors"
                    >
                      Need Help?
                    </a>
                    <a
                      href="/login"
                      className="text-sm text-primary hover:text-primary/70 transition-colors"
                    >
                      Log In
                    </a>
                    <button
                      onClick={onClose}
                      className="ml-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-accent transition-all"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 px-12 py-12 overflow-y-auto">
                    <nav>
                      <ul className="space-y-6">
                        {primaryItems.map((item, index) => (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <a
                              href={item.href}
                              className="block text-3xl font-bold text-foreground hover:text-muted-foreground transition-colors"
                              onClick={onClose}
                            >
                              {item.label}
                            </a>
                          </motion.li>
                        ))}
                      </ul>

                      {/* Secondary Links */}
                      {secondaryItems.length > 0 && (
                        <div className="mt-16 space-y-3">
                          {secondaryItems.map((item) => (
                            <a
                              key={item.href}
                              href={item.href}
                              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                              onClick={onClose}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </nav>
                  </div>
                </div>
              </div>
            ) : (
              // MOBILE: Single column, clean white
              <div className="h-full flex flex-col">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-border">
                  <a
                    href="/help"
                    className="text-sm font-medium text-foreground"
                  >
                    Need Help?
                  </a>
                  <Button variant="outline" size="md" pill onClick={() => window.location.href = '/login'}>
                    Log in
                  </Button>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-border"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-6 py-8 overflow-y-auto">
                  <nav>
                    <ul className="space-y-6">
                      {primaryItems.map((item, index) => (
                        <motion.li
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <a
                            href={item.href}
                            className="block text-4xl font-bold text-foreground hover:text-muted-foreground transition-colors py-2"
                            onClick={onClose}
                          >
                            {item.label}
                          </a>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Secondary Links */}
                    {secondaryItems.length > 0 && (
                      <div className="mt-12 space-y-4">
                        {secondaryItems.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="block text-base text-foreground hover:text-muted-foreground transition-colors"
                            onClick={onClose}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Language Selector */}
                    <div className="mt-12 flex items-center justify-end">
                      <span className="text-sm font-medium text-foreground">
                        {currentLanguage}
                      </span>
                    </div>
                  </nav>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
