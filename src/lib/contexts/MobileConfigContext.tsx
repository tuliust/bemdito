/**
 * MobileConfigContext
 * -------------------
 * Provides mobile configuration loaded from the KV store (server)
 * to all public-facing components (Header, Footer, SectionRenderer, CardRenderer).
 *
 * Usage:
 *   import { useMobileConfig } from '@/lib/contexts/MobileConfigContext';
 *   const { header, footer, global, getSectionOverride, cards } = useMobileConfig();
 */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// ═══════════════════════════════════════════════════════════════
// Types (mirror the admin page types)
// ═══════════════════════════════════════════════════════════════

export interface MobileGlobalConfig {
  fontScaleTitle: number;
  fontScaleBody: number;
  spacingScale: number;
  containerPadding: string;
  maxWidth: string;
  gridInvert: boolean;
  hideMediaOnMobile: boolean;
}

export interface MobileHeaderConfig {
  barHeight: string;
  logoHeight: string;
  menuButtonSize: string;
  menuButtonIconSize: string;
  drawerItemFontSize: string;
  drawerItemPadding: string;
  drawerItemGap: string;
  showCtaInDrawer: boolean;
  ctaSize: string;
  ctaFullWidth: boolean;
}

export interface MobileFooterConfig {
  columnsLayout: 'stack' | 'grid-2';
  columnGap: string;
  textAlign: 'left' | 'center' | 'right';
  titleFontSize: string;
  linkFontSize: string;
  socialIconSize: string;
  copyrightFontSize: string;
  paddingX: string;
  paddingY: string;
  hideSocial: boolean;
}

export interface MobileSectionOverride {
  gridCols: number;
  textAlign: 'left' | 'center' | 'right';
  stackOrder: 'text-first' | 'media-first';
  spacingTop: string;
  spacingBottom: string;
  spacingX: string;
  titleFontSize: string;
  subtitleFontSize: string;
  hideMedia: boolean;
  hideCards: boolean;
  hideIcon: boolean;
  hideButton: boolean;
  mediaMaxHeight: string;
  cardsPerRow: number;
  cardGap: string;
  height: string;
}

export interface MobileCardsConfig {
  defaultColumns: number;
  defaultGap: string;
  cardPadding: string;
  titleFontSize: string;
  subtitleFontSize: string;
  showMedia: boolean;
  mediaHeight: string;
  borderRadius: string;
  perTemplate: Record<string, Partial<MobileCardsConfig>>;
}

// ═══════════════════════════════════════════════════════════════
// Defaults
// ═══════════════════════════════════════════════════════════════

const DEFAULT_GLOBAL: MobileGlobalConfig = {
  fontScaleTitle: 1,
  fontScaleBody: 1,
  spacingScale: 1,
  containerPadding: '16px',
  maxWidth: '100%',
  gridInvert: true,
  hideMediaOnMobile: false,
};

const DEFAULT_HEADER: MobileHeaderConfig = {
  barHeight: '80px',
  logoHeight: '56px',
  menuButtonSize: '44px',
  menuButtonIconSize: '28px',
  drawerItemFontSize: '1rem',
  drawerItemPadding: '12px 16px',
  drawerItemGap: '16px',
  showCtaInDrawer: true,
  ctaSize: 'md',
  ctaFullWidth: true,
};

const DEFAULT_FOOTER: MobileFooterConfig = {
  columnsLayout: 'stack',
  columnGap: '32px',
  textAlign: 'center',
  titleFontSize: '1rem',
  linkFontSize: '0.875rem',
  socialIconSize: '24px',
  copyrightFontSize: '0.75rem',
  paddingX: '16px',
  paddingY: '48px',
  hideSocial: false,
};

const DEFAULT_CARDS: MobileCardsConfig = {
  defaultColumns: 1,
  defaultGap: '16px',
  cardPadding: '16px',
  titleFontSize: '1rem',
  subtitleFontSize: '0.875rem',
  showMedia: true,
  mediaHeight: '200px',
  borderRadius: '1rem',
  perTemplate: {},
};

// ═══════════════════════════════════════════════════════════════
// Context
// ═══════════════════════════════════════════════════════════════

interface MobileConfigContextValue {
  global: MobileGlobalConfig;
  header: MobileHeaderConfig;
  footer: MobileFooterConfig;
  cards: MobileCardsConfig;
  sectionOverrides: Record<string, Partial<MobileSectionOverride>>;
  getSectionOverride: (sectionId: string) => MobileSectionOverride;
  getCardConfig: (templateId?: string) => MobileCardsConfig;
  isMobile: boolean;
  loaded: boolean;
}

const MobileConfigContext = createContext<MobileConfigContextValue>({
  global: DEFAULT_GLOBAL,
  header: DEFAULT_HEADER,
  footer: DEFAULT_FOOTER,
  cards: DEFAULT_CARDS,
  sectionOverrides: {},
  getSectionOverride: () => ({} as MobileSectionOverride),
  getCardConfig: () => DEFAULT_CARDS,
  isMobile: false,
  loaded: false,
});

export function useMobileConfig() {
  return useContext(MobileConfigContext);
}

