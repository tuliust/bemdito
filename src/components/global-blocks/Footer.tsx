import { useState } from 'react';
import { Container, Button } from '@/components/foundation';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useIsDesktop } from '@/hooks/use-breakpoint';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  href: string;
}

export interface FooterProps {
  logo?: {
    src: string;
    alt: string;
  };
  newsletterTitle?: string;
  newsletterDescription?: string;
  linkGroups?: FooterLinkGroup[];
  helpLinks?: FooterLink[];
  legalLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  showNewsletter?: boolean;
}

const SocialIcon = ({ platform }: { platform: SocialLink['platform'] }) => {
  const icons = {
    facebook: Facebook,
    twitter: Twitter,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
  };
  const Icon = icons[platform];
  return <Icon className="w-5 h-5" />;
};

export function Footer({
  logo,
  newsletterTitle = 'Fique por dentro',
  newsletterDescription = 'Receba novidades e atualizações diretamente no seu email',
  linkGroups = [
    {
      title: 'Main',
      links: [
        { label: 'Products', href: '/products' },
        { label: 'For Business', href: '/business' },
        { label: 'Affiliate Program', href: '/affiliate' },
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contacts', href: '/contacts' },
        { label: 'Brand Assets', href: '/brand' },
      ],
    },
  ],
  helpLinks = [
    { label: 'Need Help?', href: '/help' },
  ],
  legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Editorial Process', href: '/editorial' },
    { label: 'Master Service Agreement', href: '/agreement' },
  ],
  socialLinks = [
    { platform: 'instagram', href: 'https://instagram.com' },
    { platform: 'facebook', href: 'https://facebook.com' },
    { platform: 'twitter', href: 'https://twitter.com' },
  ],
  showNewsletter = true,
}: FooterProps) {
  const [email, setEmail] = useState('');
  const isDesktop = useIsDesktop();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-background border-t border-border">
      <Container size="wide">
        {isDesktop ? (
          // DESKTOP: 3-row layout
          <>
            {/* ROW 1: Newsletter */}
            {showNewsletter && (
              <>
                <div className="py-12">
                  <div className="grid grid-cols-5 gap-16">
                    {/* Left: Title (40%) */}
                    <div className="col-span-2">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {newsletterTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {newsletterDescription}
                      </p>
                    </div>

                    {/* Right: Form (60%) */}
                    <div className="col-span-3">
                      <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email"
                          className="flex-1 h-12 px-6 rounded-full bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                        />
                        <Button type="submit" variant="primary" pill size="md">
                          Subscribe
                        </Button>
                      </form>
                      <p className="text-xs text-muted-foreground mt-3">
                        By subscribing, you agree to our privacy policy
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border" />
              </>
            )}

            {/* ROW 2: Social + Navigation */}
            <div className="py-12">
              <div className="grid grid-cols-5 gap-16">
                {/* Left: Social (40%) */}
                <div className="col-span-2">
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.platform}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded border-2 border-border hover:bg-accent transition-all"
                        aria-label={social.platform}
                      >
                        <SocialIcon platform={social.platform} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right: Navigation horizontal (60%) */}
                <div className="col-span-3">
                  <nav className="flex flex-wrap gap-x-6 gap-y-3">
                    {linkGroups[0]?.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* ROW 3: Copyright + Legal */}
            <div className="py-8">
              <div className="grid grid-cols-5 gap-16">
                {/* Left: Copyright (40%) */}
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()}. BetterMe.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    All rights reserved
                  </p>
                </div>

                {/* Right: Legal links (60%) */}
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-6">
                    {helpLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                    {legalLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // MOBILE: Vertical stack
          <>
            {/* Newsletter */}
            {showNewsletter && (
              <>
                <div className="py-12">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {newsletterTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {newsletterDescription}
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="flex-1 h-12 px-6 rounded-full bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      required
                    />
                    <Button type="submit" variant="primary" pill size="md">
                      Subscribe
                    </Button>
                  </form>

                  <p className="text-xs text-muted-foreground mt-3">
                    By subscribing, you agree to our privacy policy
                  </p>
                </div>

                <div className="border-t border-border" />
              </>
            )}

            {/* Navigation grid 2 cols */}
            <div className="py-12">
              <nav className="grid grid-cols-2 gap-x-6 gap-y-4">
                {linkGroups[0]?.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="border-t border-border" />

            {/* Legal */}
            <div className="py-8">
              <div className="flex flex-col gap-4">
                {helpLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                {legalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Social */}
            <div className="py-8">
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded border-2 border-border hover:bg-accent transition-all"
                    aria-label={social.platform}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Copyright */}
            <div className="py-6">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()}. BetterMe.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                All rights reserved
              </p>
            </div>
          </>
        )}
      </Container>
    </footer>
  );
}
