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
  description?: string;
  navigation?: {
    product?: FooterLink[];
    company?: FooterLink[];
    legal?: FooterLink[];
  };
  social?: SocialLink[];
  newsletter?: {
    title?: string;
    description?: string;
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
  newsletterTitle = 'Fique por dentro',
  newsletterDescription = 'Receba novidades e atualizacoes diretamente no seu email',
  description,
  navigation,
  social,
  newsletter,
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
  helpLinks = [{ label: 'Need Help?', href: '/help' }],
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
  const resolvedNewsletterTitle = newsletter?.title || newsletterTitle;
  const resolvedNewsletterDescription = newsletter?.description || newsletterDescription;
  const resolvedSocialLinks = social && social.length > 0 ? social : socialLinks;
  const resolvedLinkGroups =
    navigation && (navigation.product || navigation.company)
      ? [
          {
            title: 'Main',
            links: [...(navigation.product || []), ...(navigation.company || [])],
          },
        ]
      : linkGroups;
  const resolvedLegalLinks =
    navigation?.legal && navigation.legal.length > 0 ? navigation.legal : legalLinks;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-background border-t border-border">
      <Container size="wide">
        {isDesktop ? (
          <>
            {showNewsletter && (
              <>
                <div className="py-12">
                  <div className="grid grid-cols-5 gap-16">
                    <div className="col-span-2">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {resolvedNewsletterTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {resolvedNewsletterDescription}
                      </p>
                      {description && (
                        <p className="text-sm text-muted-foreground mt-4">{description}</p>
                      )}
                    </div>

                    <div className="col-span-3">
                      <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email"
                          className="flex-1 h-12 rounded-full border border-border bg-input-background px-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

            <div className="py-12">
              <div className="grid grid-cols-5 gap-16">
                <div className="col-span-2">
                  <div className="flex gap-3">
                    {resolvedSocialLinks.map((socialItem) => (
                      <a
                        key={`${socialItem.platform}-${socialItem.href}`}
                        href={socialItem.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded border-2 border-border transition-all hover:bg-accent"
                        aria-label={socialItem.platform}
                      >
                        <SocialIcon platform={socialItem.platform} />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="col-span-3">
                  <nav className="flex flex-wrap gap-x-6 gap-y-3">
                    {resolvedLinkGroups[0]?.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                      >
                        {link.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="py-8">
              <div className="grid grid-cols-5 gap-16">
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">
                    Copyright {new Date().getFullYear()}. BetterMe.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">All rights reserved</p>
                </div>

                <div className="col-span-3">
                  <div className="flex flex-wrap gap-6">
                    {helpLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                      >
                        {link.label}
                      </a>
                    ))}
                    {resolvedLegalLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
          <>
            {showNewsletter && (
              <>
                <div className="py-12">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {resolvedNewsletterTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {resolvedNewsletterDescription}
                  </p>
                  {description && (
                    <p className="text-sm text-muted-foreground mb-6">{description}</p>
                  )}

                  <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      className="flex-1 h-12 rounded-full border border-border bg-input-background px-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

            <div className="py-12">
              <nav className="grid grid-cols-2 gap-x-6 gap-y-4">
                {resolvedLinkGroups[0]?.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="border-t border-border" />

            <div className="py-8">
              <div className="flex flex-col gap-4">
                {helpLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {link.label}
                  </a>
                ))}
                {resolvedLegalLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="py-8">
              <div className="flex gap-3">
                {resolvedSocialLinks.map((socialItem) => (
                  <a
                    key={`${socialItem.platform}-${socialItem.href}`}
                    href={socialItem.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded border-2 border-border transition-all hover:bg-accent"
                    aria-label={socialItem.platform}
                  >
                    <SocialIcon platform={socialItem.platform} />
                  </a>
                ))}
              </div>
            </div>

            <div className="border-t border-border" />

            <div className="py-6">
              <p className="text-sm text-muted-foreground">
                Copyright {new Date().getFullYear()}. BetterMe.
              </p>
              <p className="text-xs text-muted-foreground mt-1">All rights reserved</p>
            </div>
          </>
        )}
      </Container>
    </footer>
  );
}