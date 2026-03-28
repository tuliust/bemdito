/**
 * Utilitários de manipulação de cores
 */

/**
 * Converte uma cor hex para rgba com opacidade configurável.
 * Suporta hex de 3 ou 6 dígitos, com ou sem `#`.
 *
 * @example
 * hexToRgba('#ea526e', 0.1)  → 'rgba(234, 82, 110, 0.1)'
 * hexToRgba('2e2240', 0.5)   → 'rgba(46, 34, 64, 0.5)'
 */
export function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace('#', '');
  const expanded =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;

  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Adiciona opacidade a uma cor hex retornando um hex de 8 dígitos.
 * Útil para inline styles onde rgba não é aceito como hex.
 *
 * @example
 * hexWithAlpha('#ea526e', 0.1)  → '#ea526e1a'
 */
export function hexWithAlpha(hex: string, opacity: number): string {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex.replace('#', '#')}${alpha}`;
}

/**
 * Resolve uma cor hex a partir de um token ID no array de tokens do DesignSystem.
 *
 * Centraliza a lógica duplicada em Header, HeaderPreview,
 * MegamenuContent e MegamenuConfigurator.
 *
 * @param colors   Array de tokens de cor (`useDesignSystem().colors`)
 * @param tokenId  ID do token a resolver (pode ser null/undefined)
 * @param fallback Cor hex de fallback quando o token não existe
 *
 * @example
 * import { getTokenColor } from '@/lib/utils/colors';
 *
 * const iconColor = getTokenColor(colors, card.icon_color_token, getColor('primary') ?? '#ea526e');
 */
export function getTokenColor(
  colors: Array<{ id: string; value: string | any }>,
  tokenId: string | null | undefined,
  fallback = '#000000'
): string {
  if (!tokenId) return fallback;
  const token = colors.find((t) => t.id === tokenId);
  if (!token) return fallback;
  try {
    const parsed =
      typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
    return parsed.hex || parsed.color || fallback;
  } catch {
    return fallback;
  }
}