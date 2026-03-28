import { useState, useEffect } from 'react';
import { Link } from '@/lib/components/Link';
import { useNavigate } from 'react-router';
import { ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase/client';
import type { MenuItem, MenuCard, SiteConfig } from '@/types/database';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { ResponsiveText } from '../../components/ResponsiveText';
import { ResponsiveButton } from '../../components/ResponsiveButton';
import { MegamenuContent } from '../../components/megamenu/MegamenuContent';
import { getLucideIcon } from '../../../lib/utils/icons';
import { getTokenColor } from '../../../lib/utils/colors';
import { useMenuHover } from '../../../lib/hooks/useMenuHover';
import { MegamenuCardItem } from '../../components/megamenu/MegamenuCardItem';
import { useMobileConfig } from '../../../lib/contexts/MobileConfigContext';

export function Header() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [allCards, setAllCards] = useState<MenuCard[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { hoveredItem, openItem, scheduleClose, clearTimer, closeImmediate } = useMenuHover(1000);

  const { getColor, getRadius, colors } = useDesignSystem();
  const { header: mobileHeader, isMobile } = useMobileConfig();

  useEffect(() => {
    loadHeader();
  }, []);

  async function loadHeader() {
    try {
      const { data: siteConfigData } = await supabase
        .from('site_config')
        .select('*')
        .single();

      if (siteConfigData) {
        setConfig(siteConfigData as any);
      }

      const { data: menuData } = await supabase
        .from('menu_items')
        .select('*')
        .order('order');

      if (menuData) {
        setMenuItems(menuData);
      }

      const { data: cardsData } = await supabase
        .from('menu_cards')
        .select('*')
        .eq('is_global', true);

      if (cardsData) {
        setAllCards(cardsData);
      }
    } catch (error) {
      console.error('Error loading header:', error);
    }
  }

  const renderMegamenu = (item: MenuItem) => {
    const megamenuConfig = item.megamenu_config as any;
    if (!megamenuConfig || !megamenuConfig.enabled) return null;

    if (!megamenuConfig.column && !megamenuConfig.columns?.[0]) {
      console.warn('[HEADER] Megamenu sem estrutura valida');
      return null;
    }

    return (
      <div
        className="fixed left-1/2 transform -translate-x-1/2 w-[900px] z-50"
        style={{ top: sticky ? '80px' : '88px' }}
        onMouseEnter={clearTimer}
        onMouseLeave={() => scheduleClose(item.id)}
      >
        <MegamenuContent 
          config={megamenuConfig}
          cards={allCards}
          onCardClick={(url) => navigate(url)}
        />
      </div>
    );
  };

  if (!config) {
    const borderColor = getColor('muted') ?? '#e5e7eb';
    
    return (
      <header className="bg-white border-b" style={{ borderColor }}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-center">
          <ResponsiveText tokenName="body" color="muted">
            Loading...
          </ResponsiveText>
        </div>
      </header>
    );
  }

  const { logo, cta, sticky } = config.header || {};
  const borderColor = getColor('muted') ?? '#e5e7eb';
  const primaryColor = getColor('primary') ?? '#ea526e';
  const textColor = getColor('dark') ?? '#374151';

  // ✅ Mobile-aware dimensions
  const barHeightStyle = isMobile ? { height: mobileHeader.barHeight } : {};
  const logoHeightClass = isMobile ? '' : 'h-8 md:h-10 lg:h-11 xl:h-12';
  {/* ✅ Logo ajustada: 32px → 40px → 44px → 48px (reduzido em xl) */}
  const logoHeightStyle = isMobile ? { height: mobileHeader.logoHeight, width: 'auto' } : {};

  return (
    <header 
      className={`bg-white border-b ${sticky ? 'sticky top-0 z-50' : ''}`}
      style={{ borderColor }}
    >
      <div className="w-full px-1 sm:px-2 md:px-4 lg:px-8 xl:px-12">
        {/* ✅ Paddings super reduzidos: 4px → 8px → 16px → 32px → 48px */}
        <div
          className={`${isMobile ? '' : 'h-16 lg:h-20'} flex items-center justify-between`}
          style={barHeightStyle}
        >
          {/* Logo */}
          <Link to={logo?.link || '/'} className="flex items-center">
            {logo?.url ? (
              <img 
                src={logo.url} 
                alt={logo.text || 'Logo'} 
                className={`${logoHeightClass} w-auto object-contain`}
                style={logoHeightStyle}
              />
            ) : (
              <ResponsiveText tokenName="minor-title" color="primary" as="div">
                {logo?.text || 'BemDito'}
              </ResponsiveText>
            )}
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1.5 md:gap-2 lg:gap-3 xl:gap-6">
            {/* ✅ Gap reduzido em md/lg: 6px → 8px → 12px → 24px (para evitar quebra) */}
            {menuItems.map((item) => {
              const hasMegamenu =
                item.megamenu_config &&
                (item.megamenu_config as any).enabled === true;

              const labelColor = item.label_color_token 
                ? getTokenColor(colors, item.label_color_token, textColor)
                : textColor;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => { if (hasMegamenu) openItem(item.id); }}
                  onMouseLeave={() => { if (hasMegamenu) scheduleClose(item.id); }}
                >
                  {/* ✅ Fonte reduzida em md/lg, aumentada em xl: 12px → 14px → 16px → 24px */}
                  <button 
                    className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3 font-medium py-2 md:py-2.5 lg:py-3 xl:py-4 px-2 md:px-3 lg:px-4 xl:px-6 text-xs md:text-sm lg:text-base xl:text-2xl rounded-lg hover:bg-gray-50"
                    style={{ transition: 'background-color 0.2s ease', color: labelColor, fontWeight: 500 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryColor;
                      clearTimer();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = labelColor;
                    }}
                  >
                    {item.icon && getLucideIcon(item.icon, 'h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7')}
                    <ResponsiveText tokenName="menu" as="span" style={{ whiteSpace: 'nowrap' }}>
                      {item.label}
                    </ResponsiveText>
                    {hasMegamenu && (
                      <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4.5 lg:w-4.5 xl:h-5 xl:w-5" />
                    )}
                  </button>

                  {/* Megamenu Dropdown */}
                  {hasMegamenu && hoveredItem === item.id && renderMegamenu(item)}
                </div>
              );
            })}
          </nav>

          {/* CTA Button */}
          {cta && (
            <div className="hidden md:block">
              <ResponsiveButton
                variant="outline"
                size="sm"
                href={cta.url}
                leftIcon={cta.icon && getLucideIcon(cta.icon)}
                onClick={() => setIsMenuOpen(false)}
              >
                {cta.label}
              </ResponsiveButton>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center"
            style={isMobile ? {
              width: mobileHeader.menuButtonSize,
              height: mobileHeader.menuButtonSize,
            } : { padding: '12px' }}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMobile ? (
              <span style={{ display: 'inline-flex', width: mobileHeader.menuButtonIconSize, height: mobileHeader.menuButtonIconSize }}>
                {getLucideIcon(isMenuOpen ? 'X' : 'Menu', 'w-full h-full')}
              </span>
            ) : getLucideIcon(isMenuOpen ? 'X' : 'Menu', 'h-7 w-7')}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor }}>
            <nav
              className="flex flex-col"
              style={isMobile ? { gap: mobileHeader.drawerItemGap } : { gap: '16px' }}
            >
              {menuItems.map((item) => (
                <div key={item.id}>
                  <Link
                    to="#"
                    className="flex items-center gap-2 font-medium"
                    style={{
                      color: textColor,
                      transition: 'none',
                      padding: isMobile ? mobileHeader.drawerItemPadding : '8px',
                      fontSize: isMobile ? mobileHeader.drawerItemFontSize : undefined,
                    }}
                    onClick={(e) => {
                      const hasMegamenu = item.megamenu_config && (item.megamenu_config as any).enabled;
                      if (hasMegamenu) {
                        e.preventDefault();
                        if (hoveredItem === item.id) {
                          closeImmediate();
                        } else {
                          openItem(item.id);
                        }
                      } else {
                        setIsMenuOpen(false);
                      }
                    }}
                  >
                    {item.icon && getLucideIcon(item.icon)}
                    <ResponsiveText tokenName="menu" as="span">
                      {item.label}
                    </ResponsiveText>
                    {item.megamenu_config && (item.megamenu_config as any).enabled && (
                      <ChevronDown
                        className={`h-3 w-3 ml-auto ${hoveredItem === item.id ? 'rotate-180' : ''}`}
                        style={{ transition: 'none' }}
                      />
                    )}
                  </Link>

                  {/* Mobile Megamenu Cards */}
                  {hoveredItem === item.id &&
                    item.megamenu_config &&
                    (item.megamenu_config as any).enabled && (
                      <div className="mt-2 ml-6 space-y-4">
                        {(() => {
                          const cfg = item.megamenu_config as any;
                          const col = cfg.column ?? cfg.columns?.[0];
                          if (!col) return null;
                          const mobileCards = allCards.filter(c => col.card_ids?.includes(c.id));
                          if (mobileCards.length === 0) return null;
                          return (
                            <div className="space-y-2">
                              {col.title && (
                                <ResponsiveText 
                                  tokenName="menu" 
                                  as="p"
                                  color={col.titleColor || 'dark'}
                                  className="uppercase font-semibold"
                                >
                                  {col.title}
                                </ResponsiveText>
                              )}
                              <div className="space-y-2">
                                {mobileCards.map((card) => (
                                  <MegamenuCardItem
                                    key={card.id}
                                    card={card}
                                    onClick={() => { navigate(card.url ?? '#'); setIsMenuOpen(false); }}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                </div>
              ))}

              {cta && mobileHeader.showCtaInDrawer && (
                <ResponsiveButton
                  variant="outline"
                  size={mobileHeader.ctaSize as any}
                  href={cta.url}
                  fullWidth={mobileHeader.ctaFullWidth}
                  leftIcon={cta.icon && getLucideIcon(cta.icon)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cta.label}
                </ResponsiveButton>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}