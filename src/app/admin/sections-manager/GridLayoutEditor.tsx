import React, { useState } from 'react';
import { FileText, Grid2X2, ImageIcon, Video, MoveUp, MoveDown, MoveLeft, MoveRight, Maximize2, Minimize2 } from 'lucide-react';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';

// ============================================
// TIPOS
// ============================================

type ElementType = 'text' | 'media' | 'cards';
type GridPosition = 
  | 'top-left' | 'top-right' | 'top-center'
  | 'bottom-left' | 'bottom-right' | 'bottom-center'
  | 'middle-left' | 'middle-right' | 'center';

interface GridLayout {
  text?: GridPosition | { position: GridPosition; [key: string]: any }; // ✅ Aceita string ou objeto
  media?: GridPosition | { position: GridPosition; [key: string]: any }; // ✅ Aceita string ou objeto
  cards?: GridPosition | { position: GridPosition; [key: string]: any }; // ✅ Aceita string ou objeto
}

interface GridLayoutEditorProps {
  elements: {
    hasText: boolean;
    hasMedia: boolean;
    hasCards: boolean;
    mediaType?: 'image' | 'video' | null;
  };
  layout: GridLayout;
  onChange: (layout: GridLayout) => void;
}

// ============================================
// UTILITÁRIOS: CONVERSÃO DE POSIÇÕES
// ============================================

// Converter GridPosition para layout de grid CSS
function positionToLayout(position: GridPosition): { startCol: number; startRow: number; cols: number; rows: number } | undefined {
  const layouts: Record<GridPosition, { startCol: number; startRow: number; cols: number; rows: number }> = {
    'top-left': { startCol: 1, startRow: 1, cols: 1, rows: 1 },
    'top-right': { startCol: 2, startRow: 1, cols: 1, rows: 1 },
    'top-center': { startCol: 1, startRow: 1, cols: 2, rows: 1 },
    'bottom-left': { startCol: 1, startRow: 2, cols: 1, rows: 1 },
    'bottom-right': { startCol: 2, startRow: 2, cols: 1, rows: 1 },
    'bottom-center': { startCol: 1, startRow: 2, cols: 2, rows: 1 },
    'middle-left': { startCol: 1, startRow: 1, cols: 1, rows: 2 },
    'middle-right': { startCol: 2, startRow: 1, cols: 1, rows: 2 },
    'center': { startCol: 1, startRow: 1, cols: 2, rows: 2 },
  };

  return layouts[position];
}

// Converter cols/rows/startCol/startRow de volta para GridPosition
function layoutToPosition(cols: number, rows: number, startCol: number, startRow: number): GridPosition {
  // Centro total (2x2)
  if (cols === 2 && rows === 2) return 'center';
  
  // Linha superior (row 1)
  if (startRow === 1 && rows === 1) {
    if (cols === 2) return 'top-center';
    if (startCol === 1) return 'top-left';
    return 'top-right';
  }
  
  // Linha inferior (row 2)
  if (startRow === 2 && rows === 1) {
    if (cols === 2) return 'bottom-center';
    if (startCol === 1) return 'bottom-left';
    return 'bottom-right';
  }
  
  // Ocupando 2 linhas
  if (rows === 2) {
    if (startCol === 1) return 'middle-left';
    return 'middle-right';
  }
  
  // Fallback
  return 'center';
}

// ✅ Extrair posição como string de qualquer formato (string ou objeto)
function extractPosition(value: GridPosition | { position: GridPosition; [key: string]: any } | undefined, fallback: GridPosition = 'top-left'): GridPosition {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && 'position' in value) return value.position;
  return fallback;
}

// ============================================
// COMPONENTE: GRID ELEMENT (SEM DRAG)
// ============================================

interface GridElementProps {
  type: ElementType;
  position: GridPosition;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onResize: (cols: 1 | 2, rows: 1 | 2) => void;
  canMove: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
  canResize: {
    expandCols: boolean;
    shrinkCols: boolean;
    expandRows: boolean;
    shrinkRows: boolean;
  };
  mediaType?: 'image' | 'video' | null;
}

