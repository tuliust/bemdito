/**
 * Fixtures de dados para testes
 *
 * Contém dados de exemplo alinhados ao Schema V2.0 (2026-02-19).
 *
 * Regras aplicadas:
 *  - layout.desktop.text / .media / .cards são STRINGS DIRETAS (não objetos)
 *  - gridRows e gridCols ficam em CONFIG, não em layout
 *  - page_sections usa order_index (não "order")
 */

import type { Section, PageSection } from '../../types/database';

export const mockSection: Section = {
  id: 'section-123',
  name: 'Hero Section',
  type: 'unico',
  config: {
    gridCols: 2,         // ✅ Em config (não em layout)
    gridRows: 1,         // ✅ Em config (não em layout)
    title:    'Bem-vindo ao BemDito',
    subtitle: 'Criamos soluções incríveis',
    smallTitle: 'NOVIDADE',
    ctaButton: {
      label: 'Saiba Mais',
      url:   '/sobre',
    },
    titleColor:    'token-uuid-dark',
    titleFontSize: 'token-uuid-heading-1',
  },
  elements: {
    hasIcon:       false,
    hasMinorTitle: true,
    hasMainTitle:  true,
    hasSubtitle:   true,
    hasButton:     true,
    hasMedia:      true,
    hasCards:      false,
    hasContainer:  false,
    mediaType:     'image',
  },
  layout: {
    desktop: {
      text:  'top-left',   // ✅ String direta (NÃO objeto { position: 'top-left' })
      media: 'top-right',  // ✅ String direta
    },
    mobile: {
      stack:     'vertical',
      textAlign: 'center',
    },
  },
  styling: {
    height: 'auto',
    spacing: {
      top:    '50px',
      bottom: '50px',
      left:   '50px',
      right:  '50px',
      gap:    '50px',
    },
  },
  global:     true,
  published:  true,
  created_at: '2026-02-13T00:00:00.000Z',
  updated_at: '2026-02-13T00:00:00.000Z',
};

export const mockPageSection: PageSection = {
  id:          'ps-123',
  page_id:     'page-123',
  section_id:  'section-123',
  order_index: 1,       // ✅ "order_index" (NÃO "order")
  config:      {},      // Vazio — config completo está em sections.config
  section:     mockSection,
};

/**
 * Seção com grid 2×2 e 3 elementos (texto + mídia + cards)
 * Similar à seção "Monte seu Projeto" real (e735eafe)
 */
export const mockSection2x2WithCards: Section = {
  id:   'section-456',
  name: 'Monte seu Projeto (mock)',
  type: 'unico',
  config: {
    gridCols: 2,
    gridRows: 2,
    title:   'Monte seu Projeto',
    cardTemplateId: 'template-uuid-123',
    rowGap: '100px',
  },
  elements: {
    hasIcon:       false,
    hasMinorTitle: false,
    hasMainTitle:  true,
    hasSubtitle:   true,
    hasButton:     true,
    hasMedia:      true,
    hasCards:      true,
    hasContainer:  false,
    cardCount:     3,
    mediaType:     'image',
  },
  layout: {
    desktop: {
      text:  'top-left',
      media: 'top-right',
      cards: 'bottom-center',
    },
  },
  styling: {
    height: 'auto',
    spacing: {
      top:    '50px',
      bottom: '50px',
      left:   '50px',
      right:  '50px',
      gap:    '50px',
      rowGap: '100px',
    },
  },
  global:    true,
  published: true,
  created_at: '2026-02-17T00:00:00.000Z',
  updated_at: '2026-02-17T00:00:00.000Z',
};

/**
 * Seção com mídia alinhada (modo "alinhada")
 * Similar à seção "Prazer, somos a BemDito!" real (667ab5d5)
 */
export const mockSectionWithAlignedMedia: Section = {
  id:   'section-667',
  name: 'Prazer, somos a BemDito! (mock)',
  type: 'unico',
  config: {
    gridCols: 2,
    gridRows: 2,
    title:   'Prazer, somos a BemDito!',
    media: {
      fitMode: 'alinhada',
      alignX:  'right',
      alignY:  'bottom',
    },
  },
  elements: {
    hasIcon:       false,
    hasMinorTitle: false,
    hasMainTitle:  true,
    hasSubtitle:   true,
    hasButton:     true,
    hasMedia:      true,
    hasCards:      false,
    hasContainer:  false,
    mediaType:     'image',
  },
  layout: {
    desktop: {
      text:  'middle-left',
      media: 'middle-right',
    },
  },
  styling: {
    height: '50vh',
    spacing: {
      top:    '0px',
      bottom: '0px',
      left:   '50px',
      right:  '0px',
      gap:    '50px',
    },
  },
  global:    true,
  published: true,
  created_at: '2026-02-14T00:00:00.000Z',
  updated_at: '2026-02-18T00:00:00.000Z',
};
