import { useState, useRef, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { X, ChevronDown, ChevronRight, ChevronUp, GripVertical } from 'lucide-react';
import { getLucideIcon } from '../../../lib/utils/icons';
import { ColorTokenPicker } from '../../components/ColorTokenPicker';
import { TypeScalePicker } from '../../components/admin/TypeScalePicker';
import { IconPicker, IconPickerContent } from '../../components/admin/IconPicker';
import { adminVar } from '../../components/admin/AdminThemeProvider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { supabase } from '../../../lib/supabase/client';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';
import { getTokenColor } from '../../../lib/utils/colors';
import type { Database } from '../../../lib/supabase/client';
import React from 'react';

type MenuCard = Database['public']['Tables']['menu_cards']['Row'];

const ITEM_TYPE = 'MENU_CARD';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableCardItemProps {
  card: MenuCard;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onUpdate: (updates: Partial<MenuCard>) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

// ─── Seção colapsável reutilizável (Design tab) ─────────────────────────────
function DesignSection({
  label,
  open,
  onOpenChange,
  children,
}: {
  label: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)',
          border: '1px solid var(--admin-collapsible-border, #e5e7eb)',
        }}
      >
        <CollapsibleTrigger
          className="w-full px-4 py-3 flex items-center justify-between rounded-lg"
          style={{ transition: 'none' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--admin-collapsible-hover-bg, #f3f4f6)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <h3
            className="uppercase tracking-wide"
            style={{
              fontSize: 'var(--admin-collapsible-label-size, 0.75rem)',
              fontWeight: 'var(--admin-collapsible-label-weight, 600)',
              color: 'var(--admin-collapsible-label-color, #374151)',
            }}
          >
            {label}
          </h3>
          {open ? (
            <ChevronUp className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
          ) : (
            <ChevronDown className="h-4 w-4" style={{ color: 'var(--admin-icon-action, #6b7280)' }} />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div
            className="px-4 pb-4 pt-2 space-y-3"
            style={{ borderTop: '1px solid var(--admin-collapsible-border, #e5e7eb)' }}
          >
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function DraggableCardItem({
  card,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
  onUpdate,
  onMove,
}: DraggableCardItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  // ✅ Hook para acessar tokens do Design System
  const { colors, typography } = useDesignSystem();

  // ✅ Helper para converter token de tipografia em estilo CSS
  const getTypographyFromTokenId = (tokenId?: string) => {
    if (!tokenId) return {};
    const typoToken = typography.find((t) => t.id === tokenId);
    if (!typoToken) return {};
    try {
      const parsed = typeof typoToken.value === 'string' 
        ? JSON.parse(typoToken.value) 
        : typoToken.value;
      return {
        fontSize: parsed.fontSize || parsed.size,
        fontWeight: parsed.fontWeight || parsed.weight,
      };
    } catch {
      return {};
    }
  };

  // Estados para controlar collapse de cada seção
  const [openIcone, setOpenIcone] = useState(false);
  const [openTitulo, setOpenTitulo] = useState(false);
  const [openSubtitulo, setOpenSubtitulo] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openLayout, setOpenLayout] = useState(false); // ✅ NOVO: Estado para seção Layout
  
  // Estado para controlar o popover de seleção rápida de ícone
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  
  // Estado para armazenar a cor do ícone
  const [iconColor, setIconColor] = useState<string>('#6b7280');

  // ✅ NOVO: Estado para largura dinâmica do subtítulo
  const [subtitleWidth, setSubtitleWidth] = useState<number>(200);
  const subtitleMeasureRef = useRef<HTMLSpanElement>(null);

  // Buscar cor do token quando icon_color_token mudar
  useEffect(() => {
    async function fetchIconColor() {
      if (!card.icon_color_token) {
        setIconColor('#6b7280'); // Fallback
        return;
      }

      const { data } = await supabase
        .from('design_tokens')
        .select('value')
        .eq('id', card.icon_color_token)
        .single();

      if (data?.value) {
        try {
          const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
          setIconColor(parsed.hex || '#6b7280');;
        } catch {
          setIconColor('#6b7280');
        }
      }
    }

    fetchIconColor();
  }, [card.icon_color_token]);

  // ✅ NOVO: Calcular largura dinâmica do subtítulo baseado no conteúdo
  useEffect(() => {
    if (subtitleMeasureRef.current) {
      const measuredWidth = subtitleMeasureRef.current.offsetWidth;
      // Adiciona 40px de padding (20px cada lado) + margem de segurança
      setSubtitleWidth(Math.max(200, Math.min(768, measuredWidth + 40)));
    }
  }, [card.subtitle, card.subtitle_font_size]);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { id: card.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // ✅ Ícone maior com classe customizada
  const CardIcon = card.icon ? getLucideIcon(card.icon, '') : null;

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className="p-4 rounded-lg transition-all"
      style={{
        backgroundColor: 'var(--admin-list-item-bg, #ffffff)',
        border: '2px solid var(--admin-list-item-border, #e5e7eb)',
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        boxShadow: isDragging ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
      }}
    >
      {/* Header - sempre visível */}
      <div className="relative pb-4">
        {/* Linha superior: Ícone Drag (esquerda) + Botão X (direita) */}
        <div className="flex justify-between items-start mb-3">
          {/* Ícone de Drag */}
          <div
            className="cursor-grab active:cursor-grabbing"
            style={{ color: 'var(--admin-icon-action, #9ca3af)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </div>

          {/* Botão Remover (X) - Maior */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1.5 rounded-lg"
            style={{
              transition: 'none',
              color: 'var(--admin-delete-btn-text, #dc2626)',
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = 'var(--admin-delete-btn-hover-text, #b91c1c)';
              el.style.backgroundColor = 'var(--admin-delete-btn-hover-bg, #fef2f2)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = 'var(--admin-delete-btn-text, #dc2626)';
              el.style.backgroundColor = 'transparent';
            }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo centralizado: Ícone + Título + Subtítulo (vertical) */}
        <div className="flex flex-col items-center gap-2">
          {/* Ícone clicável acima do título */}
          {CardIcon ? (
            <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded transition-colors cursor-pointer flex-shrink-0"
                  style={{
                    color: iconColor,
                  }}
                  title="Clique para trocar o ícone"
                >
                  <div 
                    style={{ 
                      width: `${card.icon_size || 32}px`,
                      height: `${card.icon_size || 32}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(CardIcon as React.ReactElement, {
                      style: {
                        width: '100%',
                        height: '100%',
                      }
                    })}
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[420px] p-0 rounded-[1.5rem]"
                onOpenAutoFocus={(e) => e.preventDefault()}
                side="bottom"
                align="center"
              >
                <IconPickerContent
                  value={card.icon || ''}
                  onChange={(icon) => onUpdate({ icon })}
                  onClose={() => setIconPickerOpen(false)}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div
              className="h-8 w-8 border border-dashed rounded flex-shrink-0"
              style={{ borderColor: 'var(--admin-field-border, #e5e7eb)' }}
            />
          )}
          
          {/* Campo de Título com largura reduzida */}
          <Input
            value={card.title || card.name || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Digite o título do card"
            className="text-center max-w-md min-h-[3rem] py-2"
            onClick={(e) => e.stopPropagation()}
            style={{
              ...getTypographyFromTokenId(card.title_font_size),
              color: getTokenColor(colors, card.title_color_token, adminVar('list-item-title', 'color')),
            }}
          />
          
          {/* Campo de Subtítulo - SEMPRE visível (não apenas quando expandido) */}
          <div className="relative">
            {/* Elemento invisível para medir o texto */}
            <span
              ref={subtitleMeasureRef}
              className="absolute invisible whitespace-nowrap px-4"
              style={{
                ...getTypographyFromTokenId(card.subtitle_font_size),
              }}
            >
              {card.subtitle || 'Digite o subtítulo do card'}
            </span>
            
            {/* Input real com largura dinâmica */}
            <Input
              value={card.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Digite o subtítulo do card"
              className="text-center px-4" 
              onClick={(e) => e.stopPropagation()}
              style={{
                width: `${subtitleWidth}px`,
                minWidth: '200px',
                maxWidth: '768px',
                ...getTypographyFromTokenId(card.subtitle_font_size),
                color: getTokenColor(colors, card.subtitle_color_token, '#6b7280'),
              }}
            />
          </div>
        </div>

        {/* Botão Expandir/Recolher - Canto inferior direito */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="absolute bottom-0 right-0 p-1 rounded transition-colors"
          style={{
            color: 'var(--admin-icon-action, #6b7280)',
          }}
        >
          <ChevronDown
            className="h-6 w-6"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease-in-out',
            }}
          />
        </button>
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <div className="mt-4 pl-11">
          {/* Grid 2x2: Ícone + Título (linha 1), Subtítulo + Link (linha 2) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Seção: Ícone */}
            <DesignSection label="Ícone" open={openIcone} onOpenChange={setOpenIcone}>
              <div className="space-y-3">
                {/* Campo: Cor do Ícone (full width) */}
                <div>
                  <Label>Cor do Ícone</Label>
                  <div className="mt-1.5">
                    <ColorTokenPicker
                      value={card.icon_color_token || ''}
                      onChange={(tokenId) => onUpdate({ icon_color_token: tokenId })}
                      label=""
                      layout="horizontal"
                    />
                  </div>
                </div>
              </div>
            </DesignSection>

            {/* Seção: Título */}
            <DesignSection label="Título" open={openTitulo} onOpenChange={setOpenTitulo}>
              <div className="space-y-3">
                {/* Campo: Cor do Texto (full width) */}
                <div>
                  <Label>Cor do Texto</Label>
                  <div className="mt-1.5">
                    <ColorTokenPicker
                      value={card.title_color_token || ''}
                      onChange={(tokenId) => onUpdate({ title_color_token: tokenId })}
                      label=""
                      layout="horizontal"
                    />
                  </div>
                </div>
              </div>
            </DesignSection>

            {/* Seção: Subtítulo */}
            <DesignSection label="Subtítulo" open={openSubtitulo} onOpenChange={setOpenSubtitulo}>
              <div className="space-y-3">
                {/* Campo: Cor do Texto (full width) */}
                <div>
                  <Label>Cor do Texto</Label>
                  <div className="mt-1.5">
                    <ColorTokenPicker
                      value={card.subtitle_color_token || ''}
                      onChange={(tokenId) => onUpdate({ subtitle_color_token: tokenId })}
                      label=""
                      layout="horizontal"
                    />
                  </div>
                </div>
              </div>
            </DesignSection>

            {/* Seção: Layout e Link */}
            <DesignSection label="Layout e Link" open={openLink} onOpenChange={setOpenLink}>
              <div className="space-y-5">
                {/* Campo: URL */}
                <div>
                  <Label>URL</Label>
                  <Input
                    value={card.url || ''}
                    onChange={(e) => onUpdate({ url: e.target.value })}
                    placeholder="https://exemplo.com"
                    className="mt-1.5"
                  />
                </div>

                {/* Campo: Tamanho do Ícone */}
                <div>
                  <Label>Tamanho do Ícone</Label>
                  <Input
                    type="number"
                    value={card.icon_size || 28}
                    onChange={(e) => onUpdate({ icon_size: parseInt(e.target.value) })}
                    min="16"
                    max="64"
                    className="mt-1.5"
                  />
                </div>

                {/* Campo: Tamanho da Fonte do Título */}
                <div>
                  <Label>Tamanho da Fonte do Título</Label>
                  <div className="mt-1.5">
                    <TypeScalePicker
                      value={card.title_font_size || ''}
                      onChange={(tokenId) => onUpdate({ title_font_size: tokenId })}
                      label=""
                    />
                  </div>
                </div>

                {/* Campo: Tamanho da Fonte do Subtítulo */}
                <div>
                  <Label>Tamanho da Fonte do Subtítulo</Label>
                  <div className="mt-1.5">
                    <TypeScalePicker
                      value={card.subtitle_font_size || ''}
                      onChange={(tokenId) => onUpdate({ subtitle_font_size: tokenId })}
                      label=""
                    />
                  </div>
                </div>
              </div>
            </DesignSection>
          </div>
        </div>
      )}
    </div>
  );
}