/**
 * ResponsiveCard Component
 * 
 * Card completo e responsivo com todos os design tokens aplicados automaticamente.
 * 
 * CARACTERÍSTICAS:
 * - Background color do banco
 * - Border radius do banco
 * - Spacing interno (padding) do banco
 * - Hover states
 * - Link support (clicável)
 * - Shadow configurável
 * 
 * USO:
 * ```tsx
 * <ResponsiveCard 
 *   backgroundColor="white"
 *   padding="lg"
 *   radius="lg"
 *   shadow="md"
 * >
 *   <h3>Título do Card</h3>
 *   <p>Conteúdo aqui</p>
 * </ResponsiveCard>
 * 
 * // Card clicável (como link)
 * <ResponsiveCard href="/detalhes" hover>
 *   <CardImage src="/product.jpg" alt="Produto" />
 *   <h3>Produto</h3>
 * </ResponsiveCard>
 * ```
 */

import { ReactNode, ElementType, CSSProperties, MouseEvent } from 'react';
import { Link } from '@/lib/components/Link';
import { useDesignSystem } from '../../lib/contexts/DesignSystemContext';

type ColorToken = 'primary' | 'secondary' | 'background' | 'accent' | 'muted' | 'dark' | 'white';
type RadiusToken = 'sm' | 'md' | 'lg';
type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveCardProps {
  /**
   * Elemento HTML a ser renderizado
   * @default 'div'
   */
  as?: ElementType;
  
  /**
   * Cor de fundo usando design tokens
   * @default 'white'
   */
  backgroundColor?: ColorToken | 'white';
  
  /**
   * Cor da borda usando design tokens
   */
  borderColor?: ColorToken;
  
  /**
   * Border radius usando design tokens
   * @default 'lg'
   */
  radius?: RadiusToken;
  
  /**
   * Padding interno usando design tokens
   * @default 'lg'
   */
  padding?: SpacingToken;
  
  /**
   * Shadow do card
   * @default 'md'
   */
  shadow?: ShadowSize;
  
  /**
   * Se deve mostrar borda
   * @default true
   */
  border?: boolean;
  
  /**
   * Largura da borda em pixels
   * @default 1
   */
  borderWidth?: number;
  
  /**
   * URL para tornar o card clicável (React Router)
   */
  href?: string;
  
  /**
   * URL externa para tornar o card clicável
   */
  externalHref?: string;
  
  /**
   * Callback de click
   */
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  
  /**
   * Ativar hover effect (scale + shadow)
   * @default false
   */
  hover?: boolean;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Estilos inline adicionais
   */
  style?: CSSProperties;
  
  /**
   * Conteúdo do card
   */
  children: ReactNode;
  
  /**
   * ID do elemento
   */
  id?: string;
}

/**
 * Mapeia shadow sizes para valores CSS
 */
const SHADOW_MAP: Record<ShadowSize, string> = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

export function ResponsiveCard({
  as,
  backgroundColor = 'white',
  borderColor,
  radius = 'lg',
  padding = 'lg',
  shadow = 'md',
  border = true,
  borderWidth = 1,
  href,
  externalHref,
  onClick,
  hover = false,
  className = '',
  style = {},
  children,
  id,
}: ResponsiveCardProps) {
  const { getColor, getRadius, getSpacing } = useDesignSystem();

  // Determinar componente base
  let Component: ElementType = as || 'div';
  let linkProps = {};

  if (href) {
    Component = Link;
    linkProps = { to: href };
  } else if (externalHref) {
    Component = 'a';
    linkProps = { href: externalHref, target: '_blank', rel: 'noopener noreferrer' };
  } else if (onClick) {
    Component = 'button';
    linkProps = { type: 'button' };
  }

  // Obter cores do design system
  const bgColor = backgroundColor === 'white' ? '#ffffff' : getColor(backgroundColor);
  const bColor = borderColor ? getColor(borderColor) : getColor('muted') ?? '#e5e7eb';

  // Construir estilos
  const cardStyle: CSSProperties = {
    backgroundColor: bgColor,
    borderRadius: getRadius(radius),
    padding: getSpacing(padding),
    boxShadow: SHADOW_MAP[shadow],
    border: border ? `${borderWidth}px solid ${bColor}` : 'none',
    transition: 'all 0.3s ease',
    cursor: (href || externalHref || onClick) ? 'pointer' : 'default',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    width: '100%',
    ...style,
  };

  // Hover effect inline
  const handleMouseEnter = (e: MouseEvent<HTMLElement>) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = SHADOW_MAP['xl'];
    }
  };

  const handleMouseLeave = (e: MouseEvent<HTMLElement>) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = SHADOW_MAP[shadow];
    }
  };

  return (
    <Component
      {...linkProps}
      id={id}
      className={className}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Component>
  );
}

// =====================================================
// PRESET CARDS
// =====================================================

/**
 * Card básico branco com padding grande
 */
export function BasicCard({ children, ...props }: Omit<ResponsiveCardProps, 'backgroundColor' | 'padding'>) {
  return (
    <ResponsiveCard backgroundColor="white" padding="lg" {...props}>
      {children}
    </ResponsiveCard>
  );
}

/**
 * Card de produto com hover effect
 */
export function ProductCard({ children, ...props }: Omit<ResponsiveCardProps, 'hover' | 'shadow'>) {
  return (
    <ResponsiveCard hover shadow="md" {...props}>
      {children}
    </ResponsiveCard>
  );
}

/**
 * Card de feature/destaque (colorido)
 */
export function FeatureCard({ children, ...props }: Omit<ResponsiveCardProps, 'backgroundColor' | 'border' | 'shadow'>) {
  return (
    <ResponsiveCard 
      backgroundColor="background" 
      border={false} 
      shadow="lg" 
      {...props}
    >
      {children}
    </ResponsiveCard>
  );
}

/**
 * Card interativo (clicável) com hover
 */
export function InteractiveCard({ children, href, ...props }: ResponsiveCardProps) {
  return (
    <ResponsiveCard hover href={href} {...props}>
      {children}
    </ResponsiveCard>
  );
}

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default ResponsiveCard;