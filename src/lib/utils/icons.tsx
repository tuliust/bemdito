import * as LucideIcons from 'lucide-react';
import type { ReactElement } from 'react';

/**
 * Retorna um elemento JSX de ícone Lucide a partir do nome do ícone.
 *
 * Centraliza a lógica duplicada em Header.tsx e HeaderPreview.tsx.
 *
 * @param iconName  Nome do ícone Lucide (ex: 'Menu', 'X', 'ChevronDown')
 * @param className Classes CSS aplicadas ao SVG (padrão: 'h-4 w-4')
 *
 * @example
 * import { getLucideIcon } from '@/lib/utils/icons';
 *
 * const icon = getLucideIcon('Menu');               // <Menu className="h-4 w-4" />
 * const icon = getLucideIcon('Settings', 'h-6 w-6'); // <Settings className="h-6 w-6" />
 */
export function getLucideIcon(
  iconName: string | null | undefined,
  className = 'h-4 w-4'
): ReactElement | null {
  if (!iconName) return null;
  const Icon = (LucideIcons as any)[iconName];
  return Icon ? <Icon className={className} /> : null;
}
