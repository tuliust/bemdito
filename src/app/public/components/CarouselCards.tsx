import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardRenderer } from './CardRenderer';
import { useDesignSystem } from '../../../lib/contexts/DesignSystemContext';

/**
 * CarouselCards
 *
 * Renderiza cards um a um com navegação por setas (clique).
 * Variante 'carousel' do sistema de Card Templates.
 *
 * Visual:
 *  ←  [ Card ]  →
 *     ● ○ ○ ○     ← indicadores de posição
 *
 * Seta esquerda: círculo outline (muted)
 * Seta direita: círculo preenchido (secondary)
 */

interface CarouselCardsProps {
  cards: any[];
  cardDisplayMode: string;
  /** Compatibilidade de API com ScrollRevealCards — não utilizado */
  progress?: number;
}

export function CarouselCards({ cards, cardDisplayMode }: CarouselCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { secondaryColor } = useDesignSystem();

  if (cards.length === 0) return null;

  const prev = () => setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setCurrentIndex((i) => (i + 1) % cards.length);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Linha principal: setas + card */}
      <div className="flex items-center gap-3 w-full">
        {/* Seta esquerda — outline/muted */}
        <button
          onClick={prev}
          aria-label="Card anterior"
          className="flex-shrink-0 h-11 w-11 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'transparent',
            border: '2px solid #e7e8e8',
            color: '#9ca3af',
            transition: 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#d1d5db';
            (e.currentTarget as HTMLButtonElement).style.color = '#6b7280';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#e7e8e8';
            (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af';
          }}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Card atual */}
        <div className="flex-1 min-w-0">
          <CardRenderer
            card={cards[currentIndex]}
            compact={cardDisplayMode === 'compact'}
          />
        </div>

        {/* Seta direita — secondary color */}
        <button
          onClick={next}
          aria-label="Próximo card"
          className="flex-shrink-0 h-11 w-11 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: secondaryColor || '#2e2240',
            border: 'none',
            color: '#ffffff',
            transition: 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
          }}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Indicadores de posição (dots) */}
      {cards.length > 1 && (
        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Ir para card ${i + 1}`}
              className="rounded-full"
              style={{
                width: i === currentIndex ? '20px' : '8px',
                height: '8px',
                backgroundColor: i === currentIndex
                  ? (secondaryColor || '#2e2240')
                  : '#e7e8e8',
                transition: 'width 0.25s ease, background-color 0.25s ease',
                border: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
