import React from 'react';
import { CardRenderer } from './CardRenderer';

/**
 * ScrollRevealCards
 *
 * Renderiza cards um a um com efeito de scroll-reveal:
 * - Cards sobem e desvanecem conforme o usuário rola a página
 * - Apenas um card visível por vez
 * - A seção "congela" (sticky) enquanto os cards passam
 *
 * USAGE: Renderizado dentro da célula de cards do grid quando
 *        o template tem variant === 'scroll-reveal'.
 *        O wrapper externo (scroll track) é criado pelo SectionRenderer.
 */

interface ScrollRevealCardsProps {
  cards: any[];
  cardDisplayMode: string;
  /** Progresso do scroll: 0 (início) a 1 (todos os cards passaram) */
  progress: number;
}

export function ScrollRevealCards({ cards, cardDisplayMode, progress }: ScrollRevealCardsProps) {
  const numCards = cards.length;
  if (numCards === 0) return null;

  // Multiplicador: garante que o primeiro card começa visível (offset +0.5)
  // e o último card termina de sair exatamente quando progress=1
  const multiplier = numCards - 0.5;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {cards.map((card, i) => {
        // Cada card ocupa 1 unidade de fase, com offset de 0.5 para que card 0 comece visível
        // Formula: card 0 = 0.5 quando progress=0 (centro do range visível 0.2-0.8)
        //          card N-1 = 1.0 quando progress=1 (término do exit)
        const cardProgress = progress * multiplier - i + 0.5;

        // Fases de animação:
        // < 0     : Abaixo (aguardando entrada)
        // 0 - 0.2 : Entrando de baixo (translateY: 60% → 0%, opacity: 0 → 1)
        // 0.2-0.8 : Visível no centro
        // 0.8-1.0 : Saindo para cima (translateY: 0% → -40%, opacity: 1 → 0)
        // > 1     : Acima (já saiu)

        let translateY = 0;
        let opacity = 0;
        let scale = 1;

        if (cardProgress < 0) {
          // Card ainda não entrou
          translateY = 60;
          opacity = 0;
          scale = 0.95;
        } else if (cardProgress <= 0.2) {
          // Entrando de baixo
          const enterProgress = cardProgress / 0.2;
          const eased = easeOutCubic(enterProgress);
          translateY = 60 * (1 - eased);
          opacity = eased;
          scale = 0.95 + 0.05 * eased;
        } else if (cardProgress <= 0.8) {
          // Totalmente visível
          translateY = 0;
          opacity = 1;
          scale = 1;
        } else if (cardProgress <= 1.0) {
          // Saindo para cima com fade
          const exitProgress = (cardProgress - 0.8) / 0.2;
          const eased = easeInCubic(exitProgress);
          translateY = -40 * eased;
          opacity = 1 - eased;
          scale = 1 - 0.05 * eased;
        } else {
          // Card já saiu completamente
          translateY = -40;
          opacity = 0;
          scale = 0.95;
        }

        // Não renderizar no DOM se completamente invisível (performance)
        if (opacity < 0.01) {
          return null;
        }

        return (
          <div
            key={card.id}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              transform: `translateY(${translateY}%) scale(${scale})`,
              opacity,
              willChange: 'transform, opacity',
              pointerEvents: opacity > 0.5 ? 'auto' : 'none',
            }}
          >
            <div style={{ width: '100%', maxWidth: '100%' }}>
              <CardRenderer card={card} compact={cardDisplayMode === 'compact'} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Easing suave para entrada */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Easing suave para saída */
function easeInCubic(t: number): number {
  return t * t * t;
}