/**
 * ResponsiveSection Component
 * 
 * Wrapper de seção completo e responsivo com todos os design tokens aplicados.
 * 
 * CARACTERÍSTICAS:
 * - Background color/image do banco
 * - Padding vertical responsivo
 * - Container interno automático
 * - Suporte a overlay (para backgrounds escuros)
 * - Min-height configurável
 * 
 * USO:
 * ```tsx
 * <ResponsiveSection 
 *   backgroundColor="background"
 *   paddingY="xl"
 * >
 *   <h2>Título da Seção</h2>
 *   <p>Conteúdo aqui</p>
 * </ResponsiveSection>
 * 
 * // Hero section com imagem de fundo
 * <ResponsiveSection
 *   backgroundImage="/images/hero.jpg"
 *   overlay={0.5}
 *   minHeight="500px"
 *   textColor="white"
 * >
 *   <MainTitle>Hero Title</MainTitle>
 * </ResponsiveSection>
 * ```
 */

import { ReactNode, ElementType, CSSProperties } from 'react';
import { useDesignSystem } from '../../lib/contexts/DesignSystemContext';

type ColorToken = 'primary' | 'secondary' | 'background' | 'accent' | 'muted' | 'dark' | 'white';
type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

type ContainerWidth = 
  | 'full'      // 100% sem padding
  | 'container' // 1280px
  | 'narrow'    // 768px
  | 'wide'      // 1440px
  | 'none';     // Sem container (children controlam)

interface ResponsiveSectionProps {
  /**
   * Elemento HTML a ser renderizado
   * @default 'section'
   */
  as?: ElementType;
  
  /**
   * Cor de fundo usando design tokens
   */
  backgroundColor?: ColorToken | 'white' | 'transparent';
  
  /**
   * URL da imagem de fundo
   */
  backgroundImage?: string;
  
  /**
   * Posição do background
   * @default 'center'
   */
  backgroundPosition?: string;
  
  /**
   * Tamanho do background
   * @default 'cover'
   */
  backgroundSize?: 'cover' | 'contain' | 'auto';
  
  /**
   * Overlay escuro sobre background (0-1)
   * 0 = sem overlay, 1 = 100% opaco
   */
  overlay?: number;
  
  /**
   * Cor do overlay
   * @default 'black'
   */
  overlayColor?: 'black' | 'white' | ColorToken;
  
  /**
   * Cor do texto (para contraste com background)
   */
  textColor?: ColorToken | 'white' | 'black';
  
  /**
   * Padding vertical usando design tokens
   * @default 'xl'
   */
  paddingY?: SpacingToken;
  
  /**
   * Padding top específico
   */
  paddingTop?: SpacingToken;
  
  /**
   * Padding bottom específico
   */
  paddingBottom?: SpacingToken;
  
  /**
   * Largura do container interno
   * @default 'container'
   */
  containerWidth?: ContainerWidth;
  
  /**
   * Altura mínima da seção
   */
  minHeight?: string;
  
  /**
   * Centralizar conteúdo verticalmente
   * @default false
   */
  centerContent?: boolean;
  
  /**
   * Classes CSS adicionais para a section
   */
  className?: string;
  
  /**
   * Classes CSS adicionais para o container interno
   */
  containerClassName?: string;
  
  /**
   * Estilos inline adicionais
   */
  style?: CSSProperties;
  
  /**
   * Conteúdo da seção
   */
  children: ReactNode;
  
  /**
   * ID do elemento
   */
  id?: string;
}

/**
 * Mapeia container width para valores CSS
 */
const CONTAINER_WIDTH_MAP: Record<Exclude<ContainerWidth, 'none'>, string> = {
  full: '100%',
  container: '1280px',
  narrow: '768px',
  wide: '1440px',
};

