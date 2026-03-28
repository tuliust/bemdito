import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../../../lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────
type DesignToken = {
  id: string;
  category: string;
  name: string;
  value: Record<string, any>;
  label: string;
  order: number;
};

// ─── Definição dos grupos de tokens unificados (cor) ─────────────────────────
// Esses grupos organizam os tokens da categoria 'color' na UI.
export const UNIFIED_COLOR_GROUPS: { key: string; title: string; subtitle: string; tokens: string[] }[] = [
  {
    key: 'brand',
    title: 'Marca',
    subtitle: 'Cores principais da identidade visual BemDito.',
    tokens: ['brand-primary', 'brand-pink', 'brand-orange'],
  },
  {
    key: 'text',
    title: 'Texto',
    subtitle: 'Cores para tipografia em diferentes contextos.',
    tokens: [
      'text-primary', 'text-secondary', 'text-muted', 'text-disabled',
      'text-inverse', 'text-on-dark', 'text-on-light',
    ],
  },
  {
    key: 'bg',
    title: 'Fundos',
    subtitle: 'Cores de fundo para superfícies e containers.',
    tokens: ['bg-base', 'bg-surface', 'bg-subtle', 'bg-disabled'],
  },
  {
    key: 'border',
    title: 'Bordas',
    subtitle: 'Cores para bordas e divisores.',
    tokens: ['border-soft', 'border-default', 'border-strong', 'border-focus'],
  },
  {
    key: 'state',
    title: 'Estados',
    subtitle: 'Cores para hover, seleção e foco.',
    tokens: [
      'state-hover-neutral', 'state-hover-brand-subtle',
      'state-selected-bg', 'state-selected-border', 'state-focus-ring',
    ],
  },
  {
    key: 'semantic',
    title: 'Semântica',
    subtitle: 'Cores para feedback (sucesso, alerta, erro, informação).',
    tokens: [
      'semantic-success-base', 'semantic-success-bg', 'semantic-success-border', 'semantic-success-text',
      'semantic-warning-base', 'semantic-warning-bg', 'semantic-warning-border', 'semantic-warning-text',
      'semantic-error-base', 'semantic-error-bg', 'semantic-error-border', 'semantic-error-text',
      'semantic-info-base', 'semantic-info-bg', 'semantic-info-border', 'semantic-info-text',
    ],
  },
  {
    key: 'button',
    title: 'Botões',
    subtitle: 'Cores específicas para componentes de botão.',
    tokens: [
      'button-primary-bg', 'button-primary-text', 'button-primary-hover',
      'button-ghost-border', 'button-ghost-hover',
    ],
  },
  {
    key: 'input',
    title: 'Inputs',
    subtitle: 'Cores específicas para campos de formulário.',
    tokens: [
      'input-bg', 'input-text', 'input-placeholder', 'input-border', 'input-border-focus',
    ],
  },
];

// ─── Mapeamento: token unificado → CSS var Tailwind/theme.css ─────────────────
const TAILWIND_MAP: Record<string, string> = {
  'brand-pink':             '--primary',
  'brand-primary':          '--secondary',
  'brand-orange':           '--accent',
  'bg-base':                '--background',
  'text-primary':           '--foreground',
  'border-default':         '--border',
  'bg-surface':             '--card',
  'text-muted':             '--muted-foreground',
  'semantic-error-base':    '--destructive',
  'bg-disabled':            '--input-background',
  'text-inverse':           '--primary-foreground',
  'text-on-light':          '--accent-foreground',
};

