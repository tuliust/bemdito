/**
 * ResponsiveText Component
 * 
 * Um componente de texto totalmente responsivo que aplica tokens de tipografia
 * do Design System. Suporta diferentes elementos HTML e variantes de cor.
 * 
 * @example
 * ```tsx
 * <ResponsiveText tokenName="main-title" as="h1" color="primary">
 *   Título Principal
 * </ResponsiveText>
 * 
 * <ResponsiveText tokenName="body" as="p" color="secondary">
 *   Parágrafo com cor secundária
 * </ResponsiveText>
 * ```
 * 
 * @see /DESIGN_SYSTEM.md para lista completa de tokens disponíveis
 */

import { useDesignSystem } from '@/lib/contexts/DesignSystemContext';
import { combineTokenStyles, applyColorToken } from '@/lib/utils/designTokens';
import type { ReactNode, CSSProperties } from 'react';

// =====================================================
// TYPES
// =====================================================

interface ResponsiveTextProps {
  /**
   * Nome do token de tipografia a ser aplicado
   * Tokens disponíveis: 'main-title', 'minor-title', 'subtitle', 'body', 'menu', 'button', 'font-family'
   */
  tokenName: string;
  
  /**
   * Elemento HTML a ser renderizado
   * @default 'p'
   */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';
  
  /**
   * Nome do token de cor (opcional)
   * Se fornecido, aplica a cor do token
   * Exemplos: 'primary', 'secondary', 'dark', 'muted'
   */
  color?: string;
  
  /**
   * Classes CSS adicionais (Tailwind ou custom)
   */
  className?: string;
  
  /**
   * Estilos inline adicionais
   * Sobrescreve estilos do token se fornecido
   */
  style?: CSSProperties;
  
  /**
   * Conteúdo do texto
   */
  children: ReactNode;
  
  /**
   * ID do elemento (opcional)
   */
  id?: string;
  
  /**
   * Outros atributos HTML
   */
  [key: string]: any;
}

// =====================================================
// COMPONENT
// =====================================================

export function ResponsiveText({
  tokenName,
  as = 'p',
  color,
  className = '',
  style = {},
  children,
  id,
  ...rest
}: ResponsiveTextProps) {
  const { typography, colors, getTypography, getColor, isLoading } = useDesignSystem();
  
  // ✅ FALLBACK HARDCODED: Se nenhum token foi carregado, usar valores padrão
  const defaultTypographyStyle: CSSProperties = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.5',
  };
  
  // Buscar token de tipografia
  const typographyToken = typography.find((t) => t.name === tokenName);
  // Usa o token solicitado, ou fallback para 'body-base' se não encontrar
  const typographyStyle = getTypography(tokenName) || getTypography('body-base') || getTypography('body') || defaultTypographyStyle;
  
  // Buscar token de cor (se fornecido)
  let colorStyle: CSSProperties = {};
  if (color) {
    const colorToken = colors.find((c) => c.name === color);
    if (colorToken) {
      colorStyle = applyColorToken(colorToken, 'color');
    }
  }
  
  // Combinar estilos - IMPORTANTE: style sobrescreve tudo
  const combinedStyle = combineTokenStyles(
    typographyStyle || defaultTypographyStyle,
    colorStyle,
    style
  );
  
  // Elemento a renderizar
  const Component = as;
  
  // Debug logs em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    if (!typographyToken && typography.length > 0) {
      console.warn(`[ResponsiveText] Typography token "${tokenName}" not found. Available tokens:`, typography.map(t => t.name));
    } else if (typography.length === 0 && !isLoading) {
      console.warn(`[ResponsiveText] No typography tokens loaded. Using hardcoded fallback. Check RLS policies on design_tokens table.`);
    }
  }
  
  return (
    <Component
      id={id}
      className={className}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </Component>
  );
}

// =====================================================
// PRESET COMPONENTS (Atalhos)
// =====================================================

/**
 * Componente de título principal (usa token 'main-title')
 */
export function MainTitle({ children, ...props }: Omit<ResponsiveTextProps, 'tokenName' | 'as'>) {
  return (
    <ResponsiveText tokenName="main-title" as="h1" {...props}>
      {children}
    </ResponsiveText>
  );
}

/**
 * Componente de subtítulo (usa token 'subtitle')
 */
export function Subtitle({ children, ...props }: Omit<ResponsiveTextProps, 'tokenName' | 'as'>) {
  return (
    <ResponsiveText tokenName="subtitle" as="h2" {...props}>
      {children}
    </ResponsiveText>
  );
}

/**
 * Componente de texto de corpo (usa token 'body')
 */
export function BodyText({ children, ...props }: Omit<ResponsiveTextProps, 'tokenName' | 'as'>) {
  return (
    <ResponsiveText tokenName="body" as="p" {...props}>
      {children}
    </ResponsiveText>
  );
}

/**
 * Componente de heading 1 (usa token 'main-title')
 */
export function Heading1({ children, ...props }: Omit<ResponsiveTextProps, 'tokenName' | 'as'>) {
  return (
    <ResponsiveText tokenName="main-title" as="h1" {...props}>
      {children}
    </ResponsiveText>
  );
}

/**
 * Componente de heading 2 (usa token 'minor-title')
 */
export function Heading2({ children, ...props }: Omit<ResponsiveTextProps, 'tokenName' | 'as'>) {
  return (
    <ResponsiveText tokenName="minor-title" as="h2" {...props}>
      {children}
    </ResponsiveText>
  );
}

/**
 * Componente de heading 3 (usa token 'subtitle')
 */
export function Heading3({ children, ...props }: Omit<ResponsiveTextProps, 'tokenName' | 'as'>) {
  return (
    <ResponsiveText tokenName="subtitle" as="h3" {...props}>
      {children}
    </ResponsiveText>
  );
}

/**
 * Componente de texto pequeno (usa token 'menu')
 */
export function SmallText({ children, ...props }: Omit<ResponsiveTextProps, 'tokenName' | 'as'>) {
  return (
    <ResponsiveText tokenName="menu" as="span" {...props}>
      {children}
    </ResponsiveText>
  );
}

// =====================================================
// EXPORT
// =====================================================

export default ResponsiveText;