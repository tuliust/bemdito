/**
 * ResponsiveImage Component
 * 
 * Imagem responsiva com lazy loading, srcset, e fallback automático.
 * 
 * CARACTERÍSTICAS:
 * - Lazy loading nativo
 * - Border radius dinâmico do banco
 * - Fallback para imagens quebradas
 * - Aspect ratio mantido
 * - Suporte a srcset para múltiplas resoluções
 * 
 * USO:
 * ```tsx
 * <ResponsiveImage 
 *   src="/images/hero.jpg"
 *   alt="Hero banner"
 *   radius="lg"
 *   aspectRatio="16/9"
 * />
 * 
 * // Com srcset para diferentes resoluções
 * <ResponsiveImage
 *   src="/images/product.jpg"
 *   srcSet="/images/product-400.jpg 400w, /images/product-800.jpg 800w"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 *   alt="Produto"
 * />
 * ```
 */

import { useState, ImgHTMLAttributes, CSSProperties } from 'react';
import { useDesignSystem } from '../../lib/contexts/DesignSystemContext';

type RadiusToken = 'sm' | 'md' | 'lg' | 'none';

type AspectRatio = 
  | '1/1'    // Quadrado
  | '4/3'    // Padrão foto
  | '16/9'   // Widescreen
  | '21/9'   // Ultra wide
  | '3/2'    // Clássico
  | 'auto';  // Original

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'style'> {
  /**
   * URL da imagem
   */
  src: string;
  
  /**
   * Texto alternativo (obrigatório para acessibilidade)
   */
  alt: string;
  
  /**
   * Border radius usando design tokens
   * @default 'md'
   */
  radius?: RadiusToken;
  
  /**
   * Aspect ratio da imagem
   * @default 'auto'
   */
  aspectRatio?: AspectRatio;
  
  /**
   * Modo de ajuste da imagem
   * @default 'cover'
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  
  /**
   * Posicionamento da imagem
   * @default 'center'
   */
  objectPosition?: string;
  
  /**
   * URL da imagem de fallback (se a principal falhar)
   */
  fallbackSrc?: string;
  
  /**
   * Lazy loading
   * @default true
   */
  lazy?: boolean;
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Estilos inline adicionais
   */
  style?: CSSProperties;
  
  /**
   * Callback quando imagem carrega com sucesso
   */
  onLoad?: () => void;
  
  /**
   * Callback quando imagem falha ao carregar
   */
  onError?: () => void;
}

/**
 * Imagem de fallback padrão (data URI - 1px transparente)
 */
const DEFAULT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="18" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EImagem não disponível%3C/text%3E%3C/svg%3E';

export function ResponsiveImage({
  src,
  alt,
  radius = 'md',
  aspectRatio = 'auto',
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackSrc,
  lazy = true,
  className = '',
  style = {},
  onLoad,
  onError,
  ...props
}: ResponsiveImageProps) {
  const { getRadius } = useDesignSystem();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc || DEFAULT_FALLBACK);
      onError?.();
    }
  };

  const handleLoad = () => {
    setHasError(false);
    onLoad?.();
  };

  // Construir estilos
  const imageStyle: CSSProperties = {
    borderRadius: radius !== 'none' ? getRadius(radius) : undefined,
    aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
    objectFit,
    objectPosition,
    width: '100%',
    height: 'auto',
    display: 'block',
    ...style,
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      loading={lazy ? 'lazy' : 'eager'}
      onError={handleError}
      onLoad={handleLoad}
      className={className}
      style={imageStyle}
      // Acessibilidade
      role="img"
      aria-label={alt}
    />
  );
}

// =====================================================
// PRESET IMAGES
// =====================================================

/**
 * Imagem de produto (aspect ratio 1/1, border radius médio)
 */
export function ProductImage({ alt, ...props }: Omit<ResponsiveImageProps, 'aspectRatio' | 'radius'>) {
  return (
    <ResponsiveImage
      {...props}
      alt={alt}
      aspectRatio="1/1"
      radius="md"
      objectFit="cover"
    />
  );
}

/**
 * Imagem de card (aspect ratio 4/3, border radius grande)
 */
export function CardImage({ alt, ...props }: Omit<ResponsiveImageProps, 'aspectRatio' | 'radius'>) {
  return (
    <ResponsiveImage
      {...props}
      alt={alt}
      aspectRatio="4/3"
      radius="lg"
      objectFit="cover"
    />
  );
}

/**
 * Imagem de banner/hero (aspect ratio 16/9, sem border radius)
 */
export function BannerImage({ alt, ...props }: Omit<ResponsiveImageProps, 'aspectRatio' | 'radius'>) {
  return (
    <ResponsiveImage
      {...props}
      alt={alt}
      aspectRatio="16/9"
      radius="none"
      objectFit="cover"
    />
  );
}

/**
 * Avatar/foto de perfil (aspect ratio 1/1, border radius total)
 */
export function AvatarImage({ alt, ...props }: Omit<ResponsiveImageProps, 'aspectRatio' | 'objectFit' | 'style'>) {
  return (
    <ResponsiveImage
      {...props}
      alt={alt}
      aspectRatio="1/1"
      radius="none"
      objectFit="cover"
      style={{ borderRadius: '50%' }}
    />
  );
}

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default ResponsiveImage;