// ─── Mapeamento: token unificado → admin CSS vars (backward compat) ──────────
// Cada token gera --{name}: #hex diretamente.
// Adicionalmente, os aliases abaixo geram --admin-{alias}: var(--{token}).
const ADMIN_ALIAS_MAP: Record<string, string[]> = {
  // Fundos brancos
  'bg-surface': [
    'card-bg', 'modal-bg', 'list-item-bg',
    'btn-action-bg', 'btn-cancel-bg',
    'tab-active-bg', 'field-bg', 'dropdown-bg',
  ],
  'text-inverse': [
    'btn-primary-text', 'sidebar-active-text',
  ],
  // Fundos claros
  'bg-base': [
    'page-bg', 'collapsible-bg', 'editor-preview-bg',
    'modal-footer-bg', 'upload-empty-bg',
  ],
  'state-hover-neutral': [
    'btn-action-hover-bg', 'collapsible-hover-bg',
    'dropdown-item-hover-bg', 'dropdown-trigger-hover-bg',
  ],
  'bg-disabled': [
    'tab-list-bg', 'editor-preview-border',
  ],
  // Bordas
  'border-default': [
    'card-border', 'collapsible-border', 'list-item-border',
    'modal-footer-border', 'modal-border', 'btn-cancel-border',
    'btn-action-border', 'field-border', 'dropdown-border',
  ],
  'border-strong': [
    'list-item-hover-border', 'sub-nav-separator',
  ],
  // Texto
  'text-disabled': [
    'field-placeholder',
  ],
  'text-muted': [
    'sub-nav-back-text', 'action-menu-icon',
    'icon-action', 'upload-x-icon',
  ],
  'text-secondary': [
    'btn-cancel-text', 'btn-action-text',
  ],
  'text-primary': [
    'btn-action-hover-text', 'sub-nav-back-hover',
    'tab-active-text', 'upload-x-bg', 'field-text',
  ],
  // Marca
  'brand-pink': [
    'sidebar-active', 'tab-border',
  ],
  'brand-primary': [
    'sidebar-bg',
  ],
  // Botões
  'button-primary-bg': [
    'btn-primary-bg',
  ],
  'button-primary-hover': [
    'btn-primary-hover-bg',
  ],
  'button-primary-text': [],
  'button-ghost-border': [],
  'button-ghost-hover': [
    'btn-reorder-hover',
  ],
  // Inputs
  'input-bg': [],
  'input-text': [],
  'input-placeholder': [],
  'input-border': [],
  'input-border-focus': [],
  // Semânticos → delete buttons
  'semantic-error-base': [
    'delete-btn-text',
  ],
  'semantic-error-text': [
    'delete-btn-hover-text',
  ],
  'semantic-error-bg': [
    'delete-btn-hover-bg',
  ],
  'semantic-error-border': [
    'delete-btn-hover-border',
  ],
  // Estados
  'state-selected-bg': [
    'list-item-selected-bg',
  ],
  'state-selected-border': [
    'list-item-selected-border',
  ],
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface AdminThemeContextType {
  refreshTheme: () => Promise<void>;
  adminTokens: DesignToken[];
  colorTokens: DesignToken[];
  loading: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  refreshTheme: async () => {},
  adminTokens: [],
  colorTokens: [],
  loading: true,
});

export const useAdminTheme = () => useContext(AdminThemeContext);

// ─── Hex → unified var resolution ─────────────────────────────────────────────
// Admin-ui tokens have hardcoded hex colors in their `color` field.
// Instead of emitting those raw values, we resolve them to var(--unified-token)
// so they automatically follow the unified palette.
const COLOR_RESOLVE_MAP: Record<string, string> = {
  '#111827': 'var(--text-primary)',
  '#374151': 'var(--text-secondary)',
  '#4b5563': 'var(--text-secondary)',
  '#6b7280': 'var(--text-muted)',
  '#9ca3af': 'var(--text-disabled)',
  '#ffffff': 'var(--text-inverse)',
  '#ea526e': 'var(--brand-pink)',
  '#2e2240': 'var(--brand-primary)',
  '#ed9331': 'var(--brand-orange)',
  '#d1d5db': 'var(--border-strong)',
  '#e5e7eb': 'var(--border-default)',
  '#dc2626': 'var(--semantic-error-base)',
  '#b91c1c': 'var(--semantic-error-text)',
  '#f6f6f6': 'var(--bg-base)',
  '#f3f4f6': 'var(--state-hover-neutral)',
  '#f9fafb': 'var(--bg-base)',
};

export function resolveColor(hex: string): string {
  return COLOR_RESOLVE_MAP[hex.toLowerCase()] || hex;
}

