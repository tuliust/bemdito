import { ChevronDown } from 'lucide-react';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { useMenuHover } from '../../../lib/hooks/useMenuHover';
import { getLucideIcon } from '../../../lib/utils/icons';
import { ResponsiveText } from '../../components/ResponsiveText';
import { ResponsiveButton } from '../../components/ResponsiveButton';
import { MegamenuContent } from '../../components/megamenu/MegamenuContent';
import type { Database } from '../../../lib/supabase/client';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
type MenuCard = Database['public']['Tables']['menu_cards']['Row'];

interface HeaderPreviewProps {
  menuItems: MenuItem[];
  allCards: MenuCard[];
  logoText?: string;
  logoUrl?: string;
}

/**
 * HeaderPreview — Espelho fiel do Header público para uso no painel admin.
 *
 * ✅ D4: usa MegamenuContent (mesmo componente do público)
 * ✅ C1: usa useMenuHover (mesmo hook do público — 1000 ms de grace period)
 * ✅ C2: usa ResponsiveButton para o CTA (igual ao público)
 * ✅ C3: usa ResponsiveText para labels (igual ao público)
 * ✅ D2: usa getLucideIcon compartilhado
 */
export function HeaderPreview({
  menuItems,
  allCards,
  logoText = 'BemDito',
  logoUrl,
}: HeaderPreviewProps) {
  const { getColor } = useDesignSystem();
  // ✅ C1: mesmo hook do Header público (1000 ms)
  const { hoveredItem, openItem, scheduleClose, clearTimer } = useMenuHover(1000);

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);
  const borderColor = getColor('muted') ?? '#e5e7eb';
  const primaryColor = getColor('primary') ?? '#ea526e';
  const darkColor = getColor('dark') ?? '#020105';

  return (
    <div
      className="rounded-[1.5rem] overflow-visible min-h-[500px]"
      style={{
        backgroundColor: 'var(--admin-card-bg, #ffffff)',
        border: '2px solid var(--admin-card-border, #e5e7eb)',
      }}
    >
      {/* Header */}
      <div className="border-b px-6 py-4 relative" style={{ borderColor }}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold" style={{ color: primaryColor }}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={logoText || 'Logo'}
                className="h-12 w-auto object-contain"
              />
            ) : (
              logoText
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex items-center gap-6">
            {sortedMenuItems.map((item) => {
              const hasMegamenu =
                item.megamenu_config &&
                (item.megamenu_config as any).enabled === true;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => { if (hasMegamenu) openItem(item.id); }}
                  onMouseLeave={() => { if (hasMegamenu) scheduleClose(item.id); }}
                >
                  <button
                    className="flex items-center gap-2 text-sm font-medium"
                    style={{ transition: 'none', color: darkColor, fontWeight: 500 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = primaryColor;
                      clearTimer();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = darkColor;
                    }}
                  >
                    {item.icon && getLucideIcon(item.icon)}
                    {/* ✅ C3: ResponsiveText em vez de <span> */}
                    <ResponsiveText tokenName="menu" as="span">
                      {item.label}
                    </ResponsiveText>
                    {hasMegamenu && (
                      <ChevronDown className="h-3 w-3" />
                    )}
                  </button>

                  {/* ✅ D4: MegamenuContent — idêntico ao Header público */}
                  {hasMegamenu && hoveredItem === item.id && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] z-50 mt-2"
                      onMouseEnter={clearTimer}
                      onMouseLeave={() => scheduleClose(item.id)}
                    >
                      <MegamenuContent
                        config={item.megamenu_config as any}
                        cards={allCards}
                        // Preview não navega — onCardClick omitido intencionalmente
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* ✅ C2: ResponsiveButton em vez de <button> custom */}
          <ResponsiveButton
            variant="outline"
            size="sm"
            leftIcon={getLucideIcon('Lock')}
          >
            Entrar
          </ResponsiveButton>
        </div>
      </div>

      {/* Dica de uso */}
      <div className="px-6 py-3 text-center" style={{ backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)' }}>
        <p style={{ fontSize: 'var(--admin-field-hint-size, 0.75rem)', color: 'var(--admin-field-hint-color, #6b7280)' }}>
          Passe o mouse sobre os itens de menu para ver os megamenus
        </p>
      </div>
    </div>
  );
}