export function ResponsiveSection({
  as: Component = 'section',
  backgroundColor,
  backgroundImage,
  backgroundPosition = 'center',
  backgroundSize = 'cover',
  overlay,
  overlayColor = 'black',
  textColor,
  paddingY = 'xl',
  paddingTop,
  paddingBottom,
  containerWidth = 'container',
  minHeight,
  centerContent = false,
  className = '',
  containerClassName = '',
  style = {},
  children,
  id,
}: ResponsiveSectionProps) {
  const { getColor, getSpacing } = useDesignSystem();

  // Calcular padding final
  const finalPaddingTop = paddingTop || paddingY;
  const finalPaddingBottom = paddingBottom || paddingY;

  // Obter cores
  const bgColor = backgroundColor && backgroundColor !== 'transparent' && backgroundColor !== 'white'
    ? getColor(backgroundColor as ColorToken)
    : backgroundColor === 'white' 
    ? '#ffffff' 
    : undefined;

  const txtColor = textColor && textColor !== 'white' && textColor !== 'black'
    ? getColor(textColor as ColorToken)
    : textColor;

  const overlColor = overlayColor !== 'black' && overlayColor !== 'white'
    ? getColor(overlayColor as ColorToken)
    : overlayColor;

  // Construir estilos da section
  const sectionStyle: CSSProperties = {
    position: 'relative',
    backgroundColor: bgColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundPosition,
    backgroundSize,
    backgroundRepeat: 'no-repeat',
    paddingTop: getSpacing(finalPaddingTop),
    paddingBottom: getSpacing(finalPaddingBottom),
    minHeight,
    color: txtColor,
    display: centerContent ? 'flex' : 'block',
    alignItems: centerContent ? 'center' : undefined,
    justifyContent: centerContent ? 'center' : undefined,
    ...style,
  };

  // Estilos do overlay
  const overlayStyle: CSSProperties | undefined = overlay
    ? {
        position: 'absolute',
        inset: 0,
        backgroundColor: overlColor || 'black',
        opacity: overlay,
        pointerEvents: 'none',
      }
    : undefined;

  // Estilos do container interno
  const containerStyle: CSSProperties = containerWidth !== 'none'
    ? {
        position: 'relative',
        zIndex: 1,
        maxWidth: CONTAINER_WIDTH_MAP[containerWidth],
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: containerWidth === 'full' ? undefined : getSpacing('md'),
        paddingRight: containerWidth === 'full' ? undefined : getSpacing('md'),
        width: '100%',
      }
    : {
        position: 'relative',
        zIndex: 1,
      };

  return (
    <Component id={id} className={className} style={sectionStyle}>
      {/* Overlay (se houver) */}
      {overlay && <div style={overlayStyle} aria-hidden="true" />}
      
      {/* Container de conteúdo */}
      {containerWidth !== 'none' ? (
        <div className={containerClassName} style={containerStyle}>
          {children}
        </div>
      ) : (
        <div style={containerStyle}>{children}</div>
      )}
    </Component>
  );
}

// =====================================================
// PRESET SECTIONS
// =====================================================

/**
 * Hero section com fundo escuro e overlay
 */
export function HeroSection({ 
  children, 
  backgroundImage,
  ...props 
}: Omit<ResponsiveSectionProps, 'overlay' | 'minHeight' | 'centerContent' | 'textColor'>) {
  return (
    <ResponsiveSection
      backgroundImage={backgroundImage}
      overlay={backgroundImage ? 0.5 : undefined}
      minHeight="500px"
      centerContent
      textColor="white"
      {...props}
    >
      {children}
    </ResponsiveSection>
  );
}

/**
 * CTA section colorida
 */
export function CTASection({ children, ...props }: Omit<ResponsiveSectionProps, 'backgroundColor' | 'textColor'>) {
  return (
    <ResponsiveSection
      backgroundColor="primary"
      textColor="white"
      paddingY="xl"
      centerContent
      {...props}
    >
      {children}
    </ResponsiveSection>
  );
}

/**
 * Content section (fundo claro, padding padrão)
 */
export function ContentSection({ children, ...props }: Omit<ResponsiveSectionProps, 'backgroundColor'>) {
  return (
    <ResponsiveSection
      backgroundColor="background"
      paddingY="xl"
      {...props}
    >
      {children}
    </ResponsiveSection>
  );
}

/**
 * Feature section (fundo branco, container estreito)
 */
export function FeatureSection({ children, ...props }: Omit<ResponsiveSectionProps, 'backgroundColor' | 'containerWidth'>) {
  return (
    <ResponsiveSection
      backgroundColor="white"
      containerWidth="narrow"
      paddingY="2xl"
      {...props}
    >
      {children}
    </ResponsiveSection>
  );
}

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default ResponsiveSection;