function GridElement({ type, position, isSelected, onSelect, onMove, onResize, canMove, canResize, mediaType }: GridElementProps) {
  const layout = positionToLayout(position);
  
  if (!layout) {
    console.error(`Invalid position for ${type}:`, position);
    return null;
  }

  const icons = {
    text: <FileText className="h-8 w-8" />,
    media: mediaType === 'video' ? <Video className="h-8 w-8" /> : <ImageIcon className="h-8 w-8" />,
    cards: <Grid2X2 className="h-8 w-8" />,
  };

  const labels = {
    text: 'Texto',
    media: 'Mídia',
    cards: 'Cards',
  };

  // Calcular posição no grid CSS
  const gridStyle = {
    gridColumnStart: layout.startCol,
    gridColumnEnd: layout.startCol + layout.cols,
    gridRowStart: layout.startRow,
    gridRowEnd: layout.startRow + layout.rows,
  };

  return (
    <div
      onClick={onSelect}
      className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2"
      style={{
        ...gridStyle,
        transition: 'none',
        backgroundColor: isSelected ? 'var(--primary, #ea526e)' : '#ffffff',
        color: isSelected ? '#ffffff' : '#374151',
        borderColor: isSelected ? 'var(--primary, #ea526e)' : '#d1d5db',
        boxShadow: isSelected ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none',
        zIndex: isSelected ? 10 : 0,
        cursor: isSelected ? 'default' : 'pointer',
      }}
    >
      {/* Ícone e label */}
      <div className="flex flex-col items-center gap-2">
        {icons[type]}
        <span className="text-sm font-semibold">{labels[type]}</span>
      </div>

      {/* Controles de movimento (visíveis quando selecionado) */}
      {isSelected && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          {/* Botões de movimento */}
          <div className="flex gap-0.5">
            {canMove.up && (
              <button onClick={(e) => { e.stopPropagation(); onMove('up'); }} className="p-1 rounded bg-white/30 hover:bg-white/50" title="Mover para cima">
                <MoveUp className="h-3 w-3" />
              </button>
            )}
            {canMove.down && (
              <button onClick={(e) => { e.stopPropagation(); onMove('down'); }} className="p-1 rounded bg-white/30 hover:bg-white/50" title="Mover para baixo">
                <MoveDown className="h-3 w-3" />
              </button>
            )}
            {canMove.left && (
              <button onClick={(e) => { e.stopPropagation(); onMove('left'); }} className="p-1 rounded bg-white/30 hover:bg-white/50" title="Mover para esquerda">
                <MoveLeft className="h-3 w-3" />
              </button>
            )}
            {canMove.right && (
              <button onClick={(e) => { e.stopPropagation(); onMove('right'); }} className="p-1 rounded bg-white/30 hover:bg-white/50" title="Mover para direita">
                <MoveRight className="h-3 w-3" />
              </button>
            )}
          </div>
          {/* Botões de redimensionamento */}
          <div className="flex gap-0.5 ml-1 border-l border-white/30 pl-1">
            {(canResize.expandCols || canResize.shrinkCols) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResize(layout.cols === 1 ? 2 : 1, layout.rows as 1 | 2);
                }}
                className="p-1 rounded bg-white/30 hover:bg-white/50"
                title={layout.cols === 1 ? 'Expandir colunas' : 'Encolher colunas'}
              >
                {layout.cols === 1 ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </button>
            )}
            {(canResize.expandRows || canResize.shrinkRows) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResize(layout.cols as 1 | 2, layout.rows === 1 ? 2 : 1);
                }}
                className="p-1 rounded bg-white/30 hover:bg-white/50"
                title={layout.rows === 1 ? 'Expandir linhas' : 'Encolher linhas'}
              >
                {layout.rows === 1 ? <Maximize2 className="h-3 w-3 rotate-90" /> : <Minimize2 className="h-3 w-3 rotate-90" />}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL: GRID LAYOUT EDITOR
// ============================================

export function GridLayoutEditor({ elements, layout, onChange }: GridLayoutEditorProps) {
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  // Extrair posições atuais do layout
  const textPosition = extractPosition(layout.text, 'top-left');
  const mediaPosition = extractPosition(layout.media, 'top-right');
  const cardsPosition = extractPosition(layout.cards, 'bottom-center');

  // Atualizar posição de um elemento
  const updatePosition = (elementType: ElementType, newPosition: GridPosition) => {
    const newLayout = { ...layout, [elementType]: newPosition };
    onChange(newLayout);
  };

  // Mover um elemento em uma direção
  const handleMove = (elementType: ElementType, direction: 'up' | 'down' | 'left' | 'right') => {
    const currentPos = elementType === 'text' ? textPosition : elementType === 'media' ? mediaPosition : cardsPosition;
    const currentLayout = positionToLayout(currentPos);
    if (!currentLayout) return;

    let { startCol, startRow, cols, rows } = currentLayout;

    switch (direction) {
      case 'up': startRow = Math.max(1, startRow - 1); break;
      case 'down': startRow = Math.min(2, startRow + 1); break;
      case 'left': startCol = Math.max(1, startCol - 1); break;
      case 'right': startCol = Math.min(2, startCol + 1); break;
    }

    // Ensure within bounds
    if (startCol + cols - 1 > 2) startCol = 2 - cols + 1;
    if (startRow + rows - 1 > 2) startRow = 2 - rows + 1;

    const newPosition = layoutToPosition(cols, rows, startCol, startRow);
    updatePosition(elementType, newPosition);
  };

  // Redimensionar um elemento
  const handleResize = (elementType: ElementType, newCols: 1 | 2, newRows: 1 | 2) => {
    const currentPos = elementType === 'text' ? textPosition : elementType === 'media' ? mediaPosition : cardsPosition;
    const currentLayout = positionToLayout(currentPos);
    if (!currentLayout) return;

    let { startCol, startRow } = currentLayout;

    // Ensure within bounds after resize
    if (startCol + newCols - 1 > 2) startCol = 1;
    if (startRow + newRows - 1 > 2) startRow = 1;

    const newPosition = layoutToPosition(newCols, newRows, startCol, startRow);
    updatePosition(elementType, newPosition);
  };

  // Calcular possibilidades de movimento
  const getCanMove = (position: GridPosition) => {
    const l = positionToLayout(position);
    if (!l) return { up: false, down: false, left: false, right: false };
    return {
      up: l.startRow > 1,
      down: l.startRow + l.rows - 1 < 2,
      left: l.startCol > 1,
      right: l.startCol + l.cols - 1 < 2,
    };
  };

  // Calcular possibilidades de redimensionamento
  const getCanResize = (position: GridPosition) => {
    const l = positionToLayout(position);
    if (!l) return { expandCols: false, shrinkCols: false, expandRows: false, shrinkRows: false };
    return {
      expandCols: l.cols < 2 && l.startCol + 1 <= 2,
      shrinkCols: l.cols > 1,
      expandRows: l.rows < 2 && l.startRow + 1 <= 2,
      shrinkRows: l.rows > 1,
    };
  };

  return (
    <div className="space-y-3">
      {/* Grid 2×2 visual */}
      <div
        className="grid gap-2 min-h-[200px]"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
        }}
      >
        {/* Elementos posicionados */}
        {elements.hasText && (
          <GridElement
            type="text"
            position={textPosition}
            isSelected={selectedElement === 'text'}
            onSelect={() => setSelectedElement(selectedElement === 'text' ? null : 'text')}
            onMove={(dir) => handleMove('text', dir)}
            onResize={(cols, rows) => handleResize('text', cols, rows)}
            canMove={getCanMove(textPosition)}
            canResize={getCanResize(textPosition)}
          />
        )}

        {elements.hasMedia && (
          <GridElement
            type="media"
            position={mediaPosition}
            isSelected={selectedElement === 'media'}
            onSelect={() => setSelectedElement(selectedElement === 'media' ? null : 'media')}
            onMove={(dir) => handleMove('media', dir)}
            onResize={(cols, rows) => handleResize('media', cols, rows)}
            canMove={getCanMove(mediaPosition)}
            canResize={getCanResize(mediaPosition)}
            mediaType={elements.mediaType}
          />
        )}

        {elements.hasCards && (
          <GridElement
            type="cards"
            position={cardsPosition}
            isSelected={selectedElement === 'cards'}
            onSelect={() => setSelectedElement(selectedElement === 'cards' ? null : 'cards')}
            onMove={(dir) => handleMove('cards', dir)}
            onResize={(cols, rows) => handleResize('cards', cols, rows)}
            canMove={getCanMove(cardsPosition)}
            canResize={getCanResize(cardsPosition)}
          />
        )}

        {/* Células vazias de fundo */}
        {[1, 2, 3, 4].map((cell) => (
          <div
            key={`bg-${cell}`}
            className="rounded-lg border border-dashed"
            style={{
              borderColor: 'var(--admin-collapsible-border, #e5e7eb)',
              backgroundColor: 'var(--admin-collapsible-bg, #f9fafb)',
              gridColumn: cell <= 2 ? cell : cell - 2,
              gridRow: cell <= 2 ? 1 : 2,
              zIndex: -1,
            }}
          />
        ))}
      </div>

      {/* Legenda */}
      <div data-slot="field-hint" className="flex gap-4 justify-center">
        <span>Clique para selecionar → Use controles para mover/redimensionar</span>
      </div>
    </div>
  );
}