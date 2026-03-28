import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Button } from '../../components/ui/button';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { Settings, Trash2, GripVertical } from 'lucide-react';
import { adminVar } from '../../components/admin/AdminThemeProvider';

type Section = {
  id: string;
  name: string;
  type: string;
  config: any;
  styling?: any; // ✅ NOVO: Campo styling
  elements?: any; // ✅ NOVO: Campo elements (para compatibilidade)
  global: boolean;
  published: boolean;
};

type PageSection = {
  id: string;
  page_id: string;
  section_id: string;
  config: any;
  order_index: number;
  section?: Section;
};

type DraggableSectionItemProps = {
  pageSection: PageSection;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  onEditConfig: (index: number) => void;
  onRemove: (index: number) => void;
};

const ItemType = {
  SECTION: 'section',
};

export function DraggableSectionItem({
  pageSection,
  index,
  moveSection,
  onEditConfig,
  onRemove,
}: DraggableSectionItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // ✅ NOVO: Usar cores do Design System
  const { getColor } = useDesignSystem();

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType.SECTION,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType.SECTION,
    hover: (draggedItem: { index: number }) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Move the section
      moveSection(dragIndex, hoverIndex);

      // Update the dragged item's index
      draggedItem.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect drag and drop refs
  drag(drop(ref));

  // ✅ NOVO: Extrair informações da seção para exibição
  const section = pageSection.section;
  const config = section?.config || {};
  const styling = section?.styling || {};
  const elements = config.elements || {};
  
  // Grid (gridRows x gridCols)
  const gridRows = config.gridRows || 1;
  const gridCols = config.gridCols || 1;
  const gridLabel = `${gridCols}×${gridRows}`;
  
  // Altura
  const heightMap: Record<string, string> = {
    'auto': 'Auto',
    '25vh': '25%',
    '50vh': '50%',
    '100vh': '100%',
  };
  const heightValue = styling.height || config.heightMode || 'auto';
  const heightLabel = heightMap[heightValue] || heightValue;
  
  // Elementos presentes
  const hasText = elements.hasIcon || elements.hasMinorTitle || elements.hasMainTitle || elements.hasSubtitle || elements.hasButton;
  const hasCards = elements.hasCards || false;
  const hasMedia = elements.hasMedia || false;
  const hasBgMedia = !!config.backgroundImage;
  
  // ✅ NOVO: Cores do Design System — usa ?? para permitir string vazia como valor válido
  const primaryColor = getColor('primary') ?? '#ea526e';
  const secondaryColor = getColor('secondary') ?? '#2e2240';
  const accentColor = getColor('accent') ?? '#ed9331';
  const mutedColor = getColor('muted') ?? '#e7e8e8';
  
  // ✅ NOVO: Helper para ajustar opacidade de cor hex
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  // ✅ NOVO: Componente Badge para indicadores (usando cores do DS)
  const Badge = ({ children, color = 'primary' }: { children: React.ReactNode; color?: 'primary' | 'secondary' | 'accent' | 'muted' }) => {
    const colorMap = {
      primary: { bg: hexToRgba(primaryColor, 0.1), text: primaryColor },
      secondary: { bg: hexToRgba(secondaryColor, 0.1), text: secondaryColor },
      accent: { bg: hexToRgba(accentColor, 0.1), text: accentColor },
      muted: { bg: hexToRgba(mutedColor, 0.5), text: '#4b5563' }, // gray-600
    };
    
    const colors = colorMap[color];
    
    return (
      <span 
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
        style={{ 
          backgroundColor: colors.bg, 
          color: colors.text 
        }}
      >
        {children}
      </span>
    );
  };

  return (
    <div
      ref={ref}
      className="border-2 rounded-lg p-4"
      style={{
        transition: 'none',
        opacity: isDragging ? 0.5 : 1,
        borderColor: isDragging
          ? '#d1d5db'
          : isOver
          ? 'var(--primary, #ea526e)'
          : '#e5e7eb',
        backgroundColor: isDragging
          ? '#f3f4f6'
          : isOver
          ? 'color-mix(in srgb, var(--primary, #ea526e) 8%, transparent)'
          : '#f9fafb',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="cursor-grab active:cursor-grabbing"
            style={{ color: 'var(--admin-icon-action, #6b7280)' }}
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h4
              style={{
                fontSize:   adminVar('item-title-list', 'size'),
                fontWeight: adminVar('item-title-list', 'weight'),
                color:      adminVar('item-title-list', 'color'),
              }}
              className="mb-2"
            >
              {pageSection.section?.name}
            </h4>
            
            {/* ✅ NOVO: Informações da seção em badges */}
            <div className="flex flex-wrap gap-2">
              <Badge color="primary">Grid {gridLabel}</Badge>
              <Badge color="secondary">Altura {heightLabel}</Badge>
              {hasText && <Badge color="accent">✓ Texto</Badge>}
              {hasBgMedia && <Badge color="accent">✓ BG Mídia</Badge>}
              {hasMedia && <Badge color="accent">✓ Mídia</Badge>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEditConfig(index)}
            style={{
              transition:      'none',
              backgroundColor: 'var(--admin-btn-action-bg,     #ffffff)',
              color:           'var(--admin-btn-action-text,   #374151)',
              borderColor:     'var(--admin-btn-action-border, #e5e7eb)',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.backgroundColor = 'var(--admin-btn-action-hover-bg,   #f9fafb)';
              btn.style.color           = 'var(--admin-btn-action-hover-text, #111827)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.backgroundColor = 'var(--admin-btn-action-bg,   #ffffff)';
              btn.style.color           = 'var(--admin-btn-action-text, #374151)';
            }}
          >
            <Settings className="h-4 w-4 mr-1" />
            Configurar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
            style={{
              transition:      'none',
              color:           'var(--admin-delete-btn-text,     #dc2626)',
              backgroundColor: 'transparent',
              borderColor:     'var(--admin-btn-action-border, #e5e7eb)',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.color           = 'var(--admin-delete-btn-hover-text,   #b91c1c)';
              btn.style.backgroundColor = 'var(--admin-delete-btn-hover-bg,     #fef2f2)';
              btn.style.borderColor     = 'var(--admin-delete-btn-hover-border, #fca5a5)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.color           = 'var(--admin-delete-btn-text,     #dc2626)';
              btn.style.backgroundColor = 'transparent';
              btn.style.borderColor     = 'var(--admin-btn-action-border, #e5e7eb)';
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}