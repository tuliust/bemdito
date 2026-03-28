/**
 * ResponsiveButton Component
 * 
 * Botão que aplica design tokens automaticamente (cores, tipografia, radius, transição).
 * Suporta variantes (primary, secondary, outline) e estados (hover, disabled).
 * 
 * EXEMPLO:
 * ```tsx
 * <ResponsiveButton variant="primary" href="/contato">
 *   Entre em Contato
 * </ResponsiveButton>
 * 
 * <ResponsiveButton variant="outline" onClick={handleClick}>
 *   Saiba Mais
 * </ResponsiveButton>
 * ```
 */

import { useDesignSystem } from '@/lib/contexts/DesignSystemContext';
import { combineTokenStyles } from '@/lib/utils/designTokens';
import { Link } from '@/lib/components/Link';
import type { ReactNode, CSSProperties, MouseEvent } from 'react';

// =====================================================
// TYPES
// =====================================================

interface ResponsiveButtonProps {
  /**
   * Variante do botão
   * - primary: Cor primária, texto branco
   * - secondary: Cor secundária, texto branco
   * - outline: Borda da cor primária, texto na cor primária
   * - ghost: Transparente, texto na cor primária
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  
  /**
   * Tamanho do botão
   * - sm: Pequeno
   * - md: Médio (padrão)
   * - lg: Grande
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * URL para navegação (usa React Router Link)
   * Se fornecido, renderiza como Link em vez de button
   */
  href?: string;
  
  /**
   * URL externa (usa tag <a>)
   * Tem prioridade sobre href
   */
  externalHref?: string;
  
  /**
   * Callback de clique
   */
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  
  /**
   * Tipo do botão (quando não é link)
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';
  
  /**
   * Desabilita o botão
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Largura total (w-full)
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Ícone à esquerda do texto
   */
  leftIcon?: ReactNode;
  
  /**
   * Ícone à direita do texto
   */
  rightIcon?: ReactNode;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Estilos inline adicionais
   */
  style?: CSSProperties;
  
  /**
   * Conteúdo do botão
   */
  children: ReactNode;
  
  /**
   * ID do elemento
   */
  id?: string;
  
  /**
   * Outros atributos HTML
   */
  [key: string]: any;
}

// =====================================================
// SIZE CONFIGS
// =====================================================

const SIZE_CLASSES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
};

const ICON_GAPS = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

// =====================================================
// COMPONENT
// =====================================================

export function ResponsiveButton({
  variant = 'primary',
  size = 'md',
  href,
  externalHref,
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  style = {},
  children,
  id,
  ...rest
}: ResponsiveButtonProps) {
  const { getColor, getTypography, getRadius, getTransition } = useDesignSystem();
  
  // Buscar cores
  const primaryColor = getColor('primary');
  const secondaryColor = getColor('secondary');
  const backgroundColor = getColor('background');
  
  // Buscar outros tokens
  const buttonTypography = getTypography('button-text') || getTypography('body-base') || {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: '1.5'
  };
  const borderRadius = getRadius('lg'); // Usando 'lg' por padrão (pode ser parametrizado)
  const transitionDuration = getTransition('normal');
  
  // Construir estilos baseados na variante
  let variantStyles: CSSProperties = {};
  let hoverStyles = ''; // Classes de hover
  
  switch (variant) {
    case 'primary':
      variantStyles = {
        backgroundColor: primaryColor || '#ea526e',
        color: '#ffffff',
        borderColor: primaryColor || '#ea526e',
      } as CSSProperties;
      hoverStyles = 'hover:opacity-90 active:scale-95';
      break;
      
    case 'secondary':
      variantStyles = {
        backgroundColor: secondaryColor || '#2e2240',
        color: '#ffffff',
        borderColor: secondaryColor || '#2e2240',
      };
      hoverStyles = 'hover:opacity-90 active:scale-95';
      break;
      
    case 'outline':
      variantStyles = {
        backgroundColor: 'transparent',
        color: primaryColor || '#ea526e',
        borderColor: primaryColor || '#ea526e',
      } as CSSProperties;
      hoverStyles = 'active:scale-95 hover-outline-button';
      break;
      
    case 'ghost':
      variantStyles = {
        backgroundColor: 'transparent',
        color: primaryColor || '#ea526e',
        borderColor: 'transparent',
      };
      hoverStyles = 'hover:bg-opacity-10 active:scale-95';
      break;
  }
  
  // Base classes (sem transition-all — transição definida via inline style abaixo)
  const baseClasses = `inline-flex items-center justify-center font-semibold cursor-pointer border-2 ${hoverStyles}`;
  
  // Aplicar radius e transition
  if (borderRadius) {
    variantStyles.borderRadius = borderRadius;
  }
  
  if (transitionDuration) {
    // Animar apenas propriedades seguras (sem box-shadow que causa CSS parsing error)
    variantStyles.transition = `background-color ${transitionDuration} ease-in-out, color ${transitionDuration} ease-in-out, border-color ${transitionDuration} ease-in-out, opacity ${transitionDuration} ease-in-out`;
  }
  
  // Combinar estilos
  const combinedStyle = combineTokenStyles(
    buttonTypography || {},
    variantStyles,
    style
  );
  
  // Classes finais
  const finalClasses = [
    baseClasses,
    SIZE_CLASSES[size],
    ICON_GAPS[size],
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ].filter(Boolean).join(' ');
  
  // Conteúdo do botão
  const content = (
    <>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </>
  );
  
  // Props comuns
  const commonProps = {
    id,
    className: finalClasses,
    style: combinedStyle,
    onClick: disabled ? undefined : onClick,
    ...rest,
  };
  
  // Renderizar como link externo
  if (externalHref && !disabled) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        {...commonProps}
      >
        {content}
      </a>
    );
  }
  
  // Renderizar como React Router Link
  if (href && !disabled) {
    return (
      <Link to={href} {...commonProps}>
        {content}
      </Link>
    );
  }
  
  // Renderizar como botão
  return (
    <button
      type={type}
      disabled={disabled}
      {...commonProps}
    >
      {content}
    </button>
  );
}

// =====================================================
// PRESET COMPONENTS (Atalhos)
// =====================================================

/**
 * Botão primário (atalho)
 */
export function PrimaryButton(props: Omit<ResponsiveButtonProps, 'variant'>) {
  return <ResponsiveButton variant="primary" {...props} />;
}

/**
 * Botão secundário (atalho)
 */
export function SecondaryButton(props: Omit<ResponsiveButtonProps, 'variant'>) {
  return <ResponsiveButton variant="secondary" {...props} />;
}

/**
 * Botão outline (atalho)
 */
export function OutlineButton(props: Omit<ResponsiveButtonProps, 'variant'>) {
  return <ResponsiveButton variant="outline" {...props} />;
}

/**
 * Botão ghost (atalho)
 */
export function GhostButton(props: Omit<ResponsiveButtonProps, 'variant'>) {
  return <ResponsiveButton variant="ghost" {...props} />;
}

// =====================================================
// EXPORT
// =====================================================

export default ResponsiveButton;