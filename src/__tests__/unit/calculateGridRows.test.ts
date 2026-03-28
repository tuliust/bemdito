import { describe, it, expect } from 'vitest';

/**
 * Função calculateGridRows extraída de UnifiedSectionConfigModal.tsx
 * Esta é uma cópia para fins de teste. A função original está em:
 * /src/app/admin/pages-manager/UnifiedSectionConfigModal.tsx (linha 278)
 * 
 * ⚠️ IMPORTANTE: Se a função original mudar, atualizar esta cópia
 */
const calculateGridRows = (elements: any, layout: any): 1 | 2 => {
  if (!elements || !layout?.desktop) return 1;

  // Lista de elementos possíveis e suas positions
  const elementPositions = [
    { name: 'icon', active: elements.hasIcon, position: layout.desktop.icon?.position },
    { name: 'text', active: elements.hasMinorTitle || elements.hasMainTitle || elements.hasSubtitle || elements.hasButton, position: layout.desktop.text?.position },
    { name: 'media', active: elements.hasMedia, position: layout.desktop.media?.position },
    { name: 'cards', active: elements.hasCards, position: layout.desktop.cards?.position },
    { name: 'container', active: elements.hasContainer, position: layout.desktop.container?.position },
  ];

  // Verificar se algum elemento ativo está em position que requer 2 linhas
  for (const el of elementPositions) {
    if (!el.active || !el.position) continue;

    const pos = el.position as string;

    // Posições que EXIGEM 2 linhas:
    // - middle-left (ocupa 2 linhas)
    // - middle-right (ocupa 2 linhas)
    // - bottom-* (linha inferior)
    // - center (fullscreen 2×2) ⚠️ FALTANDO!
    if (
      pos === 'middle-left' ||
      pos === 'middle-right' ||
      pos.startsWith('bottom-') ||
      pos === 'center' // ✅ CORRIGIDO
    ) {
      return 2; // Precisa de 2 linhas
    }
  }

  // Se chegou aqui, todos os elementos estão em top-*
  return 1;
};

