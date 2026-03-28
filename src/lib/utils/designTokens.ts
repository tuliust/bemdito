/**
 * Design Tokens Utilities
 * 
 * Funções utilitárias para trabalhar com design tokens.
 * Use estas funções para aplicar tokens de forma consistente.
 */

import type { 
  ColorToken, 
  TypographyToken, 
  SpacingToken, 
  RadiusToken,
  TransitionToken,
  TypographyStyle 
} from '@/lib/contexts/DesignSystemContext';

// =====================================================
// COLOR UTILITIES
// =====================================================

/**
 * Aplica um token de cor a uma propriedade CSS
 * @param token - Token de cor do Design System
 * @param property - Propriedade CSS a ser aplicada
 * @returns Objeto de estilos CSS
 */
export function applyColorToken(
  token: ColorToken | null,
  property: 'color' | 'backgroundColor' | 'borderColor' = 'color'
): React.CSSProperties {
  if (!token) return {};
  
  try {
    // O valor pode vir como string JSON ou objeto já parseado
    const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
    // Suporta múltiplos formatos: { hex: "..." }, { color: "..." }, ou { value: "..." }
    const colorValue = parsed.hex || parsed.color || parsed.value || null;
    
    if (!colorValue) {
      return {};
    }
    
    return { [property]: colorValue };
  } catch {
    // Token inválido - retorna vazio silenciosamente
    return {};
  }
}

/**
 * Extrai o valor hexadecimal de um token de cor
 * @param token - Token de cor
 * @returns Valor hexadecimal ou null
 */
export function getColorValue(token: ColorToken | null): string | null {
  if (!token) return null;
  
  try {
    // O valor pode vir como string JSON ou objeto já parseado
    const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
    // Suporta múltiplos formatos: { hex: "..." }, { color: "..." }, ou { value: "..." }
    return parsed.hex || parsed.color || parsed.value || null;
  } catch {
    return null;
  }
}

// =====================================================
// TYPOGRAPHY UTILITIES
// =====================================================

/**
 * Aplica um token de tipografia como estilo inline
 * @param token - Token de tipografia ou null
 * @returns Objeto de estilo CSS
 */
export function applyTypographyToken(
  token: TypographyToken | null
): React.CSSProperties {
  if (!token) return {};
  
  try {
    const parsed = JSON.parse(token.value);
    return {
      fontFamily: parsed.fontFamily,
      fontWeight: parsed.fontWeight,
      fontSize: parsed.fontSize,
      lineHeight: parsed.lineHeight,
    };
  } catch {
    console.error('Failed to parse typography token:', token);
    return {};
  }
}

/**
 * Extrai o estilo de tipografia de um token
 * @param token - Token de tipografia
 * @returns Objeto de estilo tipográfico
 */
export function getTypographyValue(token: TypographyToken | null): TypographyStyle | null {
  if (!token) return null;
  
  try {
    const parsed = JSON.parse(token.value);
    return {
      fontFamily: parsed.fontFamily,
      fontWeight: parsed.fontWeight,
      fontSize: parsed.fontSize,
      lineHeight: parsed.lineHeight,
    };
  } catch {
    return null;
  }
}

// =====================================================
// SPACING UTILITIES
// =====================================================

/**
 * Aplica um token de spacing como estilo inline
 * @param token - Token de spacing ou null
 * @param properties - Propriedades CSS onde aplicar (default: ['padding'])
 * @returns Objeto de estilo CSS
 */
