/**
 * Responsive Components - Barrel Export
 * 
 * Importação centralizada de todos os componentes responsivos do BemDito CMS.
 * 
 * USO:
 * ```tsx
 * import { 
 *   ResponsiveText, 
 *   MainTitle,
 *   PrimaryButton,
 *   ResponsiveCard 
 * } from '@/app/components';
 * ```
 */

// =====================================================
// TEXT COMPONENTS
// =====================================================

export {
  ResponsiveText,
  MainTitle,
  Subtitle,
  BodyText,
  SmallText,
  Heading1,
  Heading2,
  Heading3,
  Label,
} from './ResponsiveText';

// =====================================================
// BUTTON COMPONENTS
// =====================================================

export {
  ResponsiveButton,
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
} from './ResponsiveButton';

// =====================================================
// CONTAINER COMPONENTS
// =====================================================

export {
  ResponsiveContainer,
  PageContainer,
  NarrowContainer,
  WideContainer,
  SectionContainer,
} from './ResponsiveContainer';

// =====================================================
// IMAGE COMPONENTS
// =====================================================

export {
  ResponsiveImage,
  ProductImage,
  CardImage,
  BannerImage,
  AvatarImage,
} from './ResponsiveImage';

// =====================================================
// CARD COMPONENTS
// =====================================================

export {
  ResponsiveCard,
  BasicCard,
  ProductCard,
  FeatureCard,
  InteractiveCard,
} from './ResponsiveCard';

// =====================================================
// SECTION COMPONENTS
// =====================================================

export {
  ResponsiveSection,
  HeroSection,
  CTASection,
  ContentSection,
  FeatureSection,
} from './ResponsiveSection';

// =====================================================
// TYPE EXPORTS
// =====================================================

export type { default as ResponsiveTextProps } from './ResponsiveText';
export type { default as ResponsiveButtonProps } from './ResponsiveButton';