describe('calculateGridRows', () => {
  describe('Retorna 1 linha (gridRows: 1)', () => {
    describe('Posições top-* (linha superior)', () => {
      it('quando elemento está em top-left', () => {
        const elements = { hasMainTitle: true };
        const layout = {
          desktop: {
            text: { position: 'top-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('quando elemento está em top-right', () => {
        const elements = { hasMedia: true };
        const layout = {
          desktop: {
            media: { position: 'top-right' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('quando elemento está em top-center', () => {
        const elements = { hasCards: true };
        const layout = {
          desktop: {
            cards: { position: 'top-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('quando múltiplos elementos estão em top-*', () => {
        const elements = {
          hasMainTitle: true,
          hasMedia: true,
          hasCards: true,
        };
        const layout = {
          desktop: {
            text: { position: 'top-left' },
            media: { position: 'top-right' },
            cards: { position: 'top-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });
    });

    describe('Casos especiais que retornam 1', () => {
      it('quando não há elementos ativos', () => {
        const elements = {};
        const layout = { desktop: {} };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('quando elementos estão inativos mas têm position', () => {
        const elements = { hasMainTitle: false };
        const layout = {
          desktop: {
            text: { position: 'bottom-center' }, // Position de 2 linhas mas elemento inativo
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('quando elemento ativo mas sem position', () => {
        const elements = { hasMainTitle: true };
        const layout = {
          desktop: {
            text: {}, // Sem position
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });
    });
  });

  describe('Retorna 2 linhas (gridRows: 2)', () => {
    describe('Posições middle-* (2 linhas)', () => {
      it('quando elemento está em middle-left', () => {
        const elements = { hasMainTitle: true };
        const layout = {
          desktop: {
            text: { position: 'middle-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('quando elemento está em middle-right', () => {
        const elements = { hasMedia: true };
        const layout = {
          desktop: {
            media: { position: 'middle-right' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });
    });

    describe('Posições bottom-* (linha inferior)', () => {
      it('quando elemento está em bottom-left', () => {
        const elements = { hasCards: true };
        const layout = {
          desktop: {
            cards: { position: 'bottom-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('quando elemento está em bottom-right', () => {
        const elements = { hasCards: true };
        const layout = {
          desktop: {
            cards: { position: 'bottom-right' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('quando elemento está em bottom-center', () => {
        const elements = { hasCards: true };
        const layout = {
          desktop: {
            cards: { position: 'bottom-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });
    });

    describe('Posição center (fullscreen 2×2)', () => {
      it('quando elemento está em center', () => {
        const elements = { hasMainTitle: true };
        const layout = {
          desktop: {
            text: { position: 'center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });
    });

    describe('Combinações mistas', () => {
      it('quando um elemento em top e outro em bottom', () => {
        const elements = {
          hasMainTitle: true,
          hasCards: true,
        };
        const layout = {
          desktop: {
            text: { position: 'top-left' },
            cards: { position: 'bottom-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('quando um elemento em top e outro em middle', () => {
        const elements = {
          hasMedia: true,
          hasMainTitle: true,
        };
        const layout = {
          desktop: {
            media: { position: 'top-right' },
            text: { position: 'middle-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('quando múltiplos elementos em positions de 2 linhas', () => {
        const elements = {
          hasMainTitle: true,
          hasMedia: true,
          hasCards: true,
        };
        const layout = {
          desktop: {
            text: { position: 'middle-left' },
            media: { position: 'middle-right' },
            cards: { position: 'bottom-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });
    });
  });

  describe('Edge Cases e Validação', () => {
    describe('Parâmetros nulos ou undefined', () => {
      it('quando elements é null', () => {
        expect(calculateGridRows(null, { desktop: {} })).toBe(1);
      });

      it('quando elements é undefined', () => {
        expect(calculateGridRows(undefined, { desktop: {} })).toBe(1);
      });

      it('quando layout é null', () => {
        const elements = { hasMainTitle: true };
        expect(calculateGridRows(elements, null)).toBe(1);
      });

      it('quando layout é undefined', () => {
        const elements = { hasMainTitle: true };
        expect(calculateGridRows(elements, undefined)).toBe(1);
      });

      it('quando layout.desktop é undefined', () => {
        const elements = { hasMainTitle: true };
        const layout = {}; // Sem desktop
        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('quando ambos são null', () => {
        expect(calculateGridRows(null, null)).toBe(1);
      });
    });

    describe('Todos os tipos de elementos', () => {
      it('hasIcon com bottom-center', () => {
        const elements = { hasIcon: true };
        const layout = {
          desktop: {
            icon: { position: 'bottom-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('hasMinorTitle com middle-left', () => {
        const elements = { hasMinorTitle: true };
        const layout = {
          desktop: {
            text: { position: 'middle-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('hasSubtitle com top-center', () => {
        const elements = { hasSubtitle: true };
        const layout = {
          desktop: {
            text: { position: 'top-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('hasButton com bottom-right', () => {
        const elements = { hasButton: true };
        const layout = {
          desktop: {
            text: { position: 'bottom-right' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('hasMedia com center', () => {
        const elements = { hasMedia: true };
        const layout = {
          desktop: {
            media: { position: 'center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('hasCards com top-left', () => {
        const elements = { hasCards: true };
        const layout = {
          desktop: {
            cards: { position: 'top-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('hasContainer com middle-right', () => {
        const elements = { hasContainer: true };
        const layout = {
          desktop: {
            container: { position: 'middle-right' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });
    });

    describe('Agrupamento de elementos de texto', () => {
      it('quando hasMinorTitle e hasMainTitle (ambos usam text.position)', () => {
        const elements = {
          hasMinorTitle: true,
          hasMainTitle: true,
        };
        const layout = {
          desktop: {
            text: { position: 'bottom-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });

      it('quando hasMainTitle, hasSubtitle e hasButton (todos text)', () => {
        const elements = {
          hasMainTitle: true,
          hasSubtitle: true,
          hasButton: true,
        };
        const layout = {
          desktop: {
            text: { position: 'middle-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });
    });

    describe('Validação de lógica OR para text', () => {
      it('retorna 1 quando apenas hasMinorTitle em top-left', () => {
        const elements = { hasMinorTitle: true };
        const layout = {
          desktop: {
            text: { position: 'top-left' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('retorna 2 quando apenas hasButton em bottom-center', () => {
        const elements = { hasButton: true };
        const layout = {
          desktop: {
            text: { position: 'bottom-center' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(2);
      });
    });

    describe('Positions inválidas ou inexistentes', () => {
      it('quando position é string vazia', () => {
        const elements = { hasMainTitle: true };
        const layout = {
          desktop: {
            text: { position: '' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });

      it('quando position é string inválida', () => {
        const elements = { hasMainTitle: true };
        const layout = {
          desktop: {
            text: { position: 'invalid-position' },
          },
        };

        expect(calculateGridRows(elements, layout)).toBe(1);
      });
    });
  });

  describe('Documentação de Comportamento', () => {
    it('documenta que top-* sempre retorna 1', () => {
      const positions = ['top-left', 'top-right', 'top-center'];
      positions.forEach((pos) => {
        const result = calculateGridRows(
          { hasMainTitle: true },
          { desktop: { text: { position: pos } } }
        );
        expect(result).toBe(1);
      });
    });

    it('documenta que middle-* sempre retorna 2', () => {
      const positions = ['middle-left', 'middle-right'];
      positions.forEach((pos) => {
        const result = calculateGridRows(
          { hasMainTitle: true },
          { desktop: { text: { position: pos } } }
        );
        expect(result).toBe(2);
      });
    });

    it('documenta que bottom-* sempre retorna 2', () => {
      const positions = ['bottom-left', 'bottom-right', 'bottom-center'];
      positions.forEach((pos) => {
        const result = calculateGridRows(
          { hasCards: true },
          { desktop: { cards: { position: pos } } }
        );
        expect(result).toBe(2);
      });
    });

    it('documenta que center sempre retorna 2', () => {
      const result = calculateGridRows(
        { hasMainTitle: true },
        { desktop: { text: { position: 'center' } } }
      );
      expect(result).toBe(2);
    });
  });
});