// ─── CSS Builder ──────────────────────────────────────────────────────────────
function buildCSS(colorTokens: DesignToken[], adminTokens: DesignToken[]): string {
  const lines: string[] = [];
  const colorMap = new Map<string, string>(); // name → hex for alias resolution

  // 1. Generate CSS vars for unified color tokens: --{name}: #hex
  for (const token of colorTokens) {
    const hex = token.value?.hex;
    if (!hex) continue;
    const varName = `--${token.name}`;
    lines.push(`  ${varName}: ${hex};`);
    colorMap.set(token.name, hex);

    // 1a. Tailwind/theme.css mapping
    const tailwindVar = TAILWIND_MAP[token.name];
    if (tailwindVar) {
      lines.push(`  ${tailwindVar}: ${hex};`);
    }

    // 1b. Admin backward-compat aliases: --admin-{alias}: var(--{token-name})
    const aliases = ADMIN_ALIAS_MAP[token.name];
    if (aliases) {
      for (const alias of aliases) {
        lines.push(`  --admin-${alias}: var(${varName});`);
      }
    }
  }

  // 2. Generate CSS vars for admin-ui tokens (typography, value, icon)
  for (const token of adminTokens) {
    const v = token.value;
    const base = `--admin-${token.name}`;

    if (v.hex) {
      // Pure color token still in admin-ui category
      lines.push(`  ${base}: ${v.hex};`);
    } else if (v.value !== undefined && v.size === undefined) {
      // Value token (border-radius, rgba, etc.)
      lines.push(`  ${base}: ${v.value};`);
    } else {
      // Typography or icon token
      if (v.size   !== undefined) lines.push(`  ${base}-size: ${v.size};`);
      if (v.weight !== undefined) lines.push(`  ${base}-weight: ${v.weight};`);
      if (v.color  !== undefined) lines.push(`  ${base}-color: ${resolveColor(v.color)};`);
      if (v.mono   !== undefined)
        lines.push(`  ${base}-font: ${v.mono ? 'ui-monospace, monospace' : 'inherit'};`);
    }
  }

  return `:root {\n${lines.join('\n')}\n}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const styleRef   = useRef<HTMLStyleElement | null>(null);
  const [adminTokens, setAdminTokens] = useState<DesignToken[]>([]);
  const [colorTokens, setColorTokens] = useState<DesignToken[]>([]);
  const [loading, setLoading]         = useState(true);

  const injectCSS = useCallback((colors: DesignToken[], admin: DesignToken[]) => {
    const css = buildCSS(colors, admin);
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      styleRef.current.id = 'admin-theme-dynamic';
      document.head.appendChild(styleRef.current);
    }
    styleRef.current.textContent = css;
  }, []);

  const refreshTheme = useCallback(async () => {
    const [colorsRes, adminRes] = await Promise.all([
      supabase.from('design_tokens').select('*').eq('category', 'color').order('order'),
      supabase.from('design_tokens').select('*').eq('category', 'admin-ui').order('order'),
    ]);

    const colors = (colorsRes.data || []) as DesignToken[];
    const admin  = (adminRes.data  || []) as DesignToken[];

    setColorTokens(colors);
    setAdminTokens(admin);
    injectCSS(colors, admin);
  }, [injectCSS]);

  useEffect(() => {
    (async () => {
      await refreshTheme();
      setLoading(false);
    })();

    return () => {
      styleRef.current?.remove();
      styleRef.current = null;
    };
  }, []);

  return (
    <AdminThemeContext.Provider value={{ refreshTheme, adminTokens, colorTokens, loading }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

// ─── Helpers exportados ───────────────────────────────────────────────────────

/** Retorna o CSS var gerado para um token admin-ui */
export function adminVar(tokenName: string, prop: 'size' | 'weight' | 'color' | 'font' | ''): string {
  if (prop === '') return `var(--admin-${tokenName})`;
  return `var(--admin-${tokenName}-${prop})`;
}

/** Helper para tokens unificados de cor: var(--brand-primary), var(--text-muted), etc. */
export function colorVar(tokenName: string): string {
  return `var(--${tokenName})`;
}

// Legacy export for backward compatibility
export const COLOR_CSS_VAR_MAP = TAILWIND_MAP;