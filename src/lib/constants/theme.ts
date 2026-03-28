/**
 * Constantes de Tema - BemDito CMS
 * 
 * Este arquivo centraliza todas as cores e valores de tema usados no admin.
 * NUNCA use cores hardcoded diretamente nos componentes.
 * 
 * Para cores do site público, use sempre design_tokens do banco de dados.
 */

// =====================================================
// CORES PRINCIPAIS DO ADMIN
// =====================================================

export const ADMIN_COLORS = {
  // Cor primária (rosa/pink)
  primary: {
    DEFAULT: '#ea526e',
    hover: '#d94860',
    light: 'rgb(254, 242, 242)', // pink-50 equivalent
    border: '#ea526e',
  },
  
  // Cores secundárias
  secondary: {
    DEFAULT: '#2e2240',
    hover: '#241b33',
  },
  
  // Cores neutras
  neutral: {
    background: '#f6f6f6',
    white: '#ffffff',
    black: '#000000',
  },
  
  // Cores de feedback
  feedback: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
} as const;

// =====================================================
// CLASSES TAILWIND PRÉ-DEFINIDAS
// =====================================================

/**
 * Classes Tailwind para estados de seleção/ativo
 * Use estas classes em vez de escrever as cores diretamente
 */
export const ADMIN_CLASSES = {
  // Botão primário
  button: {
    primary: 'bg-[#ea526e] text-white hover:bg-[#d94860] transition-colors',
    secondary: 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  },
  
  // Card/Item selecionado
  selected: {
    border: 'border-[#ea526e]',
    background: 'bg-pink-50',
    text: 'text-[#ea526e]',
    full: 'border-[#ea526e] bg-pink-50', // border + background
  },
  
  // Card/Item não selecionado
  unselected: {
    border: 'border-gray-200',
    background: 'bg-white',
    hover: 'hover:border-gray-300 hover:bg-gray-50',
    full: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
  },
  
  // Estados de drag & drop
  dragActive: 'border-[#ea526e] bg-pink-50',
  dragInactive: 'border-gray-300 hover:border-[#ea526e] hover:bg-gray-50',
  
  // Loading/spinner
  spinner: 'text-[#ea526e]',
  
  // Badge/tag
  badge: {
    primary: 'bg-[#ea526e] text-white',
    secondary: 'bg-gray-200 text-gray-700',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  },
} as const;

// =====================================================
// UTILITÁRIOS
// =====================================================

/**
 * Retorna classes Tailwind para um item selecionável
 * @param isSelected - Se o item está selecionado
 * @returns String de classes Tailwind
 */
export function getSelectableClasses(isSelected: boolean): string {
  return isSelected 
    ? ADMIN_CLASSES.selected.full
    : ADMIN_CLASSES.unselected.full;
}

/**
 * Retorna classes Tailwind para um botão primário
 * @param variant - Variante do botão (primary, secondary, ghost, danger)
 * @returns String de classes Tailwind
 */
export function getButtonClasses(variant: keyof typeof ADMIN_CLASSES.button = 'primary'): string {
  return ADMIN_CLASSES.button[variant];
}

/**
 * Retorna classes Tailwind para um badge
 * @param variant - Variante do badge
 * @returns String de classes Tailwind
 */
export function getBadgeClasses(variant: keyof typeof ADMIN_CLASSES.badge = 'primary'): string {
  return ADMIN_CLASSES.badge[variant];
}

// =====================================================
// DESIGN TOKENS DO BANCO
// =====================================================

/**
 * IMPORTANTE: Este arquivo contém apenas cores hardcoded para o ADMIN.
 * 
 * Para cores do site público, SEMPRE use design_tokens do banco de dados:
 * 
 * ```typescript
 * import { useDesignTokens } from '@/lib/hooks/useDesignTokens';
 * 
 * const { tokens } = useDesignTokens();
 * const primaryColor = tokens.find(t => t.name === 'primary' && t.category === 'color');
 * ```
 * 
 * Categorias de tokens disponíveis no banco:
 * - color: Cores do site (primary, secondary, background, accent, muted, dark)
 * - typography: Escalas tipográficas (main-title, subtitle, body-text, etc.)
 * - spacing: Espaçamentos (xs, sm, md, lg, xl, 2xl)
 * - radius: Border radius (sm, md, lg)
 * - transition: Durações de transição (fast, normal, slow)
 */

// =====================================================
// BREAKPOINTS RESPONSIVOS
// =====================================================

export const BREAKPOINTS = {
  mobile: '< 768px',
  tablet: '768px - 1024px',
  desktop: '> 1024px',
  
  // Valores numéricos para uso em JS
  values: {
    mobile: 768,
    tablet: 1024,
  },
} as const;

// =====================================================
// TAMANHOS PADRÃO
// =====================================================

export const SIZES = {
  // Larguras de preview
  preview: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1440px',
  },
  
  // Alturas de preview
  previewHeight: {
    mobile: '667px',
    tablet: '1024px',
    desktop: '900px',
  },
  
  // Sidebar admin
  sidebar: {
    width: '256px',
    collapsedWidth: '64px',
  },
  
  // Modal
  modal: {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  },
} as const;

// =====================================================
// ANIMAÇÕES
// =====================================================

export const ANIMATIONS = {
  // Durações (em ms)
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Easings
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// =====================================================
// VALORES PADRÃO
// =====================================================

export const DEFAULTS = {
  // Border radius padrão para modais
  modalRadius: '2xl',
  
  // Padding padrão
  padding: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
  
  // Gap padrão
  gap: {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  },
} as const;

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default {
  colors: ADMIN_COLORS,
  classes: ADMIN_CLASSES,
  breakpoints: BREAKPOINTS,
  sizes: SIZES,
  animations: ANIMATIONS,
  defaults: DEFAULTS,
  
  // Utilitários
  getSelectableClasses,
  getButtonClasses,
  getBadgeClasses,
} as const;