export function applySpacingToken(
  token: SpacingToken | null,
  properties: ('padding' | 'margin' | 'gap' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight')[] = ['padding']
): React.CSSProperties {
  if (!token) return {};
  
  try {
    const parsed = JSON.parse(token.value);
    const value = parsed.value;
    
    const styles: React.CSSProperties = {};
    properties.forEach((prop) => {
      styles[prop] = value;
    });
    
    return styles;
  } catch {
    console.error('Failed to parse spacing token:', token);
    return {};
  }
}

/**
 * Extrai o valor de um token de spacing
 * @param token - Token de spacing
 * @returns Valor de spacing ou null
 */
export function getSpacingValue(token: SpacingToken | null): string | null {
  if (!token) return null;
  
  try {
    const parsed = JSON.parse(token.value);
    return parsed.value || null;
  } catch {
    return null;
  }
}

// =====================================================
// RADIUS UTILITIES
// =====================================================

/**
 * Aplica um token de radius como estilo inline
 * @param token - Token de radius ou null
 * @returns Objeto de estilo CSS
 */
export function applyRadiusToken(
  token: RadiusToken | null
): React.CSSProperties {
  if (!token) return {};
  
  try {
    const parsed = JSON.parse(token.value);
    return { borderRadius: parsed.value };
  } catch {
    console.error('Failed to parse radius token:', token);
    return {};
  }
}

/**
 * Extrai o valor de um token de radius
 * @param token - Token de radius
 * @returns Valor de radius ou null
 */
export function getRadiusValue(token: RadiusToken | null): string | null {
  if (!token) return null;
  
  try {
    const parsed = JSON.parse(token.value);
    return parsed.value || null;
  } catch {
    return null;
  }
}

// =====================================================
// TRANSITION UTILITIES
// =====================================================

/**
 * Aplica um token de transition como estilo inline
 * @param token - Token de transition ou null
 * @param property - Propriedade CSS a animar (default: 'all')
 * @returns Objeto de estilo CSS
 */
export function applyTransitionToken(
  token: TransitionToken | null,
  property: string = 'all'
): React.CSSProperties {
  if (!token) return {};
  
  try {
    const parsed = JSON.parse(token.value);
    return { transition: `${property} ${parsed.value} ease-in-out` };
  } catch {
    console.error('Failed to parse transition token:', token);
    return {};
  }
}

/**
 * Extrai o valor de um token de transition
 * @param token - Token de transition
 * @returns Valor de transition ou null
 */
export function getTransitionValue(token: TransitionToken | null): string | null {
  if (!token) return null;
  
  try {
    const parsed = JSON.parse(token.value);
    return parsed.value || null;
  } catch {
    return null;
  }
}

// =====================================================
// COMBINED UTILITIES
// =====================================================

/**
 * Combina múltiplos estilos de tokens
 * @param styles - Array de objetos de estilo CSS
 * @returns Objeto de estilo CSS combinado
 */
export function combineTokenStyles(...styles: React.CSSProperties[]): React.CSSProperties {
  return Object.assign({}, ...styles);
}

/**
 * Cria um estilo completo combinando múltiplos tokens
 * @param options - Opções de estilo
 * @returns Objeto de estilo CSS
 */
export function createTokenStyle(options: {
  color?: ColorToken | null;
  typography?: TypographyToken | null;
  spacing?: SpacingToken | null;
  radius?: RadiusToken | null;
  transition?: TransitionToken | null;
  backgroundColor?: ColorToken | null;
  borderColor?: ColorToken | null;
}): React.CSSProperties {
  const styles: React.CSSProperties = {};
  
  if (options.color) {
    Object.assign(styles, applyColorToken(options.color, 'color'));
  }
  
  if (options.backgroundColor) {
    Object.assign(styles, applyColorToken(options.backgroundColor, 'backgroundColor'));
  }
  
  if (options.borderColor) {
    Object.assign(styles, applyColorToken(options.borderColor, 'borderColor'));
  }
  
  if (options.typography) {
    Object.assign(styles, applyTypographyToken(options.typography));
  }
  
  if (options.spacing) {
    Object.assign(styles, applySpacingToken(options.spacing));
  }
  
  if (options.radius) {
    Object.assign(styles, applyRadiusToken(options.radius));
  }
  
  if (options.transition) {
    Object.assign(styles, applyTransitionToken(options.transition));
  }
  
  return styles;
}

// =====================================================
// RESPONSIVE UTILITIES
// =====================================================

/**
 * Gera classes Tailwind responsivas
 * @param base - Classe base
 * @param tablet - Classe para tablet (opcional)
 * @param desktop - Classe para desktop (opcional)
 * @returns String de classes combinadas
 */
export function getResponsiveClasses(
  base: string,
  tablet?: string,
  desktop?: string
): string {
  const classes = [base];
  
  if (tablet) {
    classes.push(`md:${tablet}`);
  }
  
  if (desktop) {
    classes.push(`lg:${desktop}`);
  }
  
  return classes.join(' ');
}

/**
 * Calcula valor responsivo baseado no breakpoint atual
 * @param breakpoint - Breakpoint atual
 * @param values - Valores para cada breakpoint
 * @returns Valor para o breakpoint atual
 */
export function getResponsiveValue<T>(
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  values: {
    mobile: T;
    tablet?: T;
    desktop?: T;
  }
): T {
  if (breakpoint === 'desktop' && values.desktop !== undefined) {
    return values.desktop;
  }
  
  if (breakpoint === 'tablet' && values.tablet !== undefined) {
    return values.tablet;
  }
  
  return values.mobile;
}

// =====================================================
// VALIDATION UTILITIES
// =====================================================

/**
 * Verifica se um token é válido
 * @param token - Token a validar
 * @returns true se válido, false caso contrário
 */
export function isValidToken(token: any): boolean {
  if (!token) return false;
  if (!token.id || !token.category || !token.name || !token.value) return false;
  
  try {
    JSON.parse(token.value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida e retorna um token ou fallback
 * @param token - Token a validar
 * @param fallback - Valor de fallback
 * @returns Token válido ou fallback
 */
export function validateToken<T>(token: T | null | undefined, fallback: T): T {
  return token && isValidToken(token) ? token : fallback;
}

// =====================================================
// EXPORT
// =====================================================

export default {
  // Color
  applyColorToken,
  getColorValue,
  
  // Typography
  applyTypographyToken,
  getTypographyValue,
  
  // Spacing
  applySpacingToken,
  getSpacingValue,
  
  // Radius
  applyRadiusToken,
  getRadiusValue,
  
  // Transition
  applyTransitionToken,
  getTransitionValue,
  
  // Combined
  combineTokenStyles,
  createTokenStyle,
  
  // Responsive
  getResponsiveClasses,
  getResponsiveValue,
  
  // Validation
  isValidToken,
  validateToken,
};