import * as LucideIcons from 'lucide-react';
import { getSelectableClasses } from '../../../lib/constants/theme';

/**
 * IconPickerGrid — grade de ícones Lucide pura e reutilizável.
 *
 * Não gerencia estado de busca; recebe a lista filtrada como prop.
 * Usada por:
 *   - IconPicker  (dentro de Popover)
 *   - IconField   (dentro de BaseModal)
 *
 * @example
 * <IconPickerGrid
 *   icons={filteredIcons}
 *   selectedIcon={value}
 *   onSelect={(name) => { onChange(name); setOpen(false); }}
 *   height={320}
 * />
 */

interface IconPickerGridProps {
  /** Lista de nomes de ícones já filtrados pelo pai */
  icons: string[];
  /** Nome do ícone atualmente selecionado */
  selectedIcon?: string;
  /** Callback ao clicar num ícone */
  onSelect: (iconName: string) => void;
  /** Altura do container scrollável em px. Padrão: 320 */
  height?: number;
}

export function IconPickerGrid({
  icons,
  selectedIcon,
  onSelect,
  height = 320,
}: IconPickerGridProps) {
  return (
    <div
      className="overflow-y-auto overflow-x-hidden"
      style={{
        height: `${height}px`,
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db #f3f4f6',
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="grid grid-cols-7 gap-1 p-3">
        {icons.map((iconName) => {
          const Icon = (LucideIcons as any)[iconName];
          if (!Icon) return null;
          const isSelected = iconName === selectedIcon;

          return (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className={`flex items-center justify-center p-2.5 rounded-lg border-2 ${getSelectableClasses(isSelected)}`}
              style={{
                transition: 'none',
                animation: 'none',
                boxShadow: 'none',
              }}
              title={iconName}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>

      {icons.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Nenhum ícone encontrado</p>
          <p className="text-xs mt-1">Tente outro termo de busca</p>
        </div>
      )}
    </div>
  );
}