// ═══════════════════════════════════════════════════════════════
// Provider
// ═══════════════════════════════════════════════════════════════

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-72da2481/mobile-config`;

export function MobileConfigProvider({ children }: { children: React.ReactNode }) {
  const [globalCfg, setGlobalCfg] = useState<MobileGlobalConfig>(DEFAULT_GLOBAL);
  const [headerCfg, setHeaderCfg] = useState<MobileHeaderConfig>(DEFAULT_HEADER);
  const [footerCfg, setFooterCfg] = useState<MobileFooterConfig>(DEFAULT_FOOTER);
  const [cardsCfg, setCardsCfg] = useState<MobileCardsConfig>(DEFAULT_CARDS);
  const [sectionOverrides, setSectionOverrides] = useState<Record<string, Partial<MobileSectionOverride>>>({});
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Load config from server once
  useEffect(() => {
    loadAllConfigs();
  }, []);

  async function loadAllConfigs() {
    try {
      const res = await fetch(API_BASE, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setGlobalCfg({ ...DEFAULT_GLOBAL, ...(d.global || {}) });
        setHeaderCfg({ ...DEFAULT_HEADER, ...(d.header || {}) });
        setFooterCfg({ ...DEFAULT_FOOTER, ...(d.footer || {}) });
        setCardsCfg({ ...DEFAULT_CARDS, ...(d.cards || {}) });
        setSectionOverrides(d.sections || {});
      }
    } catch (error) {
      console.warn('[MobileConfig] Failed to load, using defaults:', error);
    } finally {
      setLoaded(true);
    }
  }

  // Build default section override from global config
  const defaultSectionOverride: MobileSectionOverride = {
    gridCols: globalCfg.gridInvert ? 1 : 2,
    textAlign: 'center',
    stackOrder: 'text-first',
    spacingTop: '32px',
    spacingBottom: '32px',
    spacingX: globalCfg.containerPadding,
    titleFontSize: '',
    subtitleFontSize: '',
    hideMedia: globalCfg.hideMediaOnMobile,
    hideCards: false,
    hideIcon: false,
    hideButton: false,
    mediaMaxHeight: '300px',
    cardsPerRow: 1,
    cardGap: '16px',
    height: 'auto',
  };

  const getSectionOverride = (sectionId: string): MobileSectionOverride => {
    return {
      ...defaultSectionOverride,
      ...(sectionOverrides[sectionId] || {}),
    };
  };

  const getCardConfig = (templateId?: string): MobileCardsConfig => {
    if (templateId && cardsCfg.perTemplate[templateId]) {
      return { ...cardsCfg, ...cardsCfg.perTemplate[templateId] };
    }
    return cardsCfg;
  };

  // Inject mobile CSS custom properties so components can read them via var()
  useEffect(() => {
    if (!loaded) return;
    const styleId = 'mobile-config-vars';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    // Generate CSS vars that CSS media queries and components can consume
    style.textContent = `
      @media (max-width: 767px) {
        :root {
          /* Global */
          --mobile-font-scale-title: ${globalCfg.fontScaleTitle};
          --mobile-font-scale-body: ${globalCfg.fontScaleBody};
          --mobile-spacing-scale: ${globalCfg.spacingScale};
          --mobile-container-padding: ${globalCfg.containerPadding};
          --mobile-max-width: ${globalCfg.maxWidth};

          /* Header */
          --mobile-header-height: ${headerCfg.barHeight};
          --mobile-header-logo-height: ${headerCfg.logoHeight};
          --mobile-header-btn-size: ${headerCfg.menuButtonSize};
          --mobile-header-btn-icon: ${headerCfg.menuButtonIconSize};
          --mobile-drawer-font-size: ${headerCfg.drawerItemFontSize};
          --mobile-drawer-padding: ${headerCfg.drawerItemPadding};
          --mobile-drawer-gap: ${headerCfg.drawerItemGap};

          /* Footer */
          --mobile-footer-text-align: ${footerCfg.textAlign};
          --mobile-footer-title-fs: ${footerCfg.titleFontSize};
          --mobile-footer-link-fs: ${footerCfg.linkFontSize};
          --mobile-footer-copyright-fs: ${footerCfg.copyrightFontSize};
          --mobile-footer-social-size: ${footerCfg.socialIconSize};
          --mobile-footer-px: ${footerCfg.paddingX};
          --mobile-footer-py: ${footerCfg.paddingY};
          --mobile-footer-col-gap: ${footerCfg.columnGap};

          /* Cards */
          --mobile-card-columns: ${cardsCfg.defaultColumns};
          --mobile-card-gap: ${cardsCfg.defaultGap};
          --mobile-card-padding: ${cardsCfg.cardPadding};
          --mobile-card-title-fs: ${cardsCfg.titleFontSize};
          --mobile-card-subtitle-fs: ${cardsCfg.subtitleFontSize};
          --mobile-card-media-height: ${cardsCfg.mediaHeight};
          --mobile-card-radius: ${cardsCfg.borderRadius};
        }
      }
    `;

    return () => {
      style?.remove();
    };
  }, [loaded, globalCfg, headerCfg, footerCfg, cardsCfg]);

  const value: MobileConfigContextValue = {
    global: globalCfg,
    header: headerCfg,
    footer: footerCfg,
    cards: cardsCfg,
    sectionOverrides,
    getSectionOverride,
    getCardConfig,
    isMobile,
    loaded,
  };

  return (
    <MobileConfigContext.Provider value={value}>
      {children}
    </MobileConfigContext.Provider>
  );
}
