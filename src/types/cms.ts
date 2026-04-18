/**
 * CMS Type Definitions
 * Core types for the schema-driven CMS platform
 */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface DesignToken {
  id: string;
  site_id?: string;
  siteId?: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'animation';
  name: string;
  slug?: string;
  value: string | Record<string, any> | any[];
  description?: string;
  created_at?: string;
  updated_at?: string;
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
  site_id?: string;
  siteId?: string;
  name: string;
  slot: 'display' | 'heading' | 'subheading' | 'body' | 'supporting' | 'label' | 'metadata';
  font_family_id?: string;
  fontFamilyId?: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
  breakpoints?: TypographyBreakpoint[];
  created_at?: string;
  updated_at?: string;
}

export interface TypographyBreakpoint {
  breakpoint: Breakpoint;
  fontSize?: string;
  lineHeight?: string;
}

export interface ButtonPreset {
  id: string;
  site_id?: string;
  siteId?: string;
  name: string;
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg' | 'xl';
  style: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface InputPreset {
  id: string;
  site_id?: string;
  siteId?: string;
  name: string;
  variant: 'default' | 'pill' | 'underline';
  size: 'sm' | 'md' | 'lg';
  style: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface AnimationPreset {
  id: string;
  site_id?: string;
  siteId?: string;
  name: string;
  type: 'entrance' | 'exit' | 'hover' | 'scroll' | 'layout';
  config: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface Page {
  id: string;
  site_id?: string;
  siteId?: string;
  slug: string;
  title: string;
  name?: string;
  description?: string;
  status: 'draft' | 'published' | 'archived' | string;
  sections?: PageSection[];
  globalBlocks?: GlobalBlock[];
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
}

export interface SectionTemplate {
  id: string;
  name: string;
  slug: string;
  category?: 'hero' | 'content' | 'testimonial' | 'cta' | 'media' | 'other' | string;
  description?: string;
  schema?: Record<string, any>;
  defaultConfig?: Record<string, any>;
  default_config?: Record<string, any>;
  preview_image?: string;
  variants?: SectionVariant[];
  created_at?: string;
  updated_at?: string;
}

export interface SectionVariant {
  id: string;
  template_id?: string;
  templateId?: string;
  name: string;
  slug: string;
  description?: string;
  schemaOverrides?: Record<string, any>;
  schema_overrides?: Record<string, any>;
  stylePreset?: Record<string, any>;
  preview_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PageSection {
  id: string;
  page_id?: string;
  pageId?: string;
  template_id?: string;
  templateId?: string;
  variant_id?: string;
  variantId?: string;
  order_index?: number;
  order?: number;
  content: Record<string, any>;
  config?: SectionConfig & Record<string, any>;
  content_config?: Record<string, any>;
  style_config?: Record<string, any>;
  layout_config?: Record<string, any>;
  behavior_config?: Record<string, any>;
  items?: SectionItem[];
  breakpointOverrides?: BreakpointOverride[];
  breakpoint_overrides?: BreakpointOverride[];
  visible: boolean;
  template?: SectionTemplate | { id: string; slug: string; name: string };
  variant?: SectionVariant | { id: string; slug: string; name: string };
  created_at?: string;
  updated_at?: string;
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
  section_id?: string;
  sectionId?: string;
  type?: string;
  order_index?: number;
  order?: number;
  visible?: boolean;
  content: Record<string, any>;
  config?: Record<string, any>;
  breakpointOverrides?: BreakpointOverride[];
  created_at?: string;
  updated_at?: string;
}

export interface BreakpointOverride {
  id?: string;
  section_id?: string;
  sectionId?: string;
  breakpoint: Breakpoint;
  config?: Record<string, any>;
  visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GlobalBlock {
  id: string;
  site_id?: string;
  siteId?: string;
  type: 'header' | 'footer' | 'menu_overlay' | 'support_modal' | 'floating_button' | 'custom';
  slug: string;
  name: string;
  content: Record<string, any>;
  config: Record<string, any>;
  visible: boolean;
  position?: 'top' | 'bottom' | 'fixed';
  created_at?: string;
  updated_at?: string;
}

export interface NavigationMenu {
  id: string;
  site_id?: string;
  siteId?: string;
  name?: string;
  location: 'primary' | 'footer' | 'mobile' | 'legal';
  created_at?: string;
  updated_at?: string;
  items?: NavigationItem[];
}

export interface NavigationItem {
  id: string;
  menu_id?: string;
  menuId?: string;
  parent_id?: string;
  parentId?: string;
  label: string;
  type: 'page' | 'url' | 'section' | 'action';
  url?: string;
  page_id?: string;
  pageId?: string;
  order_index?: number;
  target?: string;
  icon?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
  children?: NavigationItem[];
}

export interface MediaAsset {
  id: string;
  site_id?: string;
  siteId?: string;
  folder_id?: string;
  folderId?: string;
  filename: string;
  alt_text?: string;
  altText?: string;
  caption?: string;
  url: string;
  mime_type?: string;
  mimeType?: string;
  size: number;
  width?: number;
  height?: number;
  variants?: MediaVariant[];
  usage?: MediaUsage[];
  created_at?: string;
  updated_at?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MediaVariant {
  id: string;
  asset_id?: string;
  assetId?: string;
  name: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface MediaUsage {
  asset_id?: string;
  assetId?: string;
  page_id?: string;
  pageId?: string;
  section_id?: string;
  sectionId?: string;
  block_id?: string;
  blockId?: string;
  context: string;
}

export interface BlogPost {
  id: string;
  site_id?: string;
  siteId?: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  featuredImage?: string;
  category?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  published_at?: string;
  publishedAt?: Date;
  views?: number;
  status: 'draft' | 'published' | 'archived' | string;
}

export interface Testimonial {
  id: string;
  site_id?: string;
  siteId?: string;
  name: string;
  company?: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
  featured: boolean;
  order?: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Award {
  id: string;
  site_id?: string;
  siteId?: string;
  title: string;
  organization: string;
  year: number;
  logo?: string;
  description?: string;
  order?: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FAQGroup {
  id: string;
  site_id?: string;
  siteId?: string;
  name: string;
  order?: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  items?: FAQItem[];
}

export interface FAQItem {
  id: string;
  group_id?: string;
  groupId?: string;
  question: string;
  answer: string;
  order?: number;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}
