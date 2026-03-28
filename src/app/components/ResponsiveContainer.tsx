/**
 * ResponsiveContainer Component
 * 
 * Container responsivo que aplica spacing e padding dinâmicos do banco de dados.
 * 
 * CARACTERÍSTICAS:
 * - Padding responsivo usando design tokens
 * - Max-width configurável
 * - Centralização automática
 * - Suporte a todas as tags HTML
 * 
 * USO:
 * ```tsx
 * <ResponsiveContainer padding="lg" maxWidth="container">
 *   <h1>Conteúdo aqui</h1>
 * </ResponsiveContainer>
 * 
 * // Com tokens específicos
 * <ResponsiveContainer 
 *   paddingTop="xl" 
 *   paddingBottom="md"
 *   maxWidth="narrow"
 * >
 *   <p>Texto</p>
 * </ResponsiveContainer>
 * ```
 */

import { ReactNode, ElementType, CSSProperties } from 'react';
import { useDesignSystem } from '../../lib/contexts/DesignSystemContext';

type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type MaxWidth = 
  | 'full'      // 100%
  | 'container' // 1280px (padrão container)
  | 'narrow'    // 768px (artigos, formulários)
  | 'wide'      // 1440px (hero sections)
  | 'screen';   // 100vw

interface ResponsiveContainerProps {
  /**
   * Elemento HTML a ser renderizado
   * @default 'div'
   */
  as?: ElementType;
  
  /**
   * Padding uniforme (todos os lados)
   */
  padding?: SpacingToken;
  
  /**
   * Padding específico por lado
   */
  paddingTop?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingLeft?: SpacingToken;
  paddingRight?: SpacingToken;
  
  /**
   * Padding horizontal (left + right)
   */
  paddingX?: SpacingToken;
  
  /**
   * Padding vertical (top + bottom)
   */
  paddingY?: SpacingToken;
  
  /**
   * Largura máxima do container
   * @default 'container'
   */
  maxWidth?: MaxWidth;
  
  /**
   * Centralizar horizontalmente
   * @default true
   */
  center?: boolean;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Estilos inline adicionais
   */
  style?: CSSProperties;
  
  /**
   * Conteúdo do container
   */
  children: ReactNode;
  
  /**
   * ID do elemento
   */
  id?: string;
}

/**
 * Mapeia tokens de spacing para valores CSS
 */
const MAX_WIDTH_MAP: Record<MaxWidth, string> = {
  full: '100%',
  container: '1280px',
  narrow: '768px',
  wide: '1440px',
  screen: '100vw',
};

export function ResponsiveContainer({
  as: Component = 'div',
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingX,
  paddingY,
  maxWidth = 'container',
  center = true,
  className = '',
  style = {},
  children,
  id,
}: ResponsiveContainerProps) {
  const { getSpacing } = useDesignSystem();

  // Calcular padding final (ordem de prioridade: específico > X/Y > geral)
  const finalPaddingTop = paddingTop || paddingY || padding;
  const finalPaddingBottom = paddingBottom || paddingY || padding;
  const finalPaddingLeft = paddingLeft || paddingX || padding;
  const finalPaddingRight = paddingRight || paddingX || padding;

  // Construir estilos
  const containerStyle: CSSProperties = {
    maxWidth: MAX_WIDTH_MAP[maxWidth],
    marginLeft: center ? 'auto' : undefined,
    marginRight: center ? 'auto' : undefined,
    paddingTop: finalPaddingTop ? getSpacing(finalPaddingTop) : undefined,
    paddingBottom: finalPaddingBottom ? getSpacing(finalPaddingBottom) : undefined,
    paddingLeft: finalPaddingLeft ? getSpacing(finalPaddingLeft) : undefined,
    paddingRight: finalPaddingRight ? getSpacing(finalPaddingRight) : undefined,
    ...style,
  };

  return (
    <Component id={id} className={className} style={containerStyle}>
      {children}
    </Component>
  );
}

// =====================================================
// PRESET CONTAINERS
// =====================================================

/**
 * Container padrão de página (max-width: 1280px, padding horizontal médio)
 */
export function PageContainer({ children, ...props }: Omit<ResponsiveContainerProps, 'maxWidth' | 'paddingX'>) {
  return (
    <ResponsiveContainer maxWidth="container" paddingX="md" {...props}>
      {children}
    </ResponsiveContainer>
  );
}

/**
 * Container estreito para artigos e formulários (max-width: 768px)
 */
export function NarrowContainer({ children, ...props }: Omit<ResponsiveContainerProps, 'maxWidth'>) {
  return (
    <ResponsiveContainer maxWidth="narrow" {...props}>
      {children}
    </ResponsiveContainer>
  );
}

/**
 * Container largo para hero sections (max-width: 1440px)
 */
export function WideContainer({ children, ...props }: Omit<ResponsiveContainerProps, 'maxWidth'>) {
  return (
    <ResponsiveContainer maxWidth="wide" {...props}>
      {children}
    </ResponsiveContainer>
  );
}

/**
 * Section com padding vertical padrão (top: xl, bottom: xl)
 */
export function SectionContainer({ children, ...props }: Omit<ResponsiveContainerProps, 'paddingY'>) {
  return (
    <ResponsiveContainer paddingY="xl" {...props}>
      {children}
    </ResponsiveContainer>
  );
}

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default ResponsiveContainer;
