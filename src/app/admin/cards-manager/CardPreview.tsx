import { getColorValue } from '../../../lib/hooks/useDesignTokens';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { getLucideIcon } from '../../../lib/utils/icons';
import type { Database } from '../../../lib/supabase/client';

type MenuCard = Database['public']['Tables']['menu_cards']['Row'];
type DesignToken = Database['public']['Tables']['design_tokens']['Row'];

interface CardPreviewProps {
  card: MenuCard;
  tokens: DesignToken[];
  compact?: boolean;
}

export function CardPreview({ card, tokens, compact = false }: CardPreviewProps) {
  const { getColor: getDSColor } = useDesignSystem();
  
  const getTokenById = (tokenId: string | null) => {
    if (!tokenId) return null;
    return tokens.find((t) => t.id === tokenId);
  };

  const getColor = (tokenId: string | null, fallbackTokenName: string = 'dark') => {
    const token = getTokenById(tokenId);
    return getColorValue(token) || getDSColor(fallbackTokenName);
  };

  // Calculate text color based on background luminance for accessibility
  const getContrastTextColor = (bgColor: string): string => {
    // Convert hex to RGB
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return white for dark backgrounds, dark for light backgrounds
    return luminance > 0.5 ? getDSColor('secondary') : '#ffffff';
  };

  const bgColor = getColor(card.bg_color_token, 'background');
  const borderColor = getColor(card.border_color_token, 'muted');
  const iconColor = getColor(card.icon_color_token, 'primary');
  const titleColor = getColor(card.title_color_token, 'secondary');
  const subtitleColor = getColor(card.subtitle_color_token, 'dark');

  return (
    <div
      className={`rounded-[1.5rem] border-2 ${compact ? 'p-4' : 'p-6'}`}
      style={{
        transition: 'none',
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      {card.icon && (
        <div className={compact ? 'mb-2' : 'mb-4'} style={{ color: iconColor }}>
          {getLucideIcon(card.icon, 'h-5 w-5')}
        </div>
      )}

      {card.title && (
        <h3
          className={`font-semibold ${compact ? 'text-base mb-1' : 'text-lg mb-2'}`}
          style={{ color: titleColor }}
        >
          {card.title}
        </h3>
      )}

      {card.subtitle && (
        <p
          className={`${compact ? 'text-xs' : 'text-sm'}`}
          style={{ color: subtitleColor }}
        >
          {card.subtitle}
        </p>
      )}

      {card.tabs && Array.isArray(card.tabs) && card.tabs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {card.tabs.map((tab: any) => {
            const tabBgColor = getColor(card.tab_bg_color_token, 'muted');
            const tabBorderColor = getColor(card.tab_border_color_token, 'muted');
            const tabTextColor = getContrastTextColor(tabBgColor);
            const isActive = tab.id === card.active_tab_id;

            return (
              <div
                key={tab.id}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  isActive ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: tabBgColor,
                  borderColor: tabBorderColor,
                  color: tabTextColor,
                  ...(isActive && { ringColor: getDSColor('primary') }),
                }}
              >
                {tab.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}