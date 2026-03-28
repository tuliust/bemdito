/**
 * Design System Context
 * 
 * Context global que fornece todos os design tokens e utilidades
 * para aplicar o design system em qualquer componente.
 * 
 * USO:
 * ```tsx
 * import { useDesignSystem } from '@/lib/contexts/DesignSystemContext';
 * 
 * function MyComponent() {
 *   const { getColor, getTypography } = useDesignSystem();
 *   const primaryColor = getColor('primary');
 *   
 *   return <div style={{ color: primaryColor }}>Hello</div>;
 * }
 * ```
 */

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface DesignToken {
  id: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'transition';
  name: string;
  value: string | any; // JSON string OR parsed object (Supabase returns parsed objects for jsonb)
  label: string;
  created_at?: string;
  updated_at?: string;
}

export interface ColorToken extends DesignToken {
  category: 'color';
}

export interface TypographyToken extends DesignToken {
  category: 'typography';
}

export interface SpacingToken extends DesignToken {
  category: 'spacing';
}

export interface RadiusToken extends DesignToken {
  category: 'radius';
}

export interface TransitionToken extends DesignToken {
  category: 'transition';
}

export interface TypographyStyle {
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: string;
  lineHeight?: string | number;
}

export interface Breakpoints {
  mobile: { max: number };
  tablet: { min: number; max: number };
  desktop: { min: number };
}

// =====================================================
// CONTEXT VALUE INTERFACE
// =====================================================

export interface DesignSystemContextValue {
  // Tokens agrupados por categoria
  colors: ColorToken[];
  typography: TypographyToken[];
  spacing: SpacingToken[];
  radius: RadiusToken[];
  transitions: TransitionToken[];
  
  // Todos os tokens (útil para iteração)
  allTokens: DesignToken[];
  
  // Estado de carregamento
  isLoading: boolean;
  error: Error | null;
  
  // Utilidades de busca
  getColor: (name: string) => string | null;
  getTypography: (name: string) => TypographyStyle | null;
  getSpacing: (name: string) => string | null;
  getRadius: (name: string) => string | null;
  getTransition: (name: string) => string | null;
  
  // Utilidades de aplicação
  applyColor: (name: string) => React.CSSProperties;
  applyTypography: (name: string) => React.CSSProperties;
  applySpacing: (name: string) => React.CSSProperties;
  applyRadius: (name: string) => React.CSSProperties;
  
  // Breakpoints e responsividade
  breakpoints: Breakpoints;
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Refresh
  refresh: () => Promise<void>;
}

// =====================================================
// DEFAULT BREAKPOINTS
// =====================================================

const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: { max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024 },
};

// =====================================================
// CONTEXT
// =====================================================

const DesignSystemContext = createContext<DesignSystemContextValue | null>(null);

// =====================================================
// HOOK
// =====================================================

export function useDesignSystem(): DesignSystemContextValue {
  const context = useContext(DesignSystemContext);
  
  if (!context) {
    throw new Error('useDesignSystem must be used within DesignSystemProvider');
  }
  
  return context;
}

// =====================================================
// PROVIDER PROPS
// =====================================================

interface DesignSystemProviderProps {
  children: ReactNode;
  /**
   * Custom breakpoints (opcional)
   * Se não fornecido, usa breakpoints padrão
   */
  breakpoints?: Breakpoints;
}

// =====================================================
// PROVIDER
// =====================================================

export function DesignSystemProvider({ 
  children, 
  breakpoints = DEFAULT_BREAKPOINTS,
}: DesignSystemProviderProps) {
  // Estado
  const [allTokens, setAllTokens] = useState<DesignToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  // Fetch tokens do banco
  const fetchTokens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('design_tokens')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) {
        console.error('❌ [DesignSystemContext] Supabase error:', error);
        throw new Error(`Failed to fetch design tokens: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.warn('⚠️ [DesignSystemContext] No design tokens found in database. Check RLS policies or run migrations.');
      }
      
      setAllTokens(data || []);
      
      // Cache no localStorage
      if (data && data.length > 0) {
        localStorage.setItem('design_tokens', JSON.stringify(data));
        localStorage.setItem('design_tokens_timestamp', Date.now().toString());
      }
    } catch (err) {
      console.error('❌ [DesignSystemContext] Error fetching design tokens:', err);
      setError(err as Error);
      
      // Tentar carregar do cache
      const cached = localStorage.getItem('design_tokens');
      if (cached) {
        setAllTokens(JSON.parse(cached));
      } else {
        console.warn('⚠️ [DesignSystemContext] No cached tokens available. Components will use hardcoded fallbacks.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Carregar tokens no mount
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);
  
  // Detectar breakpoint atual
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= breakpoints.mobile.max) {
        setCurrentBreakpoint('mobile');
      } else if (width >= breakpoints.tablet.min && width <= breakpoints.tablet.max) {
        setCurrentBreakpoint('tablet');
      } else {
        setCurrentBreakpoint('desktop');
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);
  
  // Tokens agrupados por categoria (memoizados)
  const colors = useMemo(
    () => allTokens.filter((t) => t.category === 'color') as ColorToken[],
    [allTokens]
  );
  
  const typography = useMemo(
    () => allTokens.filter((t) => t.category === 'typography') as TypographyToken[],
    [allTokens]
  );
  
  const spacing = useMemo(
    () => allTokens.filter((t) => t.category === 'spacing') as SpacingToken[],
    [allTokens]
  );
  
  const radius = useMemo(
    () => allTokens.filter((t) => t.category === 'radius') as RadiusToken[],
    [allTokens]
  );
  
  const transitions = useMemo(
    () => allTokens.filter((t) => t.category === 'transition') as TransitionToken[],
    [allTokens]
  );
  
  // Utilidades de busca (memoizadas)
  const getColor = useCallback(
    (name: string): string | null => {
      const token = colors.find((t) => t.name === name);
      if (!token) return null;
      
      try {
        const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
        // Suporta múltiplos formatos: { hex: "..." }, { color: "..." }, ou { value: "..." }
        return parsed.hex || parsed.color || parsed.value || null;
      } catch (err) {
        // Token value inválido - retorna null silenciosamente
        return null;
      }
    },
    [colors]
  );
  
  const getTypography = useCallback(
    (name: string): TypographyStyle | null => {
      const token = typography.find((t) => t.name === name);
      
      // Se não encontrar o token solicitado, usar fallback (primeiro da lista)
      if (!token) {
        if (typography.length > 0) {
          const fallbackToken = typography[0];
          
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[DesignSystemContext] Typography token "${name}" not found. Using fallback: "${fallbackToken.name}"`);
          }
          
          try {
            const parsed = typeof fallbackToken.value === 'string' 
              ? JSON.parse(fallbackToken.value) 
              : fallbackToken.value;
            
            return {
              fontFamily: parsed.fontFamily || 'Poppins, sans-serif',
              fontWeight: parsed.fontWeight || parsed.weight || 400,
              fontSize: parsed.fontSize || parsed.size || '1rem',
              lineHeight: parsed.lineHeight || '1.5',
            };
          } catch (error) {
            console.error(`[DesignSystemContext] Failed to parse fallback typography token:`, error);
            // Fallback final hardcoded
            return {
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '1rem',
              lineHeight: '1.5',
            };
          }
        }
        
        // Se não houver nenhum token, retornar fallback hardcoded
        // Fallback silencioso - isso é esperado durante carregamento inicial
        return {
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: '1.5',
        };
      }
      
      try {
        const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
        
        return {
          fontFamily: parsed.fontFamily || 'Poppins, sans-serif',
          fontWeight: parsed.fontWeight || parsed.weight || 400,
          fontSize: parsed.fontSize || parsed.size || '1rem',
          lineHeight: parsed.lineHeight || '1.5',
        };
      } catch (error) {
        console.error(`[DesignSystemContext] Failed to parse typography token "${name}":`, error);
        // Fallback em caso de erro
        return {
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 400,
          fontSize: '1rem',
          lineHeight: '1.5',
        };
      }
    },
    [typography]
  );
  
  const getSpacing = useCallback(
    (name: string): string | null => {
      const token = spacing.find((t) => t.name === name);
      if (!token) return null;
      
      try {
        const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
        return parsed.value || null;
      } catch {
        return null;
      }
    },
    [spacing]
  );
  
  const getRadius = useCallback(
    (name: string): string | null => {
      const token = radius.find((t) => t.name === name);
      if (!token) return null;
      
      try {
        const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
        return parsed.value || null;
      } catch {
        return null;
      }
    },
    [radius]
  );
  
  const getTransition = useCallback(
    (name: string): string | null => {
      const token = transitions.find((t) => t.name === name);
      if (!token) return null;
      
      try {
        const parsed = typeof token.value === 'string' ? JSON.parse(token.value) : token.value;
        return parsed.value || null;
      } catch {
        return null;
      }
    },
    [transitions]
  );
  
  // Utilidades de aplicação (memoizadas)
  const applyColor = useCallback(
    (name: string): React.CSSProperties => {
      const color = getColor(name);
      return color ? { color } : {};
    },
    [getColor]
  );
  
  const applyTypography = useCallback(
    (name: string): React.CSSProperties => {
      const style = getTypography(name);
      return style || {};
    },
    [getTypography]
  );
  
  const applySpacing = useCallback(
    (name: string): React.CSSProperties => {
      const value = getSpacing(name);
      return value ? { padding: value } : {};
    },
    [getSpacing]
  );
  
  const applyRadius = useCallback(
    (name: string): React.CSSProperties => {
      const value = getRadius(name);
      return value ? { borderRadius: value } : {};
    },
    [getRadius]
  );
  
  // Valores de contexto (memoizados)
  const value = useMemo<DesignSystemContextValue>(
    () => ({
      // Tokens
      colors,
      typography,
      spacing,
      radius,
      transitions,
      allTokens,
      
      // Estado
      isLoading,
      error,
      
      // Utilidades de busca
      getColor,
      getTypography,
      getSpacing,
      getRadius,
      getTransition,
      
      // Utilidades de aplicação
      applyColor,
      applyTypography,
      applySpacing,
      applyRadius,
      
      // Responsividade
      breakpoints,
      currentBreakpoint,
      isMobile: currentBreakpoint === 'mobile',
      isTablet: currentBreakpoint === 'tablet',
      isDesktop: currentBreakpoint === 'desktop',
      
      // Refresh
      refresh: fetchTokens,
    }),
    [
      colors,
      typography,
      spacing,
      radius,
      transitions,
      allTokens,
      isLoading,
      error,
      getColor,
      getTypography,
      getSpacing,
      getRadius,
      getTransition,
      applyColor,
      applyTypography,
      applySpacing,
      applyRadius,
      breakpoints,
      currentBreakpoint,
      fetchTokens,
    ]
  );
  
  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

// =====================================================
// EXPORT
// =====================================================

export default DesignSystemContext;