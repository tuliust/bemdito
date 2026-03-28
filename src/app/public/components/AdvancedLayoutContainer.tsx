import React, { CSSProperties } from 'react';

/**
 * Estrutura de posicionamento de elementos no desktop
 */
interface ElementPosition {
  row: 'top' | 'bottom' | 'both' | 'single';
  horizontal: 'left' | 'center' | 'right';
}

/**
 * Estrutura completa de layout
 */
export interface AdvancedLayout {
  desktop: {
    text: ElementPosition;      // Agrupa: ícone, chamada, título, subtítulo, botão
    media: ElementPosition;
    cards: ElementPosition;
    container: ElementPosition;
  };
  mobile: {
    textAlign: 'left' | 'center' | 'right';
    stack: 'vertical' | 'horizontal';
  };
}

/**
 * Props do container de layout avançado
 */
interface AdvancedLayoutContainerProps {
  sectionHeight: string;
  horizontalLines: 'one' | 'two';
  layout: AdvancedLayout;
  textContent?: React.ReactNode;
  mediaContent?: React.ReactNode;
  cardsContent?: React.ReactNode;
  containerContent?: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Props do renderizador de linha
 */
interface RowRendererProps {
  position: 'top' | 'bottom' | 'single';
  textElement?: { row: string; horizontal: string; content: React.ReactNode };
  mediaElement?: { row: string; horizontal: string; content: React.ReactNode };
  cardsElement?: { row: string; horizontal: string; content: React.ReactNode };
  containerElement?: { row: string; horizontal: string; content: React.ReactNode };
}

/**
 * Renderiza uma linha específica (superior ou inferior)
 */
function RowRenderer({ position, textElement, mediaElement, cardsElement, containerElement }: RowRendererProps) {
  // Filtrar apenas elementos que pertencem a esta linha
  const elementsInRow = [
    textElement,
    mediaElement,
    cardsElement,
    containerElement,
  ].filter(
    (el) => el && (el.row === position || el.row === 'both')
  );

  if (elementsInRow.length === 0) {
    return null;
  }

  // Agrupar elementos por posição horizontal
  const leftElements = elementsInRow.filter((el) => el?.horizontal === 'left');
  const centerElements = elementsInRow.filter((el) => el?.horizontal === 'center');
  const rightElements = elementsInRow.filter((el) => el?.horizontal === 'right');

  return (
    <div className="w-full h-full flex items-center justify-between gap-8">
      {/* Esquerda */}
      <div className="flex-1 flex flex-col justify-center gap-6">
        {leftElements.map((el, idx) => (
          <div key={`left-${idx}`}>{el?.content}</div>
        ))}
      </div>

      {/* Centro */}
      {centerElements.length > 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          {centerElements.map((el, idx) => (
            <div key={`center-${idx}`} className="w-full">
              {el?.content}
            </div>
          ))}
        </div>
      )}

      {/* Direita */}
      {rightElements.length > 0 && (
        <div className="flex-1 flex flex-col items-end justify-center gap-6 text-right">
          {rightElements.map((el, idx) => (
            <div key={`right-${idx}`}>{el?.content}</div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Container principal para renderização com layout avançado
 * Suporta posicionamento por linha e coluna baseado na altura e número de linhas
 */
export function AdvancedLayoutContainer({
  sectionHeight,
  horizontalLines,
  layout,
  textContent,
  mediaContent,
  cardsContent,
  containerContent,
  className = '',
  style = {},
}: AdvancedLayoutContainerProps) {
  // Criar objetos de elementos com suas posições
  const textElement = textContent
    ? { row: layout.desktop.text.row, horizontal: layout.desktop.text.horizontal, content: textContent }
    : undefined;

  const mediaElement = mediaContent
    ? { row: layout.desktop.media.row, horizontal: layout.desktop.media.horizontal, content: mediaContent }
    : undefined;

  const cardsElement = cardsContent
    ? { row: layout.desktop.cards.row, horizontal: layout.desktop.cards.horizontal, content: cardsContent }
    : undefined;

  const containerElement = containerContent
    ? {
        row: layout.desktop.container.row,
        horizontal: layout.desktop.container.horizontal,
        content: containerContent,
      }
    : undefined;

  // Determinar se a seção tem altura total (100vh)
  const isFullHeight = sectionHeight === '100vh';

  // Renderizar baseado no número de linhas
  if (horizontalLines === 'two' && isFullHeight) {
    // Modo 2 linhas: uma linha superior e uma inferior
    return (
      <div className={`h-full flex flex-col ${className}`} style={style}>
        {/* Linha Superior */}
        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <RowRenderer
              position="top"
              textElement={textElement}
              mediaElement={mediaElement}
              cardsElement={cardsElement}
              containerElement={containerElement}
            />
          </div>
        </div>

        {/* Linha Inferior */}
        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <RowRenderer
              position="bottom"
              textElement={textElement}
              mediaElement={mediaElement}
              cardsElement={cardsElement}
              containerElement={containerElement}
            />
          </div>
        </div>
      </div>
    );
  }

  // Modo 1 linha ou altura automática
  return (
    <div
      className={`${isFullHeight ? 'h-full' : ''} flex items-center justify-center ${className}`}
      style={style}
    >
      <div className="container mx-auto px-4 py-16">
        <RowRenderer
          position={isFullHeight ? 'single' : 'top'}
          textElement={textElement}
          mediaElement={mediaElement}
          cardsElement={cardsElement}
          containerElement={containerElement}
        />
      </div>
    </div>
  );
}

/**
 * Hook para converter layout antigo para novo formato (se necessário)
 */
export function useAdvancedLayout(config: any): AdvancedLayout | null {
  if (!config?.layout) return null;

  // Se já está no novo formato, retornar
  if (
    config.layout.desktop?.text?.row !== undefined &&
    config.layout.desktop?.text?.horizontal !== undefined
  ) {
    return config.layout as AdvancedLayout;
  }

  // Converter formato antigo (se existir) para novo
  return {
    desktop: {
      text: { row: 'top', horizontal: 'center' },
      media: { row: 'top', horizontal: 'center' },
      cards: { row: 'bottom', horizontal: 'center' },
      container: { row: 'both', horizontal: 'center' },
    },
    mobile: {
      textAlign: config.layout.mobile?.textAlign || 'center',
      stack: config.layout.mobile?.stack || 'vertical',
    },
  };
}