import { MapPin, Phone } from 'lucide-react';  // ✅ NOVO
import { useEffect, useState } from 'react';
import { Link } from '@/lib/components/Link';
import { supabase } from '../../../lib/supabase/client';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { ResponsiveText } from '../../components/ResponsiveText';
import { getLucideIcon } from '../../../lib/utils/icons';
import { useMobileConfig } from '../../../lib/contexts/MobileConfigContext';

type FooterLink = {
  id: string;
  label: string;
  url: string;
};

type FooterColumn = {
  id: string;
  title: string;
  links: FooterLink[];
};

type SocialLink = {
  id: string;
  platform: string;
  icon: string;
  url: string;
};

type FooterConfig = {
  copyright?: string;
  columns?: FooterColumn[];
  social?: SocialLink[];
  logo_url?: string;     // ✅ NOVO
  address?: string;      // ✅ NOVO
  phone?: string;        // ✅ NOVO
};

export function Footer() {
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const { getColor } = useDesignSystem();
  const { footer: mobileFooter, isMobile } = useMobileConfig();

  useEffect(() => {
    loadFooter();
  }, []);

  async function loadFooter() {
    try {
      const { data } = await supabase
        .from('site_config')
        .select('footer')
        .single();

      if (data && data.footer) {
        setConfig(data.footer);
      }
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  }

  const bgColor = getColor('secondary') ?? getColor('dark') ?? '#2e2240';
  const textColor = '#ffffff';
  const mutedColor = getColor('muted') ?? '#9ca3af';
  const borderColor = 'rgba(255,255,255,0.1)';

  if (!config) {
    return (
      <footer className="text-white mt-auto" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-4 py-8">
          <ResponsiveText 
            tokenName="menu" 
            as="p"
            className="text-center"
            style={{ color: mutedColor }}
          >
            &copy; {new Date().getFullYear()} BemDito. Todos os direitos reservados.
          </ResponsiveText>
        </div>
      </footer>
    );
  }

  const hasColumns = config.columns && config.columns.length > 0;
  const hasSocial = config.social && config.social.length > 0;

  return (
    <footer className="text-white mt-auto" style={{ backgroundColor: bgColor }}>
      <div
        className="mx-auto"
        style={isMobile ? {
          paddingLeft: mobileFooter.paddingX,
          paddingRight: mobileFooter.paddingX,
          paddingTop: mobileFooter.paddingY,
          paddingBottom: mobileFooter.paddingY,
          textAlign: mobileFooter.textAlign,
          maxWidth: '1280px',
          width: '100%',
        } : {
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          maxWidth: '1280px',
          width: '100%',
        }}
      >
        {/* ✅ NOVO: Logo do Footer (topo) */}
        {config.logo_url && (
          <div className="mb-8 flex justify-center">
            <img 
              src={config.logo_url} 
              alt="Logo" 
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
        )}

        {/* Columns */}
        {hasColumns && (
          <div
            className="mb-8"
            style={{ 
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? (mobileFooter.columnsLayout === 'grid-2' ? 'repeat(2, 1fr)' : '1fr')
                : `repeat(${config.columns!.length}, 1fr)`,
              gap: isMobile ? mobileFooter.columnGap : '2rem',
              width: '100%',
            }}
          >
            {config.columns!.map((column, colIndex) => (
              <div key={column.id || `column-${colIndex}`}>
                <ResponsiveText
                  tokenName="menu"
                  as="h3"
                  className="mb-4 font-semibold"
                  style={{
                    color: textColor,
                    fontSize: isMobile ? mobileFooter.titleFontSize : undefined,
                  }}
                >
                  {column.title}
                </ResponsiveText>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={link.id || `link-${column.id || colIndex}-${linkIndex}`}>
                      <Link
                        to={link.url}
                        style={{
                          color: mutedColor,
                          transition: 'none',
                          fontSize: isMobile ? mobileFooter.linkFontSize : undefined,
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = mutedColor; }}
                      >
                        <ResponsiveText tokenName="menu" as="span">
                          {link.label}
                        </ResponsiveText>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Social Links */}
        {hasSocial && !(isMobile && mobileFooter.hideSocial) && (
          <div 
            className={`flex items-center gap-4 mb-8 pb-8 border-b ${isMobile && mobileFooter.textAlign === 'center' ? 'justify-center' : ''}`}
            style={{ borderColor }}
          >
            {config.social!.map((social, socialIndex) => (
              <a
                key={social.id || `social-${socialIndex}`}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: mutedColor, transition: 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = mutedColor; }}
              >
                {isMobile ? (
                  <span style={{ display: 'inline-flex', width: mobileFooter.socialIconSize, height: mobileFooter.socialIconSize }}>
                    {getLucideIcon(social.icon, 'w-full h-full')}
                  </span>
                ) : getLucideIcon(social.icon, 'h-5 w-5')}
              </a>
            ))}
          </div>
        )}

        {/* ✅ NOVO: Address and Phone */}
        {config.address && (
          <div className="flex items-center gap-2 mb-4 justify-center">
            <MapPin className="h-5 w-5" style={{ color: mutedColor }} />
            <ResponsiveText 
              tokenName="menu" 
              as="span"
              style={{ color: mutedColor }}
            >
              {config.address}
            </ResponsiveText>
          </div>
        )}
        {config.phone && (
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Phone className="h-5 w-5" style={{ color: mutedColor }} />
            <ResponsiveText 
              tokenName="menu" 
              as="span"
              style={{ color: mutedColor }}
            >
              {config.phone}
            </ResponsiveText>
          </div>
        )}

        {/* Copyright */}
        <div className="text-center">
          <ResponsiveText 
            tokenName="menu" 
            as="div"
            style={{
              color: mutedColor,
              fontSize: isMobile ? mobileFooter.copyrightFontSize : undefined,
            }}
          >
            {config.copyright || `\u00A9 ${new Date().getFullYear()} BemDito. Todos os direitos reservados.`}
          </ResponsiveText>
        </div>
      </div>
    </footer>
  );
}