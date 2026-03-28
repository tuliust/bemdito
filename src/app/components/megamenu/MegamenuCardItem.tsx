import * as LucideIcons from 'lucide-react';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { getTokenColor } from '../../../lib/utils/colors';

/**
 * Converte cor hexadecimal para rgba() com opacidade
 * @param hex - Cor em formato #RRGGBB
 * @param opacity - Opacidade 0-100 (será convertido para 0-1)
 * @returns String rgba(r, g, b, a) ou o hex original se conversão falhar
 */
function hexToRgba(hex: string, opacity: number = 100): string {
  // Se opacidade é 100%, retornar hex direto (sem transparência)
  if (opacity === 100) return hex;

  // Remover # se existir
  const cleanHex = hex.replace('#', '');
  
  // Converter hex para RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Validar se a conversão deu certo
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    console.warn(`⚠️ [hexToRgba] Conversão falhou para: ${hex}`);
    return hex; // Fallback para hex original
  }
  
  // Converter opacidade de 0-100 para 0-1
  const alpha = opacity / 100;
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Tipo mínimo necessário — compatível com
 * `Database['public']['Tables']['menu_cards']['Row']`
 * e com as interfaces locais usadas em Header / HeaderPreview / MegamenuContent.
 */
interface MenuCardData {
  id: string;
  icon?: string | null;
  icon_size?: number | null;
  icon_color_token?: string | null;
  title?: string | null;
  title_color_token?: string | null;
  subtitle?: string | null;
  subtitle_color_token?: string | null;
  bg_color_token?: string | null;
  border_color_token?: string | null;
  bg_opacity?: number | null;        // ✅ NOVO
  border_opacity?: number | null;    // ✅ NOVO
  url?: string | null;
}

interface MegamenuCardItemProps {
  card: MenuCardData;
  /** Se fornecido, o card fica clicável (cursor-pointer + onClick) */
  onClick?: () => void;
}

/**
 * MegamenuCardItem — Renderizador unificado de card de megamenu.
 *
 * Substitui as funções `renderCard` duplicadas em:
 * - `Header.tsx`        (menu mobile)
 * - `HeaderPreview.tsx` (preview do admin)
 *
 * @example
 * // Mobile (Header):
 * <MegamenuCardItem
 *   card={card}
 *   onClick={() => { navigate(card.url!); setIsMenuOpen(false); }}
 * />
 *
 * // Preview (HeaderPreview):
 * <MegamenuCardItem card={card} />
 */
export function MegamenuCardItem({ card, onClick }: MegamenuCardItemProps) {
  const { colors, getColor, getRadius } = useDesignSystem();

  const bgColor      = getTokenColor(colors, card.bg_color_token,      '#ffffff');
  const borderColor  = getTokenColor(colors, card.border_color_token,  getColor('muted')    ?? '#e5e7eb');
  const iconColor    = getTokenColor(colors, card.icon_color_token,    getColor('primary')  ?? '#ea526e');
  const titleColor   = getTokenColor(colors, card.title_color_token,   getColor('dark')     ?? '#020105');
  const subtitleColor = getTokenColor(colors, card.subtitle_color_token, getColor('dark')   ?? '#020105');

  const CardIcon   = card.icon ? (LucideIcons as any)[card.icon] : null;
  const cardRadius = getRadius('md') ?? '8px';

  return (
    <div
      className="p-4 border-2 flex flex-col items-center text-center"
      style={{
        transition: 'none',
        backgroundColor: hexToRgba(bgColor, card.bg_opacity ?? 100),
        borderColor: hexToRgba(borderColor, card.border_opacity ?? 100),
        borderRadius: cardRadius,
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {CardIcon && (
        <div className="mb-3" style={{ color: iconColor }}>
          <CardIcon className="h-8 w-8" />
        </div>
      )}
      {card.title && (
        <h4 className="font-semibold text-sm mb-1" style={{ color: titleColor }}>
          {card.title}
        </h4>
      )}
      {card.subtitle && (
        <p className="text-xs" style={{ color: subtitleColor }}>
          {card.subtitle}
        </p>
      )}
    </div>
  );
}