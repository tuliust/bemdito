/**
 * CMS Type Definitions
 * Core types for the schema-driven CMS platform
 */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface DesignToken {
  id: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow';
  name: string;
  value: string;
  description?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: PaletteColor[];
}

export interface PaletteColor {
  id: string;
  name: string;
  value: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'semantic';
}

export interface TypographyStyle {
  id: string;
  name: string;
  slot: 'display' | 'heading' | 'subheading' | 'body' | 'supporting' | 'label' | 'metadata';
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
  breakpoints?: TypographyBreakpoint[];
}

export interface TypographyBreakpoint {
  breakpoint: Breakpoint;
  fontSize?: string;
  lineHeight?: string;
}

export interface ButtonPreset {
  id: string;
  name: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg' | 'xl';
  style: Record<string, string>;
}

export interface InputPreset {
  id: string;
  name: string;
  variant: 'default' | 'pill' | 'underline';
  size: 'sm' | 'md' | 'lg';
  style: Record<string, string>;
}

export interface AnimationPreset {
  id: string;
  name: string;
  type: 'entrance' | 'exit' | 'hover' | 'scroll' | 'layout';
  config: Record<string, any>;
}

export interface Page {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
  sections: PageSection[];
  globalBlocks: GlobalBlock[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface SectionTemplate {
  id: string;
  name: string;
  slug: string;
  category: 'hero' | 'content' | 'testimonial' | 'cta' | 'media' | 'other';
  description?: string;
  schema: Record<string, any>;
  defaultConfig?: Record<string, any>;
  variants: SectionVariant[];
}

export interface SectionVariant {
  id: string;
  templateId: string;
  name: string;
  slug: string;
  description?: string;
  schemaOverrides?: Record<string, any>;
  stylePreset?: Record<string, any>;
}

export interface PageSection {
  id: string;
  pageId: string;
  templateId: string;
  variantId?: string;
  order: number;
  content: Record<string, any>;
  config: SectionConfig;
  items: SectionItem[];
  breakpointOverrides?: BreakpointOverride[];
  visible: boolean;
}

export interface SectionConfig {
  layout?: {
    container?: 'full' | 'wide' | 'narrow';
    alignment?: 'left' | 'center' | 'right';
    spacing?: {
      top?: string;
      bottom?: string;
      internal?: string;
    };
  };
  style?: {
    background?: string;
    textColor?: string;
    borderRadius?: string;
    shadow?: string;
  };
  behavior?: {
    animation?: string;
    sticky?: boolean;
    parallax?: boolean;
  };
}

export interface SectionItem {
  id: string;
  sectionId: string;
  type: string;
  order: number;
  content: Record<string, any>;
  config?: Record<string, any>;
  breakpointOverrides?: BreakpointOverride[];
}

export interface BreakpointOverride {
  breakpoint: Breakpoint;
  config: Record<string, any>;
  visible?: boolean;
}

export interface GlobalBlock {
  id: string;
  siteId: string;
  type: 'header' | 'footer' | 'menu_overlay' | 'support_modal' | 'floating_button' | 'custom';
  slug: string;
  name: string;
  content: Record<string, any>;
  config: Record<string, any>;
  visible: boolean;
  position?: 'top' | 'bottom' | 'fixed';
}

export interface NavigationMenu {
  id: string;
  siteId: string;
  location: 'primary' | 'footer' | 'mobile' | 'legal';
  items: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  menuId: string;
  parentId?: string;
  label: string;
  type: 'page' | 'url' | 'section' | 'action';
  target?: string;
  icon?: string;
  order: number;
  children?: NavigationItem[];
}

export interface MediaAsset {
  id: string;
  siteId: string;
  folderId?: string;
  filename: string;
  altText?: string;
  caption?: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  variants?: MediaVariant[];
  usage: MediaUsage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaVariant {
  id: string;
  assetId: string;
  name: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface MediaUsage {
  assetId: string;
  pageId?: string;
  sectionId?: string;
  blockId?: string;
  context: string;
}

export interface BlogPost {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt?: Date;
  views?: number;
  status: 'draft' | 'published' | 'archived';
}

export interface Testimonial {
  id: string;
  siteId: string;
  name: string;
  company?: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
  featured: boolean;
  order: number;
}

export interface Award {
  id: string;
  siteId: string;
  title: string;
  organization: string;
  year: number;
  logo?: string;
  description?: string;
  order: number;
}

export interface FAQGroup {
  id: string;
  siteId: string;
  name: string;
  order: number;
  items: FAQItem[];
}

export interface FAQItem {
  id: string;
  groupId: string;
  question: string;
  answer: string;
  order: number;
}